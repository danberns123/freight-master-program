import { AppLayout } from "@/components/layout/AppLayout";
import { WorkflowTimeline } from "@/components/shared/WorkflowTimeline";
import { workflowSteps, shipments } from "@/data/mockData";
import { Lock, Shield, User, Clock } from "lucide-react";

export default function Workflow() {
  const shipment = shipments[0];

  return (
    <AppLayout title="Workflow" subtitle="Chain of Custody">
      {/* Current Shipment Workflow */}
      <div className="bg-card rounded-md border shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{shipment.vessel}</h2>
            <p className="text-xs text-muted-foreground font-mono">{shipment.reference}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Current holder: <span className="font-medium text-foreground">{shipment.shipper}</span></span>
          </div>
        </div>
        <WorkflowTimeline steps={workflowSteps} />
      </div>

      {/* Detailed Steps */}
      <div className="bg-card rounded-md border shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-foreground">Step Details</h3>
        </div>
        <div className="divide-y">
          {workflowSteps.map((step, index) => (
            <div key={step.state} className="px-4 py-4 flex items-start gap-4">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                step.completedAt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{step.state}</span>
                  {step.locked && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      <Lock className="h-2.5 w-2.5" /> Locked
                    </span>
                  )}
                </div>
                {step.completedAt ? (
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {step.completedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> {step.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(step.completedAt).toLocaleString()}
                    </span>
                    {step.signature && (
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{step.signature}</span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
