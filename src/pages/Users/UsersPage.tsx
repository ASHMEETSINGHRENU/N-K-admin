import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import {
  ShieldCheck,
  User,
  Users2,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (user: any) => {
    setUpdatingId(user._id);
    try {
      await adminApi.updateUser(user._id, { isActive: !user.isActive });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await adminApi.updateUser(userId, { role: newRole });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Security & RBAC Governance
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Users & Roles Management
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-[#18181A] px-3 py-1.5 border border-[#2A2A2D] text-[11px] text-[#A3A3A8]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Multi-Tier Role Based Access Control</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#121214] p-4 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Total Accounts</span>
          <div className="font-serif text-2xl text-[#F7F5F0] mt-1 font-light">{users.length}</div>
        </div>
        <div className="bg-[#121214] p-4 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Master Admins</span>
          <div className="font-serif text-2xl text-[#C5A880] mt-1 font-light">
            {users.filter((u) => u.role === 'ADMIN').length}
          </div>
        </div>
        <div className="bg-[#121214] p-4 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">Licensed Brokers</span>
          <div className="font-serif text-2xl text-[#F7F5F0] mt-1 font-light">
            {users.filter((u) => u.role === 'BROKER').length}
          </div>
        </div>
        <div className="bg-[#121214] p-4 border border-[#2A2A2D]">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block">HNW Clients</span>
          <div className="font-serif text-2xl text-[#F7F5F0] mt-1 font-light">
            {users.filter((u) => u.role === 'CLIENT').length}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'ADMIN', 'BROKER', 'CLIENT'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                roleFilter === role
                  ? 'bg-[#C5A880] text-[#18181A]'
                  : 'bg-[#18181A] text-[#A3A3A8] hover:text-[#F7F5F0]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A3A3A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#18181A] border border-[#2A2A2D] pl-10 pr-4 py-2 text-xs text-[#F7F5F0] placeholder-[#71717A] focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#121214] border border-[#2A2A2D] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#71717A]">Verifying credentials...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717A]">No user accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2D] bg-[#18181A]/50 text-[10px] uppercase tracking-wider text-[#A3A3A8]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role Clearance</th>
                  <th className="py-3 px-4">Direct Contact</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2D]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#18181A]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#2A2A2D]"
                        />
                        <div>
                          <div className="font-medium text-[#F7F5F0]">{user.name}</div>
                          <div className="text-[11px] text-[#71717A] font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className="bg-[#18181A] border border-[#2A2A2D] px-2 py-1 text-[10px] font-mono text-[#C5A880] focus:outline-none focus:border-[#C5A880]"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="BROKER">BROKER</option>
                        <option value="CLIENT">CLIENT</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A3A3A8] text-[11px]">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                          user.isActive
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                            : 'bg-red-950/40 text-red-400 border-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#71717A] font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        disabled={updatingId === user._id}
                        onClick={() => handleToggleActive(user)}
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-colors ${
                          user.isActive
                            ? 'bg-[#18181A] text-red-400 border-red-800/40 hover:bg-red-950/40'
                            : 'bg-[#18181A] text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/40'
                        }`}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
