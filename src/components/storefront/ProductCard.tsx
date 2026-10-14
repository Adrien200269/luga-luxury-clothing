"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, GarmentSize } from "@/types";
import { ManagedImage } from "@/components/common/ManagedImage";
import { formatNpr } from "@/lib/utils";
import { useStore } from "@/lib/store-context";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "editorial";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = "grid",
}) => {
  const { addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, size: GarmentSize) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      size,
      priceNpr: product.priceNpr,
      quantity: 1,
      primaryImageUrl: product.primaryImageUrl,
      fabricGsm: product.fabricGsm,
    });

    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1500);
  };

  const hasHoverImage = Boolean(product.hoverImageUrl);
  const displayImageSrc = isHovered && hasHoverImage ? product.hoverImageUrl : product.primaryImageUrl;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Frame */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/40 dark:border-luga-darkBorder/40">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <ManagedImage
            src={displayImageSrc}
            slotName={`PROD_${product.sku}_${isHovered && hasHoverImage ? "BACK" : "FRONT"}`}
            aspectRatio="4:5"
            resolution="1200×1500px"
            alt={product.title}
            className="w-full h-full"
            imageClassName="transition-all duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges: Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-black/85 text-white dark:bg-white dark:text-black font-mono text-[9px] uppercase tracking-ultra">
              NEW DROP
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-luga-crimson text-white dark:bg-luga-gold dark:text-black font-mono text-[9px] uppercase tracking-ultra">
              LIMITED
            </span>
          )}
        </div>

        {/* Quick Size Selector on Hover (Desktop only, mobile navigates directly) */}
        <div className="hidden sm:block absolute inset-x-0 bottom-0 bg-luga-bg/95 dark:bg-luga-darkBg/95 backdrop-blur-md border-t border-luga-border dark:border-luga-darkBorder p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-luga-muted dark:text-luga-darkMuted">
              QUICK ADD SIZES
            </span>
            <span className="font-mono text-[9px] text-luga-muted dark:text-luga-darkMuted">
              STOCK READY
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {(["XS", "S", "M", "L", "XL"] as GarmentSize[]).map((size) => {
              const variant = product.variants.find((v) => v.size === size);
              const inStock = variant ? variant.stockQuantity > 0 : true;

              return (
                <button
                  key={size}
                  disabled={!inStock}
                  onClick={(e) => handleQuickAdd(e, size)}
                  className={`py-1.5 font-mono text-[10px] uppercase border transition-colors ${
                    !inStock
                      ? "opacity-30 cursor-not-allowed border-dashed border-luga-border dark:border-luga-darkBorder line-through"
                      : addedSize === size
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk hover:bg-luga-surface dark:hover:bg-luga-darkSurface text-luga-ink dark:text-luga-darkInk"
                  }`}
                  title={inStock ? `Add size ${size} to bag` : `${size} Out of Stock`}
                >
                  {addedSize === size ? <Check className="w-3 h-3 mx-auto" /> : size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Meta */}
      <div className="mt-2.5 sm:mt-3.5 space-y-1">
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-luga-muted dark:text-luga-darkMuted">
          <span className="truncate mr-1">{product.category}</span>
          <span className="opacity-70 flex-shrink-0">{product.sku}</span>
        </div>

        <h3 className="font-editorial text-sm sm:text-base lg:text-lg text-luga-ink dark:text-luga-darkInk hover:text-luga-crimson dark:hover:text-luga-gold transition-colors leading-snug line-clamp-2 min-h-[2.2rem] sm:min-h-[2.6rem]">
          <Link href={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        {/* Pricing in NPR */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono text-xs sm:text-sm font-semibold text-luga-ink dark:text-luga-darkInk">
            {formatNpr(product.priceNpr)}
          </span>
          {product.compareAtPriceNpr && (
            <span className="font-mono text-[11px] text-luga-muted line-through">
              {formatNpr(product.compareAtPriceNpr)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
