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
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1>Admin</h1>

      <div style={{ marginBottom: 24 }}>
        <button onClick={checkHealth} disabled={loading}>
          Check API Health
        </button>
        {healthData && (
          <pre style={{ background: "#f5f5f5", padding: 12, marginTop: 8 }}>
            {JSON.stringify(healthData, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <button onClick={connectZoho} style={{ marginRight: 8 }}>
          Connect Zoho
        </button>
        <button onClick={fetchZohoStatus} disabled={loading}>
          Refresh Status
        </button>
        {zohoStatus && (
          <div style={{ marginTop: 8 }}>
            <h3>Zoho Status:</h3>
            <pre style={{ background: "#f5f5f5", padding: 12 }}>
              {JSON.stringify(zohoStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <p>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
