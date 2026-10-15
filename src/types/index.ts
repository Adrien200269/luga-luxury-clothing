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
  heading?: string | null;
  subHeading?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
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
  collectionId?: string;
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

export interface AboutPillar {
  badge: string;
  title: string;
  description: string;
}

export interface AboutPageData {
  manifestoTag: string;
  manifestoHeading: string;
  manifestoSubHeading: string;

  narrativeTag: string;
  narrativeHeading: string;
  narrativeParagraph1: string;
  narrativeParagraph2: string;
  narrativeParagraph3: string;

  pillarsTag: string;
  pillarsHeading: string;
  pillar1Badge: string;
  pillar1Title: string;
  pillar1Description: string;
  pillar2Badge: string;
  pillar2Title: string;
  pillar2Description: string;
  pillar3Badge: string;
  pillar3Title: string;
  pillar3Description: string;

  salonHeading: string;
  salonDescription: string;
  salonCtaText: string;
  salonCtaLink: string;
}

export interface HomePageData {
  heroTag: string;
  heroHeading: string;
  heroDescription: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroStamp1: string;
  heroStamp2: string;
  heroStamp3: string;

  featuredTag: string;
  featuredHeading: string;
  featuredViewAllText: string;

  splitLeftTag: string;
  splitLeftHeading: string;
  splitLeftDescription: string;
  splitLeftCtaText: string;
  splitLeftCtaLink: string;

  splitRightTag: string;
  splitRightHeading: string;
  splitRightDescription: string;
  splitRightCtaText: string;
  splitRightCtaLink: string;

  volumesTag: string;
  volumesHeading: string;
  volumesDescription: string;

  lookbookTag: string;
  lookbookHeading: string;
  lookbookHighlightTag: string;
  lookbookHighlightTitle: string;
  lookbookHighlightSubtitle: string;
  lookbookBrowseCtaText: string;

  storyTag: string;
  storyHeading: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyCtaText: string;
  storyCtaLink: string;
}

export interface ShopPageData {
  shopTag: string;
  shopHeading: string;
  shopDescription: string;

  outerwearHeading: string;
  outerwearDescription: string;

  knitwearHeading: string;
  knitwearDescription: string;

  shirtsHeading: string;
  shirtsDescription: string;

  trousersHeading: string;
  trousersDescription: string;
}

export interface LookbookPageData {
  lookbookTag: string;
  lookbookHeading: string;
  lookbookDescription: string;

  highlightTag: string;
  highlightHeading: string;
  highlightDescription: string;
}

export interface FooterPageData {
  enclaveTag: string;
  enclaveHeading: string;
  enclaveDescription: string;
  brandDescription: string;
  craftQuarterLocation: string;
  copyrightText: string;
}

