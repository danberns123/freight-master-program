import { describe, expect, it } from "vitest";
import {
  runCoalPilotValidations,
  ruleVesselMatch,
} from "./coal-validation";

describe("coal validation rules", () => {
  it("flags vessel mismatch across documents", () => {
    const r = ruleVesselMatch({
      bill_of_lading: { vessel_name: "MV Alpha" },
      certificate_of_analysis: { vessel_name: "MV Beta" },
    });
    expect(r.passed).toBe(false);
    expect(r.code).toBe("vessel_match");
  });

  it("passes aligned pilot shipment fixtures", () => {
    const fieldsByDoc = {
      bill_of_lading: {
        vessel_name: "MV Coal Trader",
        port_of_loading: "Richards Bay",
        port_of_discharge: "Mumbai",
        cargo_description: "Steam coal in bulk",
        bill_of_lading_quantity_mt: "75000",
      },
      draft_survey_report: {
        vessel_name: "MV Coal Trader",
        port_of_loading: "Richards Bay",
        port_of_discharge: "Mumbai",
        cargo_description: "Steam coal in bulk — draft survey",
        draft_survey_quantity_mt: "75000",
      },
      certificate_of_analysis: {
        vessel_name: "MV Coal Trader",
        sampling_date: "2026-01-10",
        analysis_date: "2026-01-12",
        issue_date: "2026-01-14",
        ash_percent: "14",
        sulfur_percent: "0.65",
        nar_kcal_kg: "6000",
      },
    } as const;

    const results = runCoalPilotValidations({
      fieldsByDoc,
      mergedQualityFields: {},
      thresholds: { maxAshPercent: 16, maxSulfurPercent: 1, minNarKcalKg: 5800 },
      targetWorkflowState: "issued",
    });

    expect(results.every((x) => x.passed)).toBe(true);
  });

  it("surfaces mismatched fixture problems", () => {
    const fieldsByDoc = {
      bill_of_lading: {
        vessel_name: "MV Alpha",
        port_of_loading: "Richards Bay",
        port_of_discharge: "Mumbai",
        cargo_description: "Steam coal",
        bill_of_lading_quantity_mt: "75000",
      },
      draft_survey_report: {
        vessel_name: "MV Beta",
        port_of_loading: "Durban",
        port_of_discharge: "Chennai",
        cargo_description: "Metallurgical coke",
        draft_survey_quantity_mt: "70000",
      },
      certificate_of_analysis: {
        sampling_date: "2026-01-20",
        analysis_date: "2026-01-10",
        issue_date: "2026-01-05",
        ash_percent: "20",
        sulfur_percent: "2",
        nar_kcal_kg: "4000",
      },
    } as const;

    const results = runCoalPilotValidations({
      fieldsByDoc,
      mergedQualityFields: {},
      thresholds: { maxAshPercent: 16, maxSulfurPercent: 1, minNarKcalKg: 5800 },
      targetWorkflowState: "issued",
    });

    const failed = results.filter((x) => !x.passed);
    expect(failed.length).toBeGreaterThan(3);
  });
});
