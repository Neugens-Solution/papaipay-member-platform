function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

export function MemberOpportunitiesSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading Listings">
      <header className="space-y-4">
        <Skeleton className="h-9 w-72" />
        <div className="flex gap-2"><Skeleton className="h-9 w-20 rounded-full" /><Skeleton className="h-9 w-28 rounded-full" /><Skeleton className="h-9 w-16 rounded-full" /></div>
        <div className="sticky top-[65px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:top-[73px] sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/90 sm:p-3">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><Skeleton className="h-11 rounded-xl" /><Skeleton className="hidden h-11 rounded-xl md:block" /><Skeleton className="hidden h-11 rounded-xl md:block" /><Skeleton className="hidden h-11 rounded-xl md:block" /></div>
        </div>
      </header>
      <p className="text-sm font-semibold text-slate-500">Loading Listings...</p>
      <section className="grid gap-5 xl:grid-cols-3">
        {[0, 1, 2].map((item) => <article key={item} className="overflow-hidden rounded-lg border border-slate-200 bg-white"><Skeleton className="h-44 rounded-none sm:h-48" /><div className="space-y-4 p-5"><Skeleton className="h-3 w-32" /><Skeleton className="h-6 w-4/5" /><Skeleton className="h-4 w-44" /><div className="flex gap-2"><Skeleton className="h-7 w-16" /><Skeleton className="h-7 w-24" /></div><Skeleton className="h-2.5 w-full" /><div className="space-y-2">{[0, 1, 2, 3].map((row) => <Skeleton key={row} className="h-5 w-full" />)}</div><Skeleton className="h-10 w-full" /></div></article>)}
      </section>
    </div>
  );
}

export function AdminListingsSkeleton() {
  return <div className="mx-auto max-w-7xl space-y-6" aria-busy="true"><div className="flex justify-between"><div className="space-y-3"><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-96" /></div><Skeleton className="h-10 w-32" /></div><div className="flex gap-3"><Skeleton className="h-11 flex-1" /><Skeleton className="h-11 w-40" /></div><p className="text-sm font-semibold text-slate-500">Loading Listings...</p><div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4"><Skeleton className="h-6 w-full" /><div className="mt-5 space-y-4">{[0,1,2,3,4].map((row) => <Skeleton key={row} className="h-12 w-full" />)}</div></div></div>;
}

export function AdminListingDetailSkeleton() {
  return <div className="mx-auto max-w-7xl space-y-6" aria-busy="true"><Skeleton className="h-5 w-48" /><div className="space-y-3"><Skeleton className="h-4 w-40" /><Skeleton className="h-9 w-96" /><Skeleton className="h-4 w-[32rem] max-w-full" /></div><p className="text-sm font-semibold text-slate-500">Loading Opportunity...</p><div className="grid gap-4 lg:grid-cols-[1fr_.8fr]"><Skeleton className="h-64 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div><Skeleton className="h-72 rounded-2xl" /></div>;
}

export function EditListingSkeleton() {
  return <div className="mx-auto max-w-5xl space-y-6" aria-busy="true"><Skeleton className="h-5 w-44" /><div className="space-y-3"><Skeleton className="h-9 w-56" /><Skeleton className="h-4 w-[34rem] max-w-full" /></div><p className="text-sm font-semibold text-slate-500">Loading Workspace...</p><div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div><Skeleton className="h-80 rounded-2xl" /></div>;
}

export function MemberOpportunityDetailSkeleton() {
  return <div className="space-y-6" aria-busy="true"><Skeleton className="h-5 w-56" /><p className="text-sm font-semibold text-slate-500">Loading Opportunity...</p><section className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]"><Skeleton className="h-[28rem] rounded-2xl" /><div className="space-y-4"><Skeleton className="h-36 rounded-2xl" /><Skeleton className="h-56 rounded-2xl" /></div></section><div className="grid gap-4 lg:grid-cols-3"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-40 rounded-2xl" /></div></div>;
}
