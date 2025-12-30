import React, { useState } from 'react';
import { MoldCategory } from './types';
import { CATEGORY_ICONS } from './constants';
import { QuoteForm } from './components/QuoteForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ShieldCheck, CheckCircle2, Lock, X } from 'lucide-react';

type ViewState = 'home' | 'form' | 'admin' | 'success';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<MoldCategory | null>(null);
  
  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Categories list for rendering
  const categories = Object.values(MoldCategory);

  const handleCategorySelect = (cat: MoldCategory) => {
    setSelectedCategory(cat);
    setCurrentView('form');
  };

  const handleFormSuccess = () => {
    setCurrentView('success');
  };

  const handleAdminClick = () => {
    setIsLoginModalOpen(true);
    setPasswordInput('');
    setLoginError(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin') {
      setCurrentView('admin');
      setIsLoginModalOpen(false);
    } else {
      setLoginError(true);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return selectedCategory ? (
          <QuoteForm 
            category={selectedCategory} 
            onBack={() => setCurrentView('home')} 
            onSuccess={handleFormSuccess}
          />
        ) : null;

      case 'admin':
        return <AdminDashboard onLogout={() => setCurrentView('home')} />;

      case 'success':
        return (
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-12 text-center space-y-6 animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">報價提交成功！</h2>
            <p className="text-slate-600">
              感謝您的報價。我們的採購團隊將會盡快審核您的資料，並透過 Email 與您聯繫。
            </p>
            <button 
              onClick={() => setCurrentView('home')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-medium"
            >
              返回首頁
            </button>
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                選擇模具類型
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                歡迎使用 TWL 供應商系統。請選擇下方對應的模具類別以開始填寫報價細節。
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                        {cat}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">點擊開始報價</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <img 
              src="https://topwarninglight.com/asset/common/images/logo.png" 
              alt="TWL Logo" 
              className="h-10 w-auto object-contain" 
            />
            <span className="text-xl font-bold text-slate-800 tracking-tight">TWL</span>
          </div>
          
          {currentView !== 'admin' && (
            <button 
              onClick={handleAdminClick}
              className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              <ShieldCheck size={16} />
              供應商管理後台
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} TWL System. All rights reserved.
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">管理員登入</h3>
              <p className="text-sm text-slate-500 mt-1">請輸入密碼以存取後台資料</p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <input 
                  type="password" 
                  autoFocus
                  className={`w-full border rounded-lg p-3 outline-none transition-all ${
                    loginError 
                      ? 'border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50' 
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                  placeholder="密碼 (預設: admin)"
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError(false);
                  }}
                />
                {loginError && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                     密碼錯誤，請重試
                  </p>
                )}
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-slate-800 text-white py-2.5 rounded-lg hover:bg-slate-900 font-medium transition-colors"
              >
                登入系統
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;