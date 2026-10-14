import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

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
    const { id, updatedAt, ...updates } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: updates,
      create: {
        id: "singleton",
        ...updates,
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
