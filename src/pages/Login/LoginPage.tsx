import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@crestshore.com');
  const [password, setPassword] = useState('Admin@123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Verify your administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] flex items-center justify-center p-6 text-[#102A43]">
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#E9E1D4] p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full border border-[#B08D57] flex items-center justify-center text-[#102A43] mx-auto mb-3 bg-[#F7F3EA]">
            <span className="font-display font-bold text-sm">CS</span>
          </div>
          <h1 className="font-display text-2xl tracking-[0.16em] uppercase text-[#102A43]">
            CRESTSHORE
          </h1>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-medium block mt-1 font-mono">
            CENTRALIZED CONTROL PANEL
          </span>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] pl-9 pr-3 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono font-medium">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] pl-9 pr-3 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] py-3 text-xs uppercase tracking-[0.18em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{isSubmitting ? 'Verifying Clearances...' : 'Access Control Panel'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E9E1D4] text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@crestshore.com');
              setPassword('Admin@123456');
            }}
            className="text-[11px] text-[#B08D57] hover:underline font-mono"
          >
            Fill Demo Admin Credentials (admin@crestshore.com)
          </button>
        </div>
      </div>
    </div>
  );
};
