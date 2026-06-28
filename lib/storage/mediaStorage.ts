type VercelBlobPut = (
  pathname: string,
  body: File,
  options: { access: "public"; addRandomSuffix: boolean; cacheControlMaxAge: number; contentType: string },
) => Promise<{ url: string; pathname: string; contentType?: string; size?: number }>;

type VercelBlobSdk = { put: VercelBlobPut };

async function loadVercelBlobSdk(): Promise<VercelBlobSdk> {
  try {
    // Keep the official SDK isolated to the server-side storage adapter.
    const sdkPackage = "@vercel/blob";
    return (await import(/* webpackIgnore: true */ sdkPackage)) as VercelBlobSdk;
  } catch (error) {
    throw new Error(
      "The official @vercel/blob SDK is not installed. Run `npm install @vercel/blob` and redeploy before uploading images.",
    );
  }
}

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
  const { put } = await loadVercelBlobSdk();
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
    contentType: file.type,
  });

  return {
    provider: "vercel-blob",
    bucket: new URL(blob.url).origin,
    objectKey: blob.pathname || pathname,
    url: blob.url,
    contentType: blob.contentType || file.type,
    sizeBytes: blob.size || file.size,
  };
}
