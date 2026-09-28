"use client";

import { useActionState as useFormState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { type ProjectFinancialSummaryState, saveProjectFinancialSummaryAction } from "@/lib/admin/project-financials/actions";

type FinancialSummaryFormValues = {
  purchasePrice: string;
  salePrice: string;
  totalCostsSnapshot: string;
  grossProfitSnapshot: string;
  netProfitSnapshot: string;
  memberProfitDistributionPercentage: string;
  platformProfitSharePercentage: string;
  platformShare: string;
  principalReturnPool: string;
  holdingReturnPool: string;
  profitDistributionPool: string;
  finalDistributionPool: string;
  saleCompletedAt: string;
  distributionCalculationDate: string;
  calculationRemarks: string;
};

type ProjectDefaults = {
  /** Sum of confirmed, fully paid participation amounts. */
  paidPrincipal: string;
  /** Listing holding return rate, % per month. */
  holdingReturnRateMonthly: string;
  maximumHoldingPeriodMonths: number;
  /** yyyy-mm-dd; holding return accrues from this date. */
  holdingStartDate: string;
  memberProfitDistributionPercentage: string;
};

type FinancialSummaryFormProps = {
  campaignId: string;
  projectDefaults: ProjectDefaults;
  mode: "create" | "update";
  initialValues: FinancialSummaryFormValues;
  calculationStatus?: string | null;
};

function SubmitButton({ mode }: { mode: "create" | "update" }) {
  const { pending } = useFormStatus();
  const label = mode === "update" ? "Update Financial Summary" : "Create Financial Summary";

  return (
    <button
      className="mt-4 rounded-lg bg-kasset-green px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-kasset-ink disabled:cursor-not-allowed disabled:bg-slate-300"
      type="submit"
      disabled={pending}
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

const inputClass = "mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-kasset-green";
const autoClass = "mt-2 min-h-11 w-full rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 text-sm font-bold text-kasset-green outline-none";

function FieldLabel({ htmlFor, label, auto, hint }: { htmlFor: string; label: string; auto?: boolean; hint?: string }) {
  return (
    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor={htmlFor} title={hint}>
      {label}
      {auto ? <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[0.6rem] text-kasset-green">Auto</span> : null}
    </label>
  );
}

function NumberInput({
  name,
  label,
  value,
  onChange,
  percent = false,
  allowNegative = false,
}: {
  name: keyof FinancialSummaryFormValues;
  label: string;
  value: string;
  onChange: (value: string) => void;
  percent?: boolean;
  allowNegative?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name} label={label} />
      <input
        id={name}
        name={name}
        type="number"
        min={allowNegative ? undefined : "0"}
        max={percent ? "100" : undefined}
        step={percent ? "0.0001" : "0.01"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        placeholder={percent ? "0" : "Enter amount"}
      />
    </div>
  );
}

function AutoInput({ name, label, value, hint }: { name: keyof FinancialSummaryFormValues; label: string; value: string; hint: string }) {
  return (
    <div>
      <FieldLabel htmlFor={name} label={label} auto hint={hint} />
      <input id={name} name={name} readOnly value={value} className={autoClass} placeholder="Auto" />
      <p className="mt-1 text-[0.7rem] font-semibold text-slate-400">{hint}</p>
    </div>
  );
}

// Money maths in cents to avoid floating point drift.
function toCents(value: string) {
  if (value.trim() === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : null;
}
function fromCents(cents: number | null) {
  return cents === null ? "" : (cents / 100).toFixed(2);
}
/** Whole months from start to end, e.g. 15 Jan → 14 Apr = 2, 15 Jan → 15 Apr = 3. */
function completedMonths(start: string, end: string) {
  if (!start || !end) return null;
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  if ([sy, sm, sd, ey, em, ed].some((n) => !Number.isFinite(n))) return null;
  const months = (ey - sy) * 12 + (em - sm) - (ed < sd ? 1 : 0);
  return Math.max(months, 0);
}

function toPercent(value: string) {
  if (value.trim() === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

const initialState: ProjectFinancialSummaryState = { status: "idle", message: null, errors: [] };

export function FinancialSummaryForm({ campaignId, mode, initialValues, calculationStatus, projectDefaults }: FinancialSummaryFormProps) {
  const [state, formAction] = useFormState(saveProjectFinancialSummaryAction, initialState);
  const isApproved = calculationStatus === "Approved";
  const isLocked = calculationStatus === "Locked";
  const isReviewed = calculationStatus === "Reviewed";
  const isEditable = !isApproved && !isLocked;
  const [values, setValues] = useState(() => ({
    ...initialValues,
    memberProfitDistributionPercentage: initialValues.memberProfitDistributionPercentage || projectDefaults.memberProfitDistributionPercentage,
  }));
  const set = (key: keyof FinancialSummaryFormValues) => (value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const derived = useMemo(() => {
    const purchase = toCents(values.purchasePrice);
    const sale = toCents(values.salePrice);
    const costs = toCents(values.totalCostsSnapshot);
    const memberPercent = toPercent(values.memberProfitDistributionPercentage);
    const principal = toCents(projectDefaults.paidPrincipal);
    const rate = toPercent(projectDefaults.holdingReturnRateMonthly);
    const elapsed = completedMonths(projectDefaults.holdingStartDate, values.saleCompletedAt);
    const holdingMonths = elapsed === null ? null : Math.min(elapsed, projectDefaults.maximumHoldingPeriodMonths);
    const holding = principal !== null && rate !== null && holdingMonths !== null ? Math.round((principal * rate * holdingMonths) / 100) : null;

    const gross = purchase !== null && sale !== null ? sale - purchase : null;
    const net = gross !== null ? gross - (costs ?? 0) : null;
    // Holding return is paid out of net return first; the rest is split member/platform.
    const distributable = net !== null ? Math.max(net - (holding ?? 0), 0) : null;
    const holdingExceedsNet = net !== null && holding !== null && holding > net;
    const platformPercent = memberPercent !== null && memberPercent >= 0 && memberPercent <= 100 ? Math.round((100 - memberPercent) * 10000) / 10000 : null;
    const memberProfit = distributable !== null && memberPercent !== null && platformPercent !== null ? Math.round((distributable * memberPercent) / 100) : null;
    // Platform takes the remainder so member + platform always equals net return exactly.
    const platformShare = distributable !== null && memberProfit !== null ? distributable - memberProfit : null;
    const finalPool = principal !== null || holding !== null || memberProfit !== null ? (principal ?? 0) + (holding ?? 0) + (memberProfit ?? 0) : null;

    return {
      holdingMonths,
      holdingExceedsNet,
      principalReturnPool: fromCents(principal),
      holdingReturnPool: fromCents(holding),
      grossProfitSnapshot: fromCents(gross),
      netProfitSnapshot: fromCents(net),
      platformProfitSharePercentage: platformPercent === null ? "" : String(platformPercent),
      platformShare: fromCents(platformShare),
      profitDistributionPool: fromCents(memberProfit),
      finalDistributionPool: fromCents(finalPool),
    };
  }, [values, projectDefaults]);

  if (!isEditable) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm font-semibold text-slate-700">
        {isApproved
          ? "Financials are approved. Future changes will require a reopen/revision workflow."
          : "Financials are locked for distribution preview and future batch processing."}
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
      <input type="hidden" name="campaignId" value={campaignId} />
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-kasset-ink">{mode === "update" ? "Update Financial Summary" : "Create Financial Summary"}</p>
          <p className="mt-1 text-sm text-slate-500">Enter acquisition price, sale price, total costs and sale date; fields marked Auto are calculated for you. A net loss gives RM0 profit to share.</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">Enter 0 where the approved amount is RM0. Leave fields blank only when the value is not available.</p>
        </div>
        <span className="inline-flex whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-kasset-green">
          {mode === "update" ? "Existing summary" : "New summary"}
        </span>
      </div>

      {isReviewed ? (
        <p className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          This settlement has been reviewed. Editing values may require another review.
        </p>
      ) : null}

      {state.status === "success" ? (
        <p className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-kasset-green" role="status">
          {state.message || "Financial summary updated."}
        </p>
      ) : null}
      {state.status === "error" ? (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700" role="alert">
          <p>{state.message || "Financial summary could not be saved."}</p>
          {state.errors.length > 0 ? <ul className="mt-2 list-disc space-y-1 pl-5">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NumberInput name="purchasePrice" label="Acquisition Price" value={values.purchasePrice} onChange={set("purchasePrice")} />
        <NumberInput name="salePrice" label="Sale Price / Disposal Price" value={values.salePrice} onChange={set("salePrice")} />
        <NumberInput name="totalCostsSnapshot" label="Total Approved Costs" value={values.totalCostsSnapshot} onChange={set("totalCostsSnapshot")} />
        <AutoInput name="grossProfitSnapshot" label="Gross Return" value={derived.grossProfitSnapshot} hint="Sale Price − Acquisition Price" />
        <AutoInput name="netProfitSnapshot" label="Net Return" value={derived.netProfitSnapshot} hint="Gross Return − Total Approved Costs" />
        <NumberInput name="memberProfitDistributionPercentage" label="Member Return Share %" value={values.memberProfitDistributionPercentage} onChange={set("memberProfitDistributionPercentage")} percent />
        <AutoInput name="platformProfitSharePercentage" label="Platform Return Share %" value={derived.platformProfitSharePercentage} hint="100% − Member Return Share %" />
        <AutoInput name="platformShare" label="Platform Share Amount" value={derived.platformShare} hint="(Net Return − Holding Return) × Platform %" />
        <AutoInput name="principalReturnPool" label="Principal Return Pool" value={derived.principalReturnPool} hint="Total confirmed & paid participations" />
        <AutoInput
          name="holdingReturnPool"
          label="Holding Return Pool"
          value={derived.holdingReturnPool}
          hint={
            derived.holdingMonths === null
              ? "Set Sale Completed Date to calculate"
              : `Principal × ${projectDefaults.holdingReturnRateMonthly || 0}%/month × ${derived.holdingMonths} month(s) from ${projectDefaults.holdingStartDate || "holding start"}`
          }
        />
        <AutoInput name="profitDistributionPool" label="Member Profit Distribution Pool" value={derived.profitDistributionPool} hint="(Net Return − Holding Return) × Member %" />
        <AutoInput name="finalDistributionPool" label="Final Distribution Pool" value={derived.finalDistributionPool} hint="Principal + Holding + Member Profit" />
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="saleCompletedAt">Sale Completed Date</label>
          <input id="saleCompletedAt" name="saleCompletedAt" type="date" value={values.saleCompletedAt} onChange={(event) => set("saleCompletedAt")(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-kasset-green" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="distributionCalculationDate">Distribution Calculation Date</label>
          <input id="distributionCalculationDate" name="distributionCalculationDate" type="date" defaultValue={initialValues.distributionCalculationDate} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-kasset-green" />
        </div>
      </div>
      {derived.holdingExceedsNet ? (
        <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          Holding Return Pool is larger than Net Return, so the sale does not cover the full holding return. Review before approving.
        </p>
      ) : null}
      <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="calculationRemarks">Calculation Remarks</label>
      <textarea id="calculationRemarks" name="calculationRemarks" rows={4} defaultValue={initialValues.calculationRemarks} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-kasset-green" placeholder="Add summary assumptions, approval notes, or calculation context." />
      <SubmitButton mode={mode} />
    </form>
  );
}
