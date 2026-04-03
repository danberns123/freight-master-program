import { describe, expect, it } from "vitest";
import { assertTransitionAllowed, canTransitionWorkflow } from "./workflow";

describe("workflow transitions", () => {
  it("allows draft → reviewed", () => {
    expect(canTransitionWorkflow("draft", "reviewed")).toBe(true);
  });

  it("disallows draft → issued", () => {
    expect(canTransitionWorkflow("draft", "issued")).toBe(false);
  });

  it("allows issued → transferred or surrendered", () => {
    expect(canTransitionWorkflow("issued", "transferred")).toBe(true);
    expect(canTransitionWorkflow("issued", "surrendered")).toBe(true);
  });

  it("throws on invalid transition", () => {
    expect(() => assertTransitionAllowed("draft", "archived")).toThrow(/Invalid workflow transition/);
  });
});
