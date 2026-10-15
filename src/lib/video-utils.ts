/**
 * LUGA Luxury Atelier - Video & Media Stream Utilities
 * Comprehensive detection, parsing, and embed generation for all web video sources:
 * - YouTube (standard watch, shorts, youtu.be, embed, nocookie)
 * - Vimeo (standard, channels, player embed)
 * - Google Drive video preview
 * - Direct video streams / files (MP4, WebM, MOV, OGG, MKV)
 * - Uploadcare CDN media pipelines
 */

export type VideoProvider = "youtube" | "vimeo" | "googledrive" | "direct" | null;

export interface VideoInfo {
  isVideo: boolean;
  provider: VideoProvider;
  providerLabel: string;
  originalUrl: string;
  embedUrl: string | null;
  videoId: string | null;
  mimeType?: string;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID&feature=share
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const clean = url.trim();

  // 11 character alphanumeric + underscore + dash
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=|v\/|user\/\S+\/u\/\w\/))([\w-]{11})/i;
  const match = clean.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  // Handle youtu.be/<id>?...
  const shortExp = /^https?:\/\/youtu\.be\/([\w-]{11})/i;
  const shortMatch = clean.match(shortExp);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  return null;
}

/**
 * Extracts Vimeo video ID from various Vimeo URL formats:
 * - https://vimeo.com/123456789
 * - https://player.vimeo.com/video/123456789
 * - https://vimeo.com/channels/staffpicks/123456789
 */
export function getVimeoVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const clean = url.trim();

  const regExp = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/i;
  const match = clean.match(regExp);
  return match ? match[1] || match[2] : null;
}

/**
 * Extracts Google Drive file ID from sharing URLs:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 */
export function getGoogleDriveVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const clean = url.trim();

  const regExp = /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/i;
  const match = clean.match(regExp);
  return match ? match[1] : null;
}

/**
 * Determines proper MIME type for direct HTML5 video playback
 */
export function getVideoMimeType(url?: string | null): string {
  if (!url) return "video/mp4";
  const lower = url.toLowerCase();
  if (/\.webm(\?|#|$)/i.test(lower)) return "video/webm";
  if (/\.mov(\?|#|$)/i.test(lower)) return "video/quicktime";
  if (/\.og[gv](\?|#|$)/i.test(lower)) return "video/ogg";
  if (/\.m4v(\?|#|$)/i.test(lower)) return "video/mp4";
  if (/\.mkv(\?|#|$)/i.test(lower)) return "video/x-matroska";
  return "video/mp4";
}

/**
 * Comprehensive Video Information Analyzer
 */
export function getVideoInfo(url?: string | null): VideoInfo {
  if (!url || typeof url !== "string") {
    return {
      isVideo: false,
      provider: null,
      providerLabel: "Image",
      originalUrl: "",
      embedUrl: null,
      videoId: null,
    };
  }

  const trimmed = url.trim();

  // 1. YouTube check
  const ytId = getYouTubeVideoId(trimmed);
  if (ytId) {
    return {
      isVideo: true,
      provider: "youtube",
      providerLabel: "YouTube",
      originalUrl: trimmed,
      videoId: ytId,
      // enablejsapi=1 allows postMessage playback/mute control from outside
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&playsinline=1&controls=0&rel=0&modestbranding=1&enablejsapi=1`,
    };
  }

  // 2. Vimeo check
  const vimeoId = getVimeoVideoId(trimmed);
  if (vimeoId) {
    return {
      isVideo: true,
      provider: "vimeo",
      providerLabel: "Vimeo",
      originalUrl: trimmed,
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1&playsinline=1&byline=0&title=0&dnt=1`,
    };
  }

  // 3. Google Drive check
  const gdriveId = getGoogleDriveVideoId(trimmed);
  if (gdriveId) {
    return {
      isVideo: true,
      provider: "googledrive",
      providerLabel: "Google Drive",
      originalUrl: trimmed,
      videoId: gdriveId,
      embedUrl: `https://drive.google.com/file/d/${gdriveId}/preview`,
    };
  }

  // 4. Direct video files or CDN streams
  const isDirect =
    /\.(mp4|webm|mov|m4v|ogg|ogv|mkv)(\?|#|$)/i.test(trimmed) ||
    trimmed.startsWith("data:video/") ||
    trimmed.startsWith("blob:") ||
    trimmed.includes("video/") ||
    /\/video(\/|\.)/i.test(trimmed) ||
    trimmed.includes("/adaptive_video/");

  if (isDirect) {
    return {
      isVideo: true,
      provider: "direct",
      providerLabel: "Direct Video",
      originalUrl: trimmed,
      videoId: null,
      embedUrl: null,
      mimeType: getVideoMimeType(trimmed),
    };
  }

  return {
    isVideo: false,
    provider: null,
    providerLabel: "Image",
    originalUrl: trimmed,
    embedUrl: null,
    videoId: null,
  };
}

/**
 * Checks if a given media URL is a video (YouTube, Vimeo, Google Drive, or direct video file)
 */
export function isVideoUrl(url?: string | null): boolean {
  return getVideoInfo(url).isVideo;
}
