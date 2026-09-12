import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { Briefcase, Plus, ShieldCheck, CheckCircle2, User, Phone, Mail } from 'lucide-react';

export const BrokersPage: React.FC = () => {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New broker form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Broker@123456');
  const [reraNumber, setReraNumber] = useState('');
  const [title, setTitle] = useState('Private Client Advisor');
  const [commissionSplitPct, setCommissionSplitPct] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBrokers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getBrokers();
      setBrokers(res.brokers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrokers();
  }, []);

  const handleCreateBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminApi.createBroker({
        name,
        email,
        password,
        reraNumber,
        title,
        commissionSplitPct: Number(commissionSplitPct)
      });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setReraNumber('');
      await loadBrokers();
      alert('Broker successfully registered and certified.');
    } catch (err: any) {
      alert(err.message || 'Failed to create broker');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Licensed Practitioners Roster
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Broker Management
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certified Broker</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#121214] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brokers.map((b) => (
            <div key={b._id} className="bg-[#121214] border border-[#2A2A2D] p-6 space-y-4 text-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-[#2A2A2D]">
                <img
                  src={b.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border border-[#C5A880]"
                />
                <div>
                  <h3 className="font-serif text-lg text-[#F7F5F0] font-medium">{b.user?.name}</h3>
                  <span className="text-[#C5A880] text-[11px] block">{b.title}</span>
                  <span className="text-[10px] text-[#71717A] font-mono">{b.reraNumber}</span>
                </div>
              </div>

              <div className="space-y-2 text-[#A3A3A8]">
                <div className="flex justify-between">
                  <span>Direct Email:</span>
                  <span className="text-[#F7F5F0] font-mono">{b.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission Split:</span>
                  <span className="text-[#C5A880] font-bold font-mono">{b.commissionSplitPct}% / {100 - b.commissionSplitPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Listings:</span>
                  <span className="text-[#F7F5F0] font-semibold">{b.activeListingsCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Historical Sales:</span>
                  <span className="text-[#F7F5F0] font-serif">{formatAED(b.totalSalesVolumeAED || 0)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2A2A2D] flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RERA Verified</span>
                </span>
                <span className="text-[#71717A] font-mono">Rating: {b.rating} ★</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Broker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070708]/80 backdrop-blur-sm">
          <div className="bg-[#121214] border border-[#2A2A2D] max-w-md w-full p-6 text-[#F7F5F0] space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]">
              <h3 className="font-serif text-xl font-light">Onboard Certified Broker</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#71717A] hover:text-[#F7F5F0]">✕</button>
            </div>

            <form onSubmit={handleCreateBroker} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="broker@nestandkey.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">RERA License Number *</label>
                <input
                  type="text"
                  required
                  placeholder="RERA-99481"
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Broker Split (%)</label>
                  <input
                    type="number"
                    min="30"
                    max="90"
                    value={commissionSplitPct}
                    onChange={(e) => setCommissionSplitPct(Number(e.target.value))}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#2A2A2D] text-xs uppercase text-[#A3A3A8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#C5A880] text-[#18181A] font-semibold text-xs uppercase"
                >
                  {isSubmitting ? 'Onboarding...' : 'Register Broker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
