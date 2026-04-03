import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/shared/KpiCard";
import { StatusBadge, SeverityBadge } from "@/components/shared/StatusBadge";
import { shipments, exceptions } from "@/data/mockData";
import { FileText, AlertTriangle, Clock, CheckCircle, Ship, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const activeShipments = shipments.filter((s) => !["Archived", "Surrendered"].includes(s.status));
  const openExceptions = exceptions.filter((e) => e.status === "Open");

  return (
    <AppLayout title="Dashboard">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Active Shipments" value={activeShipments.length} icon={Ship} subtitle="Richards Bay → India" />
        <KpiCard title="Documents Processed" value={12} icon={FileText} trend={{ value: "+3 this week", positive: true }} />
        <KpiCard title="Open Exceptions" value={openExceptions.length} icon={AlertTriangle} subtitle="1 critical" />
        <KpiCard title="Avg Review Time" value="4.2h" icon={Clock} trend={{ value: "-18% vs last month", positive: true }} />
      </div>

      {/* Active Shipments Table */}
      <div className="bg-card rounded-md border shadow-sm mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-semibold text-foreground">Active Shipments</h2>
          <Link to="/shipments" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Vessel</th>
                <th>Route</th>
                <th>Cargo</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Docs</th>
                <th>Exceptions</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {activeShipments.map((s) => (
                <tr key={s.id} className="cursor-pointer" onClick={() => {}}>
                  <td>
                    <Link to={`/shipments/${s.id}`} className="text-primary hover:underline font-mono text-xs">
                      {s.reference}
                    </Link>
                  </td>
                  <td className="text-sm">{s.vessel}</td>
                  <td className="text-xs text-muted-foreground">
                    {s.origin.split(",")[0]} → {s.destination.split(",")[0]}
                  </td>
                  <td className="text-xs">{s.cargo}</td>
                  <td className="font-mono text-xs">{s.quantity}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="text-center font-mono text-xs">{s.documents}</td>
                  <td className="text-center">
                    {s.exceptions > 0 ? (
                      <span className="text-xs font-medium text-destructive">{s.exceptions}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="text-xs text-muted-foreground font-mono">{s.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-column: Pending Approvals + Recent Exceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Approvals */}
        <div className="bg-card rounded-md border shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-foreground">Pending Approvals</h2>
            <span className="text-xs text-muted-foreground">2 awaiting action</span>
          </div>
          <div className="divide-y">
            {shipments.filter(s => s.status === "Reviewed").map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.vessel}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.reference}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  <Link to="/smartfill" className="text-xs text-primary hover:underline">Review</Link>
                </div>
              </div>
            ))}
            {shipments.filter(s => s.status === "Reviewed").length === 0 && (
              <div className="px-4 py-6 text-center">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All caught up</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Exceptions */}
        <div className="bg-card rounded-md border shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-foreground">Recent Exceptions</h2>
            <Link to="/exceptions" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y">
            {exceptions.slice(0, 3).map((e) => (
              <div key={e.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{e.type}</span>
                  <SeverityBadge severity={e.severity} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{e.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">{e.shipmentRef}</span>
                  <span className="text-[10px] text-muted-foreground">• {e.assignee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
