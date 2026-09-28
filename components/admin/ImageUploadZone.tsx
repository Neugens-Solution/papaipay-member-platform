"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  createListingImagePathname,
  validateImageFile,
  type UploadedListingImage,
} from "@/lib/storage/listingImagePath";

type Item = {
  id: string;
  name: string;
  previewUrl: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
  result?: UploadedListingImage;
};

/**
 * Uploads listing images straight from the browser to Vercel Blob, one request
 * per file, and submits only the resulting references with the form. This keeps
 * the Server Action body small no matter how many images are selected.
 */
export function ImageUploadZone({
  title,
  helper,
  name,
  multiple = false,
  campaignId,
  listingSlug,
  currentFiles = [],
  error,
}: {
  title: string;
  helper: string;
  name: string;
  multiple?: boolean;
  campaignId?: string;
  listingSlug?: string;
  currentFiles?: { id: string; name: string; url?: string }[];
  error?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const canUpload = Boolean(campaignId && listingSlug);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl)), []);

  // React resets the form after a successful action; drop uploaded references
  // so they are not saved a second time on the next submit.
  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const clear = () =>
      setItems((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        return [];
      });
    form.addEventListener("reset", clear);
    return () => form.removeEventListener("reset", clear);
  }, []);

  function patch(id: string, next: Partial<Item>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...next } : item)));
  }

  async function uploadOne(item: Item, file: File) {
    try {
      validateImageFile(file);
      const { pathname } = createListingImagePathname(listingSlug!, file);
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/listings/media-upload",
        clientPayload: campaignId,
        contentType: file.type,
        onUploadProgress: ({ percentage }) => patch(item.id, { progress: percentage }),
      });
      patch(item.id, {
        status: "done",
        progress: 100,
        result: { url: blob.url, pathname: blob.pathname, originalFilename: file.name },
      });
    } catch (uploadError) {
      patch(item.id, {
        status: "error",
        error: uploadError instanceof Error ? uploadError.message : "Upload failed.",
      });
    }
  }

  function onSelect(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    const next = files.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "uploading" as const,
    }));
    setItems((prev) => {
      const kept = multiple ? prev : [];
      if (!multiple) prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [...kept, ...next];
    });
    next.forEach((item, index) => void uploadOne(item, files[index]));
  }

  function remove(id: string) {
    setItems((prev) =>
      prev.filter((item) => {
        if (item.id === id) URL.revokeObjectURL(item.previewUrl);
        return item.id !== id;
      }),
    );
  }

  const uploading = items.some((item) => item.status === "uploading");
  const shown = items.length
    ? items
    : currentFiles.map((file) => ({ id: file.id, name: file.name, previewUrl: file.url ?? "", progress: 100, status: "done" as const }));

  return (
    <div
      ref={rootRef}
      data-field={name}
      className={`min-w-0 rounded-2xl border border-dashed bg-slate-50 p-4 ${error ? "border-red-300" : "border-slate-300"}`}
    >
      <p className="text-sm font-black text-kasset-ink">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
      {canUpload ? (
        <label className="mt-3 inline-flex cursor-pointer rounded-full bg-white px-3 py-2 text-xs font-black text-kasset-green ring-1 ring-emerald-100">
          <input
            type="file"
            multiple={multiple}
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              onSelect(event.currentTarget.files);
              event.currentTarget.value = "";
            }}
          />
          Choose file{multiple ? "s" : ""}
        </label>
      ) : (
        <p className="mt-3 text-xs font-bold text-amber-700">Save Overview first to enable image uploads.</p>
      )}
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Supported: JPG, PNG, WEBP · max 5MB each
      </p>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}

      {items.map((item) =>
        item.status === "done" && item.result ? (
          <input key={item.id} type="hidden" name={name} value={JSON.stringify(item.result)} />
        ) : null,
      )}
      {uploading ? <input type="hidden" name="mediaUploadPending" value="true" /> : null}

      {shown.length ? (
        <div className="mt-3 grid gap-2">
          {shown.map((item, index) => (
            <div key={item.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-white p-2">
              <div className="grid h-14 w-14 flex-none place-items-center overflow-hidden rounded-md bg-emerald-50 text-xs font-black text-kasset-green">
                {item.previewUrl ? (
                  <span
                    className="block h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.previewUrl})` }}
                    aria-label="Selected image preview"
                  />
                ) : (
                  "IMG"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-700">{item.name}</p>
                {index === 0 && !multiple ? (
                  <p className="text-[11px] font-black uppercase text-kasset-green">Main / Hero</p>
                ) : null}
                {item.status === "uploading" ? (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-kasset-green transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                ) : null}
                {"error" in item && item.error ? (
                  <p className="text-[11px] font-bold text-red-600">{item.error}</p>
                ) : null}
                {items.length && item.status === "done" ? (
                  <p className="text-[11px] font-bold text-kasset-green">Uploaded · save this step to attach</p>
                ) : null}
              </div>
              {items.length ? (
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="flex-none rounded-full px-2 py-1 text-xs font-black text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
