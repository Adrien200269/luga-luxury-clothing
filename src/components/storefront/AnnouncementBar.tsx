"use client";

import React from "react";
import { useStore } from "@/lib/store-context";

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  if (!settings.announcementActive) return null;

  return (
    <div className="relative bg-[#111111] dark:bg-[#161616] text-[#F5F3EF] border-b border-black/20 dark:border-white/10 text-[10px] tracking-[0.22em] uppercase py-2 px-4 overflow-hidden select-none z-50">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-8 font-mono flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-luga-crimson dark:bg-luga-gold rounded-full" />
          {settings.announcementText}
        </span>
        <span className="mx-8 font-mono flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-luga-crimson dark:bg-luga-gold rounded-full" />
          {settings.announcementText}
        </span>
        <span className="mx-8 font-mono flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-luga-crimson dark:bg-luga-gold rounded-full" />
          {settings.announcementText}
        </span>
      </div>
    </div>
  );
};
