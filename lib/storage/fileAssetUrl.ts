export function fileAssetPublicUrl(fileAsset?: { bucket?: string | null; objectKey?: string | null } | null) {
  const objectKey = fileAsset?.objectKey;
  if (!objectKey) return null;
  if (/^(\/|https?:\/\/|data:image\/)/.test(objectKey)) return objectKey;
  const bucket = fileAsset?.bucket;
  if (bucket && /^https?:\/\//.test(bucket)) return `${bucket.replace(/\/$/, "")}/${objectKey.replace(/^\//, "")}`;
  return null;
}
