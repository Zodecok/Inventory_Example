# Zoho + Fishbowl Demo (Frontend)

A Next.js 14 App Router application for managing products, orders, and Zoho integrations.

## Environment Variable

- `NEXT_PUBLIC_API_BASE_URL` - API base URL (e.g., https://api.beboldapp.me)

## Local Development

```bash
npm i
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_BASE_URL
npm run dev
```

## Deployment on Vercel

1. Push this repo to GitHub
2. Import into Vercel
3. Go to Project → Settings → Environment Variables
4. Set `NEXT_PUBLIC_API_BASE_URL` to `https://api.beboldapp.me`
5. Deploy
6. Assign domain `beboldapp.me` in Vercel Project → Domains
7. Visit https://beboldapp.me

## Features

- **/products** - View products list with source badge (mock/real) and inventory table
- **/admin** - Check API health, connect to Zoho OAuth, and view connection status
- **/order** - Create orders with customer information and line items, submits to Zoho as invoice
