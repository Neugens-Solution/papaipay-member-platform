import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#0e1726] px-5 py-8 text-white sm:px-8 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div className="hidden lg:block">
          <Image
            src="/logo-kav-02.svg"
            alt="K Asset Ventures by PICM Sdn Bhd"
            width={210}
            height={68}
            priority
            className="h-16 w-auto"
          />
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-[#c6a574]">Restricted Operations Access</p>
          <h1 className="font-editorial mt-5 max-w-xl text-[3.25rem] font-medium leading-[1.05] tracking-[-0.035em]">
            Secure admin access for K Asset Ventures operations.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#cbd1dc]">
            Authorized operational users can manage members, property listings, documents and distribution records.
          </p>
        </div>

        <div className="rounded-[4px] border border-[#c6a574]/25 bg-[#fffdf9] p-7 text-[#172235] shadow-[0_28px_80px_rgba(0,0,0,0.28)] sm:p-9">
          <Link href="/" aria-label="K Asset Ventures home" className="inline-flex rounded-[3px] bg-[#0e1726] px-4 py-3">
            <Image
              src="/logo-kav-02.svg"
              alt="K Asset Ventures by PICM Sdn Bhd"
              width={180}
              height={59}
              priority
              className="h-11 w-auto"
            />
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#a47c48]">Admin Portal</p>
          <h1 className="font-editorial mt-3 text-4xl font-medium tracking-[-0.03em] text-[#0e1726]">Restricted admin login</h1>
          <p className="mt-4 text-sm leading-7 text-[#5f6670]">
            Authorized operational users only. Admin accounts must be invited and active before sign-in.
          </p>
          <AdminLoginForm />
          <div className="mt-6 flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
            <Link href="/login" className="text-[#68707c] hover:text-[#172235]">Choose another portal</Link>
            <Link href="/" className="text-[#172235] underline decoration-[#a47c48]/60 underline-offset-8 hover:text-[#a47c48]">Portal home</Link>
          </div>
          <p className="mt-5 rounded-[3px] border border-[#172235]/10 bg-[#f4eadc] px-4 py-3 text-xs font-semibold leading-5 text-[#5f6670]">
            No public admin registration is available. New admin access must be handled through a protected invite flow.
          </p>
        </div>
      </section>
    </main>
  );
}
