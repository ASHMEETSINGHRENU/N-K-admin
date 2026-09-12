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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Institutional Research & Editorial
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Market Insights CMS
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Intelligence</span>
        </button>
      </div>

      {/* Grid of Insights */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#71717A]">Loading editorial manuscripts...</div>
      ) : insights.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#71717A]">No market intelligence articles published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((article) => (
            <div
              key={article._id}
              className="bg-[#121214] border border-[#2A2A2D] flex flex-col justify-between overflow-hidden group hover:border-[#C5A880]/50 transition-all"
            >
              <div className="relative h-44 overflow-hidden bg-[#18181A]">
                <img
                  src={article.coverImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 bg-[#0B0B0C]/80 backdrop-blur-md border border-[#2A2A2D] text-[9px] uppercase tracking-wider text-[#C5A880] font-mono">
                    {article.category?.replace('_', ' ') || 'REPORT'}
                  </span>
                  {article.isFeatured && (
                    <span className="px-2 py-0.5 bg-[#C5A880] text-[#18181A] text-[9px] uppercase tracking-wider font-semibold font-mono">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] text-[#71717A] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTimeMinutes || 5} min read
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-[#F7F5F0] leading-snug group-hover:text-[#C5A880] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#A3A3A8] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2A2D] flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] font-mono">
                    Author: {article.author?.name || 'Alexander Sterling'}
                  </span>
                  <button
                    onClick={() => handleDelete(article._id, article.title)}
                    className="p-1.5 text-[#71717A] hover:text-red-400 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#2A2A2D] max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2D]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono">
                  Editorial Desk
                </span>
                <h3 className="font-serif text-xl text-[#F7F5F0] mt-0.5">
                  Publish Market Intelligence Report
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A3A3A8] hover:text-[#F7F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 2026 Dubai Prime Waterfront Capital Appreciation Indices"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="MARKET_TRENDS">Market Trends & Indices</option>
                    <option value="INVESTMENT">Ultra-HNW Investment</option>
                    <option value="ARCHITECTURE">Architectural Legacies</option>
                    <option value="REGULATORY">RERA & Golden Visa</option>
                    <option value="LIFESTYLE">Dubai High Living</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                    Estimated Read Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.readTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Executive Excerpt
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview summarizing the key empirical thesis..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] p-3 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Full Article Body
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Comprehensive editorial report, empirical analysis, and institutional takeaways..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] p-3 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-[#2A2A2D] bg-[#18181A] text-[#C5A880] focus:ring-0"
                  />
                  <span className="text-[11px] text-[#A3A3A8]">Feature prominently on homepage</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#2A2A2D] text-xs uppercase tracking-wider text-[#A3A3A8] hover:text-[#F7F5F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] text-xs uppercase tracking-wider font-semibold transition-all disabled:opacity-50"
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
