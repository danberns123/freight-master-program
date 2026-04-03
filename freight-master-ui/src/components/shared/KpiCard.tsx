import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          <span className="text-2xl font-semibold text-foreground">{value}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
          {trend && (
            <span className={`text-xs font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
              {trend.value}
            </span>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
      </div>
    </div>
  );
}
