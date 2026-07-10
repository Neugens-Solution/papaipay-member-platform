function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-slate-200/80 ${className}`} />;
}

function SkeletonField() {
  return (
    <div>
      <SkeletonLine className="h-3 w-20" />
      <div className="mt-2 h-12 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
    </div>
  );
}

export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10" aria-label="Loading portal access page">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <div className="rounded-[2rem] border border-papaipay-green/10 bg-white/90 p-8 shadow-soft">
          <SkeletonLine className="h-3 w-36" />
          <SkeletonLine className="mt-5 h-8 w-56" />
          <SkeletonLine className="mt-4 h-4 w-full" />
          <SkeletonLine className="mt-2 h-4 w-4/5" />
          <div className="mt-8 space-y-4">
            <SkeletonField />
            <SkeletonField />
            <SkeletonLine className="mt-6 h-12 w-full rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
