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
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Document upload, AI-assisted extraction, cross-document validation, workflow, RBAC, and audit
          are being implemented in this repository. API routes and app screens will connect to the
          Prisma schema and validation engine next.
        </p>
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
          Auth: <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 dark:bg-zinc-800">/api/auth/*</code>{" "}
          (credentials, JWT). Run <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 dark:bg-zinc-800">npm run db:migrate</code>{" "}
          and <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 dark:bg-zinc-800">npm run db:seed</code> for demo data.
        </p>
      </main>
    </div>
  );
}
