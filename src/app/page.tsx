import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-zinc-950">
      <main className="max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Pilot 1 — Richards Bay → India coal
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Freight Master Program
        </h1>
        <p className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Open dashboard
          </Link>
        </p>
        <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-100/80 px-4 py-3 text-left text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
          The dashboard runs in this Next.js app (same repo as Cursor). Optional: keep a separate Lovable UI for
          experiments — point it at this site&apos;s origin for API calls — or develop UI only here to avoid
          sync issues.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Document upload, AI-assisted extraction, cross-document validation, workflow, RBAC, and audit
          are being implemented in this repository. API routes and app screens will connect to the
          Prisma schema and validation engine next.
        </p>
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          Quick checks:{" "}
          <a className="font-medium text-zinc-900 underline dark:text-zinc-100" href="/api/v1/health">
            /api/v1/health
          </a>
          {" · "}
          <a className="font-medium text-zinc-900 underline dark:text-zinc-100" href="/api/v1/shipments">
            /api/v1/shipments
          </a>{" "}
          (needs DB + env on Vercel; may 403/500 until configured).
        </p>
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
          Auth: <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 dark:bg-zinc-800">/api/auth/*</code>{" "}
          (credentials, JWT). Locally run{" "}
          <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 dark:bg-zinc-800">npm run db:migrate</code>{" "}
          and <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 dark:bg-zinc-800">npm run db:seed</code> for demo data.
        </p>
      </main>
    </div>
  );
}
