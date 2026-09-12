import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Check,
  CreditCard,
  Building2,
  User
} from 'lucide-react';

export const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getCommissions();
      setCommissions(res.commissions || []);
      setMetrics(res.metrics || {});
    } catch (err) {
      console.error('Failed to load commissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await adminApi.updateCommissionStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update commission');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredCommissions = commissions.filter((c) => {
    if (activeTab === 'ALL') return true;
    return c.status === activeTab;
  });

  const totalVolume = commissions.reduce((sum, c) => sum + (c.salePriceAED || 0), 0);
  const totalGross = commissions.reduce((sum, c) => sum + (c.grossCommissionAED || 0), 0);
  const totalBrokerPayouts = commissions.reduce((sum, c) => sum + (c.netBrokerCommissionAED || 0), 0);
  const totalCompanyRetention = commissions.reduce((sum, c) => sum + (c.companyCommissionAED || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Financial Settlement & Treasury
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Commissions & Broker Payouts
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#18181A] px-3 py-1.5 border border-[#2A2A2D] text-[11px] text-[#A3A3A8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Automated RERA-Compliant Split Calculation</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121214] p-5 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Total Settled Volume</span>
          <div className="font-serif text-2xl text-[#F7F5F0] mt-1 font-light">
            {formatAED(totalVolume)}
          </div>
          <span className="text-[10px] text-[#A3A3A8] mt-1 block">Closed Luxury Transactions</span>
        </div>

        <div className="bg-[#121214] p-5 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Gross Commission Pool</span>
          <div className="font-serif text-2xl text-[#C5A880] mt-1 font-light">
            {formatAED(totalGross)}
          </div>
          <span className="text-[10px] text-[#A3A3A8] mt-1 block">Standard 2.0% Agency Fee</span>
        </div>

        <div className="bg-[#121214] p-5 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Broker Payout Obligation</span>
          <div className="font-serif text-2xl text-[#F7F5F0] mt-1 font-light">
            {formatAED(totalBrokerPayouts)}
          </div>
          <span className="text-[10px] text-[#A3A3A8] mt-1 block">60% – 70% Tiered Allocation</span>
        </div>

        <div className="bg-[#121214] p-5 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Company Treasury Share</span>
          <div className="font-serif text-2xl text-emerald-400 mt-1 font-light">
            {formatAED(totalCompanyRetention)}
          </div>
          <span className="text-[10px] text-[#A3A3A8] mt-1 block">Net Retained Earnings</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2D] pb-3 text-xs">
        {['ALL', 'PENDING', 'APPROVED', 'PAID', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 uppercase tracking-wider text-[10px] transition-colors ${
              activeTab === tab
                ? 'bg-[#C5A880] text-[#18181A] font-semibold'
                : 'bg-[#18181A] text-[#A3A3A8] hover:text-[#F7F5F0]'
            }`}
          >
            {tab} ({tab === 'ALL' ? commissions.length : commissions.filter((c) => c.status === tab).length})
          </button>
        ))}
      </div>

      {/* Commissions Table */}
      <div className="bg-[#121214] border border-[#2A2A2D] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#71717A]">Calculating ledger entries...</div>
        ) : filteredCommissions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717A]">No commissions in this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2D] bg-[#18181A]/50 text-[10px] uppercase tracking-wider text-[#A3A3A8]">
                  <th className="py-3 px-4">Transaction / Property</th>
                  <th className="py-3 px-4">Broker Specialist</th>
                  <th className="py-3 px-4">Sale Price</th>
                  <th className="py-3 px-4">Gross Comm (2%)</th>
                  <th className="py-3 px-4">Broker Split</th>
                  <th className="py-3 px-4">Company Split</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2D]">
                {filteredCommissions.map((c) => {
                  const propertyTitle = c.property?.title || 'Prime Residence';
                  const brokerName = c.broker?.user?.name || c.broker?.name || 'RERA Specialist';

                  return (
                    <tr key={c._id} className="hover:bg-[#18181A]/40 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-[#F7F5F0] truncate" title={propertyTitle}>
                          {propertyTitle}
                        </div>
                        <div className="text-[10px] text-[#71717A] font-mono">
                          Ref: {c.referenceNumber || c._id.slice(-6).toUpperCase()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#C5A880]" />
                          <span className="text-[#F7F5F0]">{brokerName}</span>
                        </div>
                        <span className="text-[10px] text-[#71717A] font-mono">
                          Split: {c.brokerSplitPct || 65}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#F7F5F0]">
                        {formatAED(c.salePriceAED)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#C5A880] font-semibold">
                        {formatAED(c.grossCommissionAED)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#F7F5F0]">
                        {formatAED(c.netBrokerCommissionAED)}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {formatAED(c.companyCommissionAED)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                            c.status === 'PAID'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                              : c.status === 'APPROVED'
                              ? 'bg-blue-950/40 text-blue-400 border-blue-800'
                              : c.status === 'PENDING'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-800'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === 'PENDING' && (
                            <button
                              disabled={updatingId === c._id}
                              onClick={() => handleStatusUpdate(c._id, 'APPROVED')}
                              className="px-2.5 py-1 bg-[#18181A] hover:bg-[#C5A880] hover:text-[#18181A] border border-[#C5A880]/40 text-[#C5A880] text-[10px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {c.status === 'APPROVED' && (
                            <button
                              disabled={updatingId === c._id}
                              onClick={() => handleStatusUpdate(c._id, 'PAID')}
                              className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-600 hover:text-[#0B0B0C] border border-emerald-600/40 text-emerald-400 text-[10px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                            >
                              Mark Paid
                            </button>
                          )}
                          {c.status === 'PAID' && (
                            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                              <Check className="w-3 h-3" /> Disbursed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
