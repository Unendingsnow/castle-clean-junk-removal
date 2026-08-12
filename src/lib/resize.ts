import { JPEG_QUALITY, MAX_EDGE_PX } from "./constants";

/**
 * Browser-only image downscaling.
 *
 * Phone cameras produce 5-12MB files and Telegram refuses any multipart photo
 * over 10MB, so every selected image is decoded, drawn into a canvas at a
 * capped longest edge, and re-encoded as JPEG before it ever hits the network.
 * A 12MP photo typically lands around 200-400KB after this.
 */

export type PreparedImage = {
  /** Stable key for React lists and removal. */
  id: string;
  /** The downscaled file that actually gets uploaded. */
  file: File;
  /** Object URL for the thumbnail. Must be revoked when discarded. */
  previewUrl: string;
  originalName: string;
  originalBytes: number;
  bytes: number;
  width: number;
  height: number;
};

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
};

/**
 * Decode a file to something drawable.
 *
 * `createImageBitmap` with `imageOrientation: "from-image"` is the path that
 * respects EXIF rotation, which matters because phone photos are almost always
 * stored landscape with a rotation flag. The `<img>` fallback covers browsers
 * that can't decode the format via createImageBitmap.
 */
async function decode(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // Fall through to the <img> path below.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const element = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not decode image"));
      img.src = url;
    });
    return {
      source: element,
      width: element.naturalWidth,
      height: element.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

function toJpegName(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, "").trim() || "photo";
  return `${base}.jpg`;
}

/**
 * Downscale and re-encode a single image.
 *
 * Throws if the file cannot be decoded (corrupt, or a format this browser
 * doesn't support) so the caller can report that one file and keep the rest.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const decoded = await decode(file);

  try {
    if (!decoded.width || !decoded.height) {
      throw new Error("Image has no dimensions");
    }

    const longestEdge = Math.max(decoded.width, decoded.height);
    const scale = longestEdge > MAX_EDGE_PX ? MAX_EDGE_PX / longestEdge : 1;
    const width = Math.max(1, Math.round(decoded.width * scale));
    const height = Math.max(1, Math.round(decoded.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // White matte: JPEG has no alpha, and transparent PNGs would otherwise
    // composite onto black.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(decoded.source, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("Could not encode image");

    // If we never had to downscale and re-encoding made the file bigger,
    // the original is the better upload.
    const keepOriginal = scale === 1 && blob.size >= file.size;
    const output = keepOriginal
      ? file
      : new File([blob], toJpegName(file.name), {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      file: output,
      previewUrl: URL.createObjectURL(output),
      originalName: file.name,
      originalBytes: file.size,
      bytes: output.size,
      width,
      height,
    };
  } finally {
    decoded.release();
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
