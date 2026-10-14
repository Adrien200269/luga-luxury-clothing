-- LUGA (लुगा) // Initial Database Schema for Supabase PostgreSQL
-- Project Ref: xhofrsxrlchdrbtiuzim

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
  CREATE TYPE role_type AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_zone_type AS ENUM ('VALLEY_INSIDE_RING_ROAD', 'VALLEY_OUTSIDE_RING_ROAD', 'OUTSIDE_VALLEY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('COD', 'ESEWA', 'KHALTI', 'FONEPAY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_type AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role role_type DEFAULT 'CUSTOMER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Site Media Slots Table (Admin visual control center)
CREATE TABLE IF NOT EXISTS site_media_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slot_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  page_section TEXT NOT NULL,
  image_url TEXT,
  alt_text TEXT,
  aspect_ratio TEXT DEFAULT '4:5',
  resolution TEXT DEFAULT '1200x1500px',
  heading TEXT,
  sub_heading TEXT,
  cta_text TEXT,
  cta_link TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  volume_number TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  craft_story TEXT,
  fabric_gsm TEXT,
  price_npr INTEGER NOT NULL,
  compare_at_price_npr INTEGER,
  category TEXT NOT NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  primary_image_url TEXT,
  hover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  sku TEXT UNIQUE NOT NULL
);

-- 6. Lookbook Items Table
CREATE TABLE IF NOT EXISTS lookbook_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  volume TEXT NOT NULL,
  image_url TEXT,
  caption TEXT,
  featured_product_ids TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT DEFAULT 'Kathmandu',
  delivery_zone delivery_zone_type NOT NULL,
  tole_address TEXT NOT NULL,
  landmark TEXT,
  payment_method payment_method_type NOT NULL,
  payment_status payment_status_type DEFAULT 'PENDING',
  order_status order_status_type DEFAULT 'PENDING',
  subtotal_npr INTEGER NOT NULL,
  shipping_npr INTEGER NOT NULL,
  total_npr INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price_npr INTEGER NOT NULL,
  primary_image_url TEXT
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  announcement_text TEXT DEFAULT 'VOLUME I: KATHMANDU ARCHIVE LIVE NOW — COMPLIMENTARY DELIVERY INSIDE RING ROAD ON ORDERS ABOVE NPR 10,000',
  announcement_active BOOLEAN DEFAULT TRUE,
  currency_code TEXT DEFAULT 'NPR',
  currency_symbol TEXT DEFAULT 'रू',
  shipping_inside_ring_road_npr INTEGER DEFAULT 100,
  shipping_outside_ring_road_npr INTEGER DEFAULT 150,
  shipping_outside_valley_npr INTEGER DEFAULT 250,
  free_shipping_threshold_npr INTEGER DEFAULT 10000,
  whatsapp_number TEXT DEFAULT '+977 9801234567',
  instagram_handle TEXT DEFAULT '@luga.studio',
  studio_address TEXT DEFAULT 'Patan Durbar Craft Quarter, Lalitpur, Kathmandu Valley, Nepal',
  fonepay_qr_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
