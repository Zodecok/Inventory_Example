async function getHealth() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  try {
    const res = await fetch(`${base}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, data: null };
  }
}

export default async function Page() {
  const health = await getHealth();
  return (
    <main style={{ padding: 24 }}>
      <h1>Zoho + Fishbowl Demo</h1>
      <p>
        Frontend deployed on Vercel. API base: {process.env.NEXT_PUBLIC_API_BASE_URL}
      </p>
      <h2>API Health</h2>
      {health.ok ? (
        <pre>{JSON.stringify(health.data, null, 2)}</pre>
      ) : (
        <p>
          Couldn’t reach the API yet. Deploy your API or update
          NEXT_PUBLIC_API_BASE_URL.
        </p>
      )}
      <hr />
      <p>
        Next steps: Products list calling Zoho Items, Create Order → Zoho Invoice,
        Fishbowl mock stock merge. (We’ll add these pages when we generate code.)
      </p>
    </main>
  );
}

