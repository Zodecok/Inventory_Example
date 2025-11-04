import Link from "next/link";
import { getJSON } from "../lib/api";

export default async function ProductsPage() {
  try {
    const data = await getJSON("/products");
    return (
      <div className="container">
        <h1 className="h1">Products</h1>

        <div className="card">
          <div style={{ marginBottom: "1rem" }}>
            <span className="label">Data Source:</span>
            <span className={`badge ${data.source === "real" ? "success" : ""}`} style={{ marginLeft: "0.5rem" }}>
              {data.source}
            </span>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td><strong>{item.sku}</strong></td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.rate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link href="/" className="link-back">← Back to Home</Link>
      </div>
    );
  } catch (error) {
    return (
      <div className="container">
        <h1 className="h1">Products</h1>
        <div className="card">
          <p className="error-text">Failed to load products</p>
        </div>
        <Link href="/" className="link-back">← Back to Home</Link>
      </div>
    );
  }
}
