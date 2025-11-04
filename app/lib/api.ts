export const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getJSON(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function postJSON(path: string, body: any) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `POST ${path} failed`);
  return data;
}

export async function fetchCatalog(q?: string) {
  const url = q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog";
  return getJSON(url); // { items:[{sku,name,rate}] }
}

export async function fetchCustomers(q?: string) {
  const url = q ? `/customers?q=${encodeURIComponent(q)}` : "/customers";
  return getJSON(url); // { customers:[{id,display_name,email}] }
}
