import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

function sanitizeCollectionData(data: Record<string, any>) {
  const sanitized: Record<string, any> = {};

  if (data.title !== undefined) sanitized.title = String(data.title).trim();
  if (data.slug !== undefined) sanitized.slug = String(data.slug).trim();
  if (data.volumeNumber !== undefined) sanitized.volumeNumber = String(data.volumeNumber).trim();
  if (data.description !== undefined) sanitized.description = data.description ? String(data.description) : null;
  if (data.coverImageUrl !== undefined) sanitized.coverImageUrl = data.coverImageUrl || null;
  if (data.isActive !== undefined) sanitized.isActive = Boolean(data.isActive);

  return sanitized;
}

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
    const sanitizedData = sanitizeCollectionData(body);

    if (!sanitizedData.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!sanitizedData.slug) {
      sanitizedData.slug = sanitizedData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    if (!sanitizedData.volumeNumber) {
      sanitizedData.volumeNumber = "VOLUME I";
    }

    const collection = await prisma.collection.create({
      data: sanitizedData as any,
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
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Collection id is required" },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeCollectionData(body);

    const updated = await prisma.collection.update({
      where: { id },
      data: sanitizedData,
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

    // Unlink products assigned to this collection first to prevent foreign key errors
    await prisma.product.updateMany({
      where: { collectionId: id },
      data: { collectionId: null },
    });

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
