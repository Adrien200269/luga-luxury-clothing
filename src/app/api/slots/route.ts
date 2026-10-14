import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    const updated = await prisma.siteMediaSlot.upsert({
      where: { slotKey },
      update: data,
      create: {
        slotKey,
        label: data.label || slotKey,
        pageSection: data.pageSection || "HOMEPAGE",
        ...data,
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
