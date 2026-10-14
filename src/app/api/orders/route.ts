import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

const VALID_DELIVERY_ZONES = [
  "VALLEY_INSIDE_RING_ROAD",
  "VALLEY_OUTSIDE_RING_ROAD",
  "OUTSIDE_VALLEY",
];

const VALID_PAYMENT_METHODS = ["COD", "ESEWA", "KHALTI", "FONEPAY"];
const VALID_PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const VALID_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
];

function normalizeEnum(val: string | undefined, validList: string[], defaultVal: string) {
  if (!val) return defaultVal;
  const upper = String(val).toUpperCase();
  return validList.includes(upper) ? upper : defaultVal;
}

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
    const { items, ...rawOrder } = body;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = rawOrder.orderNumber || `LUG-2026-${randomSuffix}`;

    const deliveryZone = normalizeEnum(
      rawOrder.deliveryZone,
      VALID_DELIVERY_ZONES,
      "VALLEY_INSIDE_RING_ROAD"
    );
    const paymentMethod = normalizeEnum(
      rawOrder.paymentMethod,
      VALID_PAYMENT_METHODS,
      "COD"
    );
    const paymentStatus = normalizeEnum(
      rawOrder.paymentStatus,
      VALID_PAYMENT_STATUSES,
      "PENDING"
    );
    const orderStatus = normalizeEnum(
      rawOrder.orderStatus,
      VALID_ORDER_STATUSES,
      "PENDING"
    );

    const subtotalNpr = Math.round(Number(rawOrder.subtotalNpr) || 0);
    const shippingNpr = Math.round(Number(rawOrder.shippingNpr) || 0);
    const totalNpr = Math.round(Number(rawOrder.totalNpr) || subtotalNpr + shippingNpr);

    const orderData: any = {
      orderNumber,
      customerName: String(rawOrder.customerName || "Customer").trim(),
      phone: String(rawOrder.phone || "").trim(),
      email: String(rawOrder.email || "").trim(),
      city: String(rawOrder.city || "Kathmandu").trim(),
      deliveryZone,
      toleAddress: String(rawOrder.toleAddress || "").trim(),
      landmark: rawOrder.landmark ? String(rawOrder.landmark).trim() : null,
      paymentMethod,
      paymentStatus,
      orderStatus,
      subtotalNpr,
      shippingNpr,
      totalNpr,
      notes: rawOrder.notes ? String(rawOrder.notes).trim() : null,
    };

    if (items && Array.isArray(items) && items.length > 0) {
      orderData.items = {
        create: items.map((i: any) => ({
          productId: i.productId || null,
          productTitle: String(i.productTitle || i.title || "Garment"),
          size: String(i.size || "M"),
          quantity: Math.max(1, Math.round(Number(i.quantity) || 1)),
          priceNpr: Math.round(Number(i.priceNpr) || 0),
          primaryImageUrl: i.primaryImageUrl || null,
        })),
      };
    }

    const order = await prisma.order.create({
      data: orderData,
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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, orderStatus, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order id is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (orderStatus) {
      updateData.orderStatus = normalizeEnum(
        orderStatus,
        VALID_ORDER_STATUSES,
        "PENDING"
      );
    }
    if (paymentStatus) {
      updateData.paymentStatus = normalizeEnum(
        paymentStatus,
        VALID_PAYMENT_STATUSES,
        "PENDING"
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("API PATCH /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
