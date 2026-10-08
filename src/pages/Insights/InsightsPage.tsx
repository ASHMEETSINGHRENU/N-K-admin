import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  BookOpen,
  Plus,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'MARKET_TRENDS',
    readTimeMinutes: 5,
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    tags: 'Dubai Real Estate, Ultra Luxury, Market Report',
    isFeatured: false
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getInsights();
      setInsights(res.insights || []);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently withdraw "${title}"?`)) return;
    try {
      await adminApi.deleteInsight(id);
      await loadInsights();
    } catch (err: any) {
      alert(err.message || 'Failed to delete insight');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await adminApi.createInsight({
        ...formData,
        tags: tagsArray
      });

      setIsModalOpen(false);
      setFormData({
        title: '',
        category: 'MARKET_TRENDS',
        readTimeMinutes: 5,
        excerpt: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        tags: 'Dubai Real Estate, Ultra Luxury, Market Report',
        isFeatured: false
      });
      await loadInsights();
    } catch (err: any) {
      alert(err.message || 'Failed to create insight');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Institutional Research & Editorial
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Market Insights CMS
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Intelligence</span>
        </button>
      </div>

      {/* Grid of Insights */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#6B7280]">Loading editorial manuscripts...</div>
      ) : insights.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#6B7280]">No market intelligence articles published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((article) => (
            <div
              key={article._id}
              className="bg-[#FFFDF8] border border-[#E9E1D4] flex flex-col justify-between overflow-hidden group hover:border-[#B08D57] transition-all shadow-sm"
            >
              <div className="relative h-44 overflow-hidden bg-[#F7F3EA]">
                <img
                  src={article.coverImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-[#FFFDF8]/90 backdrop-blur-md border border-[#E9E1D4] text-[9px] uppercase tracking-wider text-[#102A43] font-mono shadow-sm">
                    {article.category?.replace('_', ' ') || 'REPORT'}
                  </span>
                  {article.isFeatured && (
                    <span className="px-2 py-0.5 bg-[#102A43] text-[#FFFDF8] text-[9px] uppercase tracking-wider font-semibold font-mono shadow-sm">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] text-[#6B7280] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTimeMinutes || 5} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-[#102A43] leading-snug group-hover:text-[#B08D57] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#3E4852] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E9E1D4] flex items-center justify-between">
                  <span className="text-[10px] text-[#6B7280] font-mono">
                    Author: {article.author?.name || 'Alexander Sterling'}
                  </span>
                  <button
                    onClick={() => handleDelete(article._id, article.title)}
                    className="p-1.5 text-[#6B7280] hover:text-red-500 transition-colors"
                    title="Withdraw article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Intelligence Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B2135]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D4]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B08D57] font-mono font-semibold">
                  Editorial Desk
                </span>
                <h3 className="font-display text-xl text-[#102A43] mt-0.5">
                  Publish Market Intelligence Report
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B7280] hover:text-[#102A43]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 2026 Dubai Prime Waterfront Capital Appreciation Indices"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] placeholder-[#6B7280] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
                  >
                    <option value="MARKET_TRENDS">Market Trends & Indices</option>
                    <option value="INVESTMENT">Ultra-HNW Investment</option>
                    <option value="ARCHITECTURE">Architectural Legacies</option>
                    <option value="REGULATORY">RERA & Golden Visa</option>
                    <option value="LIFESTYLE">Dubai High Living</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                    Estimated Read Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.readTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] font-mono focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] placeholder-[#6B7280] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] px-3 py-2 text-xs text-[#102A43] placeholder-[#6B7280] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                  Executive Excerpt
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview summarizing the key empirical thesis..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-3 text-xs text-[#102A43] placeholder-[#6B7280] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 font-mono">
                  Full Article Body
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Comprehensive editorial report, empirical analysis, and institutional takeaways..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-3 text-xs text-[#102A43] placeholder-[#6B7280] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-[#E9E1D4] bg-[#F7F3EA] text-[#102A43] focus:ring-0"
                  />
                  <span className="text-[11px] text-[#3E4852]">Feature prominently on homepage</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
