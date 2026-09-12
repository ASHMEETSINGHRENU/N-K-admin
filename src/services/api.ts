const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://n-k-server-1.onrender.com/api/v1' : '/api/v1');

export async function fetchAdminApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('nestandkey_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Admin API request failed');
  }
  return data;
}

export const adminApi = {
  login: (email: string, password: string) =>
    fetchAdminApi<{ success: boolean; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getMe: () => fetchAdminApi<{ success: boolean; user: any }>('/auth/me'),
  getAnalytics: () => fetchAdminApi<any>('/analytics/admin'),
  getProperties: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAdminApi<{ success: boolean; properties: any[]; pagination: any }>(`/properties?${query}`);
  },
  updatePropertyStatus: (id: string, status: string, isFeatured?: boolean) =>
    fetchAdminApi<{ success: boolean; property: any }>(`/properties/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, isFeatured })
    }),
  deleteProperty: (id: string) =>
    fetchAdminApi<{ success: boolean; message: string }>(`/properties/${id}`, {
      method: 'DELETE'
    }),
  getBrokers: () => fetchAdminApi<{ success: boolean; brokers: any[] }>('/brokers/admin/all'),
  createBroker: (data: any) =>
    fetchAdminApi<{ success: boolean; broker: any }>('/brokers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateBroker: (id: string, data: any) =>
    fetchAdminApi<{ success: boolean; broker: any }>(`/brokers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getLeads: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAdminApi<{ success: boolean; leads: any[] }>(`/leads?${query}`);
  },
  assignLead: (leadId: string, brokerId: string) =>
    fetchAdminApi<{ success: boolean; lead: any }>(`/leads/${leadId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ brokerId })
    }),
  updateLeadStatus: (leadId: string, status: string) =>
    fetchAdminApi<{ success: boolean; lead: any }>(`/leads/${leadId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  getClients: () => fetchAdminApi<{ success: boolean; clients: any[] }>('/clients'),
  getCommissions: () => fetchAdminApi<{ success: boolean; commissions: any[]; metrics: any }>('/commissions'),
  updateCommissionStatus: (id: string, status: string) =>
    fetchAdminApi<{ success: boolean; commission: any }>(`/commissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  getWebsiteContent: () => fetchAdminApi<{ success: boolean; content: any }>('/cms/website'),
  updateWebsiteContent: (content: any) =>
    fetchAdminApi<{ success: boolean; content: any }>('/cms/website', {
      method: 'PUT',
      body: JSON.stringify(content)
    }),
  getCommunities: () => fetchAdminApi<{ success: boolean; communities: any[] }>('/cms/communities'),
  createCommunity: (data: any) =>
    fetchAdminApi<{ success: boolean; community: any }>('/cms/communities', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateCommunity: (id: string, data: any) =>
    fetchAdminApi<{ success: boolean; community: any }>(`/cms/communities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteCommunity: (id: string) =>
    fetchAdminApi<{ success: boolean; message: string }>(`/cms/communities/${id}`, {
      method: 'DELETE'
    }),
  getDevelopers: () => fetchAdminApi<{ success: boolean; developers: any[] }>('/cms/developers'),
  createDeveloper: (data: any) =>
    fetchAdminApi<{ success: boolean; developer: any }>('/cms/developers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateDeveloper: (id: string, data: any) =>
    fetchAdminApi<{ success: boolean; developer: any }>(`/cms/developers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteDeveloper: (id: string) =>
    fetchAdminApi<{ success: boolean; message: string }>(`/cms/developers/${id}`, {
      method: 'DELETE'
    }),
  getInsights: () => fetchAdminApi<{ success: boolean; insights: any[] }>('/insights'),
  createInsight: (data: any) =>
    fetchAdminApi<{ success: boolean; insight: any }>('/insights', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  deleteInsight: (id: string) =>
    fetchAdminApi<{ success: boolean; message: string }>(`/insights/${id}`, {
      method: 'DELETE'
    }),
  getUsers: () => fetchAdminApi<{ success: boolean; users: any[] }>('/auth/users'),
  updateUser: (id: string, data: any) =>
    fetchAdminApi<{ success: boolean; user: any }>(`/auth/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  getAuditLogs: () => fetchAdminApi<{ success: boolean; logs: any[] }>('/analytics/audit-logs')
};
