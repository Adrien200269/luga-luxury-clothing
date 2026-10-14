import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

// Helper to sanitize product data and prevent Prisma unknown field errors
function sanitizeProductData(data: Record<string, any>) {
  const sanitized: Record<string, any> = {};

  if (data.title !== undefined) sanitized.title = String(data.title).trim();
  if (data.slug !== undefined) sanitized.slug = String(data.slug).trim();
  if (data.sku !== undefined) sanitized.sku = String(data.sku).trim();
  if (data.description !== undefined) sanitized.description = String(data.description || "");
  if (data.craftStory !== undefined) sanitized.craftStory = data.craftStory ? String(data.craftStory) : null;
  if (data.fabricGsm !== undefined) sanitized.fabricGsm = data.fabricGsm ? String(data.fabricGsm) : null;
  if (data.priceNpr !== undefined) sanitized.priceNpr = Math.round(Number(data.priceNpr) || 0);
  if (data.compareAtPriceNpr !== undefined) {
    sanitized.compareAtPriceNpr = data.compareAtPriceNpr ? Math.round(Number(data.compareAtPriceNpr)) : null;
  }
  if (data.category !== undefined) sanitized.category = String(data.category).toLowerCase();
  
  // Clean collectionId: empty string must be null to respect foreign key
  if (data.collectionId !== undefined) {
    sanitized.collectionId = data.collectionId && String(data.collectionId).trim() !== "" ? String(data.collectionId).trim() : null;
  }
  
  if (data.primaryImageUrl !== undefined) sanitized.primaryImageUrl = data.primaryImageUrl || null;
  if (data.hoverImageUrl !== undefined) sanitized.hoverImageUrl = data.hoverImageUrl || null;
  if (data.galleryUrls !== undefined && Array.isArray(data.galleryUrls)) {
    sanitized.galleryUrls = data.galleryUrls.filter(Boolean);
  }
  if (data.isFeatured !== undefined) sanitized.isFeatured = Boolean(data.isFeatured);
  if (data.isNewArrival !== undefined) sanitized.isNewArrival = Boolean(data.isNewArrival);
  if (data.isArchived !== undefined) sanitized.isArchived = Boolean(data.isArchived);

  return sanitized;
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      include: { variants: true, collection: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error("API GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sanitizedData = sanitizeProductData(body);
    const sku = sanitizedData.sku || `LUG-${Date.now().toString().slice(-4)}`;

    // Prepare variants
    const variants = Array.isArray(body.variants)
      ? body.variants.map((v: any) => ({
          size: String(v.size || "M"),
          stockQuantity: Math.max(0, Math.round(Number(v.stockQuantity) || 0)),
          sku: v.sku || `${sku}-${v.size || "M"}`,
        }))
      : undefined;

    const product = await prisma.product.create({
      data: {
        ...sanitizedData,
        sku,
        variants: variants ? { create: variants } : undefined,
      } as any,
      include: { variants: true, collection: true },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /api/products error:", error);
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
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    const sanitizedData = sanitizeProductData(body);

    // Update variants if provided
    if (body.variants && Array.isArray(body.variants)) {
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });
      await prisma.productVariant.createMany({
        data: body.variants.map((v: any) => ({
          productId: id,
          size: String(v.size || "M"),
          stockQuantity: Math.max(0, Math.round(Number(v.stockQuantity) || 0)),
          sku: v.sku || `${sanitizedData.sku || "LUG"}-${v.size || "M"}-${Date.now().toString().slice(-4)}`,
        })),
      });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: sanitizedData,
      include: { variants: true, collection: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API PUT /api/products error:", error);
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
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    // Soft delete / archive product in Supabase
    const updated = await prisma.product.update({
      where: { id },
      data: { isArchived: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("API DELETE /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
