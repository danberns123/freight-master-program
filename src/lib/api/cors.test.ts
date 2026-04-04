import { afterEach, describe, expect, it } from "vitest";
import { resolveCorsAllowOrigin } from "./cors";

describe("resolveCorsAllowOrigin", () => {
  afterEach(() => {
    delete process.env.CORS_ORIGINS;
    delete process.env.CORS_ALLOW_LOVABLE_PREVIEWS;
  });

  it("returns undefined when Origin is missing", () => {
    expect(resolveCorsAllowOrigin(null)).toBeUndefined();
    expect(resolveCorsAllowOrigin("")).toBeUndefined();
  });

  it("allows localhost defaults when CORS_ORIGINS unset", () => {
    expect(resolveCorsAllowOrigin("http://localhost:8080")).toBe("http://localhost:8080");
    expect(resolveCorsAllowOrigin("http://localhost:5173")).toBe("http://localhost:5173");
    expect(resolveCorsAllowOrigin("https://evil.example")).toBeUndefined();
  });

  it("respects explicit CORS_ORIGINS", () => {
    process.env.CORS_ORIGINS = "https://app.example,http://127.0.0.1:3001";
    expect(resolveCorsAllowOrigin("https://app.example")).toBe("https://app.example");
    expect(resolveCorsAllowOrigin("http://127.0.0.1:3001")).toBe("http://127.0.0.1:3001");
    expect(resolveCorsAllowOrigin("http://localhost:8080")).toBeUndefined();
  });

  it("allows * to echo request origin", () => {
    process.env.CORS_ORIGINS = "*";
    expect(resolveCorsAllowOrigin("https://anything.example")).toBe("https://anything.example");
  });

  it("allows Lovable preview hosts when flag is set", () => {
    process.env.CORS_ALLOW_LOVABLE_PREVIEWS = "true";
    process.env.CORS_ORIGINS = "http://localhost:8080";
    expect(resolveCorsAllowOrigin("https://abc-123--project.lovable.app")).toBe(
      "https://abc-123--project.lovable.app",
    );
    expect(resolveCorsAllowOrigin("https://preview.lovable.dev")).toBe("https://preview.lovable.dev");
    expect(resolveCorsAllowOrigin("https://evil-lovable.app.attacker.com")).toBeUndefined();
  });

  it("does not allow Lovable hosts when flag is off", () => {
    process.env.CORS_ORIGINS = "http://localhost:8080";
    expect(resolveCorsAllowOrigin("https://abc.lovable.app")).toBeUndefined();
  });
});
