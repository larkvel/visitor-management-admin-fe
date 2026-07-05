import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Shield } from "lucide-react";
import { api } from "./api";
import AdminDashboard from "./components/AdminDashboard";
import { toDateTimeLocal, toIso } from "./utils/helpers";
import "./styles.css";

const emptyCompany = {
  name: "",
  industry: "",
  billingEmail: "",
  contactName: "",
  contactPhone: "",
  subscriptionPlan: "starter",
  accountStatus: "trial"
};

function App() {
  const [companies, setCompanies] = useState([]);
  const [platformDashboard, setPlatformDashboard] = useState({ companies: 0, active_companies: 0, company_users: 0, visits: 0 });
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [editingCompanyId, setEditingCompanyId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPlatform() {
    const [companyData, dashboardData] = await Promise.all([
      api.listCompanies(),
      api.getPlatformDashboard()
    ]);
    setCompanies(companyData);
    setPlatformDashboard(dashboardData);
  }

  // Load data on mount
  useEffect(() => {
    async function init() {
      try {
        await loadPlatform();
      } catch (caught) {
        setError(caught.message);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);
