"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, setIsSearchOpen, getMediaSlot } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdown, setCollectionsDropdown] = useState(false);

  const logoLightSlot = getMediaSlot("BRAND_LOGO_LIGHT");
  const logoDarkSlot = getMediaSlot("BRAND_LOGO_DARK");

  const navLinks = [
    { label: "Shop All", href: "/shop" },
    { label: "Outerwear", href: "/shop?category=outerwear" },
    { label: "Knitwear", href: "/shop?category=knitwear" },
    { label: "Shirts", href: "/shop?category=shirts" },
    { label: "Trousers", href: "/shop?category=trousers" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "About Luga", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-luga-bg/95 dark:bg-luga-darkBg/95 backdrop-blur-md border-b border-luga-border/80 dark:border-luga-darkBorder/80 transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left Section: Mobile Menu Trigger + Desktop Primary Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors lg:hidden"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-mono tracking-ultra uppercase text-luga-muted dark:text-luga-darkMuted">
            {/* Collections Dropdown */}
            <div
              className="relative py-2 group cursor-pointer"
              onMouseEnter={() => setCollectionsDropdown(true)}
              onMouseLeave={() => setCollectionsDropdown(false)}
            >
              <button className="flex items-center gap-1 hover:text-luga-ink dark:hover:text-luga-darkInk transition-colors">
                <span>VOLUMES</span>
                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>

              {collectionsDropdown && (
                <div className="absolute top-full left-0 w-64 bg-luga-bg dark:bg-luga-darkBg border border-luga-border dark:border-luga-darkBorder shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="px-4 py-1 text-[9px] font-mono text-luga-muted/60 dark:text-luga-darkMuted/60 border-b border-luga-border/50 dark:border-luga-darkBorder/50 mb-2">
                    CURATED ARCHIVES
                  </div>
                  <Link
                    href="/collections/volume-1"
                    onClick={() => setCollectionsDropdown(false)}
                    className="block px-4 py-2 hover:bg-luga-surface dark:hover:bg-luga-darkSurface text-luga-ink dark:text-luga-darkInk text-[10px] tracking-wider"
                  >
                    VOLUME I: KATHMANDU ARCHIVE
                  </Link>
                  <Link
                    href="/collections/core-archive"
                    onClick={() => setCollectionsDropdown(false)}
                    className="block px-4 py-2 hover:bg-luga-surface dark:hover:bg-luga-darkSurface text-luga-ink dark:text-luga-darkInk text-[10px] tracking-wider"
                  >
                    THE CORE STREETWEAR CAPSULE
                  </Link>
                  <Link
                    href="/collections/himalayan-winter"
                    onClick={() => setCollectionsDropdown(false)}
                    className="block px-4 py-2 hover:bg-luga-surface dark:hover:bg-luga-darkSurface text-luga-ink dark:text-luga-darkInk text-[10px] tracking-wider"
                  >
                    HIMALAYAN MONOLITH // WINTER
                  </Link>
                </div>
              )}
            </div>

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`hover:text-luga-ink dark:hover:text-luga-darkInk transition-colors ${
                    isActive ? "text-luga-ink dark:text-luga-darkInk font-semibold border-b border-luga-ink dark:border-luga-darkInk pb-0.5" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center: LUGA Wordmark / Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <Link href="/" className="inline-block group">
            {logoDarkSlot?.imageUrl || logoLightSlot?.imageUrl ? (
              <div className="h-8 sm:h-10 flex items-center justify-center">
                <img
                  src={logoDarkSlot?.imageUrl || logoLightSlot?.imageUrl || ""}
                  alt="LUGA"
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="font-editorial text-2xl sm:text-3xl tracking-[0.35em] uppercase text-luga-ink dark:text-luga-darkInk font-bold transition-all duration-300 group-hover:tracking-[0.42em]">
                  LUGA
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-mega uppercase text-luga-muted dark:text-luga-darkMuted -mt-1 opacity-80">
                  KATHMANDU • 2026
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Right Section: Currency, Theme, Search, Admin Link, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Indicator */}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-luga-border/80 dark:border-luga-darkBorder/80 text-luga-muted dark:text-luga-darkMuted">
            <span>NPR</span>
            <span className="text-luga-ink dark:text-luga-darkInk font-semibold">रू</span>
          </div>

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors"
            title="Search Archive"
            aria-label="Search garments"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Admin CMS Access */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-ultra uppercase border border-luga-border hover:border-luga-ink dark:border-luga-darkBorder dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk transition-colors"
            title="Open Admin CMS"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-luga-crimson dark:text-luga-gold" />
            <span>CMS</span>
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors flex items-center"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-luga-crimson dark:bg-luga-gold text-white dark:text-black font-mono text-[9px] font-bold flex items-center justify-center rounded-none animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-luga-border dark:border-luga-darkBorder bg-luga-bg dark:bg-luga-darkBg px-6 py-8 space-y-6">
          <div className="space-y-3 font-mono text-xs tracking-ultra uppercase">
            <div className="text-[10px] text-luga-muted dark:text-luga-darkMuted tracking-mega pb-1 border-b border-luga-border/40 dark:border-luga-darkBorder/40">
              COLLECTIONS & VOLUMES
            </div>
            <Link
              href="/collections/volume-1"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-luga-ink dark:text-luga-darkInk"
            >
              Volume I: Kathmandu Archive
            </Link>
            <Link
              href="/collections/core-archive"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-luga-ink dark:text-luga-darkInk"
            >
              Core Streetwear Capsule
            </Link>
            <Link
              href="/collections/himalayan-winter"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-luga-ink dark:text-luga-darkInk"
            >
              Himalayan Monolith Archive
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs tracking-ultra uppercase pt-4 border-t border-luga-border/40 dark:border-luga-darkBorder/40">
            <div className="text-[10px] text-luga-muted dark:text-luga-darkMuted tracking-mega pb-1">
              CATEGORY ARCHIVES
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-luga-border/40 dark:border-luga-darkBorder/40 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono tracking-ultra uppercase border border-luga-ink dark:border-luga-darkInk text-luga-ink dark:text-luga-darkInk"
            >
              <ShieldCheck className="w-4 h-4 text-luga-crimson dark:text-luga-gold" />
              <span>ADMIN CMS</span>
            </Link>

            <div className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted">
              CURRENCY: <strong className="text-luga-ink dark:text-luga-darkInk">NPR (रू)</strong>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
