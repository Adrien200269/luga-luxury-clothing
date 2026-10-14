import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

function sanitizeSettingsData(data: Record<string, any>) {
  const sanitized: Record<string, any> = {};

  if (data.announcementText !== undefined) sanitized.announcementText = String(data.announcementText);
  if (data.announcementActive !== undefined) sanitized.announcementActive = Boolean(data.announcementActive);
  if (data.currencyCode !== undefined) sanitized.currencyCode = String(data.currencyCode);
  if (data.currencySymbol !== undefined) sanitized.currencySymbol = String(data.currencySymbol);
  
  if (data.shippingInsideRingRoadNpr !== undefined) {
    sanitized.shippingInsideRingRoadNpr = Math.round(Number(data.shippingInsideRingRoadNpr) || 100);
  }
  if (data.shippingOutsideRingRoadNpr !== undefined) {
    sanitized.shippingOutsideRingRoadNpr = Math.round(Number(data.shippingOutsideRingRoadNpr) || 150);
  }
  if (data.shippingOutsideValleyNpr !== undefined) {
    sanitized.shippingOutsideValleyNpr = Math.round(Number(data.shippingOutsideValleyNpr) || 250);
  }
  if (data.freeShippingThresholdNpr !== undefined) {
    sanitized.freeShippingThresholdNpr = Math.round(Number(data.freeShippingThresholdNpr) || 10000);
  }
  
  if (data.whatsappNumber !== undefined) sanitized.whatsappNumber = String(data.whatsappNumber);
  if (data.instagramHandle !== undefined) sanitized.instagramHandle = String(data.instagramHandle);
  if (data.studioAddress !== undefined) sanitized.studioAddress = String(data.studioAddress);
  if (data.fonepayQrImageUrl !== undefined) sanitized.fonepayQrImageUrl = data.fonepayQrImageUrl || null;

  return sanitized;
}

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst({
      where: { id: "singleton" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("API GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const sanitizedData = sanitizeSettingsData(body);

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: sanitizedData,
      create: {
        id: "singleton",
        ...sanitizedData,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("API PUT /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
