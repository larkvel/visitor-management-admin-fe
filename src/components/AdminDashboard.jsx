import React, { useState } from "react";
import { Building2, ChevronDown, ChevronUp, CheckCircle, Edit3, Globe, Mail, Phone, Calendar, Tag, Users, MapPin } from "lucide-react";

function StatusBadge({ status }) {
  return <span className={`badge ${status}`}>{status}</span>;
}

function DetailField({ label, value, isLink }) {
  return (
    <div className="detail-field">
      <span className="detail-label">{label}</span>
      {isLink && value
        ? <a className="detail-value link" href={value} target="_blank" rel="noreferrer">{value}</a>
        : <span className={`detail-value ${!value ? "muted" : ""}`}>{value || "—"}</span>
      }
    </div>
  );
}

/* ── Pending approval card with expandable details ───────── */
function PendingCard({ company, onApprove, approvingId }) {
  const [expanded, setExpanded] = useState(false);
  const isApproving = approvingId === company.id;

  return (
    <div className="pending-card">
      <div className="pending-card-header" onClick={() => setExpanded(v => !v)}>
        <div className="pending-card-main">
          <div className="pending-company-name">{company.name}</div>
          <div className="pending-company-meta">
            {company.industry && <span className="meta-chip">{company.industry}</span>}
            {company.subscription_plan && <span className="meta-chip">{company.subscription_plan}</span>}
            {company.subdomain && <span className="meta-chip">🌐 {company.subdomain}.larkvel.com</span>}
            <span className="meta-chip warn">
              ⏳ {new Date(company.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="pending-card-actions" onClick={e => e.stopPropagation()}>
          <StatusBadge status={company.account_status} />
          <button
            className="approve-btn"
            onClick={() => onApprove(company.id)}
            disabled={isApproving}
            id={`approve-${company.id}`}
          >
            <CheckCircle size={15} />
            {isApproving ? "Approving…" : "Approve"}
          </button>
        </div>

        <button className="expand-btn" title={expanded ? "Collapse" : "View details"}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="pending-card-body">
          <DetailField label="Contact Name" value={company.contact_name} />
          <DetailField label="Billing Email" value={company.billing_email} />
          <DetailField label="Contact Phone" value={company.contact_phone} />
          <DetailField label="Industry" value={company.industry} />
          <DetailField label="Subscription Plan" value={company.subscription_plan} />
          <DetailField label="Subdomain" value={company.subdomain ? `${company.subdomain}.larkvel.com` : null} />
          <DetailField label="Account Status" value={company.account_status} />
          <DetailField label="Registered On" value={new Date(company.created_at).toLocaleString("en-IN")} />
          {company.notes && <DetailField label="Notes" value={company.notes} />}
        </div>
      )}
    </div>
  );
}

/* ── All-companies table row with expandable details ─────── */
function CompanyRow({ company, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div
        className={`table-row ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(v => !v)}
        id={`company-row-${company.id}`}
      >
        <div className="company-name-cell">
          <strong>{company.name}</strong>
          {company.subdomain && <small>🌐 {company.subdomain}.larkvel.com</small>}
        </div>
        <span className="cell-value">{company.industry || "—"}</span>
        <span className="cell-value">{company.contact_name || "—"}</span>
        <span className="cell-value">{company.subscription_plan || "—"}</span>
        <StatusBadge status={company.account_status} />
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            className="edit-action-btn"
            title="Edit company"
            onClick={e => { e.stopPropagation(); onEdit(company); }}
          >
            <Edit3 size={14} />
          </button>
          <button className="edit-action-btn" title={expanded ? "Collapse" : "Expand"}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="row-detail">
          <DetailField label="Billing Email" value={company.billing_email} />
          <DetailField label="Contact Phone" value={company.contact_phone} />
          <DetailField label="Attendance Module" value={company.attendance_enabled ? "Enabled" : "Disabled"} />
          <DetailField label="Payroll Module" value={company.payroll_enabled ? "Enabled" : "Disabled"} />
          <DetailField label="Registered On" value={new Date(company.created_at).toLocaleString("en-IN")} />
          <DetailField label="Users" value={company.user_count != null ? `${company.user_count} users` : null} />
          <DetailField label="Visits" value={company.visit_count != null ? `${company.visit_count} visits` : null} />
          {company.subdomain && <DetailField label="Login URL" value={`https://${company.subdomain}.larkvel.com`} isLink />}
        </div>
      )}
    </>
  );
}

