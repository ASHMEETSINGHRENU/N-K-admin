import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users2,
  Briefcase,
  UserCheck,
  DollarSign,
  MapPin,
  Building,
  BookOpen,
  Globe,
  ShieldAlert,
  Settings,
  LogOut,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Control Center', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Properties & Moderation', path: '/admin/properties', icon: Building2 },
    { label: 'Broker Management', path: '/admin/brokers', icon: Briefcase },
    { label: 'Leads Orchestration', path: '/admin/leads', icon: Users2 },
    { label: 'Client Registry', path: '/admin/clients', icon: UserCheck },
    { label: 'Commissions & Payouts', path: '/admin/commissions', icon: DollarSign },
    { label: 'Communities & Enclaves', path: '/admin/communities', icon: MapPin },
    { label: 'Developers', path: '/admin/developers', icon: Building },
    { label: 'Market Insights CMS', path: '/admin/insights', icon: BookOpen },
    { label: 'Website CMS Editor', path: '/admin/cms', icon: Globe },
    { label: 'Users & Roles', path: '/admin/users', icon: ShieldCheck },
    { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#3E4852] flex font-ui">
      {/* Sidebar - Deep Navy #102A43 */}
      <aside className="w-64 bg-[#102A43] border-r border-[#1E3A5F] flex flex-col justify-between shrink-0 text-[#F7F3EA]">
        <div className="overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#1E3A5F]">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[#B08D57] flex items-center justify-center text-[#D8C3A5] bg-[#0B2135]">
                <span className="font-display font-bold text-xs">CS</span>
              </div>
              <div>
                <span className="font-display text-lg tracking-[0.16em] uppercase text-[#F7F3EA] block leading-none">
                  CRESTSHORE
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#D8C3A5] font-medium block mt-0.5">
                  ADMIN CONTROL PANEL
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2 text-[11px] uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#1E3A5F] text-[#D8C3A5] border-l-2 border-[#B08D57] font-semibold'
                      : 'text-[#E9E1D4]/80 hover:text-[#F7F3EA] hover:bg-[#1E3A5F]/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#B08D57]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-[#1E3A5F] space-y-3 bg-[#0B2135]">
          <div className="flex gap-2">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[10px] uppercase tracking-wider py-1.5 border border-[#1E3A5F] text-[#E9E1D4]/80 hover:text-[#D8C3A5] hover:border-[#B08D57] transition-colors"
            >
              Public Portal
            </a>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[10px] uppercase tracking-wider py-1.5 border border-[#1E3A5F] text-[#E9E1D4]/80 hover:text-[#D8C3A5] hover:border-[#B08D57] transition-colors"
            >
              Broker Portal
            </a>
          </div>

          <div className="pt-2 border-t border-[#1E3A5F] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#102A43] border border-[#B08D57] flex items-center justify-center text-[#D8C3A5] text-xs font-display shrink-0">
                AD
              </div>
              <div className="truncate">
                <span className="text-xs font-medium text-[#F7F3EA] block truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[9px] text-[#D8C3A5] block font-mono">
                  Master Clearance
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-[#E9E1D4]/70 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Warm Ivory #F7F3EA */}
      <main className="flex-1 overflow-y-auto bg-[#F7F3EA] text-[#3E4852] p-8 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
};
