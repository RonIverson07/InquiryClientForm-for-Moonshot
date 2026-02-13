
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            <TextInput 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
