"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API, getJSON } from "../lib/api";

export default function AdminPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [zohoStatus, setZohoStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchZohoStatus();
  }, []);

  async function checkHealth() {
    setLoading(true);
    try {
      const data = await getJSON("/health");
      setHealthData(data);
    } catch (error: any) {
      setHealthData({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function fetchZohoStatus() {
    setLoading(true);
    try {
      const data = await getJSON("/oauth/zoho/status");
      setZohoStatus(data);
    } catch (error: any) {
      setZohoStatus({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  function connectZoho() {
    window.location.href = `${API}/oauth/zoho/login`;
  }

  return (
    <div className="container">
      <h1 className="h1">Admin</h1>

      <div className="card">
        <h2 className="h3">API Health Check</h2>
        <button className="btn" onClick={checkHealth} disabled={loading}>
          Check API Health
        </button>
        {healthData && (
          <pre style={{ marginTop: "1rem" }}>
            {JSON.stringify(healthData, null, 2)}
          </pre>
        )}
      </div>

      <div className="card">
        <h2 className="h3">Zoho Integration</h2>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
          <button className="btn" onClick={connectZoho}>
            Connect Zoho
          </button>
          <button className="btn secondary" onClick={fetchZohoStatus} disabled={loading}>
            Refresh Status
          </button>
        </div>
        {zohoStatus && (
          <div>
            <div className="label" style={{ marginBottom: "0.5rem" }}>Current Status:</div>
            <pre>{JSON.stringify(zohoStatus, null, 2)}</pre>
          </div>
        )}
      </div>

      <Link href="/" className="link-back">← Back to Home</Link>
    </div>
  );
}
