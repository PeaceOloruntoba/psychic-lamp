# Vozaro Global Resource Ltd. — Web Platform & Admin Dashboard

Production Next.js 14 (App Router) + TypeScript + Supabase + Cloudinary
platform for a solar/inverter services company, with a public marketing
site, a product catalog (physical + digital books), an order/consultation
pipeline with automated email invoices, and a protected admin dashboard.

## Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Database/Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Images:** Cloudinary (signed direct-from-browser uploads)
- **Email:** Nodemailer (SMTP — Zoho/Gmail/any provider)
- **Styling:** Tailwind CSS
- **Toasts:** Sonner

## 1. Install dependencies

```bash
npm install
```

## 2. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep secret, server-only)
3. Open the **SQL Editor** and run the entire contents of `schema.sql`.
   This creates all tables, enums, indexes, RLS policies, and seeds your
   five real services (Solar Installation, Inverter Setup & Repair, etc.).

## 3. Create your Cloudinary account

1. Go to [cloudinary.com](https://cloudinary.com) → sign up.
2. From the Dashboard, copy `Cloud name`, `API Key`, `API Secret` into
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   Uploads are **signed** server-side (via `/api/cloudinary-signature`), so
   no unsigned upload preset is needed.

## 4. Set up SMTP (Nodemailer)

Use any SMTP provider (Zoho Mail, Gmail with an App Password, etc).
Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
`SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`, and `BUSINESS_OWNER_EMAIL` (where you
want to receive a copy of every order).

## 5. Environment variables

Copy `.env.example` to `.env.local` and fill in every value:

```bash
cp .env.example .env.local
```

## 6. Create your first admin login

There is **no public signup route** by design — admins are created via
this script, which creates a Supabase Auth user and whitelists them in the
`admin_users` table in one step:

```bash
npm run seed:admin -- --email you@example.com --password "StrongPass123!" --name "Your Name"
```

Sign in at `/admin/login` with those credentials.

## 7. Run locally

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin/login`

## 8. Build for production

```bash
npm run build
npm run start
```

## Deploying

Deploy to [Vercel](https://vercel.com) (recommended for Next.js):

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all variables from `.env.local` to the Vercel project's Environment
   Variables (set `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. Run the `seed:admin` script locally (pointed at your production
   Supabase project) to create your production admin login.

## Project structure

```
app/
  page.tsx                    Landing page (Server Component)
  products/[slug]/page.tsx    Product details page
  actions/orderActions.ts     Public order submission Server Action
  api/cloudinary-signature/   Signed upload endpoint (admin-only)
  admin/
    login/                    Admin sign-in (no public signup)
    (dashboard)/              Sidebar-wrapped protected admin routes
      dashboard/               Metrics overview
      products/                Product CRUD + Cloudinary uploader
      services/                Service CRUD
      orders/                  Order pipeline with status updates
components/                   Public site + shared UI components
components/admin/             Admin-only form components
lib/                          Supabase clients, Cloudinary, email, types, utils
scripts/seedAdmin.ts          Creates admin logins
schema.sql                    Full Supabase schema + RLS + seed data
middleware.ts                 Protects /admin/* routes
```

## Notes on security

- Admin passwords are managed entirely by **Supabase Auth** — they are
  never stored in your own database. `admin_users` is purely a whitelist
  mapping an authenticated `auth.users.id` to an admin profile.
- Row Level Security is enabled on every table. The public can only
  **read** services/products and **insert** orders — nothing else.
- `SUPABASE_SERVICE_ROLE_KEY` is used only inside trusted Server Actions
  (order submission) and is never exposed to the browser.

## Customizing brand colors

Colors live in `tailwind.config.ts` under `theme.extend.colors` (`navy`,
`solar`, `amber`). They're set to match your Instagram brand kit (deep
navy background, lime/acid-green accent, warm amber secondary).
