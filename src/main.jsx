import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Shield } from "lucide-react";
import { api } from "./api";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import "./styles.css";

const emptyCompany = {
  name: "", industry: "", billingEmail: "", contactName: "", contactPhone: "",
  subscriptionPlan: "starter", accountStatus: "trial"
};

function AdminApp({ session, onLogout }) {
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [platformDashboard, setPlatformDashboard] = useState({ companies: 0, active_companies: 0, company_users: 0, visits: 0 });
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [editingCompanyId, setEditingCompanyId] = useState("");
  const [approvedCredentials, setApprovedCredentials] = useState(null);
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
    setEditingCompanyId(company.id);
    setCompanyForm({
      name: company.name || "", industry: company.industry || "",
      billingEmail: company.billing_email || "", contactName: company.contact_name || "",
      contactPhone: company.contact_phone || "", subscriptionPlan: company.subscription_plan || "starter",
      accountStatus: company.account_status || "trial"
    });
  }

  async function approveCompany(companyId) {
    setError("");
    try {
      const result = await api.approveCompany(companyId);
      setApprovedCredentials(result.adminCredentials);
      await loadPlatform();
    } catch (e) { setError(e.message); }
  }

  if (loading) return <main className="page"><div className="loading">Loading admin dashboard...</div></main>;

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Visitor Management</p>
          <h1>Platform Admin</h1>
        </div>
        <div className="toolbar">
          <span style={{ color: "#666", fontSize: "14px" }}>🔒 {session.user.fullName}</span>
          <button onClick={onLogout} style={{ marginLeft: "12px", padding: "6px 14px", border: "1px solid #ddd", borderRadius: "4px", background: "white", cursor: "pointer", fontSize: "14px" }}>Logout</button>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      {approvedCredentials && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "20px 24px", margin: "0 0 24px" }}>
          <strong style={{ color: "#166534" }}>✅ Company Approved! Share these credentials with the company admin:</strong>
          <div style={{ marginTop: "12px", fontFamily: "monospace", fontSize: "14px", background: "white", padding: "12px", borderRadius: "6px", border: "1px solid #d1fae5" }}>
            <div>Username: <strong>{approvedCredentials.username}</strong></div>
            <div>Password: <strong>{approvedCredentials.password}</strong></div>
            <div>Login URL: <a href={approvedCredentials.loginUrl} target="_blank" rel="noreferrer">{approvedCredentials.loginUrl}</a></div>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6b7280" }}>⚠️ This password is shown only once. Save it before closing!</p>
          <button onClick={() => setApprovedCredentials(null)} style={{ marginTop: "12px", padding: "6px 14px", cursor: "pointer", borderRadius: "4px", border: "1px solid #86efac" }}>Dismiss</button>
        </div>
      )}

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
      />
    </main>
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
