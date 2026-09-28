export const supportedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maxImageBytes = 5 * 1024 * 1024;

const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const safePathnamePattern = /^listings\/[a-z0-9]+(?:-[a-z0-9]+)*\/[0-9]+-[a-z0-9]{6}\.(jpg|jpeg|png|webp)$/;

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  return ".jpg";
}

export function extensionFromFilename(filename: string, mimeType: string) {
  const detectedExtension = filename.match(/\.([a-zA-Z0-9]+)$/)?.[0]?.toLowerCase() ?? null;
  const finalExtension = detectedExtension && allowedImageExtensions.has(detectedExtension)
    ? detectedExtension
    : extensionForMimeType(mimeType);

  return { detectedExtension, finalExtension };
}

export function slugifyPathSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "listing";
}

export function listingImagePathPrefix(listingSlug: string) {
  return `listings/${slugifyPathSegment(listingSlug)}/`;
}

export function isSafeListingImagePathname(pathname: string, listingSlug: string) {
  return safePathnamePattern.test(pathname) && pathname.startsWith(listingImagePathPrefix(listingSlug));
}

export function createListingImagePathname(listingSlug: string, file: { name: string; type: string }) {
  const { finalExtension } = extensionFromFilename(file.name, file.type);
  const random = Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(2, 8).padEnd(6, "0");
  const pathname = `${listingImagePathPrefix(listingSlug)}${Date.now()}-${random}${finalExtension}`;

  if (!safePathnamePattern.test(pathname)) {
    throw new Error(`Invalid generated Blob pathname: ${pathname}`);
  }

  return { pathname, extension: finalExtension };
}

export function validateImageFile(file: { type: string; size: number }) {
  if (!supportedImageMimeTypes.includes(file.type as (typeof supportedImageMimeTypes)[number])) {
    throw new Error("Images must be JPG, JPEG, PNG, or WEBP.");
  }
  if (file.size > maxImageBytes) {
    throw new Error("Images must be 5MB or smaller.");
  }
}

/** Reference to an image the browser already uploaded to Vercel Blob. */
export type UploadedListingImage = {
  url: string;
  pathname: string;
  originalFilename: string;
};
