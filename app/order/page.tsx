"use client";

import Link from "next/link";
import { useState } from "react";
import { postJSON } from "../lib/api";

interface Item {
  sku: string;
  name: string;
  rate: number;
  quantity: number;
}

interface Customer {
  display_name: string;
  email: string;
}

export default function OrderPage() {
  const [customer, setCustomer] = useState<Customer>({
    display_name: "",
    email: ""
  });
  const [items, setItems] = useState<Item[]>([
    { sku: "", name: "", rate: 0, quantity: 1 }
  ]);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function addItem() {
    setItems([...items, { sku: "", name: "", rate: 0, quantity: 1 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof Item, value: any) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResponse(null);

    // Validation
    if (!customer.display_name.trim()) {
      setError("Customer display name is required");
      return;
    }

    const validItems = items.filter(item => item.quantity > 0);
    if (validItems.length === 0) {
      setError("At least one item with quantity > 0 is required");
      return;
    }

    setLoading(true);
    try {
      const data = await postJSON("/order", { customer, items: validItems });
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h1>Create Order</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <h3>Customer</h3>
          <div style={{ marginBottom: 8 }}>
            <label>
              Display Name:
              <input
                type="text"
                value={customer.display_name}
                onChange={(e) =>
                  setCustomer({ ...customer, display_name: e.target.value })
                }
                style={{ marginLeft: 8, width: 300 }}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>
              Email:
              <input
                type="email"
                value={customer.email}
                onChange={(e) =>
                  setCustomer({ ...customer, email: e.target.value })
                }
                style={{ marginLeft: 8, width: 300 }}
              />
            </label>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h3>Items</h3>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: 12,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 4
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <label>
                  SKU:
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) => updateItem(index, "sku", e.target.value)}
                    style={{ marginLeft: 8, width: 150 }}
                  />
                </label>
                <label style={{ marginLeft: 16 }}>
                  Name:
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    style={{ marginLeft: 8, width: 200 }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>
                  Rate:
                  <input
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", parseFloat(e.target.value) || 0)
                    }
                    style={{ marginLeft: 8, width: 100 }}
                  />
                </label>
                <label style={{ marginLeft: 16 }}>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value) || 0)
                    }
                    style={{ marginLeft: 8, width: 100 }}
                  />
                </label>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{ marginLeft: 16, color: "red" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem}>
            Add Item
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ marginBottom: 16 }}>
          <h3>Response:</h3>
          <pre style={{ background: "#f5f5f5", padding: 12 }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <p>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
