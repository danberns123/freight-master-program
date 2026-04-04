# Freight Master Program

Engineering-first MVP for a **bulk commodity document control** platform, starting with the **Richards Bay → India coal** trade lane (Pilot 1). The product goal is operational proof: uploads, extraction, cross-document validation, workflow, RBAC, immutable-style audit, and **simulated** title/control transfer—not a production eBL network yet.

## Stack

- **Next.js** (App Router) + **React** + **TypeScript** + **Tailwind CSS**
- **PostgreSQL** + **Prisma ORM**
- **Auth.js** (`next-auth` beta): credentials provider + JWT sessions (OAuth-ready schema on `User` / `Account` / `Session`)

## Repository layout

| Area | Location |
|------|----------|
| Domain schema | `prisma/schema.prisma` |
| Seed (aligned + mismatched shipments) | `prisma/seed.ts` |
| Prisma client singleton | `src/lib/prisma.ts` |
| Workflow transition rules | `src/lib/workflow.ts` |
| Coal pilot validation rules | `src/lib/validation/coal-validation.ts` |
| Auth | `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts` |

## Local setup

1. Copy environment template and fill values:

   ```bash
   cp .env.example .env
   ```

2. Use a PostgreSQL URL in `DATABASE_URL`, set `AUTH_SECRET` (e.g. `openssl rand -base64 32`), and set `AUTH_URL` to your dev origin (e.g. `http://localhost:3000`).

3. Migrate and seed:

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

### Demo users (after seed)

Password for all: **`changeme`**

- `shipper@pilot.local` — shipper role  
- `forwarder@pilot.local` — freight forwarder role  
- `admin@pilot.local` — admin role  

Seed shipments: **`FMP-RB-IND-001`** (aligned) and **`FMP-MISMATCH-001`** (deliberate exceptions).

## Tests

```bash
npm test
```

Covers workflow transitions and coal cross-document validation rules.

## New GitHub repository

Create a **new** repo (e.g. **Freight Master Program**). The npm package name is `freight-master-program` (lowercase); the display name can stay **Freight Master Program**.

```bash
cd /path/to/freight-master-program
git remote add origin https://github.com/<you>/freight-master-program.git
git push -u origin main
```

## Cursor / workspace

Open **`freight-master-program`** as its own workspace root in Cursor (File → Open Folder) so this app is separate from other projects.

## Lovable + Cursor (same product, two tools)

**Why the Lovable preview can break:** Lovable builds the project it has in GitHub on the **default branch** (`main`). This repository is a **Next.js** app at the repo root. A Lovable project is normally a **Lovable-generated** (e.g. Vite) layout. If you connect Lovable to this repo after it was changed to Next-only (or remove the old Vite UI folder), Lovable’s builder no longer matches what it expects, and the **preview may fail to load or build**.

**Lovable also cannot “import” an arbitrary existing repo as a new project**—GitHub sync is export/sync from Lovable outward. So you cannot point a fresh Lovable project at this Next repo and expect it to adopt the whole backend.

**Practical setups that work:**

1. **Separate GitHub repos (recommended)**  
   - Keep **this** repo for the Next.js API, Prisma, and auth (Cursor).  
   - Keep a **second** repo connected to Lovable for the UI only (the one Lovable created and syncs).  
   - In the Lovable app, call your API with a public base URL (deployed Next on Vercel, or a tunnel such as Cloudflare Tunnel / ngrok).  
   - On the API host, set `FMP_PUBLIC_READ_API=true`, and either list exact preview origins in `CORS_ORIGINS` or set `CORS_ALLOW_LOVABLE_PREVIEWS=true` so changing Lovable preview subdomains does not require `.env` edits.  
   - Lovable only syncs **`main`**; merge feature branches to `main` so both sides see updates.

2. **UI only in Next (Cursor)**  
   - Skip Lovable GitHub sync for this product; implement pages under `src/app` here.

3. **If you must use one GitHub repo**  
   - Avoid replacing Lovable’s root layout with a different framework without a plan; restoring a working Lovable tree may require checking out an older commit or a dedicated UI branch that Lovable can still build—many teams use **two repos** instead.

**“Lovable proxy error (500)” (your screenshot):** That text is from **Lovable’s preview proxy**, not from this Next.js app. It usually means the **Vite dev server inside Lovable’s sandbox** failed to start or threw on the first request—very often immediately after a bad **`.env`** change (your sidebar shows **Update .env → Preview failed**) or a **Git merge** that broke the UI project (wrong `package.json` scripts, missing files, syntax errors). Open **Cloud → Logs** in Lovable for the stack trace, revert to the last preview that worked, or use **Try to Fix** if offered. Fix this in the **GitHub repo that Lovable syncs for “Freight Master Ui”**; changing CORS here does not resolve a proxy 500.

**CORS note:** `src/lib/api/cors.ts` only sends `Access-Control-Allow-Origin` when the browser’s `Origin` is explicitly allowed (or matches the Lovable toggle above). Wrong or missing CORS shows as **browser console** CORS errors **after** the preview shell loads—not as “Lovable proxy error (500).”

## Out of scope (Pilot 1)

Per product brief: bank integration, customs, real blockchain, legal title finality, and broad external interoperability—use **simulated** control transfer with full audit instead.
