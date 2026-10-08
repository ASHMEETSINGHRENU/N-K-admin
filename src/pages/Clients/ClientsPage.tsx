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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Confidential Client Repository
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Master Client Registry
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#FFFDF8] px-3 py-1.5 border border-[#E9E1D4] text-[11px] text-[#6B7280] shadow-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-[#B08D57]" />
          <span>Restricted Admin Clearance: Direct Access Enabled</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#B08D57] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, nationality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFFDF8] border border-[#E9E1D4] pl-10 pr-4 py-2 text-xs text-[#102A43] placeholder-[#6B7280] focus:outline-none focus:border-[#B08D57] shadow-sm"
          />
        </div>
        <div className="text-xs text-[#6B7280]">
          Showing <span className="text-[#102A43] font-medium">{filteredClients.length}</span> high-net-worth clients
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#6B7280]">
            Decrypting client records...
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B7280]">
            No client records matching current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E9E1D4] bg-[#F7F3EA] text-[10px] uppercase tracking-wider text-[#6B7280]">
                  <th className="py-3 px-4">Client Name & Details</th>
                  <th className="py-3 px-4">Nationality / Origin</th>
                  <th className="py-3 px-4">Estimated Budget</th>
                  <th className="py-3 px-4">Assigned Broker</th>
                  <th className="py-3 px-4">Target Community</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E1D4]">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-[#F7F3EA]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#102A43] border border-[#B08D57] flex items-center justify-center text-[#D8C3A5] font-display font-semibold text-xs">
                          {client.name ? client.name.charAt(0) : 'C'}
                        </div>
                        <div>
                          <div className="font-medium text-[#102A43]">{client.name}</div>
                          <div className="text-[11px] text-[#6B7280] font-mono">{client.email}</div>
                          {client.phone && (
                            <div className="text-[10px] text-[#B08D57] font-mono">{client.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">
                      {client.nationality || 'International (Undisclosed)'}
                    </td>
                    <td className="py-3 px-4">
                      {client.budgetAED ? (
                        <span className="font-mono text-[#102A43] font-medium">
                          {formatAED(client.budgetAED)}
                        </span>
                      ) : (
                        <span className="text-[#6B7280] italic">Flexible / Ultra-HNW</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {client.assignedBroker ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F7F3EA] border border-[#E9E1D4] text-[#B08D57] text-[10px] font-mono">
                          {client.assignedBroker.name || client.assignedBroker.user?.name || 'Assigned Specialist'}
                        </span>
                      ) : (
                        <span className="text-[#6B7280] text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">
                      {client.preferredCommunity || client.targetCommunity || 'Prime Dubai'}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#6B7280] font-mono">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#B08D57] hover:text-[#102A43] font-semibold"
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
        <div className="fixed inset-0 z-50 bg-[#0B2135]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-xl w-full p-6 space-y-6 animate-in fade-in shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D4]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B08D57] font-mono">
                  Confidential Client Dossier
                </span>
                <h3 className="font-display text-2xl text-[#102A43] mt-0.5">{selectedClient.name}</h3>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-[#6B7280] hover:text-[#102A43]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#F7F3EA] p-3 border border-[#E9E1D4]">
                <span className="text-[#6B7280] block text-[10px] uppercase tracking-wider font-mono">Email Address</span>
                <span className="text-[#102A43] font-mono select-all">{selectedClient.email}</span>
              </div>
              <div className="bg-[#F7F3EA] p-3 border border-[#E9E1D4]">
                <span className="text-[#6B7280] block text-[10px] uppercase tracking-wider font-mono">Direct Telephone</span>
                <span className="text-[#B08D57] font-mono select-all">{selectedClient.phone || 'N/A'}</span>
              </div>
              <div className="bg-[#F7F3EA] p-3 border border-[#E9E1D4]">
                <span className="text-[#6B7280] block text-[10px] uppercase tracking-wider font-mono">Nationality</span>
                <span className="text-[#102A43]">{selectedClient.nationality || 'Not specified'}</span>
              </div>
              <div className="bg-[#F7F3EA] p-3 border border-[#E9E1D4]">
                <span className="text-[#6B7280] block text-[10px] uppercase tracking-wider font-mono">Budget Allocation</span>
                <span className="text-[#102A43] font-mono font-medium">
                  {selectedClient.budgetAED ? formatAED(selectedClient.budgetAED) : 'Ultra-High Net Worth'}
                </span>
              </div>
            </div>

            {selectedClient.notes && (
              <div className="bg-[#F7F3EA] p-4 border border-[#E9E1D4] text-xs">
                <span className="text-[#6B7280] block text-[10px] uppercase tracking-wider mb-1 font-mono">
                  Private Investment Requirements & Notes
                </span>
                <p className="text-[#3E4852] leading-relaxed">{selectedClient.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end border-t border-[#E9E1D4]">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase tracking-wider text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
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
