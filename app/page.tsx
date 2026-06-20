import Link from "next/link";

const portalCards = [
  {
    title: "Member Portal",
    href: "/member/dashboard",
    description: "Access member listings, portfolio activity, participation records and distributions.",
    meta: "Members",
  },
  {
    title: "Admin Portal",
    href: "/admin/dashboard",
    description: "Access operational tools for admins, managers and super admins in one admin workspace.",
    meta: "Admin • Manager • Super Admin",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff7ec,transparent_32rem),linear-gradient(135deg,#f8faf7_0%,#f6f1e8_100%)] px-6 py-10 text-papaipay-ink sm:px-10 lg:px-16">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-papaipay-green">Portal Access</p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">PAPAIPAY Portal Access</h1>
          <p className="mt-6 text-lg leading-8 text-slate-700">Choose the workspace for this prototype. Member users continue to the Member Portal, while Admin, Manager and Super Admin roles share the Admin Portal interface.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {portalCards.map((portal) => (
            <Link key={portal.title} href={portal.href} className="rounded-2xl border border-papaipay-green/10 bg-white/85 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-papaipay-green">{portal.meta}</p>
              <h2 className="mt-4 text-2xl font-semibold text-papaipay-ink">{portal.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{portal.description}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-papaipay-green">Enter {portal.title} →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
