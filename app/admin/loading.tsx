function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-200/80 ${className}`} />;
}

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6" aria-label="Loading admin portal content">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <SkeletonLine className="h-3 w-28" />
          <SkeletonLine className="mt-5 h-8 w-64" />
          <SkeletonLine className="mt-4 h-4 w-full max-w-xl" />
        </div>
        <SkeletonLine className="h-10 w-32" />
      </header>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200/70 bg-white p-5">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="mt-5 h-8 w-20" />
            <SkeletonLine className="mt-4 h-3 w-full" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white" aria-hidden="true">
        <div className="grid gap-4 border-b border-slate-100 px-4 py-4 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          {[0, 1, 2, 3, 4].map((item) => <SkeletonLine key={item} className="h-3 w-full" />)}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={row} className="grid gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonLine className="h-8 w-20" />
          </div>
        ))}
      </section>
    </div>
  );
}
