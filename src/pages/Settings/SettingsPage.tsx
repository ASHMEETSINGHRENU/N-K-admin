import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  DollarSign,
  Lock,
  Save,
  CheckCircle2,
  Sliders,
  Database,
  Key
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultAgencyCommissionPct: 2.0,
    brokerBaseSplitPct: 65,
    companyBaseSplitPct: 35,
    vatPct: 5.0,
    enforceReraRegistration: true,
    maskClientPhoneOnPublic: true,
    leadConfidentialityRetentionDays: 90,
    autoAssignLeadByLocation: true,
    twoFactorAdminEnforcement: true,
    sessionTimeoutMinutes: 120,
    notificationWebhookUrl: 'https://api.crestshore.com/webhooks/ops'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            System Infrastructure & Policy
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Platform Governance Settings
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save System Policies</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform policies updated and synchronized across all operational modules.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Financial & Split Parameters */}
        <div className="bg-[#FFFDF8] p-6 border border-[#E9E1D4] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#E9E1D4] pb-3">
            <DollarSign className="w-4 h-4 text-[#102A43]" />
            <h2 className="font-display text-lg text-[#102A43]">Financial & Commission Model</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1.5 font-mono">
                Default Agency Fee (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.defaultAgencyCommissionPct}
                onChange={(e) =>
                  setSettings({ ...settings, defaultAgencyCommissionPct: parseFloat(e.target.value) })
                }
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] font-mono focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1.5 font-mono">
                Broker Split Allocation (%)
              </label>
              <input
                type="number"
                value={settings.brokerBaseSplitPct}
                onChange={(e) =>
                  setSettings({ ...settings, brokerBaseSplitPct: parseInt(e.target.value) })
                }
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] font-mono focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1.5 font-mono">
                Treasury Retained Split (%)
              </label>
              <input
                type="number"
                value={settings.companyBaseSplitPct}
                onChange={(e) =>
                  setSettings({ ...settings, companyBaseSplitPct: parseInt(e.target.value) })
                }
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] font-mono focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>
        </div>

        {/* Client Privacy Protection Invariant */}
        <div className="bg-[#FFFDF8] p-6 border border-[#E9E1D4] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#E9E1D4] pb-3">
            <Lock className="w-4 h-4 text-[#102A43]" />
            <h2 className="font-display text-lg text-[#102A43]">Strict Client Privacy Governance</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maskClientPhoneOnPublic}
                onChange={(e) =>
                  setSettings({ ...settings, maskClientPhoneOnPublic: e.target.checked })
                }
                className="mt-0.5 rounded border-[#E9E1D4] bg-[#F7F3EA] text-[#102A43] focus:ring-0"
              />
              <div>
                <span className="text-[#102A43] font-medium block">
                  Enforce Public Endpoint Privacy Filter
                </span>
                <span className="text-[#6B7280] text-[11px] block">
                  Never serialize client mobile numbers or sensitive identities across public APIs or DOM metadata.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enforceReraRegistration}
                onChange={(e) =>
                  setSettings({ ...settings, enforceReraRegistration: e.target.checked })
                }
                className="mt-0.5 rounded border-[#E9E1D4] bg-[#F7F3EA] text-[#102A43] focus:ring-0"
              />
              <div>
                <span className="text-[#102A43] font-medium block">
                  Mandatory Dubai RERA BRN Validation
                </span>
                <span className="text-[#6B7280] text-[11px] block">
                  Requires valid Real Estate Regulatory Agency license verification before activating any broker profile.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAssignLeadByLocation}
                onChange={(e) =>
                  setSettings({ ...settings, autoAssignLeadByLocation: e.target.checked })
                }
                className="mt-0.5 rounded border-[#E9E1D4] bg-[#F7F3EA] text-[#102A43] focus:ring-0"
              />
              <div>
                <span className="text-[#102A43] font-medium block">
                  Automated Geographic Lead Routing
                </span>
                <span className="text-[#6B7280] text-[11px] block">
                  Route incoming high-net-worth inquiries to localized specialists based on community specialization.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-[#FFFDF8] p-6 border border-[#E9E1D4] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#E9E1D4] pb-3">
            <ShieldCheck className="w-4 h-4 text-[#102A43]" />
            <h2 className="font-display text-lg text-[#102A43]">Session & Security Parameters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1.5 font-mono">
                Session Inactivity Timeout (Minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings({ ...settings, sessionTimeoutMinutes: parseInt(e.target.value) })
                }
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] font-mono focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1.5 font-mono">
                Operational Webhook Relay
              </label>
              <input
                type="url"
                value={settings.notificationWebhookUrl}
                onChange={(e) =>
                  setSettings({ ...settings, notificationWebhookUrl: e.target.value })
                }
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] font-mono focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
