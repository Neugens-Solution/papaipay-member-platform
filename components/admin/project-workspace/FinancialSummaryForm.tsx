"use client";

import { useFormState, useFormStatus } from "react-dom";
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

type FinancialSummaryFormProps = {
  campaignId: string;
  mode: "create" | "update";
  initialValues: FinancialSummaryFormValues;
};

function SubmitButton({ mode }: { mode: "create" | "update" }) {
  const { pending } = useFormStatus();
  const label = mode === "update" ? "Update Financial Summary" : "Create Financial Summary";

  return (
    <button
      className="mt-4 rounded-lg bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-papaipay-ink disabled:cursor-not-allowed disabled:bg-slate-300"
      type="submit"
      disabled={pending}
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function MoneyInput({ id, name, label, defaultValue }: { id: string; name: keyof FinancialSummaryFormValues; label: string; defaultValue: string }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor={id}>{label}</label>
      <input id={id} name={name} type="number" min="0" step="0.01" defaultValue={defaultValue} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-papaipay-green" placeholder="0.00" />
    </div>
  );
}

function PercentInput({ id, name, label, defaultValue }: { id: string; name: keyof FinancialSummaryFormValues; label: string; defaultValue: string }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor={id}>{label}</label>
      <input id={id} name={name} type="number" min="0" max="100" step="0.0001" defaultValue={defaultValue} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-papaipay-green" placeholder="0" />
    </div>
  );
}

const initialState: ProjectFinancialSummaryState = { status: "idle", message: null, errors: [] };

export function FinancialSummaryForm({ campaignId, mode, initialValues }: FinancialSummaryFormProps) {
  const [state, formAction] = useFormState(saveProjectFinancialSummaryAction, initialState);

  return (
    <form action={formAction} className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
      <input type="hidden" name="campaignId" value={campaignId} />
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-papaipay-ink">{mode === "update" ? "Update Financial Summary" : "Create Financial Summary"}</p>
          <p className="mt-1 text-sm text-slate-500">Enter admin-approved summary values only. Values are saved exactly as entered.</p>
        </div>
        <span className="inline-flex whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-papaipay-green">
          {mode === "update" ? "Existing summary" : "New summary"}
        </span>
      </div>

      {state.status === "success" ? (
        <p className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-papaipay-green" role="status">
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
        <MoneyInput id="purchasePrice" name="purchasePrice" label="Acquisition Price" defaultValue={initialValues.purchasePrice} />
        <MoneyInput id="salePrice" name="salePrice" label="Sale Price / Disposal Price" defaultValue={initialValues.salePrice} />
        <MoneyInput id="totalCostsSnapshot" name="totalCostsSnapshot" label="Total Approved Costs" defaultValue={initialValues.totalCostsSnapshot} />
        <MoneyInput id="grossProfitSnapshot" name="grossProfitSnapshot" label="Gross Return" defaultValue={initialValues.grossProfitSnapshot} />
        <MoneyInput id="netProfitSnapshot" name="netProfitSnapshot" label="Net Return" defaultValue={initialValues.netProfitSnapshot} />
        <PercentInput id="memberProfitDistributionPercentage" name="memberProfitDistributionPercentage" label="Member Return Share %" defaultValue={initialValues.memberProfitDistributionPercentage} />
        <PercentInput id="platformProfitSharePercentage" name="platformProfitSharePercentage" label="Platform Return Share %" defaultValue={initialValues.platformProfitSharePercentage} />
        <MoneyInput id="platformShare" name="platformShare" label="Platform Share Amount" defaultValue={initialValues.platformShare} />
        <MoneyInput id="principalReturnPool" name="principalReturnPool" label="Principal Return Pool" defaultValue={initialValues.principalReturnPool} />
        <MoneyInput id="holdingReturnPool" name="holdingReturnPool" label="Holding Return Pool" defaultValue={initialValues.holdingReturnPool} />
        <MoneyInput id="profitDistributionPool" name="profitDistributionPool" label="Member Profit Distribution Pool" defaultValue={initialValues.profitDistributionPool} />
        <MoneyInput id="finalDistributionPool" name="finalDistributionPool" label="Final Distribution Pool" defaultValue={initialValues.finalDistributionPool} />
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="saleCompletedAt">Sale Completed Date</label>
          <input id="saleCompletedAt" name="saleCompletedAt" type="date" defaultValue={initialValues.saleCompletedAt} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-papaipay-green" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="distributionCalculationDate">Distribution Calculation Date</label>
          <input id="distributionCalculationDate" name="distributionCalculationDate" type="date" defaultValue={initialValues.distributionCalculationDate} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-papaipay-green" />
        </div>
      </div>
      <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="calculationRemarks">Calculation Remarks</label>
      <textarea id="calculationRemarks" name="calculationRemarks" rows={4} defaultValue={initialValues.calculationRemarks} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-papaipay-green" placeholder="Add summary assumptions, approval notes, or calculation context." />
      <SubmitButton mode={mode} />
    </form>
  );
}
