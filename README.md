# Zoho + Fishbowl Demo (Frontend)

## Local dev
```bash
npm i
cp .env.example .env.local  # set NEXT_PUBLIC_API_BASE_URL
npm run dev
```

## Deploy (Vercel)

- Push this repo to GitHub.
- Import into Vercel → set Environment Variable `NEXT_PUBLIC_API_BASE_URL`.
- Assign domain `beboldapp.me` in Vercel Project → Domains.

Done. Visit https://beboldapp.me

