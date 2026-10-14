"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { SiteMediaSlot } from "@/types";
import {
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Image as ImageIcon,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminSiteMediaPage() {
  const { mediaSlots, updateMediaSlot, resetMediaSlot } = useStore();
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [copiedSlotKey, setCopiedSlotKey] = useState<string | null>(null);

  const slotList = Object.values(mediaSlots);

  const filteredSlots =
    selectedSection === "ALL"
      ? slotList
      : slotList.filter((s) => s.pageSection === selectedSection);

  // File to base64 DataURL handler
  const handleFileUpload = (slotKey: string, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateMediaSlot(slotKey, { imageUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title & Section Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              VISUAL ASSET CONTROL CENTER
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              GLOBAL SITE MEDIA SLOTS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
              Upload local photos or paste URLs into any visual slot across the entire store. Changes reflect live instantaneously.
            </p>
          </div>

          <div className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted flex items-center gap-2">
            <span>SLOTS:</span>
            <strong className="text-luga-ink dark:text-luga-darkInk">{slotList.length} TOTAL</strong>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2 font-mono text-[11px] tracking-wider uppercase border-b border-luga-border/60 dark:border-luga-darkBorder/60 pb-3">
          {[
            { id: "ALL", label: "All Visual Slots" },
            { id: "HOMEPAGE", label: "Homepage Banners" },
            { id: "BRAND_ASSETS", label: "Brand Assets & Fonepay QR" },
            { id: "CATEGORIES", label: "Category Header Banners" },
            { id: "ABOUT", label: "About Atelier Slots" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSection(tab.id)}
              className={`px-3.5 py-2 border transition-colors ${
                selectedSection === tab.id
                  ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black dark:border-luga-darkInk font-bold"
                  : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink text-luga-ink dark:text-luga-darkInk"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredSlots.map((slot) => {
            return (
              <div
                key={slot.slotKey}
                className="p-6 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder flex flex-col justify-between space-y-6"
              >
                {/* Header Information */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-mega text-luga-muted dark:text-luga-darkMuted mb-1">
                    <span className="uppercase text-luga-crimson dark:text-luga-gold font-bold">
                      SECTION: {slot.pageSection}
                    </span>
                    <span className="uppercase">
                      RATIO: {slot.aspectRatio} • {slot.resolution}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
                    {slot.label}
                  </h3>

                  <div className="mt-1 font-mono text-[10px] text-luga-muted">
                    SLOT KEY: <code className="px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder font-bold">{slot.slotKey}</code>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="relative w-full aspect-video bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden">
                  <ManagedImage
                    slotKey={slot.slotKey}
                    aspectRatio="16:9"
                    resolution={slot.resolution}
                    alt={slot.altText || slot.label}
                    className="w-full h-full border-none"
                  />

                  {slot.imageUrl ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9px] uppercase tracking-wider">
                      ✓ CUSTOM IMAGE ACTIVE
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-600 text-white font-mono text-[9px] uppercase tracking-wider">
                      WIREFRAME PLACEHOLDER
                    </div>
                  )}
                </div>

                {/* Slot Controls */}
                <div className="space-y-4 font-mono text-xs">
                  {/* File Upload Button + Direct URL Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider block">
                      UPLOAD IMAGE FILE (INSTANT PREVIEW)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer py-2.5 px-4 bg-luga-surface hover:bg-luga-surfaceHover dark:bg-luga-darkSurface dark:hover:bg-luga-darkSurfaceHover border border-luga-border dark:border-luga-darkBorder text-center text-luga-ink dark:text-luga-darkInk uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>CHOOSE LOCAL IMAGE FILE</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(slot.slotKey, file);
                          }}
                        />
                      </label>

                      {slot.imageUrl && (
                        <button
                          onClick={() => resetMediaSlot(slot.slotKey)}
                          className="py-2.5 px-3 border border-luga-border dark:border-luga-darkBorder hover:border-red-500 hover:text-red-500 text-luga-muted transition-colors flex items-center gap-1.5"
                          title="Reset to architectural wireframe"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase">RESET</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Or Paste URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider block">
                      OR PASTE IMAGE URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://... or data:image/..."
                        value={slot.imageUrl || ""}
                        onChange={(e) =>
                          updateMediaSlot(slot.slotKey, { imageUrl: e.target.value })
                        }
                        className="flex-1 bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Editable Headline & Subheading (for Hero & Campaign Banners) */}
                  {(slot.heading !== undefined || slot.pageSection === "HOMEPAGE" || slot.pageSection === "CATEGORIES") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-luga-border/50 dark:border-luga-darkBorder/50">
                      <div className="space-y-1">
                        <label className="text-[10px] text-luga-muted uppercase">
                          HEADLINE TEXT
                        </label>
                        <input
                          type="text"
                          value={slot.heading || ""}
                          placeholder="e.g. VOLUME I: KATHMANDU ARCHIVE"
                          onChange={(e) =>
                            updateMediaSlot(slot.slotKey, { heading: e.target.value })
                          }
                          className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-luga-muted uppercase">
                          CTA BUTTON LABEL & LINK
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slot.ctaText || ""}
                            placeholder="CTA Label (e.g. SHOP NOW)"
                            onChange={(e) =>
                              updateMediaSlot(slot.slotKey, { ctaText: e.target.value })
                            }
                            className="w-1/2 bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                          />
                          <input
                            type="text"
                            value={slot.ctaLink || ""}
                            placeholder="/collections/..."
                            onChange={(e) =>
                              updateMediaSlot(slot.slotKey, { ctaLink: e.target.value })
                            }
                            className="w-1/2 bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] text-luga-muted uppercase">
                          SUBHEADING / CAPTION
                        </label>
                        <input
                          type="text"
                          value={slot.subHeading || ""}
                          placeholder="Editorial caption description..."
                          onChange={(e) =>
                            updateMediaSlot(slot.slotKey, { subHeading: e.target.value })
                          }
                          className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Alt Text */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider block">
                      ALT TEXT (FOR ACCESSIBILITY & SEO)
                    </label>
                    <input
                      type="text"
                      value={slot.altText || ""}
                      placeholder="Descriptive text for this visual asset..."
                      onChange={(e) =>
                        updateMediaSlot(slot.slotKey, { altText: e.target.value })
                      }
                      className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
