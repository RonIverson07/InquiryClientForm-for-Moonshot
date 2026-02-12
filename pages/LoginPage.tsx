
import React from 'react';
import { AppView } from '../types';
import { TextInput } from '../components/Input';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, onForgotPassword }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border-t-[6px] border-[#0ea5e9] relative">
        <div className="text-center mb-10">
          <div className="bg-[#0ea5e9] text-white w-20 h-20 rounded-2xl font-black text-4xl flex items-center justify-center mx-auto mb-6 shadow-md">
            SL
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Admin Login</h2>
          <p className="text-slate-400 text-sm font-medium">Access StartupLab Management Console</p>
        </div>
        <form 
          onSubmit={(e) => { e.preventDefault(); onLogin(); }} 
          className="space-y-8"
          noValidate
        >
          <div className="space-y-6">
            <TextInput 
              label="Email Address" 
              type="email" 
              placeholder="admin@startuplab.com" 
            />
            <TextInput 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 uppercase tracking-widest text-sm active:scale-95"
          >
            Sign In
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-slate-400 hover:text-[#0ea5e9] transition-colors text-[11px] font-black uppercase tracking-[0.2em]"
            >
              Forgot password?
            </button>
          </div>
          <div className="text-center">
            <button 
              type="button"
              onClick={onBack}
              className="text-slate-400 hover:text-[#0ea5e9] transition-colors text-[11px] font-black uppercase tracking-[0.2em]"
            >
              Back to intake form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
