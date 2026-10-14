/**
 * LUGA // Database & Backend Access Service
 * Fully connected to live Supabase PostgreSQL database via Prisma ORM.
 */

import { PrismaClient } from "@prisma/client";
import { Product, SiteMediaSlot, Order } from "@/types";

// Global single instance for development to prevent exhausting pooler connections
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const dbService = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const prods = await prisma.product.findMany({
        where: { isArchived: false },
        include: { variants: true, collection: true },
        orderBy: { createdAt: "desc" },
      });
      return prods as unknown as Product[];
    } catch (e) {
      console.error("Prisma getProducts error:", e);
      return [];
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const prod = await prisma.product.findUnique({
        where: { slug },
        include: { variants: true, collection: true },
      });
      return prod as unknown as Product;
    } catch (e) {
      console.error("Prisma getProductBySlug error:", e);
      return null;
    }
  },

  // Media Slots
  async getSiteMediaSlots(): Promise<Record<string, SiteMediaSlot>> {
    try {
      const slots = await prisma.siteMediaSlot.findMany();
      const map: Record<string, SiteMediaSlot> = {};
      slots.forEach((s) => {
        map[s.slotKey] = s as unknown as SiteMediaSlot;
      });
      return map;
    } catch (e) {
      console.error("Prisma getSiteMediaSlots error:", e);
      return {};
    }
  },

  async updateSiteMediaSlot(slotKey: string, data: Partial<SiteMediaSlot>) {
    try {
      return await prisma.siteMediaSlot.upsert({
        where: { slotKey },
        update: data,
        create: {
          slotKey,
          label: data.label || slotKey,
          pageSection: data.pageSection || "HOMEPAGE",
          ...data,
        } as any,
      });
    } catch (e) {
      console.error("Prisma updateSiteMediaSlot error:", e);
      return null;
    }
  },

  // Orders
  async createOrder(orderData: any): Promise<Order | null> {
    try {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = orderData.orderNumber || `LUG-2026-${randomSuffix}`;

      const order = await prisma.order.create({
        data: {
          ...orderData,
          orderNumber,
          items: orderData.items
            ? {
                create: orderData.items,
              }
            : undefined,
        },
        include: { items: true },
      });
      return order as unknown as Order;
    } catch (e) {
      console.error("Prisma createOrder error:", e);
      return null;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return orders as unknown as Order[];
    } catch (e) {
      console.error("Prisma getOrders error:", e);
      return [];
    }
  },
};
