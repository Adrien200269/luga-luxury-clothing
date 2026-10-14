"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useStore } from "@/lib/store-context";
import { Collection } from "@/types";
import { Plus, Edit2, Trash2, X, Layers, Upload, Compass } from "lucide-react";
import { compressImage } from "@/lib/image-utils";
import { uploadToUploadcare } from "@/lib/uploadcare";

export default function AdminCollectionsPage() {
  const { collections, addCollection, updateCollection, deleteCollection, products } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [volumeNumber, setVolumeNumber] = useState("VOLUME III");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  const openCreate = () => {
    setEditingCollection(null);
    setTitle("");
    setSlug("");
    setVolumeNumber(`VOLUME 0${collections.length + 1}`);
    setDescription("");
    setCoverImageUrl(null);
    setIsModalOpen(true);
  };

  const openEdit = (col: Collection) => {
    setEditingCollection(col);
    setTitle(col.title);
    setSlug(col.slug);
    setVolumeNumber(col.volumeNumber);
    setDescription(col.description);
    setCoverImageUrl(col.coverImageUrl);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSaving(true);
    try {
      const finalSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      if (editingCollection) {
        await updateCollection(editingCollection.id, {
          title,
          slug: finalSlug,
          volumeNumber,
          description,
          coverImageUrl,
        });
      } else {
        await addCollection({
          title,
          slug: finalSlug,
          volumeNumber,
          description,
          coverImageUrl,
          isActive: true,
        });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Save collection error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      const res = await uploadToUploadcare(file);
      setCoverImageUrl(res.cdnUrl);
    } catch (err) {
      console.warn("Uploadcare direct upload failed, attempting local compression:", err);
      try {
        const dataUrl = await compressImage(file, 2000, 1500, 0.82);
        setCoverImageUrl(dataUrl);
      } catch (compErr) {
        console.error("Local compression error:", compErr);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              LUGA ARCHIVE CURATION
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              VOLUMES & COLLECTIONS
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
              Organize garments into numbered seasonal drops, capsule releases, and campaign narratives.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="px-6 py-3 bg-luga-ink text-white dark:bg-luga-darkInk dark:text-black font-mono text-xs uppercase tracking-ultra flex items-center gap-2 hover:bg-luga-crimson dark:hover:bg-luga-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW VOLUME</span>
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {collections.map((col) => {
            const count = products.filter((p) => p.collectionId === col.id).length;

            return (
              <div
                key={col.id}
                className="bg-luga-bg dark:bg-[#0F0F0F] border border-luga-border dark:border-luga-darkBorder p-6 flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center font-mono text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold mb-2">
                    <span>{col.volumeNumber}</span>
                    <span className="text-luga-muted">{count} GARMENTS</span>
                  </div>

                  <h3 className="font-editorial text-2xl text-luga-ink dark:text-luga-darkInk uppercase">
                    {col.title}
                  </h3>

                  <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-2 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="relative aspect-[16/9] bg-luga-surface dark:bg-luga-darkSurface border border-luga-border/50 overflow-hidden">
                  <ManagedImage
                    src={col.coverImageUrl}
                    slotKey={col.coverSlotKey}
                    slotName={`COLLECTION_${col.id}`}
                    aspectRatio="16:9"
                    resolution="1600×900px"
                    alt={col.title}
                    showInfo={false}
                    className="w-full h-full border-none"
                  />
                </div>

                <div className="pt-4 border-t border-luga-border dark:border-luga-darkBorder flex items-center justify-between font-mono text-xs">
                  <span className="text-[10px] text-luga-muted">SLUG: /{col.slug}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(col)}
                      className="p-1.5 border border-luga-border hover:border-luga-ink text-luga-ink dark:text-luga-darkInk"
                      title="Edit Volume"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete volume "${col.title}"?`)) {
                          deleteCollection(col.id);
                        }
                      }}
                      className="p-1.5 border border-luga-border hover:border-red-500 hover:text-red-500 text-luga-muted"
                      title="Delete Volume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-luga-bg dark:bg-[#121212] border border-luga-border dark:border-luga-darkBorder max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl relative my-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-luga-muted hover:text-luga-ink"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-editorial text-2xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mb-6">
                {editingCollection ? "EDIT VOLUME" : "CREATE NEW VOLUME"}
              </h2>

              <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">VOLUME TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Volume III: Mustang Monolith"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">VOLUME NUMBER TAG</label>
                    <input
                      type="text"
                      placeholder="e.g. VOLUME III"
                      value={volumeNumber}
                      onChange={(e) => setVolumeNumber(e.target.value)}
                      className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-luga-muted uppercase">URL SLUG</label>
                    <input
                      type="text"
                      placeholder="e.g. volume-3-mustang"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-luga-muted uppercase">EDITORIAL NARRATIVE</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the concept and inspiration behind this volume..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border border-luga-border p-2.5 text-luga-ink dark:text-luga-darkInk focus:outline-none"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-2 pt-2 border-t border-luga-border">
                  <label className="text-[10px] text-luga-muted uppercase">COVER IMAGE UPLOAD</label>
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
                      value={coverImageUrl || ""}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="flex-1 bg-transparent border border-luga-border p-2 text-xs focus:outline-none"
                    />
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
                      <span>SAVE VOLUME</span>
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
