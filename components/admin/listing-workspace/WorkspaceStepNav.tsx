"use client";

import { useFormStatus } from "react-dom";
import {
  WorkspaceStatusBadge,
  type WorkspaceStepStatus,
} from "./WorkspaceStatusBadge";

type WorkspaceStep = { id: string; label: string; optional: boolean };

function SaveStepButton({
  intent,
  isSaved,
}: {
  intent: string;
  isSaved: boolean;
}) {
  const { pending, data } = useFormStatus();
  const isPending = pending && data?.get("intent") === intent;
  return (
    <button
      name="intent"
      value={intent}
      disabled={pending}
      className={`rounded-md px-4 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${isSaved ? "border border-emerald-100 bg-emerald-50 text-papaipay-green" : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:text-papaipay-green"}`}
    >
      {isPending ? "Saving step..." : isSaved ? "Saved" : "Save Step"}
    </button>
  );
}

export function WorkspaceStepNav({
  steps,
  activeStep,
  statuses,
  moduleSummaries,
  saveIntent,
  isCurrentStepSaved,
  hasUnsavedChanges,
  onVisitStep,
}: {
  steps: readonly WorkspaceStep[];
  activeStep: number;
  statuses: WorkspaceStepStatus[];
  moduleSummaries: Record<number, string>;
  saveIntent: string;
  isCurrentStepSaved: boolean;
  hasUnsavedChanges: boolean;
  onVisitStep: (index: number) => void;
}) {
  const { pending, data } = useFormStatus();
  const pendingIntent = pending ? data?.get("intent") : undefined;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-slate-400">
        <span>Workspace Steps</span>
        <span className="text-papaipay-green">Scroll →</span>
      </div>
      <div
        className="-mx-1 overflow-x-auto scroll-smooth px-1 pb-3 [scrollbar-color:#10b981_#e2e8f0] [scrollbar-width:thin]"
        aria-label="Listing wizard steps"
      >
        <div className="flex w-max gap-2 pr-6">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => onVisitStep(index)}
              className={`min-w-[8rem] rounded-2xl border px-3 py-2.5 text-left transition sm:min-w-[9rem] ${activeStep === index ? "border-papaipay-green bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-100"}`}
            >
              <span className="block text-xs font-black text-papaipay-ink">
                {index + 1}. {step.label}
              </span>
              <WorkspaceStatusBadge
                status={
                  pendingIntent === saveIntent && index === activeStep
                    ? "Saving"
                    : (statuses[index] ?? "Not Started")
                }
              />
              {moduleSummaries[index] ? (
                <span className="mt-1 block text-[0.68rem] font-semibold text-slate-500">
                  {moduleSummaries[index]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold text-slate-500">
          Save Step is available for each workspace module. Publish Listing
          appears only in Publish Review.
          {hasUnsavedChanges ? (
            <span className="ml-2 rounded-full bg-amber-50 px-2 py-1 font-black text-amber-700">
              Unsaved Changes
            </span>
          ) : null}
        </p>
        {activeStep === steps.length - 1 ? null : (
          <SaveStepButton intent={saveIntent} isSaved={isCurrentStepSaved} />
        )}
      </div>
    </div>
  );
}
