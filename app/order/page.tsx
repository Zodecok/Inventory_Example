"use client";
import React from "react";
import { postJSON, fetchCatalog, fetchCustomers } from "../lib/api";

type CatItem = { sku: string; name: string; rate: number };
type Cust   = { id: string; display_name: string; email?: string };
type Row    = { sku: string; name: string; rate: number; quantity: number };

export default function OrderPage() {
  const [catalog, setCatalog] = React.useState<CatItem[]>([]);
  const [customers, setCustomers] = React.useState<Cust[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  const [customer, setCustomer] = React.useState({ display_name: "", email: "" });
  const [rows, setRows] = React.useState<Row[]>([{ sku:"", name:"", rate:0, quantity:1 }]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const [cat, cust] = await Promise.all([fetchCatalog(), fetchCustomers()]);
        setCatalog(cat.items || []);
        setCustomers(cust.customers || []);
      } catch (e:any) {
        setError(e.message || "Failed to load dropdown data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When a customer is picked, prefill the manual fields (still editable)
  function pickCustomer(id: string) {
    setSelectedCustomerId(id);
    const found = customers.find(c => c.id === id);
    setCustomer({
      display_name: found?.display_name || "",
      email: found?.email || ""
    });
  }

  // Product select auto-fills name/rate
  function pickProduct(idx:number, sku:string) {
    const found = catalog.find(i => i.sku === sku);
    setRows(prev => {
      const next = [...prev];
      next[idx] = {
        sku,
        name: found?.name || "",
        rate: found?.rate ?? 0,
        quantity: next[idx]?.quantity ?? 1
      };
      return next;
    });
  }

  function updateRow(idx:number, key:keyof Row, val:any) {
    setRows(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: key==="rate"||key==="quantity" ? Number(val) : val };
      return next;
    });
  }

  const addRow    = () => setRows(r => [...r, { sku:"", name:"", rate:0, quantity:1 }]);
  const removeRow = (i:number) => setRows(r => r.filter((_,idx)=>idx!==i));

  async function submit() {
    setError(null); setResult(null);
    const clean = rows.filter(r => r.sku && r.quantity > 0);
    if (!customer.display_name || clean.length === 0) {
      setError("Please select a customer and at least one product.");
      return;
    }
    try {
      const res = await postJSON("/order", {
        customer_id: selectedCustomerId || undefined,
        customer,
        items: clean
      });
      setResult(res);
    } catch (e:any) {
      setError(e?.message || "Order failed");
    }
  }

  return (
    <div className="container">
      <h1 className="h1">Create Order</h1>

      <div className="card" style={{marginBottom:16}}>
        <div className="row">
          <div>
            <label className="label">Customer (Zoho Books)</label>
            <select className="input" value={selectedCustomerId} onChange={e=>pickCustomer(e.target.value)}>
              <option value="">Select a customer…</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.display_name}{c.email ? ` — ${c.email}` : ""}
                </option>
              ))}
            </select>
            {selectedCustomerId && (
              <div style={{marginTop:8}} className="badge">
                Selected: {customer.display_name}{customer.email ? ` • ${customer.email}` : ""}
              </div>
            )}
          </div>
          <div>
            <label className="label">Override / Manual (optional)</label>
            <div className="row">
              <input className="input" placeholder="Customer name"
                     value={customer.display_name}
                     onChange={e=>setCustomer({...customer, display_name:e.target.value})}/>
              <input className="input" placeholder="Email"
                     type="email"
                     value={customer.email}
                     onChange={e=>setCustomer({...customer, email:e.target.value})}/>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <strong>Items</strong>
          <button className="btn secondary" onClick={addRow}>+ Add Item</button>
        </div>

        <table className="table">
          <thead>
            <tr><th style={{width:"38%"}}>Product</th><th>Name</th><th style={{width:110}}>Rate</th><th style={{width:110}}>Qty</th><th style={{width:80}}></th></tr>
          </thead>
          <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>
                <select className="input" value={r.sku} onChange={e=>pickProduct(idx, e.target.value)}>
                  <option value="">Select product…</option>
                  {catalog.map(it => (
                    <option key={it.sku} value={it.sku}>
                      {`${it.sku} — ${it.name} ($${it.rate.toFixed(2)})`}
                    </option>
                  ))}
                </select>
              </td>
              <td><input className="input" value={r.name} onChange={e=>updateRow(idx,"name",e.target.value)} /></td>
              <td><input className="input" type="number" step="0.01" value={r.rate} onChange={e=>updateRow(idx,"rate",e.target.value)} /></td>
              <td><input className="input" type="number" step="1" min="1" value={r.quantity} onChange={e=>updateRow(idx,"quantity",e.target.value)} /></td>
              <td><button className="btn secondary" onClick={()=>removeRow(idx)}>Remove</button></td>
            </tr>
          ))}
          </tbody>
        </table>

        <div style={{marginTop:12}}>
          <button className="btn" onClick={submit}>Submit Order</button>
          {loading && <span className="badge" style={{marginLeft:12}}>Loading…</span>}
        </div>

        {error && <p style={{color:"#ff8080", marginTop:10}}>Error: {error}</p>}
        {result && <pre style={{marginTop:12, background:"#0f1530", padding:12, borderRadius:10, overflow:"auto"}}>{JSON.stringify(result,null,2)}</pre>}
      </div>

      <p style={{marginTop:14}}><a href="/" className="btn secondary">Home</a></p>
    </div>
  );
}
