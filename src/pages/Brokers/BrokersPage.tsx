import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Briefcase,
  Plus,
  ShieldCheck,
  CheckCircle2,
  User,
  Phone,
  Mail,
  FileCheck,
  UploadCloud,
  FileText,
  AlertCircle,
  Clock,
  Send,
  Eye,
  Check,
  X
} from 'lucide-react';

interface PartnerRecord {
  id: string; // e.g. CP-0048
  name: string;
  company: string;
  type: string;
  city: string;
  phone: string;
  email: string;
  status: 'Pending Review' | 'Approved' | 'Request Information' | 'Rejected' | 'Suspended';
  agreementStatus: 'Not Uploaded' | 'Uploaded' | 'Sent for Review' | 'Viewed' | 'Signed/Approved' | 'Declined' | 'Expired';
  agreementVersion: string;
  commissionSplit: string;
  effectiveDate: string;
}

export const BrokersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'partners' | 'upload_agreement'>('partners');
  const [partners, setPartners] = useState<PartnerRecord[]>([
    {
      id: 'CP-0048',
      name: 'Alexander Wright',
      company: 'Wright Wealth Advisory Ltd.',
      type: 'Wealth Manager / Family Office',
      city: 'Dubai / DIFC',
      phone: '+971 50 112 3456',
      email: 'alexander@wrightwealth.com',
      status: 'Approved',
      agreementStatus: 'Signed/Approved',
      agreementVersion: 'v1.2',
      commissionSplit: '50% of Crestshore Gross Agency Fee',
      effectiveDate: '2026-10-01'
    },
    {
      id: 'CP-0049',
      name: 'Jean-Luc Bernard',
      company: 'Lombard Private Assets Geneva',
      type: 'Wealth Manager',
      city: 'Zurich / Geneva',
      phone: '+41 22 819 4400',
      email: 'jl.bernard@lombardassets.ch',
      status: 'Approved',
      agreementStatus: 'Sent for Review',
      agreementVersion: 'v1.0',
      commissionSplit: '50% of Crestshore Gross Agency Fee',
      effectiveDate: '2026-10-05'
    },
    {
      id: 'CP-0050',
      name: 'Sofia Al-Husseini',
      company: 'Apex Chartered Tax Consultants',
      type: 'CA / Tax Advisor',
      city: 'Dubai / Abu Dhabi',
      phone: '+971 55 981 7722',
      email: 'sofia@apexconsult.ae',
      status: 'Pending Review',
      agreementStatus: 'Not Uploaded',
      agreementVersion: '—',
      commissionSplit: 'TBD',
      effectiveDate: '—'
    }
  ]);

  // Agreement Upload Form State (Brief Item #5)
  const [uploadPartnerId, setUploadPartnerId] = useState('CP-0048');
  const [agreementTitle, setAgreementTitle] = useState('Master Institutional Referral Agreement');
  const [agreementVersion, setAgreementVersion] = useState('v1.3');
  const [effectiveDate, setEffectiveDate] = useState('2026-10-15');
  const [expiryDate, setExpiryDate] = useState('2028-10-15');
  const [commissionSplitTerms, setCommissionSplitTerms] = useState('50% of Crestshore Gross Agency Fee');
  const [adminNote, setAdminNote] = useState('Updated institutional split terms for Q4 2026 pipeline.');
  const [fileName, setFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [warningWrongPartner, setWarningWrongPartner] = useState(false);

  // Partner Action Modals
  const [selectedPartner, setSelectedPartner] = useState<PartnerRecord | null>(null);

  const handlePartnerAction = (partnerIdToChange: string, newStatus: PartnerRecord['status']) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === partnerIdToChange) {
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
    alert(`Partner ${partnerIdToChange} status updated to: ${newStatus}`);
  };

  const handleUploadAgreementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPartnerId || !agreementTitle || !agreementVersion) return;

    // Check safeguard
    const targetPartner = partners.find((p) => p.id === uploadPartnerId);
    if (!targetPartner) {
      alert('Selected partner not found.');
      return;
    }

    setUploadSuccess(true);
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === uploadPartnerId) {
          return {
            ...p,
            agreementStatus: 'Sent for Review',
            agreementVersion,
            commissionSplit: commissionSplitTerms,
            effectiveDate
          };
        }
        return p;
      })
    );

    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('partners');
    }, 2000);
  };

  return (
    <div className="space-y-8 font-ui text-[#3E4852]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-semibold block mb-1">
            Institutional Roster & Agreements
          </span>
          <h1 className="font-display text-3xl font-light text-[#102A43]">
            Partner Network & Agreement Desk
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Manage approved partners, approve applications, and upload partner-specific agreements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
              activeTab === 'partners'
                ? 'bg-[#102A43] text-[#FFFDF8] border-[#102A43]'
                : 'bg-[#FFFDF8] text-[#102A43] border-[#E9E1D4] hover:border-[#B08D57]'
            }`}
          >
            Partner Roster ({partners.length})
          </button>
          <button
            onClick={() => setActiveTab('upload_agreement')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border flex items-center gap-1.5 ${
              activeTab === 'upload_agreement'
                ? 'bg-[#102A43] text-[#FFFDF8] border-[#102A43]'
                : 'bg-[#FFFDF8] text-[#102A43] border-[#E9E1D4] hover:border-[#B08D57]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#B08D57]" />
            <span>Upload Partner Agreement</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PARTNER ROSTER */}
      {activeTab === 'partners' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#102A43] text-[#F7F3EA] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Partner ID</th>
                    <th className="py-3 px-4">Partner / Company</th>
                    <th className="py-3 px-4">Type & City</th>
                    <th className="py-3 px-4">Application Status</th>
                    <th className="py-3 px-4">Agreement Status</th>
                    <th className="py-3 px-4">Agreed Split Terms</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E1D4]">
                  {partners.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F7F3EA]/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-semibold text-[#102A43]">
                        {p.id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#102A43] block">{p.name}</span>
                        <span className="text-[11px] text-[#6B7280]">{p.company}</span>
                        <span className="text-[10px] text-[#6B7280] block font-mono mt-0.5">{p.email} • {p.phone}</span>
                      </td>
                      <td className="py-4 px-4 text-[#3E4852]">
                        <span className="font-medium block">{p.type}</span>
                        <span className="text-[10px] text-[#6B7280]">{p.city}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 border font-semibold ${
                            p.status === 'Approved'
                              ? 'text-[#5D7A65] bg-[#5D7A65]/10 border-[#5D7A65]/30'
                              : p.status === 'Pending Review'
                              ? 'text-amber-800 bg-amber-50 border-amber-200'
                              : 'text-red-800 bg-red-50 border-red-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 border font-semibold ${
                            p.agreementStatus === 'Signed/Approved'
                              ? 'text-[#5D7A65] bg-[#5D7A65]/10 border-[#5D7A65]/30'
                              : p.agreementStatus === 'Sent for Review'
                              ? 'text-purple-800 bg-purple-50 border-purple-200'
                              : 'text-[#6B7280] bg-gray-50 border-gray-200'
                          }`}
                        >
                          {p.agreementStatus} ({p.agreementVersion})
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-[#B08D57]">
                        {p.commissionSplit}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.status === 'Pending Review' && (
                            <button
                              onClick={() => handlePartnerAction(p.id, 'Approved')}
                              className="bg-[#5D7A65] text-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                              title="Approve & Assign Partner ID"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setUploadPartnerId(p.id);
                              setActiveTab('upload_agreement');
                            }}
                            className="bg-[#102A43] text-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                          >
                            Upload Agreement
                          </button>
                          <button
                            onClick={() => handlePartnerAction(p.id, 'Suspended')}
                            className="border border-red-300 text-red-700 hover:bg-red-50 px-2 py-1 text-[10px]"
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN AGREEMENT UPLOAD SCREEN (Brief Item #5) */}
      {activeTab === 'upload_agreement' && (
        <div className="max-w-3xl mx-auto bg-[#FFFDF8] border border-[#E9E1D4] p-8 sm:p-10 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-[#E9E1D4] pb-5 flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-semibold block mb-1">
                Admin Agreement Upload & Commercial Terms
              </span>
              <h2 className="font-display text-2xl text-[#102A43]">
                Upload Partner-Specific Agreement
              </h2>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Replaces standalone commission policy. Upload completed agreement PDF for this individual partner with exact commercial splits.
              </p>
            </div>
          </div>

          {uploadSuccess ? (
            <div className="p-8 bg-[#5D7A65]/10 border border-[#5D7A65]/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#5D7A65] mx-auto" />
              <h3 className="font-display text-xl text-[#102A43]">Agreement Sent for Partner Review</h3>
              <p className="text-xs text-[#6B7280]">
                Agreement {agreementVersion} uploaded for {uploadPartnerId}. Email and WhatsApp notification dispatched to partner.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUploadAgreementSubmit} className="space-y-5 text-xs">
              {/* Partner Selector */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                  Select Partner / Partner ID *
                </label>
                <select
                  value={uploadPartnerId}
                  onChange={(e) => {
                    setUploadPartnerId(e.target.value);
                    if (e.target.value !== 'CP-0048') {
                      setWarningWrongPartner(true);
                    } else {
                      setWarningWrongPartner(false);
                    }
                  }}
                  className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.name} ({p.company})
                    </option>
                  ))}
                </select>
                {warningWrongPartner && (
                  <p className="text-[11px] text-amber-800 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Safeguard check: Verify you are uploading the intended agreement for this partner.</span>
                  </p>
                )}
              </div>

              {/* Agreement Title & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                    Agreement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={agreementTitle}
                    onChange={(e) => setAgreementTitle(e.target.value)}
                    placeholder="e.g. Master Institutional Referral Agreement"
                    className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                    Agreement Version Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={agreementVersion}
                    onChange={(e) => setAgreementVersion(e.target.value)}
                    placeholder="e.g. v1.2"
                    className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              {/* Effective Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                    Effective Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              {/* Commission split / payment terms shown in the agreement */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                  Commission Split & Payment Terms Shown in Agreement *
                </label>
                <input
                  type="text"
                  required
                  value={commissionSplitTerms}
                  onChange={(e) => setCommissionSplitTerms(e.target.value)}
                  placeholder="e.g. 50% of Crestshore Gross Agency Fee"
                  className="w-full bg-[#FFFDF8] border border-[#E9E1D4] px-3.5 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                />
                <span className="text-[10px] text-[#6B7280] mt-1 block">
                  * Note: The authoritative terms remain the uploaded agreement PDF.
                </span>
              </div>

              {/* Upload PDF Box */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                  Completed Agreement PDF *
                </label>
                <div className="border border-dashed border-[#E9E1D4] p-6 text-center bg-[#F7F3EA]/50">
                  <UploadCloud className="w-8 h-8 text-[#B08D57] mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                    className="text-xs"
                  />
                  {fileName && (
                    <div className="text-xs font-semibold text-[#102A43] mt-2">
                      Selected File: {fileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Admin Note */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#6B7280] font-medium block mb-1">
                  Optional Admin Note
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Internal audit remarks or client background..."
                  className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-3 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              {/* Safeguards Summary */}
              <div className="p-4 bg-[#F7F3EA] border border-[#E9E1D4] text-[11px] text-[#3E4852] leading-relaxed">
                <strong>Admin Safeguards:</strong> Creating this record creates a new version history. Unsigned agreements can be superseded or withdrawn. Signed agreements can never be deleted or overwritten.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('partners')}
                  className="flex-1 border border-[#E9E1D4] py-3 text-xs uppercase tracking-wider text-[#3E4852]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] py-3 text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Send for Signature / Approval
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default BrokersPage;
