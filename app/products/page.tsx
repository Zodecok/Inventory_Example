import Link from "next/link";
import { getJSON } from "../lib/api";

export default async function ProductsPage() {
  try {
    const data = await getJSON("/products");
    return (
      <main style={{ padding: 24 }}>
        <h1>Products</h1>
        <p>
          Source: <strong>{data.source}</strong>
        </p>
        <table border={1} cellPadding={8} cellSpacing={0}>
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
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <Link href="/">← Home</Link>
        </p>
      </main>
    );
  } catch (error) {
    return (
      <main style={{ padding: 24 }}>
        <p>Failed to load products</p>
        <p>
          <Link href="/">← Home</Link>
        </p>
      </main>
    );
  }
}
