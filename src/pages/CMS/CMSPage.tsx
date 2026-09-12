import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  Shield,
  LayoutTemplate,
  Bell
} from 'lucide-react';

export const CMSPage: React.FC = () => {
  const [content, setContent] = useState<any>({
    heroHeadline: 'Curating Dubai’s Most Exceptional Architectural Legacies',
    heroSubtitle: 'Direct access to verified off-market estates, private islands, and branded penthouses across the Emirates.',
    heroTagline: 'THE PINNACLE OF ARABIAN LUXURY',
    announcementEnabled: true,
    announcementText: 'Private Viewing Appointments Available for Bvlgari Lighthouse & Jumeirah Bay Islands',
    headquartersAddress: 'Gate Village 04, Level 06, DIFC, Dubai, UAE',
    reraLicense: 'RERA ORN: 94821',
    tradeLicense: 'DIFC CL-40192',
    conciergePhone: '+971 4 456 7890',
    conciergeEmail: 'concierge@nestandkey.com',
    whatsappHotline: '+971 50 112 3456',
    statPortfolioAED: '18.4B+',
    statTransactions: '4,200+',
    statClientSatisfaction: '99.4%'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadCMS();
  }, []);

  const loadCMS = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getWebsiteContent();
      if (res.content) {
        setContent((prev: any) => ({ ...prev, ...res.content }));
      }
    } catch (err) {
      console.error('Failed to load CMS:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, val: any) => {
    setContent((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      await adminApi.updateWebsiteContent(content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save website content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-xs text-[#71717A]">Loading website content configuration...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Public Surface Content Management
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Website CMS Editor
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Public portal content updated and published live across all edge caches.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Hero Section */}
        <div className="bg-[#121214] p-6 border border-[#2A2A2D] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#2A2A2D] pb-3">
            <LayoutTemplate className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-serif text-lg text-[#F7F5F0]">Hero Section & Master Messaging</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Eyebrow Tagline
              </label>
              <input
                type="text"
                value={content.heroTagline || ''}
                onChange={(e) => handleChange('heroTagline', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={content.heroHeadline || ''}
                onChange={(e) => handleChange('heroHeadline', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Editorial Subtitle
              </label>
              <textarea
                rows={3}
                value={content.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] p-3 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Global Announcement Bar */}
        <div className="bg-[#121214] p-6 border border-[#2A2A2D] space-y-5">
          <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C5A880]" />
              <h2 className="font-serif text-lg text-[#F7F5F0]">Announcement Banner</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!content.announcementEnabled}
                onChange={(e) => handleChange('announcementEnabled', e.target.checked)}
                className="rounded border-[#2A2A2D] bg-[#18181A] text-[#C5A880] focus:ring-0"
              />
              <span className="text-[11px] text-[#A3A3A8]">Enable Banner</span>
            </label>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
              Banner Text Content
            </label>
            <input
              type="text"
              value={content.announcementText || ''}
              onChange={(e) => handleChange('announcementText', e.target.value)}
              className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
            />
          </div>
        </div>

        {/* Section 3: Legal, RERA & Contact Information */}
        <div className="bg-[#121214] p-6 border border-[#2A2A2D] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#2A2A2D] pb-3">
            <Shield className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-serif text-lg text-[#F7F5F0]">Corporate, RERA & DIFC Headquarters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Headquarters Address
              </label>
              <input
                type="text"
                value={content.headquartersAddress || ''}
                onChange={(e) => handleChange('headquartersAddress', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                RERA License (ORN)
              </label>
              <input
                type="text"
                value={content.reraLicense || ''}
                onChange={(e) => handleChange('reraLicense', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Trade License / Registration
              </label>
              <input
                type="text"
                value={content.tradeLicense || ''}
                onChange={(e) => handleChange('tradeLicense', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Concierge Phone
              </label>
              <input
                type="text"
                value={content.conciergePhone || ''}
                onChange={(e) => handleChange('conciergePhone', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Concierge Email
              </label>
              <input
                type="email"
                value={content.conciergeEmail || ''}
                onChange={(e) => handleChange('conciergeEmail', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Private WhatsApp Hotline
              </label>
              <input
                type="text"
                value={content.whatsappHotline || ''}
                onChange={(e) => handleChange('whatsappHotline', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Public Key Statistics */}
        <div className="bg-[#121214] p-6 border border-[#2A2A2D] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#2A2A2D] pb-3">
            <Building className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-serif text-lg text-[#F7F5F0]">Luxury Brand Key Metrics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Active Portfolio Value
              </label>
              <input
                type="text"
                value={content.statPortfolioAED || ''}
                onChange={(e) => handleChange('statPortfolioAED', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Total Transactions Settled
              </label>
              <input
                type="text"
                value={content.statTransactions || ''}
                onChange={(e) => handleChange('statTransactions', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1.5">
                Client Satisfaction Rate
              </label>
              <input
                type="text"
                value={content.statClientSatisfaction || ''}
                onChange={(e) => handleChange('statClientSatisfaction', e.target.value)}
                className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-6 py-3 text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
