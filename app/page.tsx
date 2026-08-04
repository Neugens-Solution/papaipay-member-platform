import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";

const pillars = [
  {
    number: "01",
    title: "Selected opportunities",
    body: "PICM assesses residential auction properties based on location, market context, property condition, auction terms and the intended exit route.",
    icon: SearchIcon,
  },
  {
    number: "02",
    title: "End-to-end management",
    body: "From acquisition and legal coordination to improvement, holding and disposal, each project is managed as one complete lifecycle.",
    icon: LayersIcon,
  },
  {
    number: "03",
    title: "A structured member view",
    body: "Approved members can review opportunity information, participation records, project updates and confirmed distributions in one private portal.",
    icon: PortalIcon,
  },
] as const;

const approach = [
  ["01", "Source & assess", "Review the property, location, auction conditions, estimated costs, intended timeline and material risks."],
  ["02", "Acquire", "PICM coordinates participation and acquires the selected property in accordance with the project terms."],
  ["03", "Improve & manage", "PICM oversees the legal process, repairs or improvement works, holding costs and ongoing project management."],
  ["04", "Exit & distribute", "PICM manages the intended sale. If an immediate sale is not suitable, the asset may be held or rented before a later exit."],
] as const;

const memberJourney = [
  ["Request access", "Create an account for review. Initial access is intended for existing and approved PICM clients."],
  ["Complete verification", "Submit the required identity documents through the portal's private manual verification flow."],
  ["Review an opportunity", "Read the property information, project structure, intended exit, key terms, documents and risks."],
  ["Confirm participation", "Choose an amount and complete the guided declarations for the selected opportunity."],
  ["Transfer to PICM", "Follow the official payment instructions and upload the bank-transfer receipt for manual confirmation."],
  ["Follow the project", "Track participation status, project progress and confirmed distribution records from the member workspace."],
] as const;

