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

## Out of scope (Pilot 1)

Per product brief: bank integration, customs, real blockchain, legal title finality, and broad external interoperability—use **simulated** control transfer with full audit instead.
