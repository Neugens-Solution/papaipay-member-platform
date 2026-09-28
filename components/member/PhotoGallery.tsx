"use client";

import { useCallback, useEffect, useState } from "react";

/** "View All Photos" button that opens a full-screen gallery with a viewer. */
export function PhotoGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => {
    setActive(null);
    setOpen(false);
  }, []);
  const step = useCallback(
    (delta: number) => setActive((index) => (index === null ? index : (index + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (active !== null) setActive(null);
        else close();
      } else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, active, close, step]);

  const button = "grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl font-bold text-white hover:bg-white/25";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-bold text-kasset-green"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        View All Photos ({images.length})
      </button>

      {open ? (
        <div role="dialog" aria-modal="true" aria-label={`${title} photos`} className="fixed inset-0 z-50 flex flex-col bg-slate-950/95">
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white sm:px-6">
            <p className="min-w-0 truncate text-sm font-bold">
              {title} · {active === null ? `${images.length} photos` : `${active + 1} / ${images.length}`}
            </p>
            <div className="flex gap-2">
              {active !== null ? (
                <button type="button" onClick={() => setActive(null)} className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold hover:bg-white/25">
                  All photos
                </button>
              ) : null}
              <button type="button" onClick={close} aria-label="Close" className={button}>×</button>
            </div>
          </div>

          {active === null ? (
            <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
              <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    className="aspect-[4/3] overflow-hidden rounded-lg bg-slate-800"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${title} photo ${index + 1}`} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[active]} alt={`${title} photo ${active + 1}`} className="max-h-full max-w-full rounded-lg object-contain" />
              {images.length > 1 ? (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={`${button} absolute left-2 top-1/2 -translate-y-1/2 sm:left-4`}>‹</button>
                  <button type="button" onClick={() => step(1)} aria-label="Next photo" className={`${button} absolute right-2 top-1/2 -translate-y-1/2 sm:right-4`}>›</button>
                </>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