const faqItems = [
  {
    question: "What is K Asset Ventures?",
    answer: "K Asset Ventures is the platform brand used for selected auction-property participation opportunities. It is owned and operated by PICM Sdn Bhd.",
  },
  {
    question: "Is this a public property marketplace?",
    answer: "No. Opportunities are selected and managed by PICM rather than listed by third-party sellers. Initial access is intended for existing and approved clients.",
  },
  {
    question: "Who owns and manages the properties?",
    answer: "PICM Sdn Bhd acquires, owns and manages the properties. Participation does not by itself place a participant's name on the registered property title.",
  },
  {
    question: "Where are participation funds transferred?",
    answer: "Funds are transferred to the official PICM Sdn Bhd company account using the instructions provided for the selected opportunity. The portal records the receipt and admin confirmation; it does not execute the bank transfer.",
  },
  {
    question: "How are holding return and capital terms determined?",
    answer: "The applicable rate, period, payment treatment, capital repayment terms and exit strategy must be stated for each opportunity and governed by the applicable Participant Agreement.",
  },
  {
    question: "What happens if a property is not sold immediately?",
    answer: "PICM may continue to hold and manage the asset, including rental where appropriate, before selling when a suitable buyer is available. The participant's position remains subject to the opportunity terms and Participant Agreement.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f3ed] text-kasset-ink">
      <header className="sticky top-0 z-50 border-b border-[#18372d]/10 bg-[#f5f3ed]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.75rem] max-w-[90rem] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <Wordmark />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#45574f] lg:flex" aria-label="Public navigation">
            <a href="#approach" className="transition hover:text-kasset-green">Our approach</a>
            <a href="#how-it-works" className="transition hover:text-kasset-green">How it works</a>
            <a href="#transparency" className="transition hover:text-kasset-green">Transparency</a>
            <a href="#faq" className="transition hover:text-kasset-green">FAQ</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/member/login" className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-bold text-[#24453a] transition hover:bg-white sm:px-5">Member login</Link>
            <Link href="/member/signup" className="hidden min-h-11 items-center justify-center rounded-full bg-[#163e31] px-5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(22,62,49,0.16)] transition hover:-translate-y-0.5 hover:bg-[#205441] sm:inline-flex">Request access</Link>
          </div>
        </div>
      </header>

      <section className="relative isolate border-b border-[#18372d]/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_10%,rgba(207,174,99,0.14),transparent_28rem),linear-gradient(180deg,#f5f3ed_0%,#f8f7f3_100%)]" />
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#b99a55]/25 bg-[#fffdf7] px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#735d2e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b99a55]" />
              A property platform by PICM Sdn Bhd
            </p>
            <h1 className="mt-7 text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.06em] text-[#12372b] sm:text-6xl lg:text-[4.8rem]">
              Selected auction properties. Managed from acquisition to exit.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#53655e] sm:text-lg">
              K Asset Ventures gives approved participants a structured way to review selected residential opportunities owned and managed by PICM Sdn Bhd.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/member/signup" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#163e31] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_45px_rgba(22,62,49,0.2)] transition hover:-translate-y-0.5 hover:bg-[#205441]">
                Request member access <ArrowIcon className="h-4 w-4" />
              </Link>
              <a href="#approach" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-[#24483b]/20 bg-white/60 px-7 py-3.5 text-sm font-bold text-[#24483b] transition hover:border-[#24483b]/35 hover:bg-white">
                Explore our approach
              </a>
            </div>
            <p className="mt-5 max-w-lg text-xs font-medium leading-5 text-[#738079]">
              Access is subject to account and identity verification. Opportunity details and participation terms are available inside the member portal.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-3xl">
            <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[#d8c18a]/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-2 shadow-[0_35px_90px_rgba(26,55,45,0.18)] sm:rounded-[2.25rem] sm:p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] sm:rounded-[1.8rem]">
                <Image
                  src="/landing/k-asset-property-hero.webp"
                  alt="Illustrative Malaysian residential property exterior"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b271e]/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-white sm:p-7">
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#e7d39f]">Our focus</p>
                    <p className="mt-2 max-w-sm text-lg font-semibold leading-6 sm:text-xl">Residential auction opportunities with a defined management plan.</p>
                  </div>
                  <span className="hidden rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur sm:inline-flex">Illustrative image</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 rounded-2xl border border-[#d9d5c9] bg-[#fffdf8] px-4 py-3 shadow-[0_18px_40px_rgba(26,55,45,0.13)] sm:-left-7 sm:px-5">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8c7238]">Curated access</p>
              <p className="mt-1 text-sm font-bold text-[#18372d]">Not a public marketplace</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#18372d]/10 bg-[#fffdfa] px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-5 text-sm text-[#45574f] sm:grid-cols-3 sm:divide-x sm:divide-[#18372d]/10">
          <TrustItem label="Owner & operator" value="PICM Sdn Bhd" />
          <TrustItem label="Initial access" value="Existing and approved clients" />
          <TrustItem label="Member experience" value="Private, structured and documented" />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <SectionHeading eyebrow="What we do" title="A focused property process, not an open listing board." />
            <p className="max-w-2xl text-base leading-8 text-[#5a6a63] lg:justify-self-end lg:text-lg">
              K Asset Ventures brings the opportunity, project information and member record into one clear experience. PICM remains responsible for the property and its management throughout the project lifecycle.
            </p>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {pillars.map(({ number, title, body, icon: Icon }) => (
              <article key={number} className="group rounded-[1.6rem] border border-[#18372d]/10 bg-[#fffdfa] p-6 transition hover:-translate-y-1 hover:border-[#18372d]/20 hover:shadow-[0_22px_55px_rgba(26,55,45,0.08)] sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e5eee9] text-[#1a5c46]"><Icon className="h-5 w-5" /></span>
                  <span className="text-xs font-extrabold tracking-[0.18em] text-[#b1934d]">{number}</span>
                </div>
                <h3 className="mt-9 text-xl font-semibold tracking-[-0.025em] text-[#173b2f]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#62716b]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#11362a] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#dac58d]">One platform. One accountable operator.</p>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">K Asset Ventures is the platform. PICM is the legal entity behind it.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#c3d0cb]">
              This relationship is kept visible so members know who owns the property, receives funds, manages the project and undertakes the participation arrangement.
            </p>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/[0.06]">
            <RelationshipRow label="Platform brand" value="K Asset Ventures" />
            <RelationshipRow label="Owner & operator" value="PICM Sdn Bhd" />
            <RelationshipRow label="Property owner" value="PICM Sdn Bhd" />
            <RelationshipRow label="Fund recipient" value="PICM Sdn Bhd company account" />
            <RelationshipRow label="Participation terms" value="Applicable Participant Agreement" last />
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <SectionHeading eyebrow="Our property approach" title="Four stages from selection to a managed exit." body="Every opportunity has its own facts, costs, timeline and risks. The purpose of the process is to make those stages clear—not to suggest that every project will perform the same way." />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-[#18372d]/10 bg-[#18372d]/10 lg:grid-cols-4">
            {approach.map(([number, title, body]) => (
              <li key={number} className="bg-[#fffdfa] p-6 sm:p-8">
                <span className="text-xs font-extrabold tracking-[0.2em] text-[#a18139]">{number}</span>
                <h3 className="mt-10 text-xl font-semibold tracking-[-0.025em] text-[#173b2f]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#617069]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-[#18372d]/10 bg-[#ebe8df] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[1.03fr_.97fr] lg:items-center">
          <div className="rounded-[1.8rem] border border-[#18372d]/10 bg-[#fffdfa] p-4 shadow-[0_28px_75px_rgba(26,55,45,0.12)] sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-[#18372d]/10 pb-5">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#9a7934]">Opportunity format</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#18372d]">Residential auction project</h3>
              </div>
              <span className="rounded-full bg-[#e5eee9] px-3 py-1.5 text-xs font-extrabold text-[#1a5c46]">Member only</span>
            </div>
            <div className="grid gap-3 py-5 sm:grid-cols-2">
              <PreviewField label="Property information" value="Type, location & condition" />
              <PreviewField label="Project plan" value="Acquire, manage & exit" />
              <PreviewField label="Participation terms" value="Amount, period & holding terms" />
              <PreviewField label="Disclosure" value="Documents, costs & key risks" />
            </div>
            <div className="rounded-2xl bg-[#153c30] p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#d8c58f]">Full opportunity details</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#d5dfdb]">Available after member sign-in and verification.</p>
              </div>
              <LockIcon className="mt-5 h-8 w-8 text-[#d8c58f] sm:mt-0" />
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8d6f2f]">Curated, not crowded</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#15382d] sm:text-5xl">The public page explains the model. The portal holds the opportunity.</h2>
            <p className="mt-6 text-base leading-8 text-[#596861]">
              Property details and financial terms are not presented as a public catalogue. Approved members review each opportunity in context, together with the intended strategy and applicable documents.
            </p>
            <ul className="mt-7 space-y-3 text-sm font-semibold text-[#385148]">
              <CheckLine>Terms shown per opportunity—not assumed across every project</CheckLine>
              <CheckLine>Participation records linked to the member account</CheckLine>
              <CheckLine>Manual payment receipts reviewed by the admin team</CheckLine>
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <SectionHeading eyebrow="Member journey" title="A clear path from access to project updates." />
            <p className="max-w-2xl text-base leading-8 text-[#5a6a63] lg:justify-self-end">The portal supports a manual, traceable process. It records participation and payment evidence while the actual bank transfer takes place outside the platform.</p>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {memberJourney.map(([title, body], index) => (
              <li key={title} className="relative min-h-56 overflow-hidden rounded-[1.6rem] border border-[#18372d]/10 bg-[#fffdfa] p-6 sm:p-7">
                <span className="absolute right-5 top-4 text-5xl font-semibold tracking-[-0.08em] text-[#173b2f]/[0.06]">{String(index + 1).padStart(2, "0")}</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#173b2f] text-xs font-extrabold text-white">{index + 1}</span>
                <h3 className="mt-8 text-lg font-semibold tracking-tight text-[#173b2f]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#62716b]">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="transparency" className="scroll-mt-24 bg-[#f0ede5] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8d6f2f]">Transparency before participation</p>
            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#15382d] sm:text-5xl">The opportunity is real. So are its variables.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#596861]">Auction conditions, project costs, holding periods and disposal timelines can change. Members should understand the specific project and its agreement before transferring funds.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DisclosureCard title="Project-specific terms">Holding return, participation period, capital repayment treatment and exit strategy must be stated for the selected opportunity.</DisclosureCard>
            <DisclosureCard title="No title ownership by default">Participation does not by itself register a participant as an owner of the property. PICM remains the property owner.</DisclosureCard>
            <DisclosureCard title="Timelines may change">Auction, legal, improvement, rental and disposal activities can take longer than initially intended.</DisclosureCard>
            <DisclosureCard title="Agreement comes first">The applicable Participant Agreement should govern the participant’s contractual rights and PICM’s obligations.</DisclosureCard>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.84fr_1.16fr] lg:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8d6f2f]">Private member portal</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#15382d] sm:text-5xl">Every important record in one member workspace.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#596861]">Review opportunities, follow participation status, submit payment evidence and see confirmed project or distribution updates without relying on scattered messages.</p>
            <Link href="/member/login" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#24483b]/20 bg-white px-6 text-sm font-extrabold text-[#24483b] transition hover:border-[#24483b]/35">
              Member login <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <PortalPreview />
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-t border-[#18372d]/10 bg-[#fffdfa] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[90rem] gap-12 lg:grid-cols-[.62fr_1.38fr]">
          <SectionHeading eyebrow="Frequently asked questions" title="Clear answers before you enter the portal." />
          <div className="divide-y divide-[#18372d]/10 border-y border-[#18372d]/10">
            {faqItems.map((item, index) => (
              <details key={item.question} className="group py-5 sm:py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-semibold text-[#173b2f] sm:text-lg">
                  {item.question}
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-[#18372d]/15 text-xl font-light transition group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-7 text-[#607069] sm:text-base sm:leading-8">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-[90rem] overflow-hidden rounded-[2rem] bg-[#12372b] px-6 py-12 text-white sm:px-10 sm:py-16 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:px-14">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#d9c78f]">Approved member access</p>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Review the full opportunity inside K Asset Ventures.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#c7d3ce]">Create an account for verification or sign in to continue to your private member workspace.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-none">
            <Link href="/member/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d9c78f] px-7 text-sm font-extrabold text-[#17362c] transition hover:bg-[#e7d9ae]">Request access</Link>
            <Link href="/member/login" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-bold text-white transition hover:bg-white/10">Member login</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#18372d]/10 bg-[#f5f3ed] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <Wordmark />
            <div className="max-w-3xl text-xs leading-6 text-[#67756f]">
              <p>K Asset Ventures is a property participation platform owned and operated by PICM Sdn Bhd. Property ownership, fund collection, project management and distributions are undertaken by PICM Sdn Bhd, subject to the applicable opportunity documents and Participant Agreement.</p>
              <p className="mt-3">The platform records manual payment and distribution outcomes. It does not execute bank transfers or provide a payment gateway.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-[#18372d]/10 pt-6 text-xs font-semibold text-[#748078] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PICM Sdn Bhd. All rights reserved.</p>
            <Link href="/admin/login" className="transition hover:text-kasset-green">Admin access</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Wordmark() {
  return (
    <Link href="/" aria-label="K Asset Ventures home" className="inline-flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#163e31] text-xs font-black tracking-[-0.05em] text-[#dec98f]">KV</span>
      <span>
        <span className="block text-sm font-black tracking-[0.08em] text-[#18372d]">K ASSET VENTURES</span>
        <span className="mt-0.5 block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#7d886f]">By PICM Sdn Bhd</span>
      </span>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#8d6f2f]">{eyebrow}</p>
      <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#15382d] sm:text-5xl">{title}</h2>
      {body ? <p className="mt-5 text-base leading-8 text-[#5a6a63]">{body}</p> : null}
    </div>
  );
}

function TrustItem({ label, value }: { label: string; value: string }) {
  return <div className="px-0 sm:px-6 sm:first:pl-0"><span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#9a7934]">{label}</span><span className="mt-1.5 block font-semibold text-[#29483d]">{value}</span></div>;
}

function RelationshipRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <div className={`grid gap-2 px-5 py-4 sm:grid-cols-[.8fr_1.2fr] sm:px-7 sm:py-5 ${last ? "" : "border-b border-white/10"}`}><span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#b7c7c1]">{label}</span><span className="font-semibold text-white sm:text-right">{value}</span></div>;
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#18372d]/10 bg-[#f4f3ed] p-4"><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#8b7651]">{label}</p><p className="mt-2 text-sm font-semibold text-[#2b493e]">{value}</p></div>;
}

function CheckLine({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-3"><span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-[#dce9e3] text-[0.65rem] font-black text-[#1a5c46]">✓</span><span>{children}</span></li>;
}

function DisclosureCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-[1.5rem] border border-[#18372d]/10 bg-[#fffdfa] p-6 sm:p-7"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#e5eee9] text-[#1a5c46]"><CheckIcon className="h-5 w-5" /></span><h3 className="mt-7 text-lg font-semibold text-[#173b2f]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#62716b]">{children}</p></article>;
}

function PortalPreview() {
  return (
    <div className="rounded-[1.8rem] border border-[#18372d]/10 bg-[#153c30] p-3 shadow-[0_35px_90px_rgba(26,55,45,0.18)] sm:p-5">
      <div className="rounded-[1.35rem] bg-[#f8f7f2] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#8c7135]">Member overview</p><p className="mt-1 text-lg font-semibold text-[#173b2f]">Your participation journey</p></div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#173b2f] text-xs font-black text-[#dec98f]">KV</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <PreviewMetric label="Verification" value="Approved" />
          <PreviewMetric label="Active records" value="2 projects" />
        </div>
        <div className="mt-3 rounded-2xl border border-[#18372d]/10 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#8b7651]">Project update</p><p className="mt-2 text-sm font-semibold text-[#29483d]">Residential opportunity</p></div><span className="rounded-full bg-[#e2eee8] px-2.5 py-1 text-[0.62rem] font-extrabold text-[#1a5c46]">Active</span></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eef1ee]"><div className="h-full w-[68%] rounded-full bg-[#2a7157]" /></div>
          <div className="mt-2 flex justify-between text-[0.65rem] font-semibold text-[#839087]"><span>Project progress</span><span>68%</span></div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {["Opportunity", "Receipt", "Updates"].map((label, index) => <div key={label} className="rounded-xl bg-[#e9eee9] p-3"><span className="text-[0.62rem] font-extrabold text-[#9a7934]">0{index + 1}</span><p className="mt-1 text-xs font-bold text-[#435a51]">{label}</p></div>)}
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#18372d]/10 bg-white p-4"><p className="text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-[#8b7651]">{label}</p><p className="mt-2 text-sm font-extrabold text-[#29483d]">{value}</p></div>;
}

function IconBase({ children, ...props }: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}
function ArrowIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="M5 12h14M14 7l5 5-5 5" /></IconBase>; }
function SearchIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 11h6M11 8v6" /></IconBase>; }
function LayersIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></IconBase>; }
function PortalIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v5M7 14h4M7 17h7" /></IconBase>; }
function LockIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></IconBase>; }
function CheckIcon(props: SVGProps<SVGSVGElement>) { return <IconBase {...props}><path d="m5 12 4 4L19 6" /></IconBase>; }
