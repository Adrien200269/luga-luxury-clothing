"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { LookbookItem, LookbookPageData } from "@/types";
import { Plus, Edit2, Trash2, X, Upload, Check, Compass, RotateCcw, Save, Video as VideoIcon, Film, ExternalLink } from "lucide-react";
import { compressImage } from "@/lib/image-utils";
import { uploadToUploadcare } from "@/lib/uploadcare";
import { getVideoInfo } from "@/lib/video-utils";

export default function AdminLookbookPage() {
  const {
    lookbookItems,
    addLookbookItem,
    updateLookbookItem,
    deleteLookbookItem,
    products,
    getLookbookContent,
    updateLookbookContent,
    resetLookbookContent,
    getMediaSlot,
    updateMediaSlot,
    isSyncing,
  } = useStore();

  // Lookbook Page Editorial State
  const [pageData, setPageData] = useState<LookbookPageData>(getLookbookContent());
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [pageSavedSuccess, setPageSavedSuccess] = useState(false);
  const [uploadingHighlight, setUploadingHighlight] = useState(false);

  const highlightSlot = getMediaSlot("LOOKBOOK_HIGHLIGHT_BANNER");
  const highlightVideo = getVideoInfo(highlightSlot?.imageUrl);

  useEffect(() => {
    setPageData(getLookbookContent());
  }, [getLookbookContent]);

  const handlePageFieldChange = (field: keyof LookbookPageData, value: string) => {
    setPageData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePageData = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingPage(true);
    try {
      await updateLookbookContent(pageData);
      setPageSavedSuccess(true);
      setTimeout(() => setPageSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Save lookbook editorial error:", err);
    } finally {
      setIsSavingPage(false);
    }
  };

  const handleResetPageData = async () => {
    if (confirm("Reset Lookbook Page editorial narrative and film reel to default copy?")) {
      await resetLookbookContent();
      setPageData(getLookbookContent());
      setPageSavedSuccess(true);
      setTimeout(() => setPageSavedSuccess(false), 3500);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LookbookItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [volume, setVolume] = useState("VOLUME I: KATHMANDU ARCHIVE");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([]);

  const openCreate = () => {
    setEditingItem(null);
    setTitle("");
    setVolume("VOLUME I: KATHMANDU ARCHIVE");
    setCaption("");
    setImageUrl(null);
    setFeaturedProductIds([]);
    setIsModalOpen(true);
  };

  const openEdit = (item: LookbookItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setVolume(item.volume);
    setCaption(item.caption || "");
    setImageUrl(item.imageUrl);
    setFeaturedProductIds(item.featuredProductIds || []);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSaving(true);
    try {
      if (editingItem) {
        await updateLookbookItem(editingItem.id, {
          title,
          volume,
          caption,
          imageUrl,
          featuredProductIds,
        });
      } else {
        await addLookbookItem({
          title,
          volume,
          caption,
          imageUrl,
          featuredProductIds,
          sortOrder: lookbookItems.length + 1,
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save lookbook error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleProductTag = (prodId: string) => {
    setFeaturedProductIds((prev) =>
      prev.includes(prodId) ? prev.filter((id) => id !== prodId) : [...prev, prodId]
    );
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      const res = await uploadToUploadcare(file);
      setImageUrl(res.cdnUrl);
    } catch (err) {
      console.warn("Uploadcare upload failed, attempting local compression:", err);
      try {
        const dataUrl = await compressImage(file, 2000, 1500, 0.82);
        setImageUrl(dataUrl);
      } catch (compErr) {
        console.error("Lookbook image compression error:", compErr);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              EDITORIAL 35MM PRODUCTION
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              LOOKBOOK FRAMES & SHOP-THE-LOOK
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
              Upload film campaign frames and tag specific Luga garments so patrons can &quot;Shop the Look&quot; directly from the spread.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="px-5 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>NEW LOOK FRAME</span>
            </button>
          </div>
        </div>

        {/* Page Saved Banner */}
        {pageSavedSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold tracking-wider uppercase">
                LOOKBOOK EDITORIAL HEADER & FILM REEL PUBLISHED TO SUPABASE
              </span>
            </div>
            <a
              href="/lookbook"
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1 hover:opacity-80"
            >
              <span>VIEW LIVE LOOKBOOK</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* 01 // LOOKBOOK EDITORIAL HEADER & FILM REEL CMS */}
        <section className="p-6 sm:p-8 bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-luga-border/50 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
                PART 01
              </span>
              <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
                EDITORIAL PAGE HEADER & 35MM CINEMATIC FILM REEL CMS
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPageData}
                className="px-3 py-1.5 border border-luga-border hover:border-luga-crimson hover:text-luga-crimson text-[10px] uppercase font-mono transition-colors"
              >
                RESET
              </button>
              <button
                type="button"
                onClick={() => handleSavePageData()}
                disabled={isSavingPage}
                className="px-4 py-1.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black hover:bg-luga-crimson dark:hover:bg-luga-gold text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE EDITORIAL</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cinematic Highlight Banner Media */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[21/9] bg-black border border-luga-border overflow-hidden">
                <ManagedImage
                  slotKey="LOOKBOOK_HIGHLIGHT_BANNER"
                  aspectRatio="21:9"
                  resolution="2560×1100px"
                  alt="Cinematic Film Reel"
                  className="w-full h-full border-none"
                />
                {highlightVideo.isVideo && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[9px] flex items-center gap-1 font-mono">
                    <VideoIcon className="w-2.5 h-2.5 text-luga-gold" />
                    <span>{highlightVideo.providerLabel.toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase">
                  CINEMATIC FILM REEL URL (MP4, WEBM, YOUTUBE, VIMEO)
                </label>
                <input
                  type="text"
                  value={highlightSlot?.imageUrl || ""}
                  onChange={(e) => updateMediaSlot("LOOKBOOK_HIGHLIGHT_BANNER", { imageUrl: e.target.value })}
                  placeholder="https://... or YouTube/Vimeo"
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                />
              </div>
            </div>

            {/* Header Text Inputs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">PAGE EYEBROW TAG</label>
                  <input
                    type="text"
                    value={pageData.lookbookTag}
                    onChange={(e) => handlePageFieldChange("lookbookTag", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">PAGE MAIN TITLE</label>
                  <input
                    type="text"
                    value={pageData.lookbookHeading}
                    onChange={(e) => handlePageFieldChange("lookbookHeading", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs font-editorial text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-luga-muted uppercase">PAGE DESCRIPTION COPY</label>
                <textarea
                  rows={2}
                  value={pageData.lookbookDescription}
                  onChange={(e) => handlePageFieldChange("lookbookDescription", e.target.value)}
                  className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-luga-border/40">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FILM REEL TITLE</label>
                  <input
                    type="text"
                    value={pageData.highlightHeading}
                    onChange={(e) => handlePageFieldChange("highlightHeading", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FILM REEL SUBTITLE / CREDITS</label>
                  <input
                    type="text"
                    value={pageData.highlightDescription}
                    onChange={(e) => handlePageFieldChange("highlightDescription", e.target.value)}
                    className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder p-2 text-xs text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 // 35MM ANALOG LOOKBOOK FRAMES */}
        <div className="flex items-center justify-between border-b border-luga-border pb-2 pt-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-luga-crimson/10 text-luga-crimson dark:bg-luga-gold/10 dark:text-luga-gold font-bold text-[10px]">
              PART 02
            </span>
            <h2 className="text-sm uppercase tracking-mega font-bold text-luga-ink dark:text-luga-darkInk">
              INDIVIDUAL ANALOG LOOKBOOK FRAMES ({lookbookItems.length})
            </h2>
          </div>
        </div>

        {/* Frames Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lookbookItems.map((item, idx) => {
            const tagged = products.filter((p) => item.featuredProductIds?.includes(p.id));

            return (
              <div
                key={item.id}
                className="bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder p-6 space-y-4"
              >
                <div className="flex justify-between items-center font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                  <span>FRAME 0{idx + 1} // {item.volume}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1 hover:text-luga-ink dark:hover:text-luga-darkInk"
                      title="Edit Frame"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete lookbook frame "${item.title}"?`)) {
                          deleteLookbookItem(item.id);
                        }
                      }}
                      className="p-1 text-luga-muted hover:text-red-500"
                      title="Delete Frame"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative aspect-[16/10] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/50 overflow-hidden">
                  <ManagedImage
                    src={item.imageUrl}
                    slotName={`LOOKBOOK_FRAME_${idx + 1}`}
                    aspectRatio="16:10"
                    resolution="2000×1250px"
                    alt={item.title}
                    className="w-full h-full border-none"
                  />
                </div>

                <div>
                  <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1 leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                {/* Tagged Garments */}
                <div className="pt-3 border-t border-luga-border/50 dark:border-luga-darkBorder/50 font-mono text-[10px]">
                  <span className="uppercase text-luga-muted block mb-1.5 font-bold">
                    TAGGED GARMENTS ({tagged.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tagged.map((g) => (
                      <span
                        key={g.id}
                        className="px-2 py-0.5 bg-luga-surface dark:bg-luga-darkSurface border border-luga-border text-luga-ink dark:text-luga-darkInk"
                      >
                        {g.title}
                      </span>
                    ))}
                    {tagged.length === 0 && (
                      <span className="text-luga-muted italic">No garments tagged yet</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-luga-bg dark:bg-[#121212] border border-luga-border dark:border-luga-darkBorder max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative my-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-luga-muted hover:text-luga-ink"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-editorial text-2xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mb-6">
                {editingItem ? "EDIT LOOKBOOK FRAME" : "ADD LOOKBOOK FRAME"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frame 01: Patan Durbar Monolith Coat"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">VOLUME NAME</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">EDITORIAL CAPTION / LOCATION</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Photographed at dawn against the 17th-century terracotta brick facades of Mul Chowk, Patan."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                {/* Upload Image */}
                <div className="space-y-2 pt-2 border-t border-luga-border">
                  <label className="text-[10px] text-luga-muted uppercase">FRAME IMAGE UPLOAD</label>
                  <div className="flex gap-2">
                    <label className="cursor-pointer py-2 px-3 border border-luga-border text-[10px] uppercase flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f);
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste image or video URL (MP4, YouTube, Vimeo)..."
                      value={imageUrl || ""}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 bg-transparent border border-luga-border p-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tag Products */}
                <div className="space-y-2 pt-2 border-t border-luga-border">
                  <label className="text-[10px] text-luga-muted uppercase">
                    TAG GARMENTS FOR &quot;SHOP THE LOOK&quot;
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-luga-border p-2">
                    {products.map((p) => {
                      const isTagged = featuredProductIds.includes(p.id);
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => toggleProductTag(p.id)}
                          className={`p-2 text-left border flex items-center justify-between transition-colors ${
                            isTagged
                              ? "border-luga-ink bg-luga-surface dark:border-luga-darkInk dark:bg-luga-darkSurface font-bold"
                              : "border-luga-border/50 text-luga-muted hover:border-luga-ink"
                          }`}
                        >
                          <span className="truncate pr-2">{p.title}</span>
                          {isTagged && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-luga-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 border border-luga-border uppercase text-center"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black uppercase tracking-ultra text-center flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isSaving ? (
                      <>
                        <Compass className="w-3.5 h-3.5 animate-spin-slow text-luga-crimson dark:text-luga-gold" />
                        <span>SYNCING TO SUPABASE...</span>
                      </>
                    ) : (
                      <span>SAVE FRAME</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
