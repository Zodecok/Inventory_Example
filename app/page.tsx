import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Zoho + Fishbowl Demo</h1>
      <ul>
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
    </main>
  );
}
