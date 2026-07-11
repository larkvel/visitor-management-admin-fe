import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Building2, Shield } from "lucide-react";
import { api } from "./api";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import "./styles.css";

const emptyCompany = {
  name: "", industry: "", billingEmail: "", contactName: "", contactPhone: "",
  subscriptionPlan: "starter", accountStatus: "trial",
  attendanceEnabled: false, payrollEnabled: false
};

function AdminApp({ session, onLogout }) {
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [platformDashboard, setPlatformDashboard] = useState({ companies: 0, active_companies: 0, company_users: 0, visits: 0 });
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [editingCompanyId, setEditingCompanyId] = useState("");
  const [approvedCredentials, setApprovedCredentials] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPlatform() {
    const [companyData, dashboardData, pendingData] = await Promise.all([
      api.listCompanies(),
      api.getPlatformDashboard(),
      api.listPendingCompanies()
    ]);
    setCompanies(companyData);
    setPlatformDashboard(dashboardData);
    setPendingCompanies(pendingData);
  }

  useEffect(() => {
    async function init() {
      try { await loadPlatform(); }
      catch (e) {
        if (e.message?.includes("expired") || e.message?.includes("Authentication")) onLogout();
        else setError(e.message);
      }
      finally { setLoading(false); }
    }
    init();
  }, []);

  function updateCompanyForm(event) {
    setCompanyForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitCompany(event) {
    event.preventDefault(); setError("");
    try {
      if (editingCompanyId) await api.updateCompany(editingCompanyId, companyForm);
      else await api.createCompany(companyForm);
      setEditingCompanyId(""); setCompanyForm(emptyCompany);
      await loadPlatform();
    } catch (e) { setError(e.message); }
  }

  function startCompanyEdit(company) {
    if (!company) { setEditingCompanyId(""); setCompanyForm(emptyCompany); return; }
    setEditingCompanyId(company.id);
    setCompanyForm({
      name: company.name || "", industry: company.industry || "",
      billingEmail: company.billing_email || "", contactName: company.contact_name || "",
      contactPhone: company.contact_phone || "", subscriptionPlan: company.subscription_plan || "starter",
      accountStatus: company.account_status || "trial",
      attendanceEnabled: company.attendance_enabled || false,
      payrollEnabled: company.payroll_enabled || false
    });
  }

  async function approveCompany(companyId) {
    setError(""); setApprovingId(companyId);
    try {
      const result = await api.approveCompany(companyId);
      setApprovedCredentials(result.adminCredentials);
      await loadPlatform();
    } catch (e) { setError(e.message); }
    finally { setApprovingId(null); }
  }

  const initials = session.user?.fullName
    ? session.user.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading admin dashboard…</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-label">Visitor Management</div>
          <h1><span className="brand-dot" />Platform Admin</h1>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${filter === null ? "active" : ""}`}
            onClick={() => setFilter(null)}
          >
            <Shield size={16} /> Overview
          </button>
          <button
            className={`nav-item ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            <Building2 size={16} /> Pending
            {pendingCompanies.length > 0 && (
              <span className="nav-badge">{pendingCompanies.length}</span>
            )}
          </button>
          <button
            className={`nav-item ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            <Building2 size={16} /> Active
          </button>
          <button
            className={`nav-item ${filter === "suspended" ? "active" : ""}`}
            onClick={() => setFilter("suspended")}
          >
            <Building2 size={16} /> Suspended
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div>
              <div className="user-name">{session.user?.fullName || "Admin"}</div>
              <div className="user-role">Platform Admin</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>Sign out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {filter
                ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Companies`
                : "Dashboard Overview"}
            </div>
            <div className="topbar-sub">
              {companies.length} total companies · {pendingCompanies.length} pending approval
            </div>
          </div>
          <div className="topbar-actions">
            <button className="refresh-btn" onClick={loadPlatform}>↻ Refresh</button>
          </div>
        </div>

        <div className="page-body">
          {error && <div className="alert">{error}</div>}

          <AdminDashboard
            companies={companies}
            pendingCompanies={pendingCompanies}
            dashboard={platformDashboard}
            editingCompanyId={editingCompanyId}
            form={companyForm}
            onChange={updateCompanyForm}
            onEdit={startCompanyEdit}
            onSubmit={submitCompany}
            onApprove={approveCompany}
            approvedCredentials={approvedCredentials}
            onDismissCredentials={() => setApprovedCredentials(null)}
            approvingId={approvingId}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vm_admin_session") || "null"); }
    catch { return null; }
  });

  function handleLogin(data) { localStorage.setItem("vm_admin_session", JSON.stringify(data)); setSession(data); }
  function handleLogout() { localStorage.removeItem("vm_admin_session"); setSession(null); }

  if (!session) return <Login onLogin={handleLogin} />;
  return <AdminApp session={session} onLogout={handleLogout} />;
}

createRoot(document.getElementById("root")).render(<App />);
