import { type NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/api/cors";

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ ok: true, service: "freight-master-program" }, { headers: corsHeaders(request) });
}
