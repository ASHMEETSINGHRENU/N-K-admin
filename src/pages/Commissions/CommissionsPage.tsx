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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Financial Settlement & Treasury
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Commissions & Broker Payouts
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#FFFDF8] px-3 py-1.5 border border-[#E9E1D4] text-[11px] text-[#6B7280] shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B08D57]" />
          <span>Automated RERA-Compliant Split Calculation</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF8] p-5 border border-[#E9E1D4] shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Total Settled Volume</span>
          <div className="font-display text-2xl text-[#102A43] mt-1 font-normal">
            {formatAED(totalVolume)}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-mono">Closed Luxury Transactions</span>
        </div>

        <div className="bg-[#FFFDF8] p-5 border border-[#E9E1D4] shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Gross Commission Pool</span>
          <div className="font-display text-2xl text-[#B08D57] mt-1 font-semibold">
            {formatAED(totalGross)}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-mono">Standard 2.0% Agency Fee</span>
        </div>

        <div className="bg-[#FFFDF8] p-5 border border-[#E9E1D4] shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Broker Payout Obligation</span>
          <div className="font-display text-2xl text-[#102A43] mt-1 font-normal">
            {formatAED(totalBrokerPayouts)}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-mono">60% – 70% Tiered Allocation</span>
        </div>

        <div className="bg-[#FFFDF8] p-5 border border-[#E9E1D4] shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Company Treasury Share</span>
          <div className="font-display text-2xl text-[#5D7A65] mt-1 font-semibold">
            {formatAED(totalCompanyRetention)}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-mono">Net Retained Earnings</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9E1D4] pb-3 text-xs">
        {['ALL', 'PENDING', 'APPROVED', 'PAID', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 uppercase tracking-wider text-[10px] transition-colors ${
              activeTab === tab
                ? 'bg-[#102A43] text-[#FFFDF8] font-semibold shadow-sm'
                : 'bg-[#FFFDF8] border border-[#E9E1D4] text-[#6B7280] hover:text-[#102A43]'
            }`}
          >
            {tab} ({tab === 'ALL' ? commissions.length : commissions.filter((c) => c.status === tab).length})
          </button>
        ))}
      </div>

      {/* Commissions Table */}
      <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#6B7280]">Calculating ledger entries...</div>
        ) : filteredCommissions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7280]">No commissions in this category.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E9E1D4] bg-[#F7F3EA] text-[10px] uppercase tracking-wider text-[#6B7280]">
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
              <tbody className="divide-y divide-[#E9E1D4]">
                {filteredCommissions.map((c) => {
                  const propertyTitle = c.property?.title || 'Prime Residence';
                  const brokerName = c.broker?.user?.name || c.broker?.name || 'RERA Specialist';

                  return (
                    <tr key={c._id} className="hover:bg-[#F7F3EA]/60 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-[#102A43] truncate font-display text-sm" title={propertyTitle}>
                          {propertyTitle}
                        </div>
                        <div className="text-[10px] text-[#6B7280] font-mono">
                          Ref: {c.referenceNumber || c._id.slice(-6).toUpperCase()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#B08D57]" />
                          <span className="text-[#102A43]">{brokerName}</span>
                        </div>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          Split: {c.brokerSplitPct || 65}%
                        </span>
                      </td>
                      <td className="py-3 font-display font-medium text-sm px-4 text-[#102A43]">
                        {formatAED(c.salePriceAED)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#B08D57] font-semibold">
                        {formatAED(c.grossCommissionAED)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#102A43]">
                        {formatAED(c.netBrokerCommissionAED)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#5D7A65] font-semibold">
                        {formatAED(c.companyCommissionAED)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                            c.status === 'PAID'
                              ? 'bg-emerald-50 text-[#5D7A65] border-emerald-200'
                              : c.status === 'APPROVED'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : c.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-[#F7F3EA] text-[#6B7280] border-[#E9E1D4]'
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
                              className="px-2.5 py-1 bg-[#FFFDF8] hover:bg-[#102A43] hover:text-[#FFFDF8] border border-[#B08D57] text-[#B08D57] text-[10px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {c.status === 'APPROVED' && (
                            <button
                              disabled={updatingId === c._id}
                              onClick={() => handleStatusUpdate(c._id, 'PAID')}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-[#5D7A65] text-[10px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                            >
                              Mark Paid
                            </button>
                          )}
                          {c.status === 'PAID' && (
                            <span className="text-[10px] text-[#5D7A65] font-mono flex items-center gap-1 font-semibold">
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
