import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WorkflowTimeline } from "@/components/shared/WorkflowTimeline";
import { shipments, workflowSteps, extractedFields } from "@/data/mockData";
import { MapPin, Anchor, Users, Package, FileText, Calendar } from "lucide-react";

export default function ShipmentDetail() {
  const shipment = shipments[0]; // Featured shipment

  const parties = [
    { role: "Shipper", name: shipment.shipper },
    { role: "Consignee", name: shipment.consignee },
    { role: "Freight Forwarder", name: shipment.forwarder },
    { role: "Carrier", name: shipment.carrier },
  ];

  const cargoFields = extractedFields.filter((f) => f.category === "Quality (COA)" || f.category === "Cargo");

  return (
    <AppLayout title="Shipment Detail" subtitle={shipment.reference}>
      {/* Summary Card */}
      <div className="bg-card rounded-md border shadow-sm p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Anchor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-semibold text-foreground">{shipment.vessel}</h2>
                <StatusBadge status={shipment.status} />
              </div>
              <p className="text-sm text-muted-foreground font-mono">{shipment.reference}</p>
              <p className="text-sm text-muted-foreground mt-1">{shipment.cargo}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">ETD</p>
                <p className="font-mono text-xs">{shipment.etd}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="font-mono text-xs">{shipment.eta}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="font-mono text-xs font-semibold">{shipment.quantity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="bg-card rounded-md border shadow-sm p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" /> Workflow Status
        </h3>
        <WorkflowTimeline steps={workflowSteps} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Routing */}
        <div className="bg-card rounded-md border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" /> Vessel & Routing
          </h3>
          <div className="space-y-3">
            {[
              { label: "Vessel", value: shipment.vessel },
              { label: "Port of Loading", value: shipment.origin },
              { label: "Port of Discharge", value: shipment.destination },
              { label: "ETD", value: shipment.etd },
              { label: "ETA", value: shipment.eta },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Parties */}
        <div className="bg-card rounded-md border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" /> Parties Involved
          </h3>
          <div className="space-y-3">
            {parties.map((p) => (
              <div key={p.role} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{p.role}</span>
                <span className="font-medium text-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cargo Data */}
      <div className="bg-card rounded-md border shadow-sm">
        <div className="px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" /> Cargo & Quality Data
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cargoFields.map((f) => (
                <tr key={f.id}>
                  <td className="text-sm font-medium">{f.fieldName}</td>
                  <td className="font-mono text-sm">
                    {f.extractedValue}
                    {f.discrepancy && (
                      <span className="block text-[10px] text-destructive mt-0.5">{f.discrepancy}</span>
                    )}
                  </td>
                  <td className="text-xs text-muted-foreground">{f.sourceDocument}</td>
                  <td>
                    <span className={`badge-status ${
                      f.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      f.status === "Corrected" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      f.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
