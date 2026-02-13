
import React, { useState } from 'react';
import { TextInput } from '../components/Input';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border-t-[6px] border-[#0ea5e9] relative">
        <div className="text-center mb-10">
          <img
            src="/logo.jpg"
            alt="StartupLab"
            className="w-20 h-20 rounded-2xl object-contain bg-white mx-auto mb-6 shadow-md"
          />
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Admin Login</h2>
          <p className="text-slate-400 text-sm font-medium">Access StartupLab Management Console</p>
        </div>
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmedEmail = email.trim();
            if (!trimmedEmail || !password) {
              setError('Email and password are required.');
              return;
            }

            try {
              setSubmitting(true);
              setError(null);
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email: trimmedEmail,
                password,
              });
              if (signInError) throw signInError;
              onLogin();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Login failed');
            } finally {
              setSubmitting(false);
            }
          }} 
          className="space-y-8"
          noValidate
        >
          <div className="space-y-6">
            <TextInput 
              label="Email Address" 
              type="email" 
              placeholder="admin@startuplab.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-slate-900 px-4 py-2.5 pr-12 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-[#0ea5e9] focus:border-transparent transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10.5 10.677C10.188 11.06 10 11.55 10 12c0 1.105.895 2 2 2 .45 0 .94-.188 1.323-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6.228 6.228C4.24 7.55 2.87 9.53 2 12c1.73 4.94 6.154 8 10 8 1.287 0 2.62-.27 3.873-.828" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.88 4.403C10.574 4.19 11.287 4 12 4c3.846 0 8.27 3.06 10 8-.62 1.77-1.58 3.28-2.77 4.45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M14.12 14.12C13.56 14.68 12.81 15 12 15c-1.657 0-3-1.343-3-3 0-.81.32-1.56.88-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          <button 
            type="submit"
            disabled={submitting}
            className={`w-full py-4 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 uppercase tracking-widest text-sm active:scale-95 ${submitting ? 'opacity-70 cursor-not-allowed hover:bg-[#0ea5e9]' : ''}`}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
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
