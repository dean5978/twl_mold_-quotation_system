import React, { useEffect, useState } from 'react';
import { getQuotes, updateQuoteStatus, clearAllData } from '../services/storageService';
import { QuoteData, MoldCategory } from '../types';
import { CATEGORY_FIELDS, COMMON_FIELDS } from '../constants';
import { Download, CheckCircle, XCircle, Clock, Trash2, Eye, X, Printer, User, Phone, Mail, Calendar, DollarSign, Package, FileText } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const handleStatusChange = (id: string, newStatus: QuoteData['status']) => {
    updateQuoteStatus(id, newStatus);
    setQuotes(getQuotes());
    
    // Update the modal view if it's currently open
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `twl_quotes_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleClear = () => {
    if(confirm('確定要清空所有資料嗎？此操作無法復原。')) {
        clearAllData();
        setQuotes([]);
        setSelectedQuote(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><CheckCircle size={14}/> 已核准</span>;
      case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><XCircle size={14}/> 已退回</span>;
      default: return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><Clock size={14}/> 待審核</span>;
    }
  };

  const getFieldLabel = (category: MoldCategory, key: string) => {
    const specificFields = CATEGORY_FIELDS[category] || [];
    const field = specificFields.find(f => f.key === key) || COMMON_FIELDS.find(f => f.key === key);
    return field ? field.label : key;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">TWL 供應商報價管理後台</h2>
          <p className="text-slate-500 text-sm mt-1">目前共有 {quotes.length} 筆報價紀錄</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
            <Trash2 size={16} /> 清空資料
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
            <Download size={16} /> 匯出 JSON
          </button>
          <button onClick={onLogout} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium transition-colors">
            登出
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">狀態</th>
                <th className="p-4 font-semibold">日期</th>
                <th className="p-4 font-semibold">類別</th>
                <th className="p-4 font-semibold">供應商</th>
                <th className="p-4 font-semibold">聯絡人</th>
                <th className="p-4 font-semibold text-right">預估費用</th>
                <th className="p-4 font-semibold text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">目前尚無報價資料</td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">{getStatusBadge(quote.status)}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(quote.submissionDate).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-medium text-slate-700">{quote.category}</td>
                    <td className="p-4 text-sm text-slate-800">{quote.supplierName}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <div>{quote.contactPerson}</div>
                      <div className="text-xs text-slate-400">{quote.phone}</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700 text-right">
                      NT$ {quote.estimatedCost.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedQuote(quote)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Eye size={16} /> 詳情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  {selectedQuote.category} 
                  {getStatusBadge(selectedQuote.status)}
                </h3>
                <p className="text-sm text-slate-500 mt-1">單號: #{selectedQuote.id} • 提交於 {new Date(selectedQuote.submissionDate).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedQuote(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} /> 供應商資料
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div>
                      <span className="text-xs text-slate-500 block">公司名稱</span>
                      <span className="font-semibold text-slate-800">{selectedQuote.supplierName}</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <span className="text-xs text-slate-500 block">聯絡人</span>
                        <div className="flex items-center gap-2 text-slate-700">
                           {selectedQuote.contactPerson}
                        </div>
                      </div>
                      <div className="flex-1">
                         <span className="text-xs text-slate-500 block">電話</span>
                         <div className="flex items-center gap-2 text-slate-700">
                            <Phone size={12} /> {selectedQuote.phone}
                         </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Email</span>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail size={12} /> {selectedQuote.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Package size={16} /> 報價概要
                  </h4>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-slate-500 block">預估費用</span>
                            <div className="font-bold text-green-700 text-lg flex items-center">
                                <DollarSign size={16} />
                                {selectedQuote.estimatedCost.toLocaleString()} TWD
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 block">預計交期 (T1)</span>
                            <div className="font-semibold text-slate-800 flex items-center gap-1">
                                <Calendar size={14} />
                                {selectedQuote.deliveryDate}
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <FileText size={16} /> 技術規格細節
                </h4>
                <div className="border rounded-xl overflow-hidden border-slate-200">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(selectedQuote.specifications).map(([key, value]) => (
                        <tr key={key} className="bg-white">
                          <td className="py-3 px-4 bg-slate-50 text-slate-600 font-medium w-1/3">
                            {getFieldLabel(selectedQuote.category, key)}
                          </td>
                          <td className="py-3 px-4 text-slate-800">
                            {value?.toString() || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">備註說明 (AI 潤飾後)</h4>
                <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedQuote.remarks || "無備註"}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
               <div className="flex gap-2">
                  {selectedQuote.status === 'pending' && (
                    <>
                      <button 
                          onClick={() => handleStatusChange(selectedQuote.id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                          <CheckCircle size={16} /> 核准報價
                      </button>
                      <button 
                          onClick={() => handleStatusChange(selectedQuote.id, 'rejected')}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                          <XCircle size={16} /> 退回
                      </button>
                    </>
                  )}
               </div>
               <button 
                 onClick={() => window.print()}
                 className="text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm px-4 py-2"
               >
                 <Printer size={16} /> 列印此頁
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};