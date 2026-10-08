import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Users2,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  DollarSign,
  AlertCircle,
  Edit3,
  Check,
  X
} from 'lucide-react';

interface PartnerReferralItem {
  id: string; // CS-R-000123
  partner: string;
  partnerId: string;
  market: string;
  date: string;
  status: 'Received' | 'In Progress' | 'Closed' | 'Not Proceeding' | 'Possible Duplicate';
  assignedPerson: string;
  commission: string;
  lastUpdated: string;
  internalNote: string;
}

export const LeadsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'referrals' | 'all_leads'>('referrals');
  const [leads, setLeads] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLeadForAssign, setSelectedLeadForAssign] = useState<any | null>(null);
  const [targetBrokerId, setTargetBrokerId] = useState('');

  // Partner Referrals Desk State (Brief Item #11)
  const [referrals, setReferrals] = useState<PartnerReferralItem[]>([
    {
      id: 'CS-R-000123',
      partner: 'Alexander Wright',
      partnerId: 'CP-0048',
      market: 'Palm Jumeirah',
      date: '2026-10-02',
      status: 'In Progress',
      assignedPerson: 'Tariq Al-Mansoor',
      commission: 'AED 125,000 (50% Split)',
      lastUpdated: 'Today, 11:20 AM',
      internalNote: 'Shortlist of 3 villas sent to partner. Buyer in town next week.'
    },
    {
      id: 'CS-R-000098',
      partner: 'Jean-Luc Bernard',
      partnerId: 'CP-0049',
      market: 'Downtown Dubai',
      date: '2026-09-18',
      status: 'In Progress',
      assignedPerson: 'Elena Rostova',
      commission: 'AED 40,000 (50% Split)',
      lastUpdated: 'Yesterday, 3:45 PM',
      internalNote: 'Form F executed; security deposit received in escrow.'
    },
    {
      id: 'CS-R-000045',
      partner: 'Alexander Wright',
      partnerId: 'CP-0048',
      market: 'DIFC',
      date: '2026-08-14',
      status: 'Closed',
      assignedPerson: 'Tariq Al-Mansoor',
      commission: 'AED 125,000 (50% Split)',
      lastUpdated: '2026-09-05',
      internalNote: 'Conveyance finalized at Dubai Land Department. Commission disbursed.'
    }
  ]);

  // Editing / Action Modal State
  const [editingReferral, setEditingReferral] = useState<PartnerReferralItem | null>(null);
  const [editStatus, setEditStatus] = useState<PartnerReferralItem['status']>('In Progress');
  const [editAssignedPerson, setEditAssignedPerson] = useState('');
  const [editInternalNote, setEditInternalNote] = useState('');
  const [editCommissionRecord, setEditCommissionRecord] = useState('');

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

  const handleSaveReferralAction = () => {
    if (!editingReferral) return;
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === editingReferral.id) {
          return {
            ...r,
            status: editStatus,
            assignedPerson: editAssignedPerson || r.assignedPerson,
            internalNote: editInternalNote || r.internalNote,
            commission: editCommissionRecord || r.commission,
            lastUpdated: 'Just now'
          };
        }
        return r;
      })
    );
    setEditingReferral(null);
  };

  return (
    <div className="space-y-8 font-ui text-[#3E4852]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-semibold block mb-1">
            Enquiries & Referral Desk
          </span>
          <h1 className="font-display text-3xl font-light text-[#102A43]">
            Referrals & Leads Management
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Internal console for managing Partner Network referrals and public leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
              activeTab === 'referrals'
                ? 'bg-[#102A43] text-[#FFFDF8] border-[#102A43]'
                : 'bg-[#FFFDF8] text-[#102A43] border-[#E9E1D4] hover:border-[#B08D57]'
            }`}
          >
            Partner Referrals ({referrals.length})
          </button>
          <button
            onClick={() => setActiveTab('all_leads')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
              activeTab === 'all_leads'
                ? 'bg-[#102A43] text-[#FFFDF8] border-[#102A43]'
                : 'bg-[#FFFDF8] text-[#102A43] border-[#E9E1D4] hover:border-[#B08D57]'
            }`}
          >
            Public Leads ({leads.length})
          </button>
        </div>
      </div>

      {/* TAB 1: PARTNER REFERRALS LIST (Brief Item #11) */}
      {activeTab === 'referrals' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#102A43] text-[#F7F3EA] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Referral ID</th>
                    <th className="py-3 px-4">Partner</th>
                    <th className="py-3 px-4">Market</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Person</th>
                    <th className="py-3 px-4">Commission</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D4]">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-[#F7F3EA]/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-[#102A43]">
                        {ref.id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#102A43] block">{ref.partner}</span>
                        <span className="text-[10px] text-[#6B7280] font-mono">{ref.partnerId}</span>
                      </td>
                      <td className="py-4 px-4 text-[#3E4852]">{ref.market}</td>
                      <td className="py-4 px-4 text-[11px] text-[#6B7280] font-mono">{ref.date}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 border font-semibold ${
                            ref.status === 'Closed'
                              ? 'text-[#5D7A65] bg-[#5D7A65]/10 border-[#5D7A65]/30'
                              : ref.status === 'In Progress'
                              ? 'text-[#B08D57] bg-[#B08D57]/10 border-[#B08D57]/30'
                              : ref.status === 'Possible Duplicate'
                              ? 'text-purple-800 bg-purple-50 border-purple-200'
                              : 'text-[#1E3A5F] bg-[#1E3A5F]/10 border-[#1E3A5F]/30'
                          }`}
                        >
                          {ref.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#102A43] font-medium">{ref.assignedPerson}</td>
                      <td className="py-4 px-4 font-mono text-[#B08D57] font-semibold">{ref.commission}</td>
                      <td className="py-4 px-4 text-[11px] text-[#6B7280] font-mono">{ref.lastUpdated}</td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditingReferral(ref);
                            setEditStatus(ref.status);
                            setEditAssignedPerson(ref.assignedPerson);
                            setEditInternalNote(ref.internalNote);
                            setEditCommissionRecord(ref.commission);
                          }}
                          className="bg-[#102A43] text-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Action Modal for Partner Referral (Brief Item #11) */}
          {editingReferral && (
            <div className="fixed inset-0 z-50 bg-[#0B2135]/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-lg w-full p-6 text-xs text-[#3E4852] space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-[#E9E1D4]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#B08D57] font-semibold block">
                      Admin Action Desk
                    </span>
                    <h3 className="font-display text-xl text-[#102A43]">
                      Manage Referral: {editingReferral.id}
                    </h3>
                  </div>
                  <button onClick={() => setEditingReferral(null)} className="text-[#6B7280] hover:text-[#102A43]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 bg-[#F7F3EA] border border-[#E9E1D4] text-xs">
                  <div>Partner: <strong className="text-[#102A43]">{editingReferral.partner} ({editingReferral.partnerId})</strong></div>
                  <div>Market: <strong className="text-[#102A43]">{editingReferral.market}</strong></div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                      Update Partner-Facing Status *
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e: any) => setEditStatus(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43]"
                    >
                      <option value="Received">Received</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Possible Duplicate">Possible Duplicate (Internal Review)</option>
                      <option value="Closed">Closed</option>
                      <option value="Not Proceeding">Not Proceeding</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                      Assign Internal Person
                    </label>
                    <input
                      type="text"
                      value={editAssignedPerson}
                      onChange={(e) => setEditAssignedPerson(e.target.value)}
                      placeholder="e.g. Tariq Al-Mansoor"
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                      Record Commission Terms
                    </label>
                    <input
                      type="text"
                      value={editCommissionRecord}
                      onChange={(e) => setEditCommissionRecord(e.target.value)}
                      placeholder="e.g. AED 125,000 (50% Split as per Partner Agreement v1.2)"
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                      Internal Admin Note
                    </label>
                    <textarea
                      rows={2}
                      value={editInternalNote}
                      onChange={(e) => setEditInternalNote(e.target.value)}
                      placeholder="Add confidential update or next steps..."
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingReferral(null)}
                    className="flex-1 border border-[#E9E1D4] py-2 text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReferralAction}
                    className="flex-1 bg-[#102A43] text-white py-2 text-xs uppercase font-semibold"
                  >
                    Save & Update Timestamp
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL PUBLIC LEADS */}
      {activeTab === 'all_leads' && (
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-x-auto animate-in fade-in">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EA] border-b border-[#E9E1D4] text-[#6B7280] uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-[#E9E1D4]">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#F7F3EA]/60 transition-colors">
                  <td className="p-4 font-mono text-[#B08D57] font-medium">{lead.leadId}</td>
                  <td className="p-4 font-display text-sm text-[#102A43]">{lead.name}</td>
                  <td className="p-4 font-mono text-[#6B7280]">
                    {lead.mobile} • {lead.email}
                  </td>
                  <td className="p-4 text-[#102A43]">
                    {lead.broker ? (
                      <span className="text-[#5D7A65] font-semibold">
                        {lead.broker.user?.name || lead.broker.title}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-mono">Unassigned Pool</span>
                    )}
                  </td>
                  <td className="p-4 text-[#6B7280] font-mono text-[10px]">{lead.source}</td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#F7F3EA] border border-[#E9E1D4] text-[#6B7280]">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLeadForAssign(lead)}
                      className="text-[11px] text-[#B08D57] hover:text-[#102A43] uppercase tracking-wider font-semibold font-mono"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
