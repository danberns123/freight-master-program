import { AppLayout } from "@/components/layout/AppLayout";
import { SeverityBadge } from "@/components/shared/StatusBadge";
import { exceptions } from "@/data/mockData";
import { AlertTriangle, Filter } from "lucide-react";

export default function Exceptions() {
  const openCount = exceptions.filter((e) => e.status === "Open").length;
  const criticalCount = exceptions.filter((e) => e.severity === "critical").length;

  return (
    <AppLayout title="Exceptions">
      {/* Summary Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="font-medium text-foreground">{exceptions.length} total</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-destructive font-medium">{criticalCount} critical</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-warning font-medium">{openCount} open</span>
        </div>
        <button className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border bg-card text-muted-foreground hover:text-foreground">
          <Filter className="h-3 w-3" /> Filter
        </button>
      </div>

      <div className="bg-card rounded-md border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Shipment</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Description</th>
                <th>Source Docs</th>
                <th>Rule</th>
                <th>Assignee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.map((e) => (
                <tr key={e.id}>
                  <td className="font-mono text-xs text-muted-foreground">{e.id}</td>
                  <td className="font-mono text-xs text-primary">{e.shipmentRef}</td>
                  <td className="text-sm font-medium">{e.type}</td>
                  <td><SeverityBadge severity={e.severity} /></td>
                  <td className="text-xs text-muted-foreground max-w-xs">{e.description}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {e.sourceDocuments.map((doc) => (
                        <span key={doc} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{doc}</span>
                      ))}
                    </div>
                  </td>
                  <td className="font-mono text-[10px] text-muted-foreground">{e.ruleTriggered}</td>
                  <td className="text-xs">{e.assignee}</td>
                  <td>
                    <span className={`badge-status ${
                      e.status === "Open" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      e.status === "Under Review" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      e.status === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      "bg-muted text-muted-foreground border-border"
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="mt-4 bg-card rounded-md border shadow-sm p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Suggested Actions</h3>
        <div className="space-y-2">
          {exceptions.filter(e => e.status === "Open").map((e) => (
            <div key={e.id} className="flex items-start gap-3 p-3 rounded border bg-muted/10">
              <SeverityBadge severity={e.severity} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{e.type}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{e.suggestedAction}</p>
              </div>
              <button className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground font-medium shrink-0">
                Take Action
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
