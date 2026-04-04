import {
  type Document,
  type ExtractedField,
  type Organization,
  type Shipment,
  type ShipmentParty,
  DocumentType,
  FieldKey,
  ShipmentPartyKind,
  ShipmentWorkflowState,
} from "@prisma/client";

/** Mirrors the Lovable UI `Shipment` type (mockData.ts). */
export interface ShipmentListItemDto {
  id: string;
  reference: string;
  vessel: string;
  origin: string;
  destination: string;
  cargo: string;
  quantity: string;
  status: string;
  shipper: string;
  consignee: string;
  forwarder: string;
  carrier: string;
  etd: string;
  eta: string;
  documents: number;
  exceptions: number;
  lastUpdated: string;
}

const WORKFLOW_TO_UI: Record<ShipmentWorkflowState, string> = {
  draft: "Draft",
  reviewed: "Reviewed",
  approved: "Approved",
  issued: "Issued",
  transferred: "Transferred",
  surrendered: "Surrendered",
  archived: "Archived",
};

type FieldRow = ExtractedField & { document: Document };

function pickField(
  fields: FieldRow[],
  key: FieldKey,
  prefer: DocumentType = DocumentType.bill_of_lading,
): string {
  const preferred = fields.find((f) => f.fieldKey === key && f.document.type === prefer);
  if (preferred?.extractedValue) return preferred.extractedValue;
  const any = fields.find((f) => f.fieldKey === key);
  return any?.extractedValue?.trim() ?? "";
}

function formatMt(raw: string): string {
  const n = Number.parseFloat(raw.replace(/,/g, ""));
  if (Number.isFinite(n)) {
    return `${n.toLocaleString("en-US")} MT`;
  }
  return raw ? `${raw} MT` : "—";
}

function orgName(
  parties: (ShipmentParty & { organization: Organization })[],
  kind: ShipmentPartyKind,
): string {
  return parties.find((p) => p.kind === kind)?.organization.name ?? "—";
}

export function shipmentToListItemDto(
  row: Shipment & {
    parties: (ShipmentParty & { organization: Organization })[];
    extractedFields: FieldRow[];
    _count: { documents: number; exceptions: number };
  },
): ShipmentListItemDto {
  const fields = row.extractedFields;
  const pol = pickField(fields, FieldKey.port_of_loading);
  const pod = pickField(fields, FieldKey.port_of_discharge);
  const qtyRaw = pickField(fields, FieldKey.bill_of_lading_quantity_mt);

  return {
    id: row.id,
    reference: row.referenceCode,
    vessel: pickField(fields, FieldKey.vessel_name) || "—",
    origin: pol ? `${pol}, South Africa` : "—",
    destination: pod ? `${pod}, India` : "—",
    cargo: pickField(fields, FieldKey.cargo_description) || "—",
    quantity: qtyRaw ? formatMt(qtyRaw) : "—",
    status: WORKFLOW_TO_UI[row.workflowState] ?? row.workflowState,
    shipper: orgName(row.parties, ShipmentPartyKind.shipper),
    consignee: orgName(row.parties, ShipmentPartyKind.consignee),
    forwarder: orgName(row.parties, ShipmentPartyKind.freight_forwarder),
    carrier: orgName(row.parties, ShipmentPartyKind.carrier),
    etd: "—",
    eta: "—",
    documents: row._count.documents,
    exceptions: row._count.exceptions,
    lastUpdated: row.updatedAt.toISOString(),
  };
}
