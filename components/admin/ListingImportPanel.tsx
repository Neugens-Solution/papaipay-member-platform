"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Card } from "@/components/admin/AdminUI";
import { listingImportAction, type ListingImportState } from "@/lib/admin/actions/listingImport";

function SubmitButton({ intent, label, pendingLabel, disabled }: { intent: "preview" | "import"; label: string; pendingLabel: string; disabled?: boolean }) {
  const { pending, data } = useFormStatus();
  const active = pending && data?.get("intent") === intent;
  return (
    <button
      type="submit"
      name="intent"
      value={intent}
      disabled={pending || disabled}
      className={`rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${intent === "import" ? "bg-kasset-green text-white hover:bg-kasset-ink" : "border border-slate-200 bg-white text-kasset-green hover:bg-emerald-50"}`}
    >
      {active ? pendingLabel : label}
    </button>
  );
}

function money(value: number | null | undefined) {
  return value ? `RM${value.toLocaleString("en-MY")}` : "—";
}

export function ListingImportPanel({ serviceAccountEmail }: { serviceAccountEmail: string | null }) {
  const [state, formAction] = useActionState(listingImportAction, {
    status: "idle",
    message: null,
    sheetUrl: "",
    notices: [],
    rows: [],
    results: [],
    serviceAccountEmail,
  } as ListingImportState);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const importable = state.rows.filter((row) => !row.errors.length);
  const isSelected = (rowNumber: number) => selected.has(rowNumber);
  const toggle = (rowNumber: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(rowNumber)) next.delete(rowNumber);
      else next.add(rowNumber);
      return next;
    });

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <h2 className="font-bold text-kasset-ink">1. Share and paste the Google Sheet</h2>
        {serviceAccountEmail ? (
          <p className="mt-2 text-sm text-slate-600">
            In Google Sheets, click <b>Share</b> and add <b className="break-all text-kasset-ink">{serviceAccountEmail}</b> as <b>Viewer</b>. Then paste the sheet link below.
          </p>
        ) : (
          <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm font-semibold text-amber-700">
            Google Sheets import is not configured yet. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY in Vercel, then redeploy.
          </p>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            name="sheetUrl"
            required
            defaultValue={state.sheetUrl}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="min-h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-kasset-green"
          />
          <SubmitButton intent="preview" label="Read sheet" pendingLabel="Reading..." />
        </div>
      </Card>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`rounded-xl border p-4 text-sm font-semibold ${state.status === "error" ? "border-rose-100 bg-rose-50 text-rose-700" : "border-emerald-100 bg-emerald-50 text-kasset-green"}`}
        >
          {state.message}
        </p>
      ) : null}
      {state.notices.map((notice) => (
        <p key={notice} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm font-semibold text-amber-700">{notice}</p>
      ))}

      {state.results.length ? (
        <Card>
          <h2 className="font-bold text-kasset-ink">Import results</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {state.results.map((result) => (
              <li key={result.rowNumber} className={result.ok ? "text-kasset-green" : "text-rose-700"}>
                <b>Row {result.rowNumber} · {result.title}</b> — {result.message}{" "}
                {result.slug ? <Link className="font-bold underline" href={`/admin/listings/${result.slug}/edit`}>Open listing</Link> : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold text-slate-500">Next: open each listing, upload images and documents, review every step, then publish.</p>
        </Card>
      ) : null}

      {state.rows.length ? (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-bold text-kasset-ink">2. Review and choose rows</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelected(new Set(importable.map((row) => row.rowNumber)))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
              >
                Select all ready ({importable.length})
              </button>
              <SubmitButton intent="import" label={`Import ${selected.size} as Draft`} pendingLabel="Importing..." disabled={!selected.size} />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {state.rows.map((row) => {
              const blocked = row.errors.length > 0;
              return (
                <label
                  key={row.rowNumber}
                  className={`block rounded-xl border p-4 ${blocked ? "border-rose-100 bg-rose-50/40" : isSelected(row.rowNumber) ? "border-emerald-200 bg-emerald-50/50" : "border-slate-100 bg-white"}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="rowNumber"
                      value={row.rowNumber}
                      disabled={blocked}
                      checked={!blocked && isSelected(row.rowNumber)}
                      onChange={() => toggle(row.rowNumber)}
                      className="mt-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-kasset-ink">
                        Row {row.rowNumber} · {row.title}
                        {row.existingSlug ? (
                          <Link href={`/admin/listings/${row.existingSlug}/edit`} className="ml-2 text-xs font-bold text-kasset-green underline">existing listing</Link>
                        ) : null}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {row.sourcePdf ? `${row.sourcePdf} · ` : ""}
                        Target {money(row.campaign.campaignTarget)} · Reserve {money(row.property?.reservePrice)} · {row.property ? `${row.property.propertyType}, ${row.property.location}` : "Property incomplete"} · {row.faqs.length} FAQ · {row.timeline.length} timeline
                      </p>
                      {row.errors.map((error) => <p key={error} className="mt-1 text-xs font-bold text-rose-700">✕ {error}</p>)}
                      {row.warnings.map((warning) => <p key={warning} className="mt-1 text-xs font-semibold text-amber-700">! {warning}</p>)}
                      {row.manualAssets.length ? (
                        <details className="mt-2 text-xs text-slate-500">
                          <summary className="cursor-pointer font-bold">Upload manually after import ({row.manualAssets.length})</summary>
                          <ul className="mt-1 list-disc space-y-1 break-all pl-5">{row.manualAssets.map((asset) => <li key={asset}>{asset}</li>)}</ul>
                        </details>
                      ) : null}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </Card>
      ) : null}
    </form>
  );
}
