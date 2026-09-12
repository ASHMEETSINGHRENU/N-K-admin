import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  UserCheck,
  Search,
  Filter,
  ShieldAlert,
  Phone,
  Mail,
  Building,
  DollarSign,
  Globe,
  ExternalLink,
  Eye,
  Calendar,
  X
} from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getClients();
      setClients(res.clients || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const emailMatch = c.email?.toLowerCase().includes(q);
    const phoneMatch = c.phone?.toLowerCase().includes(q);
    const natMatch = c.nationality?.toLowerCase().includes(q);
    return nameMatch || emailMatch || phoneMatch || natMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Confidential Client Repository
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Master Client Registry
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#18181A] px-3 py-1.5 border border-[#2A2A2D] text-[11px] text-[#A3A3A8]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Restricted Admin Clearance: Direct Access Enabled</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#A3A3A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, nationality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181A] border border-[#2A2A2D] pl-10 pr-4 py-2 text-xs text-[#F7F5F0] placeholder-[#71717A] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
        <div className="text-xs text-[#A3A3A8]">
          Showing <span className="text-[#F7F5F0] font-medium">{filteredClients.length}</span> high-net-worth clients
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121214] border border-[#2A2A2D] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#71717A]">
            Decrypting client records...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717A]">
            No client records matching current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2D] bg-[#18181A]/50 text-[10px] uppercase tracking-wider text-[#A3A3A8]">
                  <th className="py-3 px-4">Client Name & Details</th>
                  <th className="py-3 px-4">Nationality / Origin</th>
                  <th className="py-3 px-4">Estimated Budget</th>
                  <th className="py-3 px-4">Assigned Broker</th>
                  <th className="py-3 px-4">Target Community</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2D]">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-[#18181A]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#18181A] border border-[#C5A880]/30 flex items-center justify-center text-[#C5A880] font-serif font-semibold text-xs">
                          {client.name ? client.name.charAt(0) : 'C'}
                        </div>
                        <div>
                          <div className="font-medium text-[#F7F5F0]">{client.name}</div>
                          <div className="text-[11px] text-[#A3A3A8] font-mono">{client.email}</div>
                          {client.phone && (
                            <div className="text-[10px] text-[#C5A880] font-mono">{client.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#A3A3A8]">
                      {client.nationality || 'International (Undisclosed)'}
                    </td>
                    <td className="py-3 px-4">
                      {client.budgetAED ? (
                        <span className="font-mono text-[#F7F5F0]">
                          {formatAED(client.budgetAED)}
                        </span>
                      ) : (
                        <span className="text-[#71717A] italic">Flexible / Ultra-HNW</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {client.assignedBroker ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#18181A] border border-[#2A2A2D] text-[#C5A880] text-[10px]">
                          {client.assignedBroker.name || client.assignedBroker.user?.name || 'Assigned Specialist'}
                        </span>
                      ) : (
                        <span className="text-[#71717A] text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#A3A3A8]">
                      {client.preferredCommunity || client.targetCommunity || 'Prime Dubai'}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#71717A] font-mono">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#C5A880] hover:text-[#B8976C] font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Dossier Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#2A2A2D] max-w-xl w-full p-6 space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2D]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-mono">
                  Confidential Client Dossier
                </span>
                <h3 className="font-serif text-xl text-[#F7F5F0] mt-0.5">{selectedClient.name}</h3>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-[#A3A3A8] hover:text-[#F7F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#18181A] p-3 border border-[#2A2A2D]">
                <span className="text-[#71717A] block text-[10px] uppercase tracking-wider">Email Address</span>
                <span className="text-[#F7F5F0] font-mono select-all">{selectedClient.email}</span>
              </div>
              <div className="bg-[#18181A] p-3 border border-[#2A2A2D]">
                <span className="text-[#71717A] block text-[10px] uppercase tracking-wider">Direct Telephone</span>
                <span className="text-[#C5A880] font-mono select-all">{selectedClient.phone || 'N/A'}</span>
              </div>
              <div className="bg-[#18181A] p-3 border border-[#2A2A2D]">
                <span className="text-[#71717A] block text-[10px] uppercase tracking-wider">Nationality</span>
                <span className="text-[#F7F5F0]">{selectedClient.nationality || 'Not specified'}</span>
              </div>
              <div className="bg-[#18181A] p-3 border border-[#2A2A2D]">
                <span className="text-[#71717A] block text-[10px] uppercase tracking-wider">Budget Allocation</span>
                <span className="text-[#F7F5F0] font-mono">
                  {selectedClient.budgetAED ? formatAED(selectedClient.budgetAED) : 'Ultra-High Net Worth'}
                </span>
              </div>
            </div>

            {selectedClient.notes && (
              <div className="bg-[#18181A] p-4 border border-[#2A2A2D] text-xs">
                <span className="text-[#71717A] block text-[10px] uppercase tracking-wider mb-1">
                  Private Investment Requirements & Notes
                </span>
                <p className="text-[#A3A3A8] leading-relaxed">{selectedClient.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 border border-[#2A2A2D] text-xs uppercase tracking-wider text-[#A3A3A8] hover:text-[#F7F5F0]"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
