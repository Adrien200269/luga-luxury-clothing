"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { LookbookItem } from "@/types";
import { Plus, Edit2, Trash2, X, Upload, Check, Compass } from "lucide-react";
import { compressImage } from "@/lib/image-utils";
import { uploadToUploadcare } from "@/lib/uploadcare";

export default function AdminLookbookPage() {
  const { lookbookItems, addLookbookItem, updateLookbookItem, deleteLookbookItem, products } = useStore();

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

          <button
            onClick={openCreate}
            className="px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ADD LOOKBOOK FRAME</span>
          </button>
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
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f);
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste URL..."
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
