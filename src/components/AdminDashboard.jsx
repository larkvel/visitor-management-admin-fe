import React from "react";
import { Building2, CheckCircle2, Edit3, DoorOpen, Shield, Users } from "lucide-react";
import Metric from "./Metric";
import StatusBadge from "./StatusBadge";

export default function AdminDashboard({ companies, dashboard, editingCompanyId, form, onChange, onEdit, onSubmit }) {
  return (
    <>
      <section className="metrics" aria-label="Platform metrics">
        <Metric icon={<Building2 />} label="Companies" value={dashboard.companies} />
        <Metric icon={<CheckCircle2 />} label="Active" value={dashboard.active_companies} />
        <Metric icon={<Users />} label="Users" value={dashboard.company_users} />
        <Metric icon={<DoorOpen />} label="Visits" value={dashboard.visits} />
      </section>

      <section className="workspace">
        <form className="panel" onSubmit={onSubmit}>
          <div className="panelHeader">
            <Building2 size={20} />
            <h2>{editingCompanyId ? "Edit Customer Company" : "Add Customer Company"}</h2>
          </div>
          <div className="fieldGrid">
            <label>Company name<input name="name" value={form.name} onChange={onChange} required /></label>
            <label>Industry<input name="industry" value={form.industry} onChange={onChange} /></label>
            <label>Billing email<input name="billingEmail" type="email" value={form.billingEmail} onChange={onChange} /></label>
            <label>Contact name<input name="contactName" value={form.contactName} onChange={onChange} /></label>
            <label>Contact phone<input name="contactPhone" value={form.contactPhone} onChange={onChange} /></label>
            <label>Plan
              <select name="subscriptionPlan" value={form.subscriptionPlan} onChange={onChange}>
                <option value="starter">Starter</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>
            <label className="wide">Status
              <select name="accountStatus" value={form.accountStatus} onChange={onChange}>
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
          <button className="primaryButton" type="submit">
            <Building2 size={18} />
            {editingCompanyId ? "Save company" : "Add company"}
          </button>
        </form>

        <section className="panel visitPanel">
          <div className="panelHeader">
            <Shield size={20} />
            <h2>Customer Accounts</h2>
          </div>
          <div className="visitList">
            {companies.map((company) => (
              <article className="accountRow" key={company.id}>
                <div>
                  <strong>{company.name}</strong>
                  <span>{company.industry || "No industry"} · {company.subscription_plan}</span>
                  <small>{company.contact_name || "No contact"} · {company.billing_email || "No billing email"}</small>
                </div>
                <StatusBadge status={company.account_status} />
                <div className="actions">
                  <button type="button" title="Edit company" onClick={() => onEdit(company)}>
                    <Edit3 size={17} />
                  </button>
                </div>
                <small>{company.user_count} users | {company.visit_count} visits</small>
              </article>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
