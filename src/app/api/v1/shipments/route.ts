import { type NextRequest, NextResponse } from "next/server";
import { ExceptionStatus } from "@prisma/client";
import { corsHeaders, publicReadApiEnabled } from "@/lib/api/cors";
import { shipmentToListItemDto } from "@/lib/api/shipment-list-dto";
import { prisma } from "@/lib/prisma";

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders(request);
  if (!publicReadApiEnabled()) {
    return NextResponse.json(
      { error: "Public read API is disabled. Set FMP_PUBLIC_READ_API=true or run in development." },
      { status: 403, headers },
    );
  }

  try {
    const [rows, openExceptions, documentsProcessed] = await Promise.all([
      prisma.shipment.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          parties: { include: { organization: true } },
          extractedFields: { include: { document: true } },
          _count: { select: { documents: true, exceptions: true } },
        },
      }),
      prisma.exceptionItem.count({ where: { status: ExceptionStatus.open } }),
      prisma.document.count(),
    ]);

    const shipments = rows.map(shipmentToListItemDto);
    const activeShipments = shipments.filter(
      (s) => !["Archived", "Surrendered"].includes(s.status),
    ).length;

    return NextResponse.json(
      {
        shipments,
        meta: {
          activeShipments,
          openExceptions,
          documentsProcessed,
        },
      },
      { headers },
    );
  } catch (e) {
    console.error("[api/v1/shipments]", e);
    return NextResponse.json(
      { error: "Failed to load shipments. Is DATABASE_URL set and migrations applied?" },
      { status: 500, headers },
    );
  }
}
