import type { NextRequest } from "next/server";

/**
 * CORS for the Vite / Lovable UI calling the Next.js API from another origin.
 * Set CORS_ORIGINS to a comma-separated list, e.g.
 * http://localhost:8080,https://id-preview--*.lovable.app (exact hosts only — use full preview URL from Lovable).
 */
export function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get("origin") ?? "";
  const allowed =
    process.env.CORS_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? ["http://localhost:8080", "http://localhost:5173"];

  const allowOrigin =
    origin && allowed.includes(origin) ? origin : allowed.includes("*") ? "*" : allowed[0] ?? "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function publicReadApiEnabled(): boolean {
  if (process.env.FMP_PUBLIC_READ_API === "false") return false;
  if (process.env.FMP_PUBLIC_READ_API === "true") return true;
  return process.env.NODE_ENV === "development";
}
