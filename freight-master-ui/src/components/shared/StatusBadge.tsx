import { type WorkflowState, type SeverityLevel, type ConfidenceLevel } from "@/data/mockData";

const statusColors: Record<WorkflowState, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Reviewed: "bg-primary/10 text-primary border-primary/20",
  Approved: "bg-success/10 text-success border-success/20",
  Issued: "bg-purple-50 text-purple-700 border-purple-200",
  Transferred: "bg-amber-50 text-amber-700 border-amber-200",
  Surrendered: "bg-slate-100 text-slate-700 border-slate-200",
  Archived: "bg-muted text-muted-foreground border-border",
};

const severityColors: Record<SeverityLevel, string> = {
  critical: "badge-severity-critical",
  high: "badge-severity-high",
  medium: "badge-severity-medium",
  low: "badge-severity-low",
};

const confidenceColors: Record<ConfidenceLevel, string> = {
  high: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-red-50 text-red-700 border-red-200",
};

export function StatusBadge({ status }: { status: WorkflowState }) {
  return (
    <span className={`badge-status ${statusColors[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return (
    <span className={`badge-status ${severityColors[severity]}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function ConfidenceBadge({ confidence }: { confidence: ConfidenceLevel }) {
  return (
    <span className={`badge-status ${confidenceColors[confidence]}`}>
      {confidence === "high" ? "95%+" : confidence === "medium" ? "75-94%" : "<75%"}
    </span>
  );
}
