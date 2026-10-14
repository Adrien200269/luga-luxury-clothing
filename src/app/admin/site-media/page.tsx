"use client";

import React, { useState, useEffect } from "react";
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
  Video as VideoIcon,
  ExternalLink,
  Compass,
  Key,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CloudUpload,
} from "lucide-react";
import {
  uploadToUploadcare,
  isVideoUrl,
  getUploadcarePublicKey,
  setUploadcarePublicKey,
} from "@/lib/uploadcare";

export default function AdminSiteMediaPage() {
  const { mediaSlots, updateMediaSlot, resetMediaSlot } = useStore();
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<{ slotKey: string; message: string } | null>(null);
  const [activePublicKey, setActivePublicKey] = useState<string>("demopublickey");
  const [isEditingKey, setIsEditingKey] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>("");
  const [keySavedBanner, setKeySavedBanner] = useState<boolean>(false);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const slotList = Object.values(mediaSlots);

  // Sync current active public key on mount
  useEffect(() => {
    const current = getUploadcarePublicKey();
    setActivePublicKey(current);
    setKeyInput(current);
  }, []);

  const handleSavePublicKey = () => {
    const trimmed = keyInput.trim();
    if (trimmed) {
      setUploadcarePublicKey(trimmed);
      setActivePublicKey(trimmed);
    } else {
      setUploadcarePublicKey("");
      setActivePublicKey("demopublickey");
      setKeyInput("demopublickey");
    }
    setIsEditingKey(false);
    setKeySavedBanner(true);
    setTimeout(() => setKeySavedBanner(false), 3500);
  };

  const filteredSlots =
    selectedSection === "ALL"
      ? slotList
      : slotList.filter((s) => s.pageSection === selectedSection);

  // Uploadcare File to CDN Handler (supports photos & videos)
  const handleFileUpload = async (slotKey: string, file: File) => {
    if (!file) return;
    try {
      setUploadingSlot(slotKey);
      setUploadProgress(0);
      setUploadError(null);

      const result = await uploadToUploadcare(file, {
        onProgress: (percent) => {
          setUploadProgress(percent);
        },
      });

      // Save CDN URL directly into slot
      await updateMediaSlot(slotKey, { imageUrl: result.cdnUrl });
    } catch (err: any) {
      console.error("Uploadcare upload error:", err);
      setUploadError({
        slotKey,
        message:
          err?.message ||
          "Failed to upload media to Uploadcare CDN. Please verify your connection or public key.",
      });
    } finally {
      setUploadingSlot(null);
      setUploadProgress(0);
    }
  };

  const isDemoKey = activePublicKey === "demopublickey";

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title & Section Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              UPLOADCARE HIGH-PERFORMANCE MEDIA ENGINE
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              GLOBAL SITE MEDIA SLOTS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1 max-w-3xl">
              Upload photos and videos directly to Uploadcare CDN. Fast edge streaming, no payload size limits, and instant real-time synchronization across your entire storefront.
            </p>
          </div>

          <div className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted flex items-center gap-3">
            <div className="px-3 py-1.5 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder">
              <span>ACTIVE SLOTS: </span>
              <strong className="text-luga-ink dark:text-luga-darkInk">{slotList.length}</strong>
            </div>
          </div>
        </div>

        {/* Uploadcare CDN Configuration Banner */}
        <div className="p-4 sm:p-5 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder font-mono text-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CloudUpload className="w-5 h-5 text-luga-crimson dark:text-luga-gold shrink-0" />
              <div>
                <div className="font-semibold text-luga-ink dark:text-luga-darkInk uppercase tracking-wide flex items-center gap-2">
                  <span>Uploadcare CDN Pipeline</span>
                  {isDemoKey ? (
                    <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                      SANDBOX MODE (demopublickey)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> CUSTOM CDN KEY ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-luga-muted dark:text-luga-darkMuted mt-0.5">
                  Public Key: <code className="text-luga-ink dark:text-luga-darkInk font-bold">{activePublicKey}</code>
                  {isDemoKey && " (Uploads persist for 24h. Connect your account key for permanent storage)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingKey(!isEditingKey)}
                className="px-3 py-1.5 border border-luga-border dark:border-luga-darkBorder hover:border-luga-ink dark:hover:border-luga-darkInk text-luga-ink dark:text-luga-darkInk text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{isEditingKey ? "Close Key Settings" : "Configure Key"}</span>
              </button>
              <a
                href="https://uploadcare.com"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 border border-luga-border dark:border-luga-darkBorder text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>Uploadcare Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Key Input Drawer */}
          {isEditingKey && (
            <div className="pt-3 border-t border-luga-border/60 dark:border-luga-darkBorder/60 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Paste your Uploadcare Public Key (e.g. 5d10a26...)"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full bg-luga-bg dark:bg-black border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
              <button
                onClick={handleSavePublicKey}
                className="px-4 py-2 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase text-[11px] tracking-wider font-bold transition-opacity hover:opacity-90"
              >
                Save & Apply Key
              </button>
              <button
                onClick={() => {
                  setKeyInput("demopublickey");
                  setUploadcarePublicKey("demopublickey");
                  setActivePublicKey("demopublickey");
                  setIsEditingKey(false);
                }}
                className="px-3 py-2 border border-luga-border dark:border-luga-darkBorder text-luga-muted text-[10px] uppercase tracking-wider"
              >
                Reset to Demo Key
              </button>
            </div>
          )}

          {keySavedBanner && (
            <div className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Uploadcare Public Key successfully saved! Ready for high-speed photo and video uploads.</span>
            </div>
          )}
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-2 sm:pb-3 border-b border-luga-border/60 dark:border-luga-darkBorder/60 font-mono text-[11px] tracking-wider uppercase">
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
              className={`px-3.5 py-2 border transition-colors shrink-0 ${
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
            const isSlotUploading = uploadingSlot === slot.slotKey;
            const slotHasError = uploadError?.slotKey === slot.slotKey;
            const isVideo = isVideoUrl(slot.imageUrl);
            const isDragOver = dragOverSlot === slot.slotKey;

            return (
              <div
                key={slot.slotKey}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverSlot(slot.slotKey);
                }}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverSlot(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(slot.slotKey, file);
                }}
                className={`p-6 bg-luga-bg dark:bg-[#0F0F0F] border flex flex-col justify-between space-y-6 transition-all ${
                  isDragOver
                    ? "border-luga-crimson dark:border-luga-gold ring-2 ring-luga-crimson/20"
                    : "border-luga-border dark:border-luga-darkBorder"
                }`}
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
                    SLOT KEY:{" "}
                    <code className="px-1.5 py-0.5 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder font-bold">
                      {slot.slotKey}
                    </code>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="relative w-full aspect-video bg-luga-surface dark:bg-luga-darkSurface border border-luga-border dark:border-luga-darkBorder overflow-hidden group">
                  <ManagedImage
                    slotKey={slot.slotKey}
                    aspectRatio="16:9"
                    resolution={slot.resolution}
                    alt={slot.altText || slot.label}
                    className="w-full h-full border-none"
                  />

                  {/* Active Media Status Badges */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    {slot.imageUrl ? (
                      <div className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        {isVideo ? (
                          <>
                            <VideoIcon className="w-3 h-3" />
                            <span>CUSTOM VIDEO ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3" />
                            <span>CUSTOM IMAGE ACTIVE</span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-amber-600 text-white font-mono text-[9px] uppercase tracking-wider shadow-sm">
                        WIREFRAME PLACEHOLDER
                      </div>
                    )}

                    {slot.imageUrl && (
                      <a
                        href={slot.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 bg-black/60 hover:bg-black text-white transition-colors"
                        title="Open file in new tab"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Drag and Drop Overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-luga-ink/80 text-white flex flex-col items-center justify-center font-mono text-xs uppercase tracking-wider z-20">
                      <CloudUpload className="w-8 h-8 animate-bounce mb-2 text-luga-gold" />
                      <span>Drop photo or video to upload</span>
                    </div>
                  )}

                  {/* Active Uploading Shimmer Overlay */}
                  {isSlotUploading && (
                    <div className="absolute inset-0 bg-black/75 text-white flex flex-col items-center justify-center font-mono text-xs uppercase tracking-wider z-20 p-4">
                      <Compass className="w-8 h-8 animate-spin-slow text-luga-crimson dark:text-luga-gold mb-3" />
                      <div className="font-bold tracking-mega mb-2">
                        UPLOADING TO UPLOADCARE CDN ({uploadProgress}%)
                      </div>
                      <div className="w-48 h-1.5 bg-white/20 overflow-hidden">
                        <div
                          className="h-full bg-luga-gold transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-white/70 mt-2">
                        Processing direct edge stream...
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {slotHasError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold uppercase">Upload Error</div>
                      <div className="text-[11px] mt-0.5">{uploadError.message}</div>
                    </div>
                  </div>
                )}

                {/* Slot Controls */}
                <div className="space-y-4 font-mono text-xs">
                  {/* Uploadcare File Upload Button + Reset */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider block">
                      UPLOAD PHOTO OR VIDEO (VIA UPLOADCARE CDN)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <label
                        className={`flex-1 cursor-pointer py-2.5 px-4 bg-luga-surface hover:bg-luga-surfaceHover dark:bg-luga-darkSurface dark:hover:bg-luga-darkSurfaceHover border border-luga-border dark:border-luga-darkBorder text-center text-luga-ink dark:text-luga-darkInk uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 transition-colors ${
                          isSlotUploading ? "opacity-75 cursor-wait" : ""
                        }`}
                      >
                        {isSlotUploading ? (
                          <>
                            <Compass className="w-3.5 h-3.5 animate-spin-slow text-luga-crimson dark:text-luga-gold" />
                            <span>UPLOADING ({uploadProgress}%)...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-luga-crimson dark:text-luga-gold" />
                            <span>CHOOSE LOCAL PHOTO OR VIDEO</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime,video/*"
                          disabled={isSlotUploading}
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
                          className="py-2.5 px-3 border border-luga-border dark:border-luga-darkBorder hover:border-red-500 hover:text-red-500 text-luga-muted transition-colors flex items-center justify-center gap-1.5"
                          title="Reset to architectural wireframe"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase">RESET</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[9.5px] text-luga-muted block">
                      Supported: JPG, PNG, WEBP, AVIF, GIF, MP4, WEBM, MOV • Drag & drop anywhere on the card
                    </span>
                  </div>

                  {/* Or Paste Direct CDN / Media URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase tracking-wider block">
                      OR PASTE MEDIA / VIDEO / CDN URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://ucarecdn.com/... or https://..."
                        value={slot.imageUrl || ""}
                        onChange={(e) =>
                          updateMediaSlot(slot.slotKey, { imageUrl: e.target.value })
                        }
                        className="flex-1 bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                      />
                      {slot.imageUrl && (
                        <button
                          onClick={() => updateMediaSlot(slot.slotKey, { imageUrl: null })}
                          className="px-2.5 py-1 border border-luga-border dark:border-luga-darkBorder text-luga-muted hover:text-luga-ink dark:hover:text-luga-darkInk text-[10px] uppercase"
                          title="Clear URL"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Editable Headline & Subheading */}
                  {(slot.heading !== undefined ||
                    slot.pageSection === "HOMEPAGE" ||
                    slot.pageSection === "CATEGORIES") && (
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
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={slot.ctaText || ""}
                            placeholder="CTA Label (e.g. SHOP NOW)"
                            onChange={(e) =>
                              updateMediaSlot(slot.slotKey, { ctaText: e.target.value })
                            }
                            className="w-full sm:w-1/2 bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                          />
                          <input
                            type="text"
                            value={slot.ctaLink || ""}
                            placeholder="/collections/..."
                            onChange={(e) =>
                              updateMediaSlot(slot.slotKey, { ctaLink: e.target.value })
                            }
                            className="w-full sm:w-1/2 bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
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
                      ALT / ACCESSIBILITY TEXT
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
