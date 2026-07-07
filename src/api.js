const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api-visit.larkvel.com";

function getToken() {
  try {
    const session = JSON.parse(localStorage.getItem("vm_admin_session") || "null");
    return session?.token || null;
  } catch { return null; }
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Request failed");
  }

  return response.json();
}

export const api = {
  // Auth
  login: (username, password) => request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),

  // Platform
  getPlatformDashboard: () => request("/api/platform/dashboard"),
  listCompanies: () => request("/api/companies"),
  listPendingCompanies: () => request("/api/admin/companies/pending"),
  approveCompany: (companyId) => request(`/api/admin/companies/${companyId}/approve`, { method: "POST" }),
  createCompany: (payload) => request("/api/companies", { method: "POST", body: JSON.stringify(payload) }),
  updateCompany: (companyId, payload) => request(`/api/companies/${companyId}`, { method: "PUT", body: JSON.stringify(payload) }),

  // Users
  listUsers: (companyId) => request(`/api/users?companyId=${companyId}`),
  createUser: (payload) => request("/api/users", { method: "POST", body: JSON.stringify(payload) }),

  // Visits
  listVisits: (companyId) => request(`/api/visits?companyId=${companyId}`)
};
