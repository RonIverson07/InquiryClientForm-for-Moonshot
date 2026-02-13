import React, { useState } from 'react';
import { TextInput } from '../components/Input';
import { supabase } from '../lib/supabaseClient';

interface ResetPasswordPageProps {
  onBackToLogin: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBackToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    if (!password || !confirmPassword) return 'Password and Confirm Password are required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setSuccess(null);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess('Password successfully changed. You can now sign in.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
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
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Reset Password</h2>
          <p className="text-slate-400 text-sm font-medium">Set a new password for your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <TextInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          {success && <p className="text-xs text-green-700 font-semibold">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 bg-[#0ea5e9] text-white font-bold rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 uppercase tracking-widest text-sm active:scale-95 ${submitting ? 'opacity-70 cursor-not-allowed hover:bg-[#0ea5e9]' : ''}`}
          >
            {submitting ? 'Saving…' : 'Save new password'}
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

export default ResetPasswordPage;
