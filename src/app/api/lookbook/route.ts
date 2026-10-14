import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

function sanitizeLookbookData(data: Record<string, any>) {
  const sanitized: Record<string, any> = {};

  if (data.title !== undefined) sanitized.title = String(data.title).trim();
  if (data.volume !== undefined) sanitized.volume = String(data.volume).trim();
  if (data.imageUrl !== undefined) sanitized.imageUrl = data.imageUrl || null;
  if (data.caption !== undefined) sanitized.caption = data.caption ? String(data.caption) : null;
  if (data.featuredProductIds !== undefined && Array.isArray(data.featuredProductIds)) {
    sanitized.featuredProductIds = data.featuredProductIds.filter(Boolean);
  }
  if (data.sortOrder !== undefined) {
    sanitized.sortOrder = Math.round(Number(data.sortOrder) || 0);
  }

  return sanitized;
}

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
    const sanitizedData = sanitizeLookbookData(body);

    if (!sanitizedData.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!sanitizedData.volume) {
      sanitizedData.volume = "VOLUME I: PATAN ARCHIVE";
    }

    const item = await prisma.lookbookItem.create({
      data: sanitizedData as any,
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
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lookbook item id is required" },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeLookbookData(body);

    const updated = await prisma.lookbookItem.update({
      where: { id },
      data: sanitizedData,
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
