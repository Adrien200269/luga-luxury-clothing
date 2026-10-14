import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

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
    const { variants, collection, id, createdAt, updatedAt, ...prodData } = body;

    const product = await prisma.product.create({
      data: {
        ...prodData,
        variants: variants
          ? {
              create: variants.map((v: any) => ({
                size: v.size,
                stockQuantity: v.stockQuantity,
                sku: v.sku,
              })),
            }
          : undefined,
      },
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
    const { id, variants, collection, createdAt, updatedAt, ...prodData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product id is required" },
        { status: 400 }
      );
    }

    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      // Delete existing variants and re-create to keep sync clean
      await prisma.productVariant.deleteMany({
        where: { productId: id },
      });
      await prisma.productVariant.createMany({
        data: variants.map((v: any) => ({
          productId: id,
          size: v.size,
          stockQuantity: v.stockQuantity,
          sku: v.sku,
        })),
      });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: prodData,
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

    // Soft delete/archive
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
