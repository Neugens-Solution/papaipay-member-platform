import type { RoleArea } from "@/lib/roles";

export function RoleAreaCard({ role }: { role: RoleArea }) {
  return (
    <article className="rounded-2xl border border-papaipay-green/10 bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-papaipay-green">Planned Area</p>
      <h2 className="mt-3 text-xl font-semibold text-papaipay-ink">{role.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
      <a aria-label={`${role.name} portal planned area`} className="mt-5 inline-flex text-sm font-semibold text-papaipay-green" href="#role-areas">
        Future {role.name} area
      </a>
    </article>
  );
}
