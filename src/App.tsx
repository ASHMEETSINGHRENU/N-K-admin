import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from './context/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';

import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { PropertiesPage } from './pages/Properties/PropertiesPage';
import { BrokersPage } from './pages/Brokers/BrokersPage';
import { LeadsPage } from './pages/Leads/LeadsPage';
import { ClientsPage } from './pages/Clients/ClientsPage';
import { CommissionsPage } from './pages/Commissions/CommissionsPage';
import { CommunitiesPage } from './pages/Communities/CommunitiesPage';
import { DevelopersPage } from './pages/Developers/DevelopersPage';
import { InsightsPage } from './pages/Insights/InsightsPage';
import { CMSPage } from './pages/CMS/CMSPage';
import { UsersPage } from './pages/Users/UsersPage';
import { AuditLogsPage } from './pages/AuditLogs/AuditLogsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-xs text-[#C5A880] font-mono uppercase tracking-widest">
        Authenticating Clearance...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="brokers" element={<BrokersPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="commissions" element={<CommissionsPage />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="developers" element={<DevelopersPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="cms" element={<CMSPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};
