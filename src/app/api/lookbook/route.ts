import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

export async function GET() {
  try {
    const items = await prisma.lookbookItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error("API GET /api/lookbook error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, createdAt, ...itemData } = body;

    const item = await prisma.lookbookItem.create({
      data: itemData,
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /api/lookbook error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, createdAt, ...itemData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lookbook item id is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.lookbookItem.update({
      where: { id },
      data: itemData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API PUT /api/lookbook error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lookbook item id is required" },
        { status: 400 }
      );
    }

    await prisma.lookbookItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API DELETE /api/lookbook error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
