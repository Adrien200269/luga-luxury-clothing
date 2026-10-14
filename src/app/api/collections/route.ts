import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: collections });
  } catch (error: any) {
    console.error("API GET /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, ...colData } = body;

    const collection = await prisma.collection.create({
      data: colData,
    });

    return NextResponse.json({ success: true, data: collection }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, ...colData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Collection id is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: colData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API PUT /api/collections error:", error);
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
        { success: false, error: "Collection id is required" },
        { status: 400 }
      );
    }

    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API DELETE /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
