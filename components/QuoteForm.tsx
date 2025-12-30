import React, { useState, useCallback } from 'react';
import { MoldCategory, QuoteData } from '../types';
import { CATEGORY_FIELDS, COMMON_FIELDS } from '../constants';
import { saveQuote } from '../services/storageService';
import { polishText } from '../services/geminiService';
import { ArrowLeft, Send, Sparkles, Loader2, Save } from 'lucide-react';

interface QuoteFormProps {
  category: MoldCategory;
  onBack: () => void;
  onSuccess: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ category, onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [polishing, setPolishing] = useState(false);
  
  // Base State
  const [supplierName, setSupplierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // Dynamic Specs State
  const [specs, setSpecs] = useState<Record<string, any>>({});

  const specificFields = CATEGORY_FIELDS[category] || [];

  const handleSpecChange = (key: string, value: any) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const handleSmartPolish = async () => {
    if (!remarks || remarks.length < 5) return;
    setPolishing(true);
    const polished = await polishText(remarks);
    setRemarks(polished);
    setPolishing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newQuote: QuoteData = {
      id: Date.now().toString(),
      category,
      supplierName,
      contactPerson,
      email,
      phone,
      submissionDate: new Date().toISOString(),
      estimatedCost: Number(estimatedCost),
      currency: 'TWD',
      deliveryDate,
      specifications: specs,
      remarks,
      status: 'pending'
    };

    // Simulate network delay for UX
    setTimeout(() => {
      saveQuote(newQuote);
      setLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
        <button onClick={onBack} className="flex items-center gap-2 hover:text-blue-300 transition-colors">
          <ArrowLeft size={20} /> 返回類別
        </button>
        <h2 className="text-xl font-bold tracking-wide">{category} - 報價單</h2>
        <div className="w-20"></div> {/* Spacer for center alignment */}
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">基本資料</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">供應商名稱 *</label>
              <input required type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={supplierName} onChange={e => setSupplierName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">聯絡人 *</label>
              <input required type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">電子郵件 *</label>
              <input required type="email" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">聯絡電話 *</label>
              <input required type="tel" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Specs (Dynamic) */}
        <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 border-slate-200">
            {category} 規格細節
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specificFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select 
                    required={field.required}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
                    onChange={e => handleSpecChange(field.key, e.target.value)}
                  >
                    <option value="">請選擇</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea 
                    required={field.required}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder={field.placeholder}
                    onChange={e => handleSpecChange(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder={field.placeholder}
                    onChange={e => handleSpecChange(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
            
            {/* Common technical fields */}
            {COMMON_FIELDS.map((field) => (
               <div key={field.key}>
               <label className="block text-sm font-medium text-slate-700 mb-1">
                 {field.label}
               </label>
               <input
                   type={field.type}
                   required={field.required}
                   className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                   placeholder={field.placeholder}
                   onChange={e => handleSpecChange(field.key, e.target.value)}
                 />
               </div>
            ))}
          </div>
        </div>

        {/* Section 3: Cost & Remarks */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">報價資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">預估費用 (TWD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input required type="number" className="w-full pl-8 rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">預計交期 (T1) *</label>
              <input required type="date" className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-end mb-1">
               <label className="block text-sm font-medium text-slate-700">備註 / 補充說明</label>
               <button 
                  type="button"
                  onClick={handleSmartPolish}
                  disabled={polishing || !remarks}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 disabled:opacity-50 transition-colors font-medium"
               >
                 {polishing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                 AI 智能潤飾
               </button>
            </div>
            <textarea 
              rows={4} 
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="請填寫其他需要注意的事項..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t flex justify-end gap-4">
           <button 
            type="button" 
            onClick={onBack}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium"
           >
             取消
           </button>
           <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-medium flex items-center gap-2 disabled:opacity-70"
           >
             {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
             提交報價單
           </button>
        </div>
      </form>
    </div>
  );
};