"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { ProductCard } from "@/components/storefront/ProductCard";
import { useStore } from "@/lib/store-context";
import { formatNpr } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Compass, Sparkles } from "lucide-react";

export default function HomePage() {
  const { products, collections, lookbookItems, getMediaSlot, addToCart } = useStore();
  const [activeLookbookIdx, setActiveLookbookIdx] = useState(0);

  const heroMainSlot = getMediaSlot("HERO_MAIN_BANNER");
  const splitLeftSlot = getMediaSlot("SPLIT_BANNER_LEFT");
  const splitRightSlot = getMediaSlot("SPLIT_BANNER_RIGHT");
  const heritageSlot = getMediaSlot("HERITAGE_STORY_BANNER");

  const featuredProducts = products.filter((p) => p.isFeatured || p.isNewArrival).slice(0, 8);
  const activeLook = lookbookItems[activeLookbookIdx] || lookbookItems[0];
  const activeLookProducts = products.filter((p) =>
    activeLook?.featuredProductIds?.includes(p.id)
  );

  return (
    <StorefrontLayout>
      {/* 1. FULL-VIEWPORT HERO SECTION */}
      <section className="relative w-full min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-end bg-luga-surface dark:bg-luga-darkSurface overflow-hidden border-b border-luga-border dark:border-luga-darkBorder">
        {/* Managed Hero Background Slot */}
        <div className="absolute inset-0 w-full h-full">
          <ManagedImage
            slotKey="HERO_MAIN_BANNER"
            aspectRatio="16:9"
            resolution="2560×1440px"
            alt="LUGA Volume I Campaign"
            className="w-full h-full border-none"
            imageClassName="w-full h-full object-cover"
            priority
          />
          {/* Subtle gradient vignette for editorial legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />
        </div>

        {/* Hero Architectural Metadata Overlay */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-12 py-12 lg:py-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8 text-white">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-gold">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
              <span>{heroMainSlot?.subHeading || "AUTUMN / WINTER 2026 // LIMITED ARTISANAL DROP"}</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[0.95] uppercase">
              {heroMainSlot?.heading || "VOLUME I: KATHMANDU ARCHIVE"}
            </h1>

            <p className="font-mono text-xs sm:text-sm tracking-wider text-[#E0DDD8] max-w-xl leading-relaxed">
              Centuries of Newari handloom heritage re-engineered into heavy 460–580 GSM brutalist streetwear silhouettes. Made in Nepal.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={heroMainSlot?.ctaLink || "/collections/volume-1"}
                className="px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-gold hover:text-black transition-colors duration-300 flex items-center gap-3"
              >
                <span>{heroMainSlot?.ctaText || "EXPLORE THE ARCHIVE"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lookbook"
                className="px-8 py-4 bg-black/40 backdrop-blur-md border border-white/40 text-white font-mono text-xs uppercase tracking-ultra hover:bg-white hover:text-black transition-colors duration-300"
              >
                VIEW LOOKBOOK FILM
              </Link>
            </div>
          </div>

          {/* Right Rail Info Stamp */}
          <div className="hidden lg:flex flex-col items-end text-right font-mono text-[10px] tracking-mega space-y-1 text-white/70">
            <div>EST. KATHMANDU VALLEY</div>
            <div>PATAN ATELIER // 27.6744° N</div>
            <div className="text-luga-gold pt-2">COMPLIMENTARY DELIVERY ACROSS RING ROAD</div>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS / FEATURED DROP GRID */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-4 mb-8 sm:mb-12 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              CURATED SELECTIONS
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-luga-ink dark:text-luga-darkInk uppercase tracking-tight mt-1">
              FEATURED GARMENTS & DROPS
            </h2>
          </div>

          <Link
            href="/shop"
            className="font-mono text-xs tracking-ultra uppercase text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk flex items-center gap-2 group"
          >
            <span>VIEW ALL ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Desktop / 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-14">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. EDITORIAL SPLIT BANNER */}
      <section className="w-full border-y border-luga-border dark:border-luga-darkBorder">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-luga-border dark:divide-luga-darkBorder">
          {/* Left Frame: Artisanal Handloom */}
          <div className="group relative flex flex-col justify-end min-h-[580px] sm:min-h-[680px] p-8 sm:p-14 overflow-hidden bg-luga-surface dark:bg-luga-darkSurface">
            <div className="absolute inset-0 w-full h-full">
              <ManagedImage
                slotKey="SPLIT_BANNER_LEFT"
                aspectRatio="3:4"
                resolution="1200×1600px"
                alt="Artisanal Handloom Craftsmanship"
                className="w-full h-full border-none"
                imageClassName="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 space-y-3 text-white max-w-md">
              <span className="font-mono text-[10px] tracking-mega uppercase text-luga-gold">
                PATAN & BHAKTAPUR HERITAGE
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl uppercase tracking-tight">
                {splitLeftSlot?.heading || "ARTISANAL HANDLOOM"}
              </h3>
              <p className="font-mono text-xs text-[#E0DDD8] tracking-wider leading-relaxed">
                {splitLeftSlot?.subHeading ||
                  "Spun on century-old wooden pit-looms in Lalitpur using organic unbleached Himalayan cotton and natural madder dyes."}
              </p>
              <div className="pt-2">
                <Link
                  href={splitLeftSlot?.ctaLink || "/about"}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra text-white border-b border-white pb-1 hover:text-luga-gold hover:border-luga-gold transition-colors"
                >
                  <span>{splitLeftSlot?.ctaText || "VIEW CRAFTSMANSHIP"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Frame: Heavyweight Cuts */}
          <div className="group relative flex flex-col justify-end min-h-[580px] sm:min-h-[680px] p-8 sm:p-14 overflow-hidden bg-luga-surface dark:bg-luga-darkSurface">
            <div className="absolute inset-0 w-full h-full">
              <ManagedImage
                slotKey="SPLIT_BANNER_RIGHT"
                aspectRatio="3:4"
                resolution="1200×1600px"
                alt="Contemporary Kathmandu Streetwear"
                className="w-full h-full border-none"
                imageClassName="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-10 space-y-3 text-white max-w-md">
              <span className="font-mono text-[10px] tracking-mega uppercase text-luga-gold">
                ARCHITECTURAL SILHOUETTES
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl uppercase tracking-tight">
                {splitRightSlot?.heading || "HEAVYWEIGHT CUTS"}
              </h3>
              <p className="font-mono text-xs text-[#E0DDD8] tracking-wider leading-relaxed">
                {splitRightSlot?.subHeading ||
                  "420–580 GSM custom-milled French terry, wool gabardine, and oversized boxy tailoring engineered to withstand time."}
              </p>
              <div className="pt-2">
                <Link
                  href={splitRightSlot?.ctaLink || "/shop?category=outerwear"}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-ultra text-white border-b border-white pb-1 hover:text-luga-gold hover:border-luga-gold transition-colors"
                >
                  <span>{splitRightSlot?.ctaText || "SHOP OUTERWEAR"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOP BY VOLUME / CAPSULE SECTION */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-muted dark:text-luga-darkMuted">
            NUMBERED ARCHIVES
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk">
            EXPLORE BY VOLUME
          </h2>
          <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted tracking-wider">
            Each volume represents a distinct thematic dialogue between Kathmandu architectural history and modern garment engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group block border border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-luga-darkSurface/40 overflow-hidden hover:border-luga-ink dark:hover:border-luga-darkInk transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-luga-surface dark:bg-luga-darkSurface">
                <ManagedImage
                  slotKey={col.coverSlotKey || `COLLECTION_${col.id}`}
                  aspectRatio="4:5"
                  resolution="1200×1500px"
                  alt={col.title}
                  imageClassName="transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                  <span>{col.volumeNumber}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk group-hover:underline">
                  {col.title}
                </h3>
                <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE LOOKBOOK TEASER & "SHOP THE LOOK" */}
      <section className="w-full bg-[#111111] dark:bg-[#0D0D0D] text-white py-20 sm:py-28 border-t border-black/40 dark:border-white/10">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12 gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-mega uppercase text-luga-gold">
                EDITORIAL SPREAD // 35MM ARCHIVE
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-white mt-1">
                SHOP THE LOOKBOOK
              </h2>
            </div>

            {/* Frame Selector Tabs */}
            <div className="flex flex-wrap gap-2 font-mono text-[10px] tracking-ultra uppercase">
              {lookbookItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveLookbookIdx(idx)}
                  className={`px-3 py-1.5 border transition-colors ${
                    activeLookbookIdx === idx
                      ? "border-luga-gold bg-luga-gold text-black font-bold"
                      : "border-white/20 text-[#A3A09A] hover:border-white hover:text-white"
                  }`}
                >
                  FRAME 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Lookbook Frame Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Big Editorial Image Slot */}
            <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] bg-[#161616] overflow-hidden border border-white/10">
              <ManagedImage
                src={activeLook?.imageUrl}
                slotName={`LOOKBOOK_FRAME_${activeLookbookIdx + 1}`}
                aspectRatio="16:9"
                resolution="1920×1080px"
                alt={activeLook?.title}
                className="w-full h-full border-none"
              />
              <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-wider uppercase px-3 py-1 bg-black/80 backdrop-blur-md text-white border border-white/20">
                {activeLook?.volume}
              </div>
            </div>

            {/* Garments in this Frame (Shop the Look) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] tracking-mega text-luga-gold uppercase">
                  LOOKBOOK FRAME 0{activeLookbookIdx + 1}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                  {activeLook?.title}
                </h3>
                <p className="font-mono text-xs text-[#A3A09A] leading-relaxed">
                  {activeLook?.caption}
                </p>
              </div>

              {/* Tagged Garments */}
              <div className="space-y-4">
                <div className="font-mono text-[10px] uppercase tracking-mega text-white/60">
                  GARMENTS IN THIS FRAME ({activeLookProducts.length})
                </div>

                {activeLookProducts.map((garment) => (
                  <div
                    key={garment.id}
                    className="p-4 bg-white/5 border border-white/10 flex gap-4 items-center justify-between group hover:border-luga-gold transition-colors"
                  >
                    <div className="w-14 h-16 bg-[#222] flex-shrink-0 overflow-hidden">
                      <ManagedImage
                        src={garment.primaryImageUrl}
                        slotName={garment.sku}
                        aspectRatio="4:5"
                        resolution="200×250px"
                        alt={garment.title}
                        showInfo={false}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-editorial text-base text-white truncate group-hover:underline">
                        <Link href={`/product/${garment.slug}`}>{garment.title}</Link>
                      </h4>
                      <p className="font-mono text-[10px] text-[#A3A09A] truncate">
                        {garment.fabricGsm}
                      </p>
                      <div className="font-mono text-xs text-luga-gold font-semibold mt-1">
                        {formatNpr(garment.priceNpr)}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          productId: garment.id,
                          title: garment.title,
                          slug: garment.slug,
                          size: "M",
                          priceNpr: garment.priceNpr,
                          quantity: 1,
                          primaryImageUrl: garment.primaryImageUrl,
                        })
                      }
                      className="px-3 py-2 bg-white text-black font-mono text-[10px] uppercase tracking-wider hover:bg-luga-gold hover:text-black transition-colors"
                      title="Add size M to bag"
                    >
                      + BAG
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/lookbook"
                  className="font-mono text-xs uppercase tracking-ultra text-white/80 hover:text-luga-gold transition-colors flex items-center gap-2"
                >
                  <span>BROWSE FULL 35MM LOOKBOOK ARCHIVE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BRAND STORY / PATAN WEAVING MANIFESTO */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              THE PATAN ATELIER MANIFESTO
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-luga-ink dark:text-luga-darkInk leading-tight uppercase">
              Hand-woven in ancient Nepal. Tailored for brutalist contemporary living.
            </h2>
            <div className="font-mono text-xs sm:text-sm text-luga-muted dark:text-luga-darkMuted space-y-4 leading-relaxed">
              <p>
                Founded in the historic stone lanes of Lalitpur (Patan), <strong>LUGA</strong> was born to challenge the Western monopoly on luxury streetwear. We fuse centuries-old Newari handloom traditions, Mustang yak-down fibers, and Palpali Dhaka weaves with modern heavyweight silhouettes.
              </p>
              <p>
                Every garment is crafted inside our Kathmandu Valley workshop in small, unhurried volumes. We don&apos;t follow fast fashion seasons; each drop is an archival release engineered to last generations.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <Link
                href="/about"
                className="px-8 py-4 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
              >
                READ THE FULL MANIFESTO
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden">
              <ManagedImage
                slotKey="HERITAGE_STORY_BANNER"
                aspectRatio="4:3"
                resolution="2000×1500px"
                alt="Newar Master Weaver in Lalitpur"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
