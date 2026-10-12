"use client";

import { useState } from "react";
import { PAYMENT_ACCOUNT } from "@/lib/payments/instructions";

function CopyRow({ label, value, copyValue }: { label: string; value: string; copyValue?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="mt-0.5 break-words text-base font-bold text-kasset-ink">{value}</dd>
      </div>
      {copyValue !== undefined ? (
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(copyValue);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            } catch {
              // Clipboard can be blocked; the value is still visible to copy manually.
            }
          }}
          className="flex-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-kasset-green hover:bg-emerald-50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}
    </div>
  );
}

/** Bank details and step-by-step payment instructions for a reserved participation. */
export function PaymentInstructions({ amountLabel, amountValue, reference, reservedUntil }: { amountLabel: string; amountValue: string; reference: string; reservedUntil?: string | null }) {
  return (
    <section className="rounded-2xl border border-kasset-green/20 bg-white p-4 text-left sm:p-5">
      <h2 className="text-base font-bold text-kasset-ink">How to Pay</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Pay the exact amount below into this account:</p>
      <dl className="mt-3 divide-y divide-slate-100 rounded-xl bg-slate-50/70 px-4">
        <CopyRow label="Account name" value={PAYMENT_ACCOUNT.accountName} />
        <CopyRow label="Account number" value={PAYMENT_ACCOUNT.accountNumber} copyValue={PAYMENT_ACCOUNT.accountNumber.replace(/\D/g, "")} />
        <CopyRow label="Bank" value={PAYMENT_ACCOUNT.bankName} />
        <CopyRow label="Amount" value={amountLabel} copyValue={amountValue} />
        <CopyRow label="Payment reference" value={reference} copyValue={reference} />
      </dl>
      <p className="mt-3 text-xs leading-5 text-slate-500">{PAYMENT_ACCOUNT.note}</p>

      <h3 className="mt-5 text-sm font-bold text-kasset-ink">Accepted payment methods</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
        <li>Online banking transfer (Instant Transfer / IBG / DuitNow to account)</li>
        <li>Cash deposit at any Hong Leong Bank branch or cash deposit machine</li>
      </ul>

      <h3 className="mt-5 text-sm font-bold text-kasset-ink">Steps</h3>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
        <li>Pay the <strong>exact amount</strong> to the account above.</li>
        <li>For online transfers, put your <strong>payment reference ({reference})</strong> in the recipient reference field.</li>
        <li>Keep the <strong>receipt</strong> — a screenshot of the transfer confirmation or the deposit slip.</li>
        <li>
          Upload the receipt and the bank transaction reference on this participation
          {reservedUntil ? <> <strong>before {reservedUntil}</strong></> : null}. Payments without a receipt cannot be verified.
        </li>
        <li>Our team verifies the payment and you will be notified once your participation is confirmed.</li>
      </ol>
    </section>
  );
}
