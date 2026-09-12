import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Building,
  DollarSign,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80',
    lifestyle: 'Waterfront, Super-Mansions, Private Beach',
    averagePriceSqFtAED: 5200,
    isFeatured: true
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getCommunities();
      setCommunities(res.communities || []);
    } catch (err) {
      console.error('Failed to load communities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCommunity(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80',
      lifestyle: 'Waterfront, Super-Mansions, Private Beach',
      averagePriceSqFtAED: 5200,
      isFeatured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comm: any) => {
    setEditingCommunity(comm);
    setFormData({
      name: comm.name,
      slug: comm.slug,
      description: comm.description || '',
      image: comm.image || '',
      lifestyle: Array.isArray(comm.lifestyle) ? comm.lifestyle.join(', ') : (comm.lifestyle || ''),
      averagePriceSqFtAED: comm.averagePriceSqFtAED || 5000,
      isFeatured: !!comm.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete community enclave "${name}"?`)) return;
    try {
      await adminApi.deleteCommunity(id);
      await loadCommunities();
    } catch (err: any) {
      alert(err.message || 'Failed to delete community');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        lifestyle: formData.lifestyle.split(',').map((s) => s.trim()).filter(Boolean)
      };

      if (editingCommunity) {
        await adminApi.updateCommunity(editingCommunity._id, payload);
      } else {
        await adminApi.createCommunity(payload);
      }

      setIsModalOpen(false);
      await loadCommunities();
    } catch (err: any) {
      alert(err.message || 'Failed to save community');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Geographic Master Taxonomies
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Communities & Prime Enclaves
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Enclave</span>
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A3A3A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search communities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181A] border border-[#2A2A2D] pl-10 pr-4 py-2 text-xs text-[#F7F5F0] placeholder-[#71717A] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
        <div className="text-xs text-[#A3A3A8]">
          Cataloging <span className="text-[#F7F5F0] font-medium">{filteredCommunities.length}</span> verified luxury jurisdictions
        </div>
      </div>

      {/* Grid of Communities */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#71717A]">Loading geographic database...</div>
      ) : filteredCommunities.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#71717A]">No communities match your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((comm) => (
            <div
              key={comm._id}
              className="bg-[#121214] border border-[#2A2A2D] overflow-hidden group hover:border-[#C5A880]/50 transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-[#18181A]">
                <img
                  src={comm.image || 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'}
                  alt={comm.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {comm.isFeatured && (
                    <span className="px-2 py-0.5 bg-[#C5A880] text-[#18181A] text-[9px] uppercase tracking-wider font-semibold font-mono">
                      Prime Enclave
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-[#F7F5F0] group-hover:text-[#C5A880] transition-colors">
                    {comm.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#C5A880] font-mono">
                    <span>Avg {formatAED(comm.averagePriceSqFtAED || 5000)} / sq.ft</span>
                  </div>
                  <p className="text-xs text-[#A3A3A8] line-clamp-2 leading-relaxed">
                    {comm.description || 'Exclusive residential jurisdiction catering to discerning high-net-worth investors.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2A2D] flex items-center justify-between">
                  <span className="text-[10px] text-[#71717A] font-mono">
                    /{comm.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(comm)}
                      className="p-1.5 text-[#A3A3A8] hover:text-[#C5A880] transition-colors"
                      title="Edit Community"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comm._id, comm.name)}
                      className="p-1.5 text-[#A3A3A8] hover:text-red-400 transition-colors"
                      title="Delete Community"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#2A2A2D] max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2D]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono">
                  Enclave Architecture
                </span>
                <h3 className="font-serif text-xl text-[#F7F5F0] mt-0.5">
                  {editingCommunity ? 'Edit Enclave' : 'Create New Luxury Community'}
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
                  Community Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Palm Jumeirah, Dubai Hills Estate"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  URL Slug (Auto-generated if blank)
                </label>
                <input
                  type="text"
                  placeholder="palm-jumeirah"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                    Avg Price per Sq.Ft (AED)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.averagePriceSqFtAED}
                    onChange={(e) => setFormData({ ...formData, averagePriceSqFtAED: Number(e.target.value) })}
                    className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                    Lifestyle Tags
                  </label>
                  <input
                    type="text"
                    value={formData.lifestyle}
                    onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
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
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <span className="text-[11px] text-[#A3A3A8]">Feature on Homepage & Navigation</span>
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
                    {isSubmitting ? 'Saving...' : 'Save Enclave'}
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
