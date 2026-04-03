import {
  ApprovalDecision,
  DocumentType,
  ExtractionFieldStatus,
  ExtractionMethod,
  FieldKey,
  ParserStatus,
  PrismaClient,
  ShipmentPartyKind,
  ShipmentWorkflowState,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("changeme", 10);

  await prisma.validationRule.createMany({
    data: [
      {
        code: "vessel_match",
        name: "Vessel name alignment",
        description: "Vessel must match across documents where present.",
        config: {},
      },
      {
        code: "pol_match",
        name: "Port of loading alignment",
        description: "POL must match across documents.",
        config: {},
      },
      {
        code: "pod_match",
        name: "Port of discharge alignment",
        description: "POD must match across documents.",
        config: {},
      },
      {
        code: "qty_bl_survey",
        name: "BL vs draft survey quantity",
        description: "Bill of lading quantity compared to draft survey MT.",
        config: { toleranceMt: 0.01 },
      },
      {
        code: "ash_threshold",
        name: "Ash maximum",
        description: "COA ash percent vs contract maximum.",
        config: { maxPercent: 16 },
      },
      {
        code: "sulfur_threshold",
        name: "Sulfur maximum",
        description: "COA sulfur percent vs contract maximum.",
        config: { maxPercent: 1 },
      },
      {
        code: "nar_min",
        name: "NAR minimum",
        description: "Net AR kcal/kg minimum.",
        config: { minKcalKg: 5800 },
      },
      {
        code: "date_sequence",
        name: "COA date sequence",
        description: "Sampling ≤ analysis ≤ issue.",
        config: {},
      },
      {
        code: "mandatory_issue",
        name: "Mandatory fields before issue",
        description: "Core fields must be populated before issued state.",
        config: {},
      },
    ],
    skipDuplicates: true,
  });

  const orgs = {
    shipper: await prisma.organization.upsert({
      where: { slug: "rb-coal-shipper" },
      create: { name: "RB Coal Shipper (Pty) Ltd", slug: "rb-coal-shipper" },
      update: {},
    }),
    forwarder: await prisma.organization.upsert({
      where: { slug: "pilot-forwarder" },
      create: { name: "Pilot Freight Forwarders", slug: "pilot-forwarder" },
      update: {},
    }),
    carrier: await prisma.organization.upsert({
      where: { slug: "pilot-ocean-carrier" },
      create: { name: "Pilot Ocean Carrier", slug: "pilot-ocean-carrier" },
      update: {},
    }),
    consignee: await prisma.organization.upsert({
      where: { slug: "india-power-consignee" },
      create: { name: "India Power Imports Ltd", slug: "india-power-consignee" },
      update: {},
    }),
    admin: await prisma.organization.upsert({
      where: { slug: "platform-admin" },
      create: { name: "Platform Administration", slug: "platform-admin" },
      update: {},
    }),
  };

  const users = {
    shipper: await prisma.user.upsert({
      where: { email: "shipper@pilot.local" },
      create: {
        email: "shipper@pilot.local",
        name: "Shipper User",
        passwordHash,
        role: UserRole.shipper,
        organizationId: orgs.shipper.id,
      },
      update: { passwordHash, role: UserRole.shipper, organizationId: orgs.shipper.id },
    }),
    forwarder: await prisma.user.upsert({
      where: { email: "forwarder@pilot.local" },
      create: {
        email: "forwarder@pilot.local",
        name: "Forwarder User",
        passwordHash,
        role: UserRole.freight_forwarder,
        organizationId: orgs.forwarder.id,
      },
      update: {
        passwordHash,
        role: UserRole.freight_forwarder,
        organizationId: orgs.forwarder.id,
      },
    }),
    admin: await prisma.user.upsert({
      where: { email: "admin@pilot.local" },
      create: {
        email: "admin@pilot.local",
        name: "Admin User",
        passwordHash,
        role: UserRole.admin,
        organizationId: orgs.admin.id,
      },
      update: { passwordHash, role: UserRole.admin, organizationId: orgs.admin.id },
    }),
  };

  async function seedShipment(args: {
    referenceCode: string;
    workflowState: ShipmentWorkflowState;
    vesselBl: string;
    vesselSurvey: string;
    polBl: string;
    polSurvey: string;
    podBl: string;
    podSurvey: string;
    cargoBl: string;
    cargoSurvey: string;
    qtyBl: string;
    qtySurvey: string;
    coaDates: { sampling: string; analysis: string; issue: string };
    coaQuality: { ash: string; sulfur: string; nar: string };
  }) {
    const shipment = await prisma.shipment.upsert({
      where: { referenceCode: args.referenceCode },
      create: {
        referenceCode: args.referenceCode,
        workflowState: args.workflowState,
        ownerOrganizationId: orgs.forwarder.id,
        currentControlOrganizationId: orgs.shipper.id,
      },
      update: {
        workflowState: args.workflowState,
        ownerOrganizationId: orgs.forwarder.id,
        currentControlOrganizationId: orgs.shipper.id,
      },
    });

    const partySpecs: { kind: ShipmentPartyKind; orgId: string }[] = [
      { kind: ShipmentPartyKind.shipper, orgId: orgs.shipper.id },
      { kind: ShipmentPartyKind.freight_forwarder, orgId: orgs.forwarder.id },
      { kind: ShipmentPartyKind.carrier, orgId: orgs.carrier.id },
      { kind: ShipmentPartyKind.consignee, orgId: orgs.consignee.id },
    ];
    for (const p of partySpecs) {
      await prisma.shipmentParty.upsert({
        where: {
          shipmentId_organizationId_kind: {
            shipmentId: shipment.id,
            organizationId: p.orgId,
            kind: p.kind,
          },
        },
        create: {
          shipmentId: shipment.id,
          organizationId: p.orgId,
          kind: p.kind,
        },
        update: {},
      });
    }

    const bl = await prisma.document.upsert({
      where: { id: `${shipment.id}-bl` },
      create: {
        id: `${shipment.id}-bl`,
        shipmentId: shipment.id,
        type: DocumentType.bill_of_lading,
        fileName: `${args.referenceCode}-BL.pdf`,
        fileHash: `sha256:${args.referenceCode}-bl`,
        uploadedByUserId: users.forwarder.id,
        sourceOrganizationId: orgs.carrier.id,
        parserStatus: ParserStatus.completed,
        parserOutput: { source: "seed", doc: "bl" },
      },
      update: {
        parserStatus: ParserStatus.completed,
        parserOutput: { source: "seed", doc: "bl" },
      },
    });

    const coa = await prisma.document.upsert({
      where: { id: `${shipment.id}-coa` },
      create: {
        id: `${shipment.id}-coa`,
        shipmentId: shipment.id,
        type: DocumentType.certificate_of_analysis,
        fileName: `${args.referenceCode}-SGS-COA.pdf`,
        fileHash: `sha256:${args.referenceCode}-coa`,
        uploadedByUserId: users.forwarder.id,
        sourceOrganizationId: orgs.forwarder.id,
        parserStatus: ParserStatus.completed,
        parserOutput: { source: "seed", doc: "coa" },
      },
      update: {
        parserStatus: ParserStatus.completed,
        parserOutput: { source: "seed", doc: "coa" },
      },
    });

    const survey = await prisma.document.upsert({
      where: { id: `${shipment.id}-survey` },
      create: {
        id: `${shipment.id}-survey`,
        shipmentId: shipment.id,
        type: DocumentType.draft_survey_report,
        fileName: `${args.referenceCode}-draft-survey.pdf`,
        fileHash: `sha256:${args.referenceCode}-survey`,
        uploadedByUserId: users.forwarder.id,
        sourceOrganizationId: orgs.forwarder.id,
        parserStatus: ParserStatus.completed,
        parserOutput: { source: "seed", doc: "survey" },
      },
      update: {
        parserStatus: ParserStatus.completed,
        parserOutput: { source: "seed", doc: "survey" },
      },
    });

    async function upsertField(
      documentId: string,
      fieldKey: FieldKey,
      value: string,
      status: ExtractionFieldStatus = ExtractionFieldStatus.approved,
    ) {
      const existing = await prisma.extractedField.findFirst({
        where: { documentId, fieldKey },
      });
      if (existing) {
        await prisma.extractedField.update({
          where: { id: existing.id },
          data: {
            extractedValue: value,
            normalizedValue: value,
            status,
            extractionMethod: ExtractionMethod.ai_parser,
            confidence: 0.95,
          },
        });
        return;
      }
      await prisma.extractedField.create({
        data: {
          documentId,
          shipmentId: shipment.id,
          fieldKey,
          extractedValue: value,
          normalizedValue: value,
          status,
          extractionMethod: ExtractionMethod.ai_parser,
          confidence: 0.95,
        },
      });
    }

    await upsertField(bl.id, FieldKey.vessel_name, args.vesselBl);
    await upsertField(bl.id, FieldKey.port_of_loading, args.polBl);
    await upsertField(bl.id, FieldKey.port_of_discharge, args.podBl);
    await upsertField(bl.id, FieldKey.cargo_description, args.cargoBl);
    await upsertField(bl.id, FieldKey.bill_of_lading_quantity_mt, args.qtyBl);

    await upsertField(survey.id, FieldKey.vessel_name, args.vesselSurvey);
    await upsertField(survey.id, FieldKey.port_of_loading, args.polSurvey);
    await upsertField(survey.id, FieldKey.port_of_discharge, args.podSurvey);
    await upsertField(survey.id, FieldKey.cargo_description, args.cargoSurvey);
    await upsertField(survey.id, FieldKey.draft_survey_quantity_mt, args.qtySurvey);

    await upsertField(coa.id, FieldKey.vessel_name, args.vesselBl);
    await upsertField(coa.id, FieldKey.sampling_date, args.coaDates.sampling);
    await upsertField(coa.id, FieldKey.analysis_date, args.coaDates.analysis);
    await upsertField(coa.id, FieldKey.issue_date, args.coaDates.issue);
    await upsertField(coa.id, FieldKey.ash_percent, args.coaQuality.ash);
    await upsertField(coa.id, FieldKey.sulfur_percent, args.coaQuality.sulfur);
    await upsertField(coa.id, FieldKey.nar_kcal_kg, args.coaQuality.nar);

    await prisma.workflowEvent.deleteMany({ where: { shipmentId: shipment.id } });
    await prisma.workflowEvent.create({
      data: {
        shipmentId: shipment.id,
        fromState: null,
        toState: ShipmentWorkflowState.draft,
        actorUserId: users.forwarder.id,
        metadata: { note: "seed create" },
      },
    });

    return shipment;
  }

  await seedShipment({
    referenceCode: "FMP-RB-IND-001",
    workflowState: ShipmentWorkflowState.reviewed,
    vesselBl: "MV Coal Trader",
    vesselSurvey: "MV Coal Trader",
    polBl: "Richards Bay",
    polSurvey: "Richards Bay",
    podBl: "Mumbai (Nhava Sheva)",
    podSurvey: "Mumbai (Nhava Sheva)",
    cargoBl: "South African steam coal in bulk",
    cargoSurvey: "South African steam coal in bulk — draft survey",
    qtyBl: "75000",
    qtySurvey: "75000",
    coaDates: { sampling: "2026-01-10", analysis: "2026-01-12", issue: "2026-01-14" },
    coaQuality: { ash: "14.0", sulfur: "0.65", nar: "6000" },
  });

  await seedShipment({
    referenceCode: "FMP-MISMATCH-001",
    workflowState: ShipmentWorkflowState.draft,
    vesselBl: "MV Alpha",
    vesselSurvey: "MV Beta",
    polBl: "Richards Bay",
    polSurvey: "Durban",
    podBl: "Mumbai",
    podSurvey: "Chennai",
    cargoBl: "Steam coal",
    cargoSurvey: "Metallurgical coke",
    qtyBl: "75000",
    qtySurvey: "70000",
    coaDates: { sampling: "2026-01-20", analysis: "2026-01-10", issue: "2026-01-05" },
    coaQuality: { ash: "20", sulfur: "2.0", nar: "4000" },
  });

  const pilotShipment = await prisma.shipment.findUniqueOrThrow({
    where: { referenceCode: "FMP-RB-IND-001" },
  });
  const existingApproval = await prisma.approval.findFirst({
    where: {
      shipmentId: pilotShipment.id,
      subjectType: "shipment",
      subjectId: pilotShipment.id,
    },
  });
  if (!existingApproval) {
    await prisma.approval.create({
      data: {
        shipmentId: pilotShipment.id,
        subjectType: "shipment",
        subjectId: pilotShipment.id,
        decision: ApprovalDecision.approved,
        decidedById: users.forwarder.id,
        decidedAt: new Date(),
        comments: "Pilot seed — smart-field review simulated",
      },
    });
  }

  console.log("Seed complete. Demo logins (password: changeme):");
  console.log("  shipper@pilot.local, forwarder@pilot.local, admin@pilot.local");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
