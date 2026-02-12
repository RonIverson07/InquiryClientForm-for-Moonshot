import React, { useState } from 'react';
import { TextInput } from '../components/Input';
import { supabase } from '../lib/supabaseClient';

interface PasswordRecoveryPageProps {
  onBackToLogin: () => void;
}

const PasswordRecoveryPage: React.FC<PasswordRecoveryPageProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError('Email is required.');
      setMessage(null);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: window.location.origin,
      });

      if (resetError) throw resetError;

      setMessage('Recovery email sent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send recovery email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full border-t-[6px] border-[#0ea5e9] relative">
        <div className="text-center mb-10">
          <div className="bg-[#0ea5e9] text-white w-20 h-20 rounded-2xl font-black text-4xl flex items-center justify-center mx-auto mb-6 shadow-md">
            SL
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Password Recovery</h2>
          <p className="text-slate-400 text-sm font-medium">We’ll send a reset link to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <TextInput
            label="Email Address"
            type="email"
            placeholder="admin@startuplab.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={error ?? undefined}
          />

          {message && <p className="text-xs text-green-700 font-semibold">{message}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 uppercase tracking-widest text-sm active:scale-95 ${submitting ? 'opacity-70 cursor-not-allowed hover:bg-[#0ea5e9]' : ''}`}
          >
            {submitting ? 'Sending…' : 'Send recovery email'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-slate-400 hover:text-[#0ea5e9] transition-colors text-[11px] font-black uppercase tracking-[0.2em]"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecoveryPage;
