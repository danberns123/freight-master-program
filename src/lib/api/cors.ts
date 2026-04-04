import type { NextRequest } from "next/server";

/**
 * CORS for a separate UI (Vite, Lovable preview, etc.) calling this Next.js API.
 *
 * - `CORS_ORIGINS`: comma-separated exact origins, e.g. `http://localhost:8080,https://abc.lovable.app`
 * - `CORS_ALLOW_LOVABLE_PREVIEWS=true`: also allow browser `Origin` values whose host is on
 *   `lovable.app` / `lovable.dev` (any subdomain). Preview URLs change; this avoids editing .env each time.
 */
const LOVABLE_HOST_RULES: readonly string[] = [".lovable.app", ".lovable.dev"];

function hostnameIsLovablePreview(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "lovable.app" || h === "lovable.dev") return true;
  return LOVABLE_HOST_RULES.some((suffix) => h.endsWith(suffix));
}

function parseOriginUrl(origin: string): URL | null {
  try {
    return new URL(origin);
  } catch {
    return null;
  }
}

/** Exported for tests. */
export function resolveCorsAllowOrigin(originHeader: string | null): string | undefined {
  const raw = originHeader?.trim();
  if (!raw) return undefined;

  const parsed = parseOriginUrl(raw);
  if (!parsed || (parsed.protocol !== "http:" && parsed.protocol !== "https:")) {
    return undefined;
  }

  const explicit =
    process.env.CORS_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? ["http://localhost:8080", "http://localhost:5173"];

  if (explicit.includes("*")) return raw;
  if (explicit.includes(raw)) return raw;

  if (process.env.CORS_ALLOW_LOVABLE_PREVIEWS === "true") {
    if (hostnameIsLovablePreview(parsed.hostname)) return raw;
  }

  return undefined;
}

export function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get("origin");
  const allowOrigin = resolveCorsAllowOrigin(origin);

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };

  if (allowOrigin) {
    headers["Access-Control-Allow-Origin"] = allowOrigin;
    headers.Vary = "Origin";
  }

  return headers;
}

export function publicReadApiEnabled(): boolean {
  if (process.env.FMP_PUBLIC_READ_API === "false") return false;
  if (process.env.FMP_PUBLIC_READ_API === "true") return true;
  return process.env.NODE_ENV === "development";
}
