import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Building2,
  Users2,
  Briefcase,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PieChart
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return <div className="p-12 text-xs text-[#71717A]">Loading platform control metrics...</div>;
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Dubai Market Ecosystem Core
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Platform Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties"
            className="bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all"
          >
            Review Listings ({m.pendingProperties || 0} Pending)
          </Link>
          <Link
            to="/admin/leads"
            className="border border-[#2A2A2D] hover:border-[#C5A880] bg-[#121214] text-[#F7F5F0] px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors"
          >
            Assign Leads
          </Link>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Listings */}
        <div className="bg-[#121214] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Total Listings</span>
            <Building2 className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">{m.totalProperties || 0}</div>
          <div className="flex items-center gap-2 text-[10px] text-[#A3A3A8] mt-1">
            <span className="text-emerald-400 font-mono">{m.activeProperties || 0} Active</span>
            <span>•</span>
            <span className="text-amber-400 font-mono">{m.pendingProperties || 0} Pending</span>
          </div>
        </div>

        {/* Brokers */}
        <div className="bg-[#121214] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Certified Brokers</span>
            <Briefcase className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">{m.totalBrokers || 0}</div>
          <span className="text-[10px] text-[#C5A880] mt-1 block font-mono">
            {m.activeBrokers || 0} RERA Licensed Active
          </span>
        </div>

        {/* Platform Leads */}
        <div className="bg-[#121214] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Inquiries & Leads</span>
            <Users2 className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">{m.totalLeads || 0}</div>
          <span className="text-[10px] text-[#A3A3A8] mt-1 block">
            Conversion rate: <strong className="text-[#C5A880]">{m.conversionRatePct || 0}%</strong>
          </span>
        </div>

        {/* Total Platform Volume */}
        <div className="bg-[#121214] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Company Commissions</span>
            <DollarSign className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-2xl text-[#C5A880] font-medium truncate">
            {formatAED(m.totalCompanyCommissionAED || 0)}
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">
            Gross fees: {formatAED(m.totalGrossCommissionAED || 0)}
          </span>
        </div>
      </div>

      {/* Breakdown: Lead Sources & Properties by Community */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Lead Sources */}
        <div className="lg:col-span-6 bg-[#121214] border border-[#2A2A2D] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]">
            <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Lead Acquisition Sources</h3>
            <span className="text-[10px] text-[#C5A880] font-mono">Multi-Channel Attribution</span>
          </div>

          <div className="space-y-3 text-xs">
            {data?.leadsBySource?.map((src: any) => {
              const count = src.count;
              const pct = m.totalLeads > 0 ? (count / m.totalLeads) * 100 : 0;
              return (
                <div key={src._id} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#A3A3A8] font-mono uppercase">{src._id}</span>
                    <span className="text-[#F7F5F0] font-semibold">{count} leads ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-[#0B0B0C] h-2 border border-[#2A2A2D]">
                    <div className="bg-[#C5A880] h-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Properties by Community */}
        <div className="lg:col-span-6 bg-[#121214] border border-[#2A2A2D] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]">
            <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Listings Distribution by Community</h3>
            <Link to="/admin/properties" className="text-[10px] text-[#C5A880] uppercase tracking-wider hover:underline">
              Inventory
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {data?.propertiesByCommunity?.map((comm: any) => (
              <div key={comm._id} className="flex justify-between items-center p-2.5 bg-[#18181A] border border-[#2A2A2D]/60">
                <span className="text-[#F7F5F0] font-medium">{comm._id}</span>
                <div className="text-right">
                  <span className="text-[#C5A880] font-mono font-bold block">{comm.count} Active</span>
                  <span className="text-[10px] text-[#71717A]">Total value: {formatAED(comm.avgPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System-Wide Activity Audit */}
      <div className="bg-[#121214] border border-[#2A2A2D] p-6">
        <div className="mb-4 pb-3 border-b border-[#2A2A2D] flex items-center justify-between">
          <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Platform Activity Stream</h3>
          <Link to="/admin/audit-logs" className="text-[11px] text-[#C5A880] uppercase tracking-wider hover:underline">
            All Audit Logs
          </Link>
        </div>

        <div className="space-y-3 text-xs">
          {data?.recentActivities?.map((act: any) => (
            <div key={act._id} className="flex items-center justify-between p-3 bg-[#18181A] border border-[#2A2A2D]/60">
              <div className="flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="text-[#A3A3A8]">{act.details}</span>
              </div>
              <span className="text-[10px] text-[#71717A] font-mono shrink-0">
                {new Date(act.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
