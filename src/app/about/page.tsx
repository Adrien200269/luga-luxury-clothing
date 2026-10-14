"use client";

import React from "react";
import Link from "next/link";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { useStore } from "@/lib/store-context";
import { Compass, Sparkles, MapPin, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { settings, getMediaSlot } = useStore();

  const studioSlot = getMediaSlot("ABOUT_STUDIO_PORTRAIT");
  const craftSlot = getMediaSlot("ABOUT_CRAFT_WEAVE");
  const heritageSlot = getMediaSlot("HERITAGE_STORY_BANNER");

  return (
    <StorefrontLayout>
      {/* Manifesto Hero Banner */}
      <section className="relative w-full min-h-[55vh] sm:min-h-[65vh] flex items-center justify-center bg-luga-surface dark:bg-luga-darkSurface border-b border-luga-border dark:border-luga-darkBorder overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <ManagedImage
            slotKey="HERITAGE_STORY_BANNER"
            aspectRatio="16:9"
            resolution="2000×1125px"
            alt="LUGA Atelier Lalitpur"
            className="w-full h-full border-none"
            priority
          />
          <div className="absolute inset-0 bg-black/65 dark:bg-black/75 pointer-events-none" />
        </div>

        <ScrollReveal direction="up" duration={850} className="relative z-10 text-center px-4 sm:px-6 max-w-4xl text-white space-y-4">
          <div className="flex items-center justify-center gap-2 font-mono text-xs tracking-mega uppercase text-luga-gold">
            <Compass className="w-4 h-4" />
            <span>KATHMANDU VALLEY // ESTABLISHED 2026</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-6xl lg:text-7xl uppercase font-light tracking-tight leading-tight break-words">
            {heritageSlot?.heading || "THE VALLEY MANIFESTO"}
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#DDD] tracking-wider max-w-2xl mx-auto leading-relaxed">
            {heritageSlot?.subHeading ||
              "Reinterpreting sacred Newar architecture and centuries-old pit-loom handcraft through the rebellious lens of luxury brutalist streetwear."}
          </p>
        </ScrollReveal>
      </section>

      {/* Narrative Section 1: The Philosophy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-28 space-y-8 sm:space-y-12">
        <ScrollReveal direction="up" className="text-center space-y-3">
          <span className="font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
            ORIGINS & ETHOS
          </span>
          <h2 className="font-editorial text-2xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk break-words">
            Why We Build in Nepal
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} className="font-mono text-xs sm:text-sm text-luga-muted dark:text-luga-darkMuted leading-relaxed space-y-6 text-justify">
          <p>
            For decades, global luxury fashion has looked toward Paris, Milan, and Tokyo for creative authority, while extracting raw cashmere, pashmina, and handloom cotton from South Asia under silent private labels.
          </p>
          <p>
            <strong>LUGA (लुगा)</strong> was born to subvert that hierarchy. Based in the ancient Newar artisan quarter of Patan (Lalitpur), we engineer contemporary streetwear that is entirely conceived, woven, tailored, and finished within Nepal. We do not celebrate shallow nostalgia; instead, we treat our cultural heritage as a living, evolving architectural framework.
          </p>
          <p>
            Our garments pair heavy 420–580 GSM organic cotton terry and raw Himalayan hemp with intricate Dhaka brocades and boiled Mustang yak fibers. Each piece takes days of meticulous hand manipulation on century-old wooden shuttle looms.
          </p>
        </ScrollReveal>
      </section>

      {/* Visual Diptych: Studio & Craft Macro */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="up" duration={750} className="space-y-4">
            <div className="relative aspect-[4/5] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden">
              <ManagedImage
                slotKey="ABOUT_STUDIO_PORTRAIT"
                aspectRatio="4:5"
                resolution="1200×1500px"
                alt="Patan Atelier"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk">
                {studioSlot?.heading || "THE ATELIER // PATAN"}
              </h3>
              <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                {studioSlot?.subHeading ||
                  "Where Himalayan raw materials meet modern garment engineering in Lalitpur."}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150} duration={750} className="space-y-4">
            <div className="relative aspect-[4/5] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden">
              <ManagedImage
                slotKey="ABOUT_CRAFT_WEAVE"
                aspectRatio="4:5"
                resolution="1200×1500px"
                alt="Handloom Weave Macro"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk">
                {craftSlot?.heading || "HERITAGE HANDLOOM"}
              </h3>
              <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted leading-relaxed">
                {craftSlot?.subHeading ||
                  "Every meter woven on traditional Newari pit-looms takes 6 hours of manual labor."}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The Pillars of Craftsmanship */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-8 py-20 sm:py-28 border-t border-luga-border dark:border-luga-darkBorder mt-16">
        <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
            TECHNICAL DISCIPLINE
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk">
            THE THREE LUGA PILLARS
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 font-mono text-xs">
          <ScrollReveal direction="up" delay={0} duration={650} className="p-5 sm:p-8 border border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-luga-darkSurface/40 space-y-4">
            <div className="text-luga-crimson dark:text-luga-gold text-sm font-bold">01 // HEAVYWEIGHT ARCHITECTURE</div>
            <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk">
              420–580 GSM Custom Milling
            </h3>
            <p className="text-luga-muted dark:text-luga-darkMuted leading-relaxed">
              We never use flimsy commodity blanks. All jerseys, terries, and twills are custom knit or loom-woven specifically for our dropped-shoulder, brutalist drape.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={120} duration={650} className="p-5 sm:p-8 border border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-luga-darkSurface/40 space-y-4">
            <div className="text-luga-crimson dark:text-luga-gold text-sm font-bold">02 // INDIGENOUS FIBERS</div>
            <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk">
              Mustang Yak & Handloom Dhaka
            </h3>
            <p className="text-luga-muted dark:text-luga-darkMuted leading-relaxed">
              Combed high-altitude yak down, wild Himalayan hemp, and geometric Palpali Dhaka panels woven by multigenerational master weavers across Lalitpur and Bhaktapur.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={240} duration={650} className="p-5 sm:p-8 border border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-luga-darkSurface/40 space-y-4">
            <div className="text-luga-crimson dark:text-luga-gold text-sm font-bold">03 // SLOW NUMBERED ARCHIVES</div>
            <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk">
              Zero Waste & Unhurried Drops
            </h3>
            <p className="text-luga-muted dark:text-luga-darkMuted leading-relaxed">
              We release garments in numbered volumes of no more than 30–50 pieces per silhouette. Leftover textile selvages are repurposed into interior garment trims.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Atelier Visit CTA */}
      <section className="bg-[#111111] dark:bg-[#0D0D0D] text-white py-12 sm:py-16 px-4 sm:px-6 text-center border-t border-black/40 dark:border-white/10">
        <div className="max-w-2xl mx-auto space-y-4">
          <MapPin className="w-6 h-6 text-luga-gold mx-auto" />
          <h2 className="font-editorial text-2xl sm:text-4xl">
            Visit the Patan Salon
          </h2>
          <p className="font-mono text-xs text-[#A3A09A] leading-relaxed">
            {settings.studioAddress}
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-white text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-gold hover:text-black transition-colors text-center"
            >
              <span>EXPLORE READY-TO-WEAR ARCHIVE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
