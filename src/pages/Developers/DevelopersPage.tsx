import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  Award,
  Calendar,
  MapPin
} from 'lucide-react';

export const DevelopersPage: React.FC = () => {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    establishedYear: 1997,
    headquarters: 'Dubai, United Arab Emirates',
    isLuxuryTier: true
  });

  useEffect(() => {
    loadDevelopers();
  }, []);

  const loadDevelopers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getDevelopers();
      setDevelopers(res.developers || []);
    } catch (err) {
      console.error('Failed to load developers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingDeveloper(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      establishedYear: 1997,
      headquarters: 'Dubai, United Arab Emirates',
      isLuxuryTier: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dev: any) => {
    setEditingDeveloper(dev);
    setFormData({
      name: dev.name,
      slug: dev.slug,
      description: dev.description || '',
      logo: dev.logo || '',
      coverImage: dev.coverImage || '',
      establishedYear: dev.establishedYear || 2000,
      headquarters: dev.headquarters || 'Dubai, UAE',
      isLuxuryTier: dev.isLuxuryTier ?? true
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete developer "${name}"?`)) return;
    try {
      await adminApi.deleteDeveloper(id);
      await loadDevelopers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete developer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      };

      if (editingDeveloper) {
        await adminApi.updateDeveloper(editingDeveloper._id, payload);
      } else {
        await adminApi.createDeveloper(payload);
      }

      setIsModalOpen(false);
      await loadDevelopers();
    } catch (err: any) {
      alert(err.message || 'Failed to save developer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDevelopers = developers.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Institutional Master Builders
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Master Developers Directory
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Master Developer</span>
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A3A3A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search developers (e.g. Emaar, Meraas, Omniyat)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181A] border border-[#2A2A2D] pl-10 pr-4 py-2 text-xs text-[#F7F5F0] placeholder-[#71717A] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
        <div className="text-xs text-[#A3A3A8]">
          Cataloging <span className="text-[#F7F5F0] font-medium">{filteredDevelopers.length}</span> institutional master developers
        </div>
      </div>

      {/* Grid of Developers */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#71717A]">Loading developer registry...</div>
      ) : filteredDevelopers.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#71717A]">No developers match your query.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev._id}
              className="bg-[#121214] border border-[#2A2A2D] p-6 flex flex-col justify-between hover:border-[#C5A880]/50 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded bg-[#18181A] border border-[#2A2A2D] flex items-center justify-center p-2">
                    {dev.logo ? (
                      <img src={dev.logo} alt={dev.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Building className="w-6 h-6 text-[#C5A880]" />
                    )}
                  </div>
                  {dev.isLuxuryTier && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#C5A880]/10 border border-[#C5A880]/40 text-[#C5A880] text-[9px] uppercase tracking-wider font-mono">
                      <Award className="w-3 h-3" /> Ultra-Tier
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-[#F7F5F0] group-hover:text-[#C5A880] transition-colors">
                    {dev.name}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#71717A] font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Est. {dev.establishedYear || 2000}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {dev.headquarters || 'Dubai'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#A3A3A8] line-clamp-3 leading-relaxed">
                  {dev.description || 'Premier UAE developer responsible for iconic luxury residential towers and communities.'}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#2A2A2D] flex items-center justify-between">
                <span className="text-[10px] text-[#71717A] font-mono">
                  /{dev.slug}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(dev)}
                    className="p-1.5 text-[#A3A3A8] hover:text-[#C5A880] transition-colors"
                    title="Edit Developer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dev._id, dev.name)}
                    className="p-1.5 text-[#A3A3A8] hover:text-red-400 transition-colors"
                    title="Delete Developer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                  Developer Configuration
                </span>
                <h3 className="font-serif text-xl text-[#F7F5F0] mt-0.5">
                  {editingDeveloper ? 'Edit Master Developer' : 'Create Master Developer'}
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
                  Developer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omniyat, Emaar, Meraas"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Slug (Auto-generated if blank)
                </label>
                <input
                  type="text"
                  placeholder="omniyat"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: Number(e.target.value) })}
                    className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] font-mono focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    value={formData.headquarters}
                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                    className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Logo Image URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full bg-[#18181A] border border-[#2A2A2D] px-3 py-2 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1">
                  Editorial Description
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
                    checked={formData.isLuxuryTier}
                    onChange={(e) => setFormData({ ...formData, isLuxuryTier: e.target.checked })}
                    className="rounded border-[#2A2A2D] bg-[#18181A] text-[#C5A880] focus:ring-0"
                  />
                  <span className="text-[11px] text-[#A3A3A8]">Ultra-Luxury Developer Tier</span>
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
                    {isSubmitting ? 'Saving...' : 'Save Developer'}
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
