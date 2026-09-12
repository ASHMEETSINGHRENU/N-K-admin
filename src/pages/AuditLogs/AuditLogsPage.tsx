import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Clock,
  User,
  Globe,
  Database,
  Download,
  Filter,
  Terminal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAuditLogs();
      setLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nestandkey_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      log.action?.toLowerCase().includes(q) ||
      log.performedBy?.toLowerCase().includes(q) ||
      log.userEmail?.toLowerCase().includes(q) ||
      log.targetModel?.toLowerCase().includes(q) ||
      log.targetId?.toLowerCase().includes(q);
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Regulatory Compliance & Forensic Tracking
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Security & Operational Audit Logs
          </h1>
        </div>

        <button
          onClick={handleExportJSON}
          className="inline-flex items-center gap-2 bg-[#18181A] hover:bg-[#2A2A2D] text-[#C5A880] border border-[#C5A880]/40 px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          {['ALL', 'PROPERTY_APPROVED', 'LEAD_ASSIGNED', 'COMMISSION_APPROVED', 'BROKER_ONBOARDED', 'SECURITY_LOGIN_SUCCESS'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono whitespace-nowrap transition-colors ${
                actionFilter === act
                  ? 'bg-[#C5A880] text-[#18181A] font-semibold'
                  : 'bg-[#18181A] text-[#A3A3A8] hover:text-[#F7F5F0]'
              }`}
            >
              {act.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A3A3A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action, actor, email, target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181A] border border-[#2A2A2D] pl-10 pr-4 py-2 text-xs text-[#F7F5F0] placeholder-[#71717A] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#121214] border border-[#2A2A2D] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#71717A]">Reading encrypted audit ledger...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717A]">No audit trail entries matched.</div>
        ) : (
          <div className="divide-y divide-[#2A2A2D]">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log._id;

              return (
                <div key={log._id} className="hover:bg-[#18181A]/40 transition-colors">
                  <div
                    onClick={() => toggleExpand(log._id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#C5A880]">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </span>
                      <span className="px-2 py-0.5 bg-[#18181A] border border-[#2A2A2D] text-[9px] font-mono text-[#C5A880]">
                        {log.action}
                      </span>
                      <span className="text-[#F7F5F0] font-medium">{log.performedBy}</span>
                      {log.userEmail && (
                        <span className="text-[11px] text-[#71717A] font-mono">({log.userEmail})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-6 text-[#A3A3A8] text-[11px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#71717A]" />
                        <span>{log.targetModel}</span>
                        {log.targetId && <span className="text-[#C5A880]">: {log.targetId}</span>}
                      </div>

                      {log.ipAddress && (
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#71717A]" />
                          <span>{log.ipAddress}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[#71717A]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-10 pb-4 pt-1 bg-[#0B0B0C] border-t border-[#2A2A2D]/40 text-xs">
                      <div className="flex items-center gap-2 text-[10px] text-[#A3A3A8] uppercase tracking-wider mb-2">
                        <Terminal className="w-3 h-3 text-[#C5A880]" />
                        <span>Audit Event Payload</span>
                      </div>
                      <pre className="p-3 bg-[#121214] border border-[#2A2A2D] text-[#C5A880] font-mono text-[11px] overflow-x-auto rounded">
                        {JSON.stringify(
                          {
                            auditId: log._id,
                            action: log.action,
                            actor: { name: log.performedBy, email: log.userEmail, role: log.userRole },
                            network: { ip: log.ipAddress, userAgent: log.userAgent },
                            target: { model: log.targetModel, id: log.targetId },
                            details: log.details,
                            timestamp: log.createdAt
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
