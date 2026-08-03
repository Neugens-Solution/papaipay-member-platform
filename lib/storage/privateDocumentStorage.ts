import { del, put } from "@vercel/blob";

export const supportedPrivateDocumentMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
] as const;

export const maxPrivateDocumentBytes = 5 * 1024 * 1024;

export type PrivateDocumentCategory = "kyc" | "payment-receipts";

export type StoredPrivateDocument = {
  bucket: string;
  objectKey: string;
  contentType: string;
  sizeBytes: number;
};

function extensionForMimeType(mimeType: string) {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "application/pdf") return ".pdf";
  return ".jpg";
}

function safeSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "document";
}

function privateBlobToken() {
  const token = process.env.PRIVATE_BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("Private document storage is not configured.");
  return token;
}

export function validatePrivateDocument(file: File) {
  if (!supportedPrivateDocumentMimeTypes.includes(file.type as (typeof supportedPrivateDocumentMimeTypes)[number])) {
    throw new Error("Upload a JPG, PNG, or PDF file.");
  }

  if (file.size <= 0) throw new Error("The selected file is empty.");
  if (file.size > maxPrivateDocumentBytes) throw new Error("Files must be 5MB or smaller.");
}

export async function uploadPrivateDocument(
  file: File,
  category: PrivateDocumentCategory,
  ownerRef: string,
): Promise<StoredPrivateDocument> {
  validatePrivateDocument(file);

  const extension = extensionForMimeType(file.type);
  const random = Math.random().toString(36).slice(2, 10);
  const pathname = `${category}/${safeSegment(ownerRef)}/${Date.now()}-${random}${extension}`;
  const blob = await put(pathname, file, {
    access: "private",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: file.type,
    token: privateBlobToken(),
  });

  return {
    bucket: new URL(blob.url).origin,
    objectKey: blob.pathname || pathname,
    contentType: blob.contentType || file.type,
    sizeBytes: file.size,
  };
}

export async function deletePrivateDocuments(objectKeys: string[]) {
  if (objectKeys.length === 0) return;
  await del(objectKeys, { token: privateBlobToken() });
}
