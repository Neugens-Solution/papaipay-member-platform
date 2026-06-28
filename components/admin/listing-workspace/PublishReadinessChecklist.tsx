"use client";

import type { WorkspaceReadinessResult } from "@/lib/admin/listings/workspace/types";

type ModuleKey = NonNullable<
  WorkspaceReadinessResult["modules"][number]["key"]
>;

const moduleStepIndex: Record<ModuleKey, number> = {
  overview: 0,
  property: 1,
  participation: 2,
  settlement: 3,
  media: 4,
  documents: 5,
  memberInfo: 6,
};

export function PublishReadinessChecklist({
  readiness,
  listingStatus,
  fieldLabels,
  publishAction,
  onGoToStep,
}: {
  readiness?: WorkspaceReadinessResult;
  listingStatus: string;
  fieldLabels: Record<string, string>;
  publishAction: React.ReactNode;
  onGoToStep: (index: number) => void;
}) {
  return (
    <section id="publish" className="space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-papaipay-green">
          Publish Review
        </p>
        <h2 className="mt-1 text-xl font-black text-papaipay-ink">
          Launch Checklist
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Publish validates persisted workspace data only. Save each module
          before launching.
        </p>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-papaipay-green">
              Readiness Progress
            </p>
            <p className="mt-1 text-lg font-black text-papaipay-ink">
              {readiness
                ? `${readiness.completionPercentage}% ready`
                : "Save a step to refresh readiness"}
            </p>
          </div>
          <p className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-emerald-100">
            {listingStatus}
          </p>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-papaipay-green transition-all"
            style={{ width: `${readiness?.completionPercentage ?? 0}%` }}
          />
        </div>
      </div>
      {readiness ? (
        <div className="grid gap-3">
          {readiness.modules.map((module) => (
            <div
              key={module.key}
              className={`rounded-2xl border p-4 text-sm ${module.ready ? "border-emerald-100 bg-emerald-50/60" : module.optional ? "border-slate-200 bg-slate-50/70" : "border-amber-200 bg-amber-50/70"}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-black text-papaipay-ink">{module.label}</p>
                  <p
                    className={`mt-1 text-xs font-black ${module.ready ? "text-papaipay-green" : module.optional ? "text-slate-500" : "text-amber-800"}`}
                  >
                    {module.ready
                      ? "Saved"
                      : module.optional
                        ? "Optional / Not Started"
                        : "Missing required fields"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onGoToStep(moduleStepIndex[module.key])}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-papaipay-green"
                >
                  Go to Step
                </button>
              </div>
              {module.missingFields.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {module.missingFields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-100"
                    >
                      {fieldLabels[field] ?? field}
                    </span>
                  ))}
                </div>
              ) : null}
              {module.warnings.length ? (
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Warnings: {module.warnings.join(", ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <div className="pt-2">{publishAction}</div>
    </section>
  );
}
