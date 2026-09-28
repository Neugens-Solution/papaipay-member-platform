import { head, put } from "@vercel/blob";
import {
  createListingImagePathname,
  isSafeListingImagePathname,
  supportedImageMimeTypes,
  maxImageBytes,
  validateImageFile,
  type UploadedListingImage,
} from "@/lib/storage/listingImagePath";

export { supportedImageMimeTypes, maxImageBytes, validateImageFile };

type VercelBlobResult = Awaited<ReturnType<typeof put>>;

export type StoredMediaObject = {
  provider: "vercel-blob";
  bucket: string;
  objectKey: string;
  url: string;
  contentType: string;
  sizeBytes: number;
};

export async function uploadListingImage(file: File, listingSlug: string): Promise<StoredMediaObject> {
  validateImageFile(file);

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Image storage is not configured. Set BLOB_READ_WRITE_TOKEN for Vercel Blob uploads.");
  }

  const { pathname } = createListingImagePathname(listingSlug, file);
  let blob: VercelBlobResult;
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
    sizeBytes: file.size,
  };
}

/**
 * Verifies an image the browser uploaded directly to Vercel Blob (client upload)
 * and returns its stored metadata. Never trust the client-supplied url/size/type.
 */
export async function verifyUploadedListingImage(upload: UploadedListingImage, listingSlug: string): Promise<StoredMediaObject> {
  if (!isSafeListingImagePathname(upload.pathname, listingSlug)) {
    throw new Error("Uploaded image does not belong to this listing.");
  }
  let blob: Awaited<ReturnType<typeof head>>;
  try {
    blob = await head(upload.url);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Uploaded image could not be found in storage. ${message}`);
  }
  if (blob.pathname !== upload.pathname) {
    throw new Error("Uploaded image does not belong to this listing.");
  }
  validateImageFile({ type: blob.contentType, size: blob.size });

  return {
    provider: "vercel-blob",
    bucket: new URL(blob.url).origin,
    objectKey: blob.pathname,
    url: blob.url,
    contentType: blob.contentType,
    sizeBytes: blob.size,
  };
}
