import type { DocumentType, FieldKey, ShipmentWorkflowState } from "@prisma/client";

export type FieldSnapshot = Partial<Record<FieldKey, string | null | undefined>>;

export type Thresholds = {
  maxAshPercent?: number;
  maxSulfurPercent?: number;
  minNarKcalKg?: number;
};

export type CoalValidationIssue = {
  code: string;
  passed: boolean;
  message: string;
};

function norm(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function parseFloatLoose(v: string | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseDateLoose(v: string | null | undefined): Date | null {
  if (v == null || v === "") return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function vesselFromSnapshot(s: FieldSnapshot): string | null {
  const v = s.vessel_name;
  return v != null && String(v).trim() !== "" ? String(v) : null;
}

/** Vessel names must match across document buckets where present. */
export function ruleVesselMatch(
  fieldsByDoc: Partial<Record<DocumentType, FieldSnapshot>>,
): CoalValidationIssue {
  const vessels: string[] = [];
  for (const snap of Object.values(fieldsByDoc)) {
    if (!snap) continue;
    const v = vesselFromSnapshot(snap);
    if (v) vessels.push(norm(v));
  }
  if (vessels.length <= 1) {
    return { code: "vessel_match", passed: true, message: "Single or no vessel reference; nothing to cross-check." };
  }
  const first = vessels[0];
  const passed = vessels.every((x) => x === first);
  return {
    code: "vessel_match",
    passed,
    message: passed ? "Vessel names align across documents." : `Vessel mismatch: ${[...new Set(vessels)].join(" vs ")}`,
  };
}

export function rulePortMatch(
  fieldsByDoc: Partial<Record<DocumentType, FieldSnapshot>>,
  field: "port_of_loading" | "port_of_discharge",
  code: string,
  label: string,
): CoalValidationIssue {
  const ports: string[] = [];
  for (const snap of Object.values(fieldsByDoc)) {
    if (!snap) continue;
    const p = snap[field];
    if (p != null && String(p).trim() !== "") ports.push(norm(String(p)));
  }
  if (ports.length <= 1) {
    return { code, passed: true, message: `${label}: single or no value.` };
  }
  const first = ports[0];
  const passed = ports.every((x) => x === first);
  return {
    code,
    passed,
    message: passed ? `${label} aligns.` : `${label} mismatch: ${[...new Set(ports)].join(" vs ")}`,
  };
}

/** Simple material alignment: normalized BL description must be contained in or equal to survey (or vice versa) when both exist. */
export function ruleCargoDescriptionAlign(
  bl: FieldSnapshot | undefined,
  survey: FieldSnapshot | undefined,
): CoalValidationIssue {
  const a = bl?.cargo_description;
  const b = survey?.cargo_description;
  if (!a || !b) {
    return {
      code: "cargo_align",
      passed: true,
      message: "Cargo description cross-check skipped (missing BL or survey text).",
    };
  }
  const na = norm(String(a));
  const nb = norm(String(b));
  const passed = na === nb || na.includes(nb) || nb.includes(na);
  return {
    code: "cargo_align",
    passed,
    message: passed ? "Cargo descriptions materially align." : "Cargo descriptions differ materially between BL and survey.",
  };
}

export function ruleQuantityBlVsSurvey(bl: FieldSnapshot | undefined, survey: FieldSnapshot | undefined): CoalValidationIssue {
  const qBl = parseFloatLoose(bl?.bill_of_lading_quantity_mt ?? undefined);
  const qSv = parseFloatLoose(survey?.draft_survey_quantity_mt ?? undefined);
  if (qBl == null || qSv == null) {
    return {
      code: "qty_bl_survey",
      passed: true,
      message: "Quantity comparison skipped (missing BL and/or draft survey MT).",
    };
  }
  const tol = 0.01;
  const passed = Math.abs(qBl - qSv) <= tol;
  return {
    code: "qty_bl_survey",
    passed,
    message: passed
      ? `BL ${qBl} MT matches draft survey ${qSv} MT (within tolerance).`
      : `BL quantity ${qBl} MT does not match draft survey ${qSv} MT.`,
  };
}

export function ruleThresholdMax(
  valueKey: FieldKey,
  label: string,
  snap: FieldSnapshot | undefined,
  max: number | undefined,
  code: string,
): CoalValidationIssue {
  if (max == null) {
    return { code, passed: true, message: `${label}: no threshold configured.` };
  }
  const raw = snap?.[valueKey];
  const val = parseFloatLoose(raw ?? undefined);
  if (val == null) {
    return { code, passed: false, message: `${label}: value missing for threshold check.` };
  }
  const passed = val <= max;
  return {
    code,
    passed,
    message: passed ? `${label} ${val}% within max ${max}%.` : `${label} ${val}% exceeds max ${max}%.`,
  };
}

export function ruleNarMinimum(snap: FieldSnapshot | undefined, min: number | undefined): CoalValidationIssue {
  if (min == null) {
    return { code: "nar_min", passed: true, message: "NAR minimum not configured." };
  }
  const val = parseFloatLoose(snap?.nar_kcal_kg ?? undefined);
  if (val == null) {
    return { code: "nar_min", passed: false, message: "NAR (kcal/kg) missing for minimum check." };
  }
  const passed = val >= min;
  return {
    code: "nar_min",
    passed,
    message: passed ? `NAR ${val} meets minimum ${min}.` : `NAR ${val} below expected minimum ${min}.`,
  };
}

export function ruleDateSequence(snap: FieldSnapshot | undefined): CoalValidationIssue {
  const sampling = parseDateLoose(snap?.sampling_date ?? undefined);
  const analysis = parseDateLoose(snap?.analysis_date ?? undefined);
  const issue = parseDateLoose(snap?.issue_date ?? undefined);
  if (!sampling || !analysis || !issue) {
    return {
      code: "date_sequence",
      passed: false,
      message: "Required dates missing (sampling, analysis, issue).",
    };
  }
  const passed = sampling <= analysis && analysis <= issue;
  return {
    code: "date_sequence",
    passed,
    message: passed ? "COA dates follow logical sequence." : "COA dates do not follow sampling ≤ analysis ≤ issue.",
  };
}

const REQUIRED_FOR_ISSUE: FieldKey[] = [
  "vessel_name",
  "port_of_loading",
  "port_of_discharge",
  "cargo_description",
  "bill_of_lading_quantity_mt",
];

/** Mandatory normalized fields before shipment may enter `issued` (pilot rule). */
export function ruleMandatoryBeforeIssued(
  mergedFields: FieldSnapshot,
  targetState: ShipmentWorkflowState,
): CoalValidationIssue {
  if (targetState !== "issued") {
    return {
      code: "mandatory_issue",
      passed: true,
      message: "Mandatory field gate applies only when transitioning to issued.",
    };
  }
  const missing = REQUIRED_FOR_ISSUE.filter((k) => {
    const v = mergedFields[k];
    return v == null || String(v).trim() === "";
  });
  const passed = missing.length === 0;
  return {
    code: "mandatory_issue",
    passed,
    message: passed ? "Mandatory fields present for issue." : `Missing mandatory fields: ${missing.join(", ")}`,
  };
}

/** Run the initial Richards Bay → India coal cross-document checks (extensible framework lives in DB `ValidationRule` for future). */
export function runCoalPilotValidations(input: {
  fieldsByDoc: Partial<Record<DocumentType, FieldSnapshot>>;
  /** Reserved for merged COA-only fields when rules split by provenance. */
  mergedQualityFields?: FieldSnapshot;
  thresholds: Thresholds;
  targetWorkflowState?: ShipmentWorkflowState;
}): CoalValidationIssue[] {
  const { fieldsByDoc, thresholds, targetWorkflowState } = input;
  const bl = fieldsByDoc.bill_of_lading;
  const coa = fieldsByDoc.certificate_of_analysis;
  const survey = fieldsByDoc.draft_survey_report;

  const mergedForIssue: FieldSnapshot = {
    ...bl,
    ...survey,
    ...coa,
  };

  const out: CoalValidationIssue[] = [
    ruleVesselMatch(fieldsByDoc),
    rulePortMatch(fieldsByDoc, "port_of_loading", "pol_match", "Port of loading"),
    rulePortMatch(fieldsByDoc, "port_of_discharge", "pod_match", "Port of discharge"),
    ruleCargoDescriptionAlign(bl, survey),
    ruleQuantityBlVsSurvey(bl, survey),
    ruleThresholdMax("ash_percent", "Ash", coa, thresholds.maxAshPercent, "ash_threshold"),
    ruleThresholdMax("sulfur_percent", "Sulfur", coa, thresholds.maxSulfurPercent, "sulfur_threshold"),
    ruleNarMinimum(coa, thresholds.minNarKcalKg),
    ruleDateSequence(coa),
  ];

  if (targetWorkflowState) {
    out.push(ruleMandatoryBeforeIssued(mergedForIssue, targetWorkflowState));
  }

  return out;
}
