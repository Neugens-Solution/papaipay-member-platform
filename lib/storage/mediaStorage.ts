const VERCEL_BLOB_API_URL = "https://blob.vercel-storage.com";
const VERCEL_BLOB_API_VERSION = "11";

export const supportedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maxImageBytes = 5 * 1024 * 1024;

export type StoredMediaObject = {
  provider: "vercel-blob";
  bucket: string;
  objectKey: string;
  url: string;
  contentType: string;
  sizeBytes: number;
};

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  return ".jpg";
}

function safeName(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
}

export function validateImageFile(file: File) {
  if (!supportedImageMimeTypes.includes(file.type as (typeof supportedImageMimeTypes)[number])) {
    throw new Error("Images must be JPG, JPEG, PNG, or WEBP.");
  }
  if (file.size > maxImageBytes) {
    throw new Error("Images must be 5MB or smaller.");
  }
}

export async function uploadListingImage(file: File, campaignId: string): Promise<StoredMediaObject> {
  validateImageFile(file);

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Image storage is not configured. Set BLOB_READ_WRITE_TOKEN for Vercel Blob uploads.");
  }

  const pathname = `listings/${campaignId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName(file.name)}${extensionForMimeType(file.type)}`;
  const response = await fetch(`${VERCEL_BLOB_API_URL}/${pathname}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": file.type,
      "x-api-version": VERCEL_BLOB_API_VERSION,
      "x-add-random-suffix": "0",
      "x-cache-control-max-age": "31536000",
    },
    body: file,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Unable to upload image to Vercel Blob (${response.status}). ${message}`.trim());
  }

  const result = (await response.json()) as { url?: string; pathname?: string };
  if (!result.url) throw new Error("Vercel Blob upload did not return a public URL.");

  return {
    provider: "vercel-blob",
    bucket: "vercel-blob",
    objectKey: pathname,
    url: result.url,
    contentType: file.type,
    sizeBytes: file.size,
  };
}
