"use client";

import { useRef, useState } from "react";

type ImageCarouselProps = {
  images: string[];
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollToImage(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), images.length - 1);
    const scroller = scrollerRef.current;
    const slide = scroller?.children.item(nextIndex) as HTMLElement | null;

    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(nextIndex);
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const nextIndex = Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1));
    setActiveIndex(Math.min(Math.max(nextIndex, 0), images.length - 1));
  }

  return (
    <>
      <div ref={scrollerRef} onScroll={handleScroll} className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth bg-slate-100">
        {images.map((item, index) => (
          <div key={`${item}-${index}`} className="h-64 min-w-full snap-center bg-cover bg-center sm:h-[26rem]" style={{ backgroundImage: `url(${item})` }} aria-label={`Asset photo ${index + 1}`} />
        ))}
      </div>
      <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-white">{activeIndex + 1} / {images.length}</span>
      <button type="button" aria-label="Previous photo" onClick={() => scrollToImage(activeIndex - 1)} disabled={activeIndex === 0} className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl font-bold text-papaipay-ink shadow-md transition hover:text-papaipay-green disabled:cursor-not-allowed disabled:opacity-50 md:grid">‹</button>
      <button type="button" aria-label="Next photo" onClick={() => scrollToImage(activeIndex + 1)} disabled={activeIndex === images.length - 1} className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-2xl font-bold text-papaipay-ink shadow-md transition hover:text-papaipay-green disabled:cursor-not-allowed disabled:opacity-50 md:grid">›</button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2 py-1 backdrop-blur" aria-label="Photo indicators">
        {images.map((item, index) => (
          <button key={`${item}-${index}`} type="button" aria-label={`View photo ${index + 1}`} onClick={() => scrollToImage(index)} className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-papaipay-green" : "bg-slate-300"}`} />
        ))}
      </div>
    </>
  );
}
