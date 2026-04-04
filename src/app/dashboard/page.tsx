import Link from "next/link";
import { ExceptionStatus } from "@prisma/client";
import { shipmentToListItemDto } from "@/lib/api/shipment-list-dto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let data: {
    shipments: ReturnType<typeof shipmentToListItemDto>[];
    activeShipments: number;
    openExceptions: number;
    documentsProcessed: number;
  };

  try {
    const [rows, openExceptions, documentsProcessed] = await Promise.all([
      prisma.shipment.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          parties: { include: { organization: true } },
          extractedFields: { include: { document: true } },
          _count: { select: { documents: true, exceptions: true } },
        },
      }),
      prisma.exceptionItem.count({ where: { status: ExceptionStatus.open } }),
      prisma.document.count(),
    ]);

    const shipments = rows.map(shipmentToListItemDto);
    const activeShipments = shipments.filter(
      (s) => !["Archived", "Surrendered"].includes(s.status),
    ).length;

    data = { shipments, activeShipments, openExceptions, documentsProcessed };
  } catch {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard unavailable</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Could not load shipments from the database. On Vercel, set{" "}
          <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">DATABASE_URL</code> and redeploy;
          run migrations against that database (e.g.{" "}
          <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">npx prisma migrate deploy</code>
          ).
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-100">
            Back to home
          </Link>
        </p>
      </div>
    );
  }

  const { shipments, activeShipments, openExceptions, documentsProcessed } = data;

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Pilot 1 — Coal</p>
            <h1 className="text-lg font-semibold">Shipments</h1>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Kpi label="Active shipments" value={activeShipments} />
          <Kpi label="Open exceptions" value={openExceptions} />
          <Kpi label="Documents processed" value={documentsProcessed} />
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Vessel</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Docs</th>
                  <th className="px-4 py-3 text-right">Exceptions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                      No shipments yet. Run{" "}
                      <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">npm run db:seed</code> locally
                      against this database.
                    </td>
                  </tr>
                ) : (
                  shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">{s.reference}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {s.vessel}
                      </td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {s.origin} → {s.destination}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">
                          {s.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{s.documents}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{s.exceptions}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