/* ── Edit company inline form ────────────────────────────── */
function EditCompanyForm({ form, editingCompanyId, onChange, onSubmit, onCancel }) {
  return (
    <div className="form-panel">
      <div className="form-title">
        <Building2 size={18} color="var(--primary)" />
        {editingCompanyId ? "Edit Company" : "Add Company"}
      </div>
      <form onSubmit={onSubmit}>
        <div className="field-grid">
          <div className="form-field">
            <label>Company Name *</label>
            <input name="name" value={form.name} onChange={onChange} required placeholder="Acme Corp" />
          </div>
          <div className="form-field">
            <label>Industry</label>
            <input name="industry" value={form.industry} onChange={onChange} placeholder="Technology" />
          </div>
          <div className="form-field">
            <label>Billing Email</label>
            <input name="billingEmail" type="email" value={form.billingEmail} onChange={onChange} placeholder="billing@acme.com" />
          </div>
          <div className="form-field">
            <label>Contact Name</label>
            <input name="contactName" value={form.contactName} onChange={onChange} placeholder="John Doe" />
          </div>
          <div className="form-field">
            <label>Contact Phone</label>
            <input name="contactPhone" value={form.contactPhone} onChange={onChange} placeholder="+91 98765 43210" />
          </div>
          <div className="form-field">
            <label>Plan</label>
            <select name="subscriptionPlan" value={form.subscriptionPlan} onChange={onChange}>
              <option value="starter">Starter</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div className="form-field">
            <label>Status</label>
            <select name="accountStatus" value={form.accountStatus} onChange={onChange}>
              <option value="pending">Pending</option>
              <option value="trial">Trial</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-field">
            <label>Attendance Module</label>
            <select 
              name="attendanceEnabled" 
              value={form.attendanceEnabled ? "true" : "false"} 
              onChange={e => onChange({ target: { name: "attendanceEnabled", value: e.target.value === "true" } })}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
          <div className="form-field wide">
            <label>Payroll Module</label>
            <select 
              name="payrollEnabled" 
              value={form.payrollEnabled ? "true" : "false"} 
              onChange={e => onChange({ target: { name: "payrollEnabled", value: e.target.value === "true" } })}
            >
              <option value="false">Disabled</option>
              <option value="true">Enabled</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingCompanyId ? "Save changes" : "Add company"}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* ── Credentials modal shown after approval ──────────────── */
function CredentialsModal({ creds, onDismiss }) {
  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          <CheckCircle size={22} />
          Company Approved!
        </div>
        <p className="modal-sub">Share these one-time credentials with the company admin to let them log in.</p>
        <div className="cred-box">
          <div className="cred-row"><span className="cred-key">Username</span><span className="cred-val">{creds.username}</span></div>
          <div className="cred-row"><span className="cred-key">Password</span><span className="cred-val">{creds.password}</span></div>
          {creds.loginUrl && (
            <div className="cred-row">
              <span className="cred-key">Login URL</span>
              <a className="cred-val" href={creds.loginUrl} target="_blank" rel="noreferrer">{creds.loginUrl}</a>
            </div>
          )}
        </div>
        <p className="cred-warn">⚠️ This password is shown only once — copy it before closing.</p>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onDismiss}>Dismiss</button>
          <button
            className="btn-primary"
            onClick={() => {
              navigator.clipboard?.writeText(`Username: ${creds.username}\nPassword: ${creds.password}\nLogin: ${creds.loginUrl || ""}`);
            }}
          >
            Copy credentials
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main AdminDashboard ─────────────────────────────────── */
export default function AdminDashboard({
  companies, pendingCompanies = [], dashboard,
  editingCompanyId, form, onChange, onEdit, onSubmit, onApprove,
  approvedCredentials, onDismissCredentials, approvingId,
  filter, onFilterChange
}) {
  const [showEditForm, setShowEditForm] = useState(false);

  function handleEdit(company) {
    onEdit(company);
    setShowEditForm(true);
  }
  function handleCancel() {
    setShowEditForm(false);
    onEdit(null); // reset
  }
  function handleSubmit(e) {
    onSubmit(e);
    setShowEditForm(false);
  }

  const displayedCompanies = filter
    ? companies.filter(c => c.account_status === filter)
    : companies.filter(c => c.account_status !== "pending");

  return (
    <>
      {/* ── Stat tiles ── */}
      <div className="stats-grid">
        <div
          className={`stat-card ${filter === null ? "active-filter" : ""}`}
          onClick={() => onFilterChange(null)}
          title="All companies"
        >
          <div className="stat-icon purple"><Building2 size={22} /></div>
          <div>
            <div className="stat-value">{dashboard.companies ?? 0}</div>
            <div className="stat-label">Total Registered</div>
          </div>
        </div>
        <div
          className={`stat-card ${filter === "active" ? "active-filter" : ""}`}
          onClick={() => onFilterChange("active")}
          title="Filter active"
        >
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div>
            <div className="stat-value">{dashboard.active_companies ?? 0}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div
          className={`stat-card ${filter === "pending" ? "active-filter" : ""}`}
          onClick={() => onFilterChange("pending")}
          title="Filter pending"
        >
          <div className="stat-icon amber"><Calendar size={22} /></div>
          <div>
            <div className="stat-value">{pendingCompanies.length}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={22} /></div>
          <div>
            <div className="stat-value">{dashboard.company_users ?? 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
      </div>

      {/* ── Pending approvals ── */}
      {pendingCompanies.length > 0 && (
        <div>
          <div className="section-header">
            <div className="section-title">
              <Calendar size={17} color="var(--warn)" />
              Pending Approvals
            </div>
            <span className="section-count warn">{pendingCompanies.length} awaiting</span>
          </div>
          <div className="pending-list">
            {pendingCompanies.map(c => (
              <PendingCard
                key={c.id}
                company={c}
                onApprove={onApprove}
                approvingId={approvingId}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Edit form (shown when editing) ── */}
      {showEditForm && (
        <EditCompanyForm
          form={form}
          editingCompanyId={editingCompanyId}
          onChange={onChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* ── All companies table ── */}
      <div>
        <div className="section-header">
          <div className="section-title">
            <Building2 size={17} color="var(--primary)" />
            {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Companies` : "All Companies"}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="section-count">{displayedCompanies.length}</span>
            {!showEditForm && (
              <button
                className="btn-primary"
                style={{ fontSize: "12px", padding: "6px 14px" }}
                onClick={() => setShowEditForm(true)}
              >
                + Add Company
              </button>
            )}
          </div>
        </div>

        <div className="companies-table">
          <div className="table-header">
            <span>Company</span>
            <span>Industry</span>
            <span>Contact</span>
            <span>Plan</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {displayedCompanies.length === 0
            ? (
              <div className="empty-state">
                <Building2 size={40} />
                <p>No companies found</p>
              </div>
            )
            : displayedCompanies.map(c => (
              <CompanyRow key={c.id} company={c} onEdit={handleEdit} />
            ))
          }
        </div>
      </div>

      {/* ── Credentials modal ── */}
      {approvedCredentials && (
        <CredentialsModal creds={approvedCredentials} onDismiss={onDismissCredentials} />
      )}
    </>
  );
}
