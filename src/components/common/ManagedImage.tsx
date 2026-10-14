"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/lib/store-context";
import { cn } from "@/lib/utils";
import { Camera, Compass } from "lucide-react";

interface ManagedImageProps {
  slotKey?: string;
  src?: string | null;
  alt?: string;
  slotName?: string;
  aspectRatio?: string; // e.g. "4/5", "16/9", "1/1", "21/9", "3/4"
  resolution?: string; // e.g. "1200×1500px"
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showInfo?: boolean;
  editorialBadge?: string;
  onClick?: () => void;
  fill?: boolean;
}

export const ManagedImage: React.FC<ManagedImageProps> = ({
  slotKey,
  src,
  alt = "LUGA Editorial Slot",
  slotName,
  aspectRatio,
  resolution,
  className,
  imageClassName,
  priority = false,
  showInfo = true,
  editorialBadge = "LUGA STUDIO // AWAITING ADMIN UPLOAD",
  onClick,
  fill = true,
}) => {
  const { getMediaSlot } = useStore();
  const [imageError, setImageError] = useState(false);

  // Look up slot data if slotKey is provided
  const slotData = slotKey ? getMediaSlot(slotKey) : undefined;

  // Determine actual image source: explicit src takes priority, then slot imageUrl
  const resolvedSrc = (src !== undefined ? src : slotData?.imageUrl) || null;
  const resolvedSlotName = slotName || slotData?.label || slotKey || "EDITORIAL_SLOT";
  const resolvedAspectRatio = aspectRatio || slotData?.aspectRatio || "4/5";
  const resolvedResolution = resolution || slotData?.resolution || "1200×1500px";

  // Reset error state if image source updates
  useEffect(() => {
    setImageError(false);
  }, [resolvedSrc]);

  // If we have a valid image source and it hasn't errored
  if (resolvedSrc && !imageError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-luga-surface dark:bg-luga-darkSurface group select-none",
          className
        )}
        style={{
          aspectRatio: resolvedAspectRatio ? resolvedAspectRatio.replace(":", "/") : undefined,
        }}
        onClick={onClick}
      >
        <img
          src={resolvedSrc}
          alt={alt || slotData?.altText || resolvedSlotName}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
            imageClassName
          )}
          onError={() => setImageError(true)}
          loading={priority ? "eager" : "lazy"}
        />
        {/* Subtle Luxury Film Grain / Contrast Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
      </div>
    );
  }

  // Otherwise, render the sleek architectural editorial wireframe placeholder
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-6 select-none",
        "bg-[#F4F1EA] dark:bg-[#0D0D0D]",
        "border border-luga-border/80 dark:border-luga-darkBorder/80",
        "transition-colors duration-300",
        className
      )}
      style={{
        aspectRatio: resolvedAspectRatio ? resolvedAspectRatio.replace(":", "/") : undefined,
      }}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Diagonal Subtle Isometric Architectural Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Architectural Corner Framing Marks (L-Brackets) */}
      <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
      <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
      <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />
      <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-luga-muted/40 dark:border-luga-darkMuted/40" />

      {/* Top Header: Geographic Coordinates & Studio Badge */}
      <div className="relative z-10 w-full flex items-center justify-between text-[9px] sm:text-[10px] tracking-mega text-luga-muted/80 dark:text-luga-darkMuted/80 font-mono">
        <span className="flex items-center gap-1.5 uppercase">
          <Compass className="w-3 h-3 text-luga-crimson dark:text-luga-gold opacity-90 animate-pulse" />
          <span>KTM // 27.7172° N</span>
        </span>
        <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 border border-luga-border dark:border-luga-darkBorder bg-luga-bg/60 dark:bg-luga-darkBg/60">
          RAW ARCHIVE
        </span>
      </div>

      {/* Center Reticle & Slot Identification */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto px-2 max-w-[90%]">
        {/* Architectural Crosshair Reticle */}
        <div className="relative mb-3 flex items-center justify-center w-12 h-12 rounded-full border border-dashed border-luga-muted/30 dark:border-luga-darkMuted/30">
          <div className="absolute w-6 h-[1px] bg-luga-muted/40 dark:bg-luga-darkMuted/40" />
          <div className="absolute h-6 w-[1px] bg-luga-muted/40 dark:bg-luga-darkMuted/40" />
          <Camera className="w-4 h-4 text-luga-muted/70 dark:text-luga-darkMuted/70" />
        </div>

        {/* Slot Name */}
        <div className="font-mono text-[10px] sm:text-xs font-semibold tracking-ultra uppercase text-luga-ink dark:text-luga-darkInk break-all">
          [{resolvedSlotName}]
        </div>

        {/* Awaiting Admin Upload Status Badge */}
        {showInfo && (
          <div className="mt-2.5 inline-flex items-center px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-mono tracking-wider uppercase border border-luga-crimson/30 dark:border-luga-gold/40 text-luga-crimson dark:text-luga-gold bg-luga-crimson/5 dark:bg-luga-gold/10">
            {editorialBadge}
          </div>
        )}
      </div>

      {/* Bottom Technical Spec Footer: Aspect Ratio & Recommended Resolution */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8.5px] sm:text-[9.5px] font-mono tracking-wider text-luga-muted/70 dark:text-luga-darkMuted/70 border-t border-luga-border/50 dark:border-luga-darkBorder/50 pt-2">
        <span className="uppercase">RATIO: {resolvedAspectRatio}</span>
        <span className="uppercase font-medium text-luga-ink/80 dark:text-luga-darkInk/80">
          {resolvedResolution}
        </span>
      </div>
    </div>
  );
};
