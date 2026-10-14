import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

export async function GET() {
  try {
    const slots = await prisma.siteMediaSlot.findMany();
    const map: Record<string, any> = {};
    slots.forEach((s) => {
      map[s.slotKey] = s;
    });
    return NextResponse.json({ success: true, data: map });
  } catch (error: any) {
    console.error("API GET /api/slots error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { slotKey, ...data } = body;

    if (!slotKey) {
      return NextResponse.json(
        { success: false, error: "slotKey is required" },
        { status: 400 }
      );
    }

    // Clean data so non-model fields or undefined fields don't cause prisma errors
    const allowedFields = [
      "label",
      "pageSection",
      "imageUrl",
      "altText",
      "aspectRatio",
      "resolution",
      "heading",
      "subHeading",
      "ctaText",
      "ctaLink",
    ];
    const updateData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    const updated = await prisma.siteMediaSlot.upsert({
      where: { slotKey },
      update: updateData,
      create: {
        slotKey,
        label: data.label || slotKey,
        pageSection: data.pageSection || "HOMEPAGE",
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API PUT /api/slots error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
