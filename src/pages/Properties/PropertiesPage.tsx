import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED, formatSqFt } from '@nestandkey/utils';
import { Building2, Check, X, Star, Trash2, ExternalLink, Sparkles } from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getProperties(filterStatus ? { status: filterStatus } : {});
      setProperties(res.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, status: string, isFeatured?: boolean) => {
    try {
      await adminApi.updatePropertyStatus(id, status, isFeatured);
      await loadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to update property status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you certain you want to remove this property from the platform?')) return;
    try {
      await adminApi.deleteProperty(id);
      await loadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to delete property');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Catalog Governance
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Property Moderation & Inventory
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['', 'PENDING_APPROVAL', 'ACTIVE', 'DRAFT', 'SOLD', 'INACTIVE'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 uppercase tracking-wider border transition-all text-[11px] ${
              filterStatus === st
                ? 'bg-[#18181A] border-[#C5A880] text-[#C5A880] font-semibold'
                : 'border-[#2A2A2D] text-[#A3A3A8] hover:text-[#F7F5F0]'
            }`}
          >
            {st ? st.replace('_', ' ') : 'All Catalog'}
          </button>
        ))}
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
                <th className="p-4">Property</th>
                <th className="p-4">Community</th>
                <th className="p-4">Price (AED)</th>
                <th className="p-4">Broker</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-[#18181A]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.featuredImage}
                        alt=""
                        className="w-14 h-10 object-cover bg-[#0B0B0C] border border-[#2A2A2D]"
                      />
                      <div>
                        <span className="font-serif text-sm font-medium text-[#F7F5F0] block">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-[#C5A880] font-mono">
                          {p.referenceNumber} • {p.propertyType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#A3A3A8]">{p.community}</td>
                  <td className="p-4 font-serif text-sm text-[#F7F5F0] font-medium">
                    {formatAED(p.priceAED)}
                  </td>
                  <td className="p-4 text-[#A3A3A8]">
                    {p.assignedBroker?.title || 'Nestandkey Specialist'}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[9px] uppercase font-mono px-2 py-0.5 font-semibold ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : p.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleUpdateStatus(p._id, p.status, !p.isFeatured)}
                      className={`p-1 border rounded transition-colors ${
                        p.isFeatured
                          ? 'bg-[#C5A880]/20 text-[#C5A880] border-[#C5A880]'
                          : 'text-[#71717A] border-[#2A2A2D] hover:text-[#F7F5F0]'
                      }`}
                      title={p.isFeatured ? 'Featured on Homepage' : 'Mark as Featured'}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'ACTIVE')}
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 uppercase text-[10px] font-semibold"
                          title="Approve & Publish to Public Site"
                        >
                          Approve
                        </button>
                      )}
                      {p.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(p._id, 'INACTIVE')}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase text-[10px]"
                          title="Unpublish"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1 text-[#71717A] hover:text-red-400 transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
