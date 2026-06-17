import { RolePlaceholderCard } from "@/components/RolePlaceholderCard";
import { rolePlaceholders } from "@/lib/roles";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10 lg:px-16">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-papaipay-green">
            Next.js App Foundation
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            PAPAIPAY Member Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Clean foundation for the role-aware member platform. This Vercel-ready
            starting point includes App Router, TypeScript, Tailwind CSS, a basic
            layout, global styles, and lightweight placeholders only.
          </p>
        </div>

        <div id="role-placeholders" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rolePlaceholders.map((role) => (
            <RolePlaceholderCard key={role.name} role={role} />
          ))}
        </div>
      </section>
    </main>
  );
}
