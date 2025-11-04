import Link from "next/link";

export default function Page() {
  return (
    <div className="container">
      <h1 className="h1">Zoho + Fishbowl Demo</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
        A demonstration of Zoho Books integration with Fishbowl inventory management.
      </p>
      <ul className="nav-list">
        <li>
          <Link href="/products">Products</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>
          <Link href="/order">Order</Link>
        </li>
      </ul>
    </div>
  );
}
