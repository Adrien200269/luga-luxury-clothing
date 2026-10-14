import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("API GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, ...orderData } = body;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = orderData.orderNumber || `LUG-2026-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        items: items
          ? {
              create: items.map((i: any) => ({
                productId: i.productId,
                productTitle: i.productTitle,
                size: i.size,
                quantity: i.quantity,
                priceNpr: i.priceNpr,
                primaryImageUrl: i.primaryImageUrl,
              })),
            }
          : undefined,
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error("API POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
