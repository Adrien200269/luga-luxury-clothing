import { uploadFile } from "@uploadcare/upload-client";

// Key for saving custom public key in browser storage
export const UPLOADCARE_STORAGE_KEY = "luga_uploadcare_public_key";

/**
 * Returns the active Uploadcare Public Key.
 * Priority:
 * 1. Saved key in localStorage (set via Admin UI)
 * 2. NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY env variable
 * 3. Default fallback "demopublickey"
 */
export function getUploadcarePublicKey(): string {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(UPLOADCARE_STORAGE_KEY);
      if (saved && saved.trim()) {
        return saved.trim();
      }
    } catch {
      // Ignore localStorage access errors
    }
  }

  return (
    process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY?.trim() || "98f6df279a4963cdd1f9"
  );
}

/**
 * Returns the Uploadcare Secret Key for server-side REST API operations
 */
export function getUploadcareSecretKey(): string {
  return process.env.UPLOADCARE_SECRET_KEY?.trim() || "";
}

/**
 * Persists an Uploadcare public key in localStorage
 */
export function setUploadcarePublicKey(key: string): void {
  if (typeof window !== "undefined") {
    try {
      if (key && key.trim()) {
        localStorage.setItem(UPLOADCARE_STORAGE_KEY, key.trim());
      } else {
        localStorage.removeItem(UPLOADCARE_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Could not save uploadcare key to localStorage:", e);
    }
  }
}

/**
 * Checks if a given media URL is a video
 */
export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".mkv") ||
    clean.includes("video/") ||
    clean.startsWith("data:video/") ||
    // Uploadcare video transformation or extension in path
    /\/video(\/|\.)/.test(clean)
  );
}

export interface UploadcareUploadResult {
  cdnUrl: string;
  uuid: string;
  name: string;
  isVideo: boolean;
  mimeType: string | null;
  size: number;
}

/**
 * Uploads any photo or video file directly to Uploadcare CDN.
 * Bypasses serverless payload size limits, avoids localStorage quota crashes,
 * and yields high-speed global CDN URLs.
 */
export async function uploadToUploadcare(
  file: File,
  options?: {
    onProgress?: (percent: number) => void;
    publicKey?: string;
  }
): Promise<UploadcareUploadResult> {
  const pubKey = options?.publicKey || getUploadcarePublicKey();

  const isVideo =
    file.type.startsWith("video/") ||
    /\.(mp4|webm|mov|m4v|ogg|mkv)$/i.test(file.name);

  // Upload using upload-client
  const result = await uploadFile(file, {
    publicKey: pubKey,
    store: "auto",
    fileName: file.name,
    contentType: file.type || undefined,
    onProgress: (info) => {
      if (info.isComputable && options?.onProgress) {
        options.onProgress(Math.round(info.value * 100));
      }
    },
  });

  // Uploadcare CDN URL
  // We append the clean filename if not already present so that video players
  // and browsers immediately recognize the file type/extension.
  let cdnUrl = result.cdnUrl || `https://ucarecdn.com/${result.uuid}/`;
  if (!cdnUrl.endsWith("/")) {
    cdnUrl += "/";
  }

  // Preserve filename with extension for video recognition
  if (file.name) {
    const encodedName = encodeURIComponent(file.name);
    cdnUrl += encodedName;
  }

  return {
    cdnUrl,
    uuid: result.uuid,
    name: file.name,
    isVideo,
    mimeType: file.type || null,
    size: file.size,
  };
}
