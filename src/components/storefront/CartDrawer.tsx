"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import { ManagedImage } from "@/components/common/ManagedImage";
import { formatNpr } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    settings,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const threshold = settings.freeShippingThresholdNpr;
  const isFreeShipping = cartSubtotal >= threshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / threshold) * 100));
  const remainingForFree = Math.max(0, threshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-luga-bg dark:bg-luga-darkBg border-l border-luga-border dark:border-luga-darkBorder flex flex-col shadow-2xl transition-transform duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-luga-border dark:border-luga-darkBorder flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-luga-crimson dark:text-luga-gold" />
              <h3 className="font-editorial text-xl uppercase tracking-wider text-luga-ink dark:text-luga-darkInk">
                SHOPPING BAG ({cartCount})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-luga-muted hover:text-luga-ink dark:text-luga-darkMuted dark:hover:text-luga-darkInk transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-luga-surface dark:bg-luga-darkSurface border-b border-luga-border dark:border-luga-darkBorder text-[11px] font-mono">
            {isFreeShipping ? (
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5">
                <span>✓</span> COMPLIMENTARY RING ROAD DELIVERY UNLOCKED
              </p>
            ) : (
              <p className="text-luga-muted dark:text-luga-darkMuted tracking-wider">
                ADD <span className="font-bold text-luga-ink dark:text-luga-darkInk">{formatNpr(remainingForFree)}</span> MORE FOR COMPLIMENTARY DELIVERY
              </p>
            )}
            <div className="mt-2 w-full h-1 bg-luga-border/50 dark:bg-luga-darkBorder/50 overflow-hidden">
              <div
                className="h-full bg-luga-crimson dark:bg-luga-gold transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-luga-border/60 dark:divide-luga-darkBorder/60">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-editorial text-2xl text-luga-muted dark:text-luga-darkMuted">
                  Your bag is currently empty.
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-luga-muted/80 dark:text-luga-darkMuted/80">
                  Explore Volume I & Core street capsules
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-4 px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra hover:opacity-90 transition-opacity"
                >
                  EXPLORE ARCHIVE
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="pt-6 first:pt-0 flex gap-4">
                  <div className="w-20 h-24 flex-shrink-0 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/40 dark:border-luga-darkBorder/40 overflow-hidden">
                    <ManagedImage
                      src={item.primaryImageUrl}
                      slotName={`CART_${item.size}`}
                      aspectRatio="4:5"
                      resolution="300×400px"
                      alt={item.title}
                      showInfo={false}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-editorial text-base text-luga-ink dark:text-luga-darkInk hover:underline leading-snug line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-luga-muted hover:text-red-500 transition-colors ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-[11px] font-mono text-luga-muted dark:text-luga-darkMuted">
                        <span className="uppercase">SIZE: <strong className="text-luga-ink dark:text-luga-darkInk">{item.size}</strong></span>
                        <span>•</span>
                        <span>{formatNpr(item.priceNpr)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-luga-border dark:border-luga-darkBorder">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.size, item.quantity - 1)}
                          className="p-1.5 hover:bg-luga-surface dark:hover:bg-luga-darkSurface transition-colors"
                        >
                          <Minus className="w-3 h-3 text-luga-ink dark:text-luga-darkInk" />
                        </button>
                        <span className="px-3 font-mono text-xs text-luga-ink dark:text-luga-darkInk">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}
                          className="p-1.5 hover:bg-luga-surface dark:hover:bg-luga-darkSurface transition-colors"
                        >
                          <Plus className="w-3 h-3 text-luga-ink dark:text-luga-darkInk" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-semibold text-luga-ink dark:text-luga-darkInk">
                        {formatNpr(item.priceNpr * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-luga-border dark:border-luga-darkBorder bg-luga-surface/40 dark:bg-luga-darkSurface/40 space-y-4">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs uppercase tracking-wider text-luga-muted dark:text-luga-darkMuted">
                  SUBTOTAL (EXCL. DELIVERY)
                </span>
                <span className="text-base font-semibold text-luga-ink dark:text-luga-darkInk">
                  {formatNpr(cartSubtotal)}
                </span>
              </div>

              <p className="text-[10px] font-mono text-luga-muted dark:text-luga-darkMuted uppercase tracking-wider">
                Nepal delivery zone calculated at checkout. Cash on Delivery (COD) & Fonepay available.
              </p>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-luga-ink dark:bg-luga-darkInk text-white dark:text-black font-mono text-xs uppercase tracking-ultra hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors duration-300"
              >
                <span>PROCEED TO NEPAL CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
