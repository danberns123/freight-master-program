import { AppLayout } from "@/components/layout/AppLayout";
import { auditEvents } from "@/data/mockData";
import { ScrollText, Filter, Download } from "lucide-react";

export default function AuditLog() {
  return (
    <AppLayout title="Audit Log">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          <ScrollText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{auditEvents.length} events</span>
          <span className="text-xs text-muted-foreground">• Immutable record</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border bg-card text-muted-foreground hover:text-foreground">
            <Filter className="h-3 w-3" /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border bg-card text-muted-foreground hover:text-foreground">
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
      </div>

      <div className="bg-card rounded-md border shadow-sm">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Field Changed</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Source</th>
                <th>Event Hash</th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((event) => (
                <tr key={event.id}>
                  <td className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="text-sm font-medium whitespace-nowrap">{event.user}</td>
                  <td>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {event.role}
                    </span>
                  </td>
                  <td className="text-xs max-w-sm">{event.action}</td>
                  <td className="text-xs text-muted-foreground">{event.fieldChanged || "—"}</td>
                  <td className="font-mono text-xs text-muted-foreground">{event.oldValue || "—"}</td>
                  <td className="font-mono text-xs">{event.newValue || "—"}</td>
                  <td className="text-xs text-muted-foreground whitespace-nowrap">{event.source}</td>
                  <td className="font-mono text-[10px] text-muted-foreground">{event.eventHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
