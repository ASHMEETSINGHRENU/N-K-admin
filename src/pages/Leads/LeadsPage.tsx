import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { Users2, UserPlus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<any | null>(null);
  const [targetBrokerId, setTargetBrokerId] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, brokersRes] = await Promise.all([
        adminApi.getLeads(),
        adminApi.getBrokers()
      ]);
      setLeads(leadsRes.leads || []);
      setBrokers(brokersRes.brokers || []);
      if (brokersRes.brokers?.length > 0) {
        setTargetBrokerId(brokersRes.brokers[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignBroker = async () => {
    if (!selectedLeadForAssign || !targetBrokerId) return;
    try {
      await adminApi.assignLead(selectedLeadForAssign._id, targetBrokerId);
      setSelectedLeadForAssign(null);
      await loadData();
      alert('Lead successfully reassigned.');
    } catch (err: any) {
      alert(err.message || 'Failed to reassign lead');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Central Lead Pool
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Lead Orchestration & Assignment
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#121214] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-[#121214] border border-[#2A2A2D] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0B0C] border-b border-[#2A2A2D] text-[#71717A] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Lead ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Assigned Broker</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Reassign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#18181A]/50">
                  <td className="p-4 font-mono text-[#C5A880] font-medium">{lead.leadId}</td>
                  <td className="p-4 font-serif text-sm text-[#F7F5F0]">{lead.name}</td>
                  <td className="p-4 font-mono text-[#A3A3A8]">
                    {lead.mobile} • {lead.email}
                  </td>
                  <td className="p-4 text-[#F7F5F0]">
                    {lead.broker ? (
                      <span className="text-emerald-400 font-medium">
                        {lead.broker.user?.name || lead.broker.title}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono">Unassigned Pool</span>
                    )}
                  </td>
                  <td className="p-4 text-[#71717A] font-mono text-[10px]">{lead.source}</td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#18181A] border border-[#2A2A2D] text-[#A3A3A8]">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLeadForAssign(lead)}
                      className="px-3 py-1 bg-[#18181A] hover:bg-[#262629] border border-[#C5A880] text-[#C5A880] text-[10px] uppercase font-semibold"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reassign Modal */}
      {selectedLeadForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070708]/80 backdrop-blur-sm">
          <div className="bg-[#121214] border border-[#2A2A2D] max-w-sm w-full p-6 text-[#F7F5F0] space-y-4 text-xs">
            <h3 className="font-serif text-xl font-light">Reassign Lead</h3>
            <p className="text-[#A3A3A8]">
              Assign <strong className="text-[#F7F5F0]">{selectedLeadForAssign.name}</strong> ({selectedLeadForAssign.leadId}) to a certified broker:
            </p>

            <div>
              <label className="block text-[10px] uppercase text-[#71717A] mb-1">Select Broker</label>
              <select
                value={targetBrokerId}
                onChange={(e) => setTargetBrokerId(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2D] p-2.5 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
              >
                {brokers.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.user?.name || b.title} ({b.reraNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLeadForAssign(null)}
                className="px-3 py-1.5 border border-[#2A2A2D] text-[#A3A3A8]"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignBroker}
                className="px-3 py-1.5 bg-[#C5A880] text-[#18181A] font-semibold"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
