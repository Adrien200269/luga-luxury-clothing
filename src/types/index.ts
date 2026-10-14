export type Role = 'CUSTOMER' | 'ADMIN';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN';
  token?: string;
  lastLogin?: string;
}

export type DeliveryZone =
  | 'VALLEY_INSIDE_RING_ROAD'
  | 'VALLEY_OUTSIDE_RING_ROAD'
  | 'OUTSIDE_VALLEY';

export type PaymentMethod = 'COD' | 'ESEWA' | 'KHALTI' | 'FONEPAY';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export type ProductCategory =
  | 'outerwear'
  | 'knitwear'
  | 'shirts'
  | 'trousers'
  | 'accessories';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SiteMediaSlot {
  id: string;
  slotKey: string;
  label: string;
  pageSection: 'HOMEPAGE' | 'BRAND_ASSETS' | 'COLLECTIONS' | 'ABOUT' | 'CATEGORIES';
  imageUrl: string | null;
  altText: string | null;
  aspectRatio: string; // e.g. "16:9", "4:5", "1:1", "21:9"
  resolution: string; // e.g. "1920x1080px", "1200x1500px"
  heading?: string;
  subHeading?: string;
  ctaText?: string;
  ctaLink?: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  volumeNumber: string; // e.g. "VOLUME I", "ARCHIVE 2026"
  description: string;
  coverImageUrl: string | null;
  coverSlotKey?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: GarmentSize;
  stockQuantity: number;
  sku: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  craftStory: string;
  fabricGsm: string;
  priceNpr: number;
  compareAtPriceNpr?: number;
  category: ProductCategory;
  collectionId: string;
  collectionTitle?: string;
  primaryImageUrl: string | null;
  hoverImageUrl: string | null;
  galleryUrls: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isArchived: boolean;
  variants: ProductVariant[];
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  volume: string;
  imageUrl: string | null;
  caption: string;
  featuredProductIds: string[];
  sortOrder: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  size: GarmentSize;
  priceNpr: number;
  quantity: number;
  primaryImageUrl: string | null;
  fabricGsm?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  size: GarmentSize;
  quantity: number;
  priceNpr: number;
  primaryImageUrl: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  deliveryZone: DeliveryZone;
  toleAddress: string;
  landmark?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotalNpr: number;
  shippingNpr: number;
  totalNpr: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface SiteSettings {
  announcementText: string;
  announcementActive: boolean;
  currencyCode: string;
  currencySymbol: string;
  shippingInsideRingRoadNpr: number;
  shippingOutsideRingRoadNpr: number;
  shippingOutsideValleyNpr: number;
  freeShippingThresholdNpr: number;
  whatsappNumber: string;
  instagramHandle: string;
  studioAddress: string;
  fonepayQrImageUrl: string | null;
}
