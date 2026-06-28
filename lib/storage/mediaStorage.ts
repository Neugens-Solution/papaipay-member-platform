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

const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const safePathnamePattern = /^listings\/[a-z0-9]+(?:-[a-z0-9]+)*\/[0-9]+-[a-z0-9]{6}\.(jpg|jpeg|png|webp)$/;

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  return ".jpg";
}

function extensionFromFilename(filename: string, mimeType: string) {
  const detectedExtension = filename.match(/\.([a-zA-Z0-9]+)$/)?.[0]?.toLowerCase() ?? null;
  const finalExtension = detectedExtension && allowedImageExtensions.has(detectedExtension)
    ? detectedExtension
    : extensionForMimeType(mimeType);

  return { detectedExtension, finalExtension };
}

function slugifyPathSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "listing";
}

function createListingImagePathname(listingSlug: string, file: File) {
  const slug = slugifyPathSegment(listingSlug);
  const { detectedExtension, finalExtension } = extensionFromFilename(file.name, file.type);
  const random = Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(2, 8).padEnd(6, "0");
  const pathname = `listings/${slug}/${Date.now()}-${random}${finalExtension}`;

  console.info("Generated pathname:", pathname);
  console.info("Original filename:", file.name);
  console.info("Detected extension:", detectedExtension ?? "none");
  console.info("Final extension:", finalExtension);

  if (!safePathnamePattern.test(pathname)) {
    throw new Error(`Invalid generated Blob pathname: ${pathname}`);
  }

  return { pathname, extension: finalExtension };
}

export function validateImageFile(file: File) {
  if (!supportedImageMimeTypes.includes(file.type as (typeof supportedImageMimeTypes)[number])) {
    throw new Error("Images must be JPG, JPEG, PNG, or WEBP.");
  }
  if (file.size > maxImageBytes) {
    throw new Error("Images must be 5MB or smaller.");
  }
}

export async function uploadListingImage(file: File, listingSlug: string): Promise<StoredMediaObject> {
  validateImageFile(file);

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Image storage is not configured. Set BLOB_READ_WRITE_TOKEN for Vercel Blob uploads.");
  }

  const { pathname } = createListingImagePathname(listingSlug, file);
  const { put } = await loadVercelBlobSdk();
  let blob: Awaited<ReturnType<VercelBlobPut>>;
  try {
    blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000,
      contentType: file.type,
    });
  } catch (error) {
    console.error("Vercel Blob upload failed for pathname:", pathname);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to upload image to Vercel Blob. ${message}`);
  }

  return {
    provider: "vercel-blob",
    bucket: new URL(blob.url).origin,
    objectKey: blob.pathname || pathname,
    url: blob.url,
    contentType: blob.contentType || file.type,
    sizeBytes: blob.size || file.size,
  };
}
