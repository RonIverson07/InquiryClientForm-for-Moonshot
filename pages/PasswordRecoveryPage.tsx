import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface PasswordRecoveryPageProps {
  onBackToLogin: () => void;
}

const PasswordRecoveryPage: React.FC<PasswordRecoveryPageProps> = ({ onBackToLogin }) => {
  const adminEmail = 'roniversonroguel.startuplab@gmail.com';
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminEmail.trim();

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
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="admin@startuplab.com"
              value={adminEmail}
              readOnly
              disabled
              required
              className={`text-slate-900 px-4 py-2.5 bg-slate-50 border rounded-md outline-none cursor-default opacity-80 ${error ? 'border-red-500' : 'border-slate-200'}`}
            />
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          </div>

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
