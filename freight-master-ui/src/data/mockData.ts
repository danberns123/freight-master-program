export type WorkflowState = "Draft" | "Reviewed" | "Approved" | "Issued" | "Transferred" | "Surrendered" | "Archived";
export type SeverityLevel = "critical" | "high" | "medium" | "low";
export type UserRole = "Shipper" | "Freight Forwarder" | "Carrier" | "Consignee" | "Platform Admin";
export type ConfidenceLevel = "high" | "medium" | "low";

export interface Shipment {
  id: string;
  reference: string;
  vessel: string;
  origin: string;
  destination: string;
  cargo: string;
  quantity: string;
  status: WorkflowState;
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

export interface ExceptionItem {
  id: string;
  shipmentRef: string;
  type: string;
  severity: SeverityLevel;
  description: string;
  sourceDocuments: string[];
  ruleTriggered: string;
  suggestedAction: string;
  assignee: string;
  status: "Open" | "Under Review" | "Resolved" | "Dismissed";
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  source: string;
  eventHash: string;
}

export interface ExtractedField {
  id: string;
  category: string;
  fieldName: string;
  extractedValue: string;
  confidence: ConfidenceLevel;
  sourceDocument: string;
  sourceSection: string;
  status: "Pending" | "Approved" | "Corrected" | "Rejected";
  discrepancy?: string;
}

export interface WorkflowStep {
  state: WorkflowState;
  completedAt?: string;
  completedBy?: string;
  role?: UserRole;
  signature?: string;
  locked: boolean;
}

export const currentUser = {
  name: "Sarah Chen",
  role: "Freight Forwarder" as UserRole,
  email: "s.chen@meridianlogistics.com",
};

export const shipments: Shipment[] = [
  {
    id: "SHP-2026-0041",
    reference: "COAL-RB-IND-0041",
    vessel: "MV Cape Horizon",
    origin: "Richards Bay, South Africa",
    destination: "Mundra, India",
    cargo: "Bituminous Coal (RB1 Grade)",
    quantity: "72,450 MT",
    status: "Reviewed",
    shipper: "Exxaro Coal Mpumalanga",
    consignee: "Tata Power Trading Co.",
    forwarder: "Meridian Freight Solutions",
    carrier: "Pacific Basin Shipping",
    etd: "2026-04-05",
    eta: "2026-04-28",
    documents: 3,
    exceptions: 2,
    lastUpdated: "2026-04-03T14:22:00Z",
  },
  {
    id: "SHP-2026-0040",
    reference: "COAL-RB-IND-0040",
    vessel: "MV Mineral Star",
    origin: "Richards Bay, South Africa",
    destination: "Paradip, India",
    cargo: "Thermal Coal (RB2 Grade)",
    quantity: "58,200 MT",
    status: "Approved",
    shipper: "Thungela Resources",
    consignee: "NTPC Vidyut Vyapar Nigam",
    forwarder: "Meridian Freight Solutions",
    carrier: "Oldendorff Carriers",
    etd: "2026-03-28",
    eta: "2026-04-20",
    documents: 3,
    exceptions: 0,
    lastUpdated: "2026-04-02T09:15:00Z",
  },
  {
    id: "SHP-2026-0039",
    reference: "COAL-RB-IND-0039",
    vessel: "MV Iron Duke",
    origin: "Richards Bay, South Africa",
    destination: "Krishnapatnam, India",
    cargo: "Bituminous Coal (RB1 Grade)",
    quantity: "65,800 MT",
    status: "Issued",
    shipper: "Seriti Resources",
    consignee: "Adani Enterprises Ltd.",
    forwarder: "Clarksons Platou",
    carrier: "Star Bulk Carriers",
    etd: "2026-03-15",
    eta: "2026-04-07",
    documents: 3,
    exceptions: 1,
    lastUpdated: "2026-04-01T16:45:00Z",
  },
  {
    id: "SHP-2026-0038",
    reference: "COAL-RB-IND-0038",
    vessel: "MV Ocean Grace",
    origin: "Richards Bay, South Africa",
    destination: "Mundra, India",
    cargo: "Thermal Coal (RB3 Grade)",
    quantity: "70,100 MT",
    status: "Transferred",
    shipper: "Exxaro Coal Mpumalanga",
    consignee: "JSW Energy Ltd.",
    forwarder: "Meridian Freight Solutions",
    carrier: "Golden Ocean Group",
    etd: "2026-03-01",
    eta: "2026-03-24",
    documents: 3,
    exceptions: 0,
    lastUpdated: "2026-03-25T11:30:00Z",
  },
  {
    id: "SHP-2026-0037",
    reference: "COAL-RB-IND-0037",
    vessel: "MV Pacific Venture",
    origin: "Richards Bay, South Africa",
    destination: "Visakhapatnam, India",
    cargo: "Bituminous Coal (RB1 Grade)",
    quantity: "68,900 MT",
    status: "Draft",
    shipper: "Thungela Resources",
    consignee: "Tata Steel Ltd.",
    forwarder: "Meridian Freight Solutions",
    carrier: "Pan Ocean Co.",
    etd: "2026-04-12",
    eta: "2026-05-05",
    documents: 1,
    exceptions: 0,
    lastUpdated: "2026-04-03T08:00:00Z",
  },
];

export const exceptions: ExceptionItem[] = [
  {
    id: "EXC-001",
    shipmentRef: "COAL-RB-IND-0041",
    type: "Quantity Mismatch",
    severity: "high",
    description: "Bill of Lading states 72,450 MT but Draft Survey Report shows 72,180 MT — difference of 270 MT (0.37%)",
    sourceDocuments: ["Bill of Lading", "Draft Survey Report"],
    ruleTriggered: "QTY_MISMATCH_THRESHOLD > 0.2%",
    suggestedAction: "Review draft survey final figures and confirm with carrier",
    assignee: "Sarah Chen",
    status: "Open",
    createdAt: "2026-04-03T14:22:00Z",
  },
  {
    id: "EXC-002",
    shipmentRef: "COAL-RB-IND-0041",
    type: "Out-of-Spec Quality",
    severity: "medium",
    description: "SGS Certificate of Analysis shows Total Moisture at 12.8% — exceeds contractual limit of 12.5%",
    sourceDocuments: ["Certificate of Analysis"],
    ruleTriggered: "COA_MOISTURE_MAX > 12.5%",
    suggestedAction: "Escalate to consignee for acceptance or price adjustment",
    assignee: "Sarah Chen",
    status: "Open",
    createdAt: "2026-04-03T14:22:00Z",
  },
  {
    id: "EXC-003",
    shipmentRef: "COAL-RB-IND-0039",
    type: "Date Sequence Issue",
    severity: "low",
    description: "B/L issue date precedes draft survey completion date by 1 day",
    sourceDocuments: ["Bill of Lading", "Draft Survey Report"],
    ruleTriggered: "DATE_SEQ_BL_AFTER_DSR",
    suggestedAction: "Verify dates with carrier and surveyor",
    assignee: "Michael Torres",
    status: "Under Review",
    createdAt: "2026-03-30T10:15:00Z",
  },
  {
    id: "EXC-004",
    shipmentRef: "COAL-RB-IND-0041",
    type: "Vessel Mismatch",
    severity: "critical",
    description: "Certificate of Analysis references vessel 'MV Cape Horizon' but IMO number differs from Bill of Lading (9876543 vs 9876544)",
    sourceDocuments: ["Bill of Lading", "Certificate of Analysis"],
    ruleTriggered: "VESSEL_IMO_MISMATCH",
    suggestedAction: "Immediately verify correct IMO with carrier before workflow can proceed",
    assignee: "Sarah Chen",
    status: "Open",
    createdAt: "2026-04-03T14:25:00Z",
  },
];

export const auditEvents: AuditEvent[] = [
  {
    id: "EVT-001",
    timestamp: "2026-04-03T14:25:00Z",
    user: "SmartFill AI",
    role: "Platform Admin",
    action: "Exception flagged: Vessel IMO mismatch detected",
    source: "SmartFill Engine",
    eventHash: "0xae3f...c891",
  },
  {
    id: "EVT-002",
    timestamp: "2026-04-03T14:22:00Z",
    user: "SmartFill AI",
    role: "Platform Admin",
    action: "Document fields extracted from Draft Survey Report",
    source: "SmartFill Engine",
    eventHash: "0x7b2d...a4f3",
  },
  {
    id: "EVT-003",
    timestamp: "2026-04-03T14:20:00Z",
    user: "Sarah Chen",
    role: "Freight Forwarder",
    action: "Document uploaded: Draft Survey Report",
    source: "Manual Upload",
    eventHash: "0x5c1e...d782",
  },
  {
    id: "EVT-004",
    timestamp: "2026-04-03T10:15:00Z",
    user: "Sarah Chen",
    role: "Freight Forwarder",
    action: "SmartFill review completed — 3 fields corrected",
    fieldChanged: "Consignee Name",
    oldValue: "Tata Power Trading",
    newValue: "Tata Power Trading Co.",
    source: "SmartFill Review",
    eventHash: "0x92af...b156",
  },
  {
    id: "EVT-005",
    timestamp: "2026-04-02T16:30:00Z",
    user: "James Wright",
    role: "Shipper",
    action: "Workflow state changed: Draft → Reviewed",
    fieldChanged: "Workflow State",
    oldValue: "Draft",
    newValue: "Reviewed",
    source: "Workflow Engine",
    eventHash: "0x3d8c...e429",
  },
  {
    id: "EVT-006",
    timestamp: "2026-04-02T14:00:00Z",
    user: "SmartFill AI",
    role: "Platform Admin",
    action: "Document fields extracted from Certificate of Analysis",
    source: "SmartFill Engine",
    eventHash: "0x1fa7...9c03",
  },
  {
    id: "EVT-007",
    timestamp: "2026-04-02T13:55:00Z",
    user: "James Wright",
    role: "Shipper",
    action: "Document uploaded: SGS Certificate of Analysis",
    source: "Manual Upload",
    eventHash: "0x6eb4...2d71",
  },
  {
    id: "EVT-008",
    timestamp: "2026-04-01T09:00:00Z",
    user: "James Wright",
    role: "Shipper",
    action: "Shipment created and Bill of Lading uploaded",
    source: "Manual Upload",
    eventHash: "0xc4a2...f598",
  },
];

export const extractedFields: ExtractedField[] = [
  { id: "F-001", category: "Shipper", fieldName: "Shipper Name", extractedValue: "Exxaro Coal Mpumalanga (Pty) Ltd", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Header Block", status: "Approved" },
  { id: "F-002", category: "Shipper", fieldName: "Shipper Address", extractedValue: "Roger Sobukwe Road, Emalahleni, 1035, South Africa", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Header Block", status: "Approved" },
  { id: "F-003", category: "Consignee", fieldName: "Consignee Name", extractedValue: "Tata Power Trading Co.", confidence: "medium", sourceDocument: "Bill of Lading", sourceSection: "Header Block", status: "Corrected", discrepancy: "Original extraction: 'Tata Power Trading' — period missing" },
  { id: "F-004", category: "Vessel", fieldName: "Vessel Name", extractedValue: "MV Cape Horizon", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Vessel Details", status: "Approved" },
  { id: "F-005", category: "Vessel", fieldName: "IMO Number", extractedValue: "9876543", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Vessel Details", status: "Pending", discrepancy: "COA shows IMO 9876544" },
  { id: "F-006", category: "Routing", fieldName: "Port of Loading", extractedValue: "Richards Bay, South Africa", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Routing", status: "Approved" },
  { id: "F-007", category: "Routing", fieldName: "Port of Discharge", extractedValue: "Mundra, Gujarat, India", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Routing", status: "Approved" },
  { id: "F-008", category: "Cargo", fieldName: "Cargo Description", extractedValue: "Bituminous Coal (RB1 Grade)", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Cargo Details", status: "Approved" },
  { id: "F-009", category: "Cargo", fieldName: "Declared Quantity (B/L)", extractedValue: "72,450 MT", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Cargo Details", status: "Pending", discrepancy: "Draft Survey shows 72,180 MT" },
  { id: "F-010", category: "Cargo", fieldName: "Draft Survey Quantity", extractedValue: "72,180 MT", confidence: "high", sourceDocument: "Draft Survey Report", sourceSection: "Summary", status: "Pending" },
  { id: "F-011", category: "Quality (COA)", fieldName: "Total Moisture", extractedValue: "12.8%", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Proximate Analysis", status: "Pending", discrepancy: "Exceeds contractual limit of 12.5%" },
  { id: "F-012", category: "Quality (COA)", fieldName: "Ash Content", extractedValue: "14.2%", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Proximate Analysis", status: "Approved" },
  { id: "F-013", category: "Quality (COA)", fieldName: "Sulfur", extractedValue: "0.62%", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Proximate Analysis", status: "Approved" },
  { id: "F-014", category: "Quality (COA)", fieldName: "Volatile Matter", extractedValue: "23.1%", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Proximate Analysis", status: "Approved" },
  { id: "F-015", category: "Quality (COA)", fieldName: "GCV (Gross Calorific Value)", extractedValue: "6,150 kcal/kg", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Calorific", status: "Approved" },
  { id: "F-016", category: "Quality (COA)", fieldName: "NAR (Net As Received)", extractedValue: "5,480 kcal/kg", confidence: "medium", sourceDocument: "Certificate of Analysis", sourceSection: "Calorific", status: "Pending" },
  { id: "F-017", category: "Quality (COA)", fieldName: "HGI (Hardgrove Index)", extractedValue: "52", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Physical", status: "Approved" },
  { id: "F-018", category: "Document", fieldName: "B/L Number", extractedValue: "COAL-OREVOY-2026-0041", confidence: "high", sourceDocument: "Bill of Lading", sourceSection: "Header", status: "Approved" },
  { id: "F-019", category: "Document", fieldName: "SGS Certificate No.", extractedValue: "SGS-RB-COA-26-1847", confidence: "high", sourceDocument: "Certificate of Analysis", sourceSection: "Header", status: "Approved" },
  { id: "F-020", category: "Document", fieldName: "Draft Survey Report No.", extractedValue: "DSR-RB-26-0893", confidence: "high", sourceDocument: "Draft Survey Report", sourceSection: "Header", status: "Approved" },
];

export const workflowSteps: WorkflowStep[] = [
  { state: "Draft", completedAt: "2026-04-01T09:00:00Z", completedBy: "James Wright", role: "Shipper", signature: "JW-SIG-001", locked: true },
  { state: "Reviewed", completedAt: "2026-04-02T16:30:00Z", completedBy: "James Wright", role: "Shipper", signature: "JW-SIG-002", locked: true },
  { state: "Approved", locked: false },
  { state: "Issued", locked: false },
  { state: "Transferred", locked: false },
  { state: "Surrendered", locked: false },
  { state: "Archived", locked: false },
];
