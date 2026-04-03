import type { ShipmentWorkflowState } from "@prisma/client";

/** Valid shipment control workflow transitions (server-side source of truth). */
const ALLOWED: Record<ShipmentWorkflowState, ShipmentWorkflowState[]> = {
  draft: ["reviewed"],
  reviewed: ["draft", "approved"],
  approved: ["reviewed", "issued"],
  issued: ["approved", "transferred", "surrendered"],
  transferred: ["archived"],
  surrendered: ["archived"],
  archived: [],
};

export function canTransitionWorkflow(
  from: ShipmentWorkflowState,
  to: ShipmentWorkflowState,
): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}

export function assertTransitionAllowed(
  from: ShipmentWorkflowState,
  to: ShipmentWorkflowState,
): void {
  if (!canTransitionWorkflow(from, to)) {
    throw new Error(`Invalid workflow transition: ${from} → ${to}`);
  }
}
