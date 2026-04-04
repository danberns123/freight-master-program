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
        <p className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-3 text-left text-sm leading-relaxed text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <strong className="font-medium">This deployment is the Next.js API shell</strong> (backend). The dashboard UI
          from Lovable lives in a separate Lovable preview or publish URL — not here. If you expected a full UI on this
          page, open your Lovable project preview, and set{" "}
          <code className="rounded bg-amber-200/80 px-1 dark:bg-amber-900/80">VITE_API_BASE_URL</code> /{" "}
          <code className="rounded bg-amber-200/80 px-1 dark:bg-amber-900/80">VITE_API_URL</code> to{" "}
          <strong className="font-medium">this site&apos;s origin</strong> (copy from the browser address bar:{" "}
          <code className="rounded bg-amber-200/80 px-1 dark:bg-amber-900/80">https://…</code>
          ), with no trailing slash.
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
