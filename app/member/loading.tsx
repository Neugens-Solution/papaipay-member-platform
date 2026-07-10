function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-200/80 ${className}`} />;
}

export default function MemberLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6" aria-label="Loading member portal content">
      <section className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.04)] sm:p-8">
        <SkeletonLine className="h-3 w-32" />
        <SkeletonLine className="mt-5 h-8 w-2/3 max-w-xl" />
        <SkeletonLine className="mt-4 h-4 w-full max-w-2xl" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200/70 bg-white p-5">
            <SkeletonLine className="h-3 w-28" />
            <SkeletonLine className="mt-5 h-7 w-24" />
            <SkeletonLine className="mt-4 h-3 w-full" />
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <SkeletonLine className="h-3 w-36" />
                <SkeletonLine className="mt-4 h-5 w-3/4" />
                <SkeletonLine className="mt-3 h-3 w-1/2" />
              </div>
              <SkeletonLine className="h-7 w-20" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((subItem) => <SkeletonBlock key={subItem} className="h-16" />)}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
