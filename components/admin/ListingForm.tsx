"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Card } from "@/components/admin/AdminUI";
import { saveListingAction } from "@/lib/admin/actions/listings";
import {
  campaignLifecycleStatuses,
  documentCategories,
} from "@/lib/adminMockData";

const tabs = [
  { id: "campaign-setup", label: "Campaign Setup" },
  { id: "property-details", label: "Property Details" },
  { id: "media-documents", label: "Media & Documents" },
  { id: "campaign-content", label: "Campaign Content" },
  { id: "return-protection", label: "Return & Protection" },
  { id: "settlement-fees", label: "Settlement & Fees" },
  { id: "review-publish", label: "Review & Publish" },
];

const campaignAmountFields = [
  "Campaign Target",
  "Minimum Participation Amount",
  "Maximum Participation Amount",
];
const campaignDateFields = ["Campaign Open Date", "Campaign Close Date"];

const propertyFields = [
  "Asset Category",
  "Property Type",
  "Market Value",
  "Estimated Yield",
  "Occupancy Status",
  "Built-Up",
  "Land Area",
  "Bedrooms",
  "Bathrooms",
  "State",
  "Location",
  "Full Address",
  "Year Built",
];

const timelineStages = [
  "Draft",
  "Open",
  "Funded",
  "Holding",
  "Sold",
  "Distribution Processing",
  "Distributed",
];

const acquisitionCostFields = [
  "Purchase Price / Successful Bid Price",
  "Auction Deposit",
  "Balance Purchase Price",
  "Legal Fee",
  "Stamp Duty",
  "Disbursement",
  "Title Search",
  "Other Acquisition Costs",
];
const holdingCostFields = [
  "Maintenance Fee",
  "Sinking Fund",
  "Quit Rent / Cukai Tanah",
  "Assessment / Cukai Pintu",
  "Utilities",
  "Insurance",
  "Security / Management Charges",
  "Other Holding Costs",
];
const renovationCostFields = [
  "Renovation Cost",
  "Contractor Cost",
  "Material Cost",
  "Cleaning Cost",
  "Defect Rectification",
  "Other Preparation Costs",
];
const disposalCostFields = [
  "Sale Price",
  "Agent Fee",
  "Legal Fee on Sale",
  "RPGT, if applicable",
  "Marketing Cost",
  "Documentation Cost",
  "Other Disposal Costs",
];
const platformCostFields = [
  "Platform Fee",
  "Management Fee",
  "Administration Fee",
  "Other Platform Costs",
];
const calculationFields = [
  "Gross Profit",
  "Total Costs",
  "Net Profit",
  "Principal Return Pool",
  "Holding Return Pool",
  "Profit Distribution Pool",
  "Platform Share",
  "Final Distribution Pool",
];

function Field({
  label,
  name,
  type = "text",
  className = "",
  defaultValue,
  step,
}: {
  label: string;
  name?: string;
  type?: string;
  className?: string;
  defaultValue?: string | number | null;
  step?: string;
}) {
  const normalizedType = label.includes("Date") ? "date" : type;
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input
        name={name}
        type={normalizedType}
        defaultValue={defaultValue ?? undefined}
        step={step}
        className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  helper,
  className = "",
  defaultValue,
}: {
  label: string;
  name?: string;
  options: readonly string[];
  helper?: string;
  className?: string;
  defaultValue?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  name,
  helper,
  rows = 4,
  defaultValue,
}: {
  label: string;
  name?: string;
  helper?: string;
  rows?: number;
  defaultValue?: string | null;
}) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? undefined}
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
      />
    </label>
  );
}

function ReadOnlyField({
  label,
  helper,
  value = "Auto-generated after save",
}: {
  label: string;
  helper: string;
  value?: string;
}) {
  return (
    <label>
      <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-papaipay-green"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 11h2" />
          <path d="M14 11h2" />
          <path d="M8 15h2" />
          <path d="M14 15h2" />
        </svg>
        {label}
      </span>
      <div className="mt-2 min-h-11 rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-500 ring-1 ring-slate-100">
        {value}
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </label>
  );
}

function CalculatedField({
  label,
  helper = "Calculated from campaign data",
}: {
  label: string;
  helper?: string;
}) {
  return <ReadOnlyField label={label} helper={helper} value="Derived value" />;
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <section id={id} className="scroll-mt-28">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          </div>
        </div>
        {children}
      </section>
    </Card>
  );
}

function FieldGrid({
  fields,
  columns = "lg:grid-cols-3",
}: {
  fields: string[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns}`}>
      {fields.map((field) => (
        <Field
          key={field}
          label={field}
          className={
            field === "Full Address" ? "sm:col-span-2 lg:col-span-3" : ""
          }
        />
      ))}
    </div>
  );
}

function UploadZone({
  title,
  supported,
  helper = "Drag and drop here, or choose file",
  name,
  multiple = false,
  currentFileNames = [],
  error,
}: {
  title: string;
  supported: string;
  helper?: string;
  name?: string;
  multiple?: boolean;
  currentFileNames?: string[];
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<
    { id: string; name: string; url?: string }[]
  >([]);
  const displayedFileNames =
    selectedFiles.length > 0
      ? selectedFiles.map((file) => file.name)
      : currentFileNames;

  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.url) URL.revokeObjectURL(file.url);
      });
    };
  }, [selectedFiles]);

  function removeSelectedFile(id: string) {
    const input = inputRef.current;
    if (!input?.files) return;
    const transfer = new DataTransfer();
    Array.from(input.files)
      .filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== id)
      .forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
    setSelectedFiles((files) => {
      const removed = files.find((file) => file.id === id);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return files.filter((file) => file.id !== id);
    });
  }

  return (
    <div
      data-field={name}
      className={`min-w-0 rounded-2xl border border-dashed bg-slate-50/70 p-5 text-center transition hover:border-papaipay-green/40 hover:bg-emerald-50/40 ${
        error ? "border-red-300 bg-red-50/60" : "border-slate-300"
      }`}
    >
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-papaipay-green ring-1 ring-slate-200">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      </div>
      <p className="mt-3 text-sm font-bold text-papaipay-ink">{title}{title === "Hero Image" ? " *" : ""}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
      <label className="mt-3 inline-flex cursor-pointer rounded-full bg-white px-3 py-1 text-xs font-black text-papaipay-green ring-1 ring-emerald-100">
        <input
          ref={inputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept={supported.includes("PDF") ? ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp" : "image/jpeg,image/png,image/webp"}
          className="sr-only"
          onChange={(event) => {
            const nextFiles = Array.from(event.currentTarget.files ?? []).map((file) => ({
              id: `${file.name}-${file.size}-${file.lastModified}`,
              name: file.name,
              url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
            }));
            setSelectedFiles((previous) => {
              previous.forEach((file) => file.url && URL.revokeObjectURL(file.url));
              return nextFiles;
            });
          }}
        />
        Choose file{multiple ? "s" : ""}
      </label>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Supported: {supported} · {selectedFiles.length > 0 ? `${selectedFiles.length} image${selectedFiles.length === 1 ? "" : "s"} selected` : "No new file selected"}
      </p>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
      {displayedFileNames.length > 0 ? (
        <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-emerald-100 bg-white px-3 py-2 text-left">
          <p className="text-xs font-black uppercase tracking-wide text-papaipay-green">{selectedFiles.length > 0 ? "Selected" : "Current upload"}</p>
          <div className="mt-2 grid gap-2">
            {(selectedFiles.length > 0 ? selectedFiles : displayedFileNames.map((fileName) => ({ id: fileName, name: fileName, url: undefined }))).map((file) => (
              <div key={file.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2">
                {typeof file.url === "string" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt="" className="h-12 w-12 flex-none rounded-md object-cover" />
                ) : <div className="grid h-12 w-12 flex-none place-items-center rounded-md bg-emerald-50 text-xs font-black text-papaipay-green">IMG</div>}
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-600">{file.name}</span>
                {selectedFiles.length > 0 ? (
                  <button type="button" onClick={() => removeSelectedFile(file.id)} className="flex-none rounded-full px-2 py-1 text-xs font-black text-red-600 hover:bg-red-50">Remove</button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SubmitButton({ intent, children, pendingLabel, className }: { intent: string; children: React.ReactNode; pendingLabel: string; className: string }) {
  const { pending, data } = useFormStatus();
  const isPending = pending && data?.get("intent") === intent;
  return <button name="intent" value={intent} disabled={pending} className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}>{isPending ? pendingLabel : children}</button>;
}

function Toast({ message }: { message: string }) {
  return <div role="status" className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm font-bold text-papaipay-ink shadow-[0_18px_45px_rgba(15,23,42,0.18)]"><span className="text-papaipay-green">✓</span> {message}</div>;
}

function RepeaterPreview({
  title,
  description,
  items,
  buttonLabel,
}: {
  title: string;
  description: string;
  items: { primary: string; secondary: string; body?: string }[];
  buttonLabel: string;
}) {
  return (
    <SubsectionCard title={title} description={description}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-xl border border-slate-100 bg-white p-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={item.primary} />
              <Field label={item.secondary} />
            </div>
            {item.body ? (
              <div className="mt-4">
                <TextAreaField label={item.body} rows={4} />
              </div>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="rounded-md border border-dashed border-papaipay-green/50 bg-emerald-50 px-4 py-2 text-sm font-black text-papaipay-green"
        >
          {buttonLabel}
        </button>
      </div>
    </SubsectionCard>
  );
}

function CostAccordion({
  title,
  fields,
  defaultOpen = false,
}: {
  title: string;
  fields: string[];
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-papaipay-ink">
        <span>{title}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200 group-open:hidden">
          Open
        </span>
        <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-papaipay-green ring-1 ring-emerald-100 group-open:inline-flex">
          Expanded
        </span>
      </summary>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <Field key={field} label={field} />
        ))}
      </div>
    </details>
  );
}

function SubsectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <h3 className="text-sm font-black text-papaipay-ink">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold text-slate-700">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs text-papaipay-green">
        ✓
      </span>
      {label}
    </li>
  );
}

type ListingFormInitialValues = {
  id?: string;
  campaignRef?: string;
  campaignCode?: string;
  title?: string;
  visibility?: string;
  publishStatus?: string;
  campaignTarget?: string | number;
  minimumParticipationAmount?: string | number;
  maximumParticipationAmount?: string | number;
  campaignOpenDate?: string | null;
  campaignCloseDate?: string | null;
  holdingReturnRateMonthly?: string | number;
  returnType?: string;
  maximumHoldingPeriodMonths?: number;
  principalProtectionEnabled?: boolean;
  propertyDetail?: any;
  content?: any;
  media?: any[];
  documents?: any[];
};

export function ListingForm({
  mode,
  slug,
  initialValues,
}: {
  mode: "create" | "edit";
  slug?: string;
  initialValues?: ListingFormInitialValues;
}) {
  const [state, formAction] = useFormState(saveListingAction, { errors: [] });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fieldErrors = useMemo(() => state.fieldErrors ?? {}, [state.fieldErrors]);

  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    const messages: Record<string, string> = {
      draft: "Listing saved successfully as Draft.",
      publish: "Listing published successfully.",
      unpublish: "Listing unpublished successfully.",
    };
    if (!saved || !messages[saved]) return;
    setToastMessage(mode === "edit" && saved === "draft" ? "Listing updated successfully." : messages[saved]);
    const timer = window.setTimeout(() => setToastMessage(null), 4500);
    return () => window.clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    const firstField = Object.keys(fieldErrors)[0];
    if (!firstField) return;
    const element = document.querySelector<HTMLElement>(`[name="${CSS.escape(firstField)}"], [data-field="${CSS.escape(firstField)}"]`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) element.focus({ preventScroll: true });
    }, 350);
  }, [fieldErrors]);
  const memberPreviewHref =
    mode === "edit" && slug ? `/member/opportunities/${slug}` : undefined;
  const campaignIdValue =
    mode === "edit" && initialValues?.campaignRef
      ? initialValues.campaignRef
      : "Auto-generated after save";
  const campaignCodeValue =
    mode === "edit" && initialValues?.campaignCode
      ? initialValues.campaignCode
      : "Auto-generated after save";
  const heroImage = initialValues?.media?.find(
    (media) => media.mediaType === "PrimaryImage",
  );
  const galleryImages =
    initialValues?.media?.filter(
      (media) => media.mediaType === "GalleryImage",
    ) ?? [];
  const documents = initialValues?.documents ?? [];

  return (
    <form action={formAction} className="space-y-5">
      {toastMessage ? <Toast message={toastMessage} /> : null}
      <input type="hidden" name="campaignId" value={initialValues?.id ?? ""} />
      {state.errors.length > 0 ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">
          <p className="text-xs font-black uppercase tracking-wide">Please complete the following before publishing</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="sticky top-[76px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div
          className="flex gap-2 overflow-x-auto"
          aria-label="Listing form sections"
        >
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:border-papaipay-green/40 hover:bg-emerald-50/50 hover:text-papaipay-green"
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>

      <Section
        id="campaign-setup"
        title="Campaign Setup"
        description="Manage identifiers, lifecycle status, participation limits, campaign dates and member preview visibility."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <SubsectionCard
            title="Identity & Visibility"
            description="Reference details and member-facing visibility controls."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyField
                label="Campaign ID"
                helper="System-generated database identifier. Manual entry is disabled."
                value={campaignIdValue}
              />
              <ReadOnlyField
                label="Campaign Code"
                helper="System-generated campaign code. Manual entry is disabled."
                value={campaignCodeValue}
              />
              <Field
                label="Campaign Title"
                name="title"
                defaultValue={initialValues?.title}
              />
              <SelectField
                label="Member Preview Visibility"
                name="visibility"
                defaultValue={initialValues?.visibility ?? "InternalOnly"}
                options={["MemberVisible", "InternalOnly"]}
              />
            </div>
          </SubsectionCard>
          <SubsectionCard
            title="Lifecycle & Dates"
            description="Operational status and campaign timing."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Campaign Lifecycle Status"
                options={campaignLifecycleStatuses}
                className="sm:col-span-2"
              />
              <Field
                label="Campaign Open Date"
                name="campaignOpenDate"
                defaultValue={initialValues?.campaignOpenDate}
              />
              <Field
                label="Campaign Close Date"
                name="campaignCloseDate"
                defaultValue={initialValues?.campaignCloseDate}
              />
              <CalculatedField
                label="Days Remaining"
                helper="Calculated from the campaign close date."
              />
            </div>
          </SubsectionCard>
          <SubsectionCard
            title="Participation & Progress"
            description="Campaign funding values and derived campaign progress."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Campaign Target"
                name="campaignTarget"
                type="number"
                defaultValue={initialValues?.campaignTarget ?? 0}
              />
              <Field
                label="Minimum Participation Amount"
                name="minimumParticipationAmount"
                type="number"
                defaultValue={initialValues?.minimumParticipationAmount ?? 0}
              />
              <Field
                label="Maximum Participation Amount"
                name="maximumParticipationAmount"
                type="number"
                defaultValue={initialValues?.maximumParticipationAmount ?? 0}
              />
              <ReadOnlyField
                label="Collected Amount"
                helper="Derived from confirmed participations and successful payments. Admin editing is disabled."
                value="Derived from confirmed payments"
              />
              <ReadOnlyField
                label="Remaining Amount"
                helper="Derived from campaign target minus collected and reserved amounts."
                value="Derived balance"
              />
              <ReadOnlyField
                label="Progress Percentage"
                helper="Derived from collected amount against campaign target."
                value="Derived percentage"
              />
            </div>
          </SubsectionCard>
          <SubsectionCard
            title="Internal Notes"
            description="Notes for admin coordination only."
          >
            <TextAreaField label="Internal Admin Notes" rows={6} />
          </SubsectionCard>
        </div>
      </Section>

      <Section
        id="property-details"
        title="Property Details"
        description="Maintain the Malaysian property benchmark fields that appear in the member property snapshot."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField
            label="Tenure"
            name="tenure"
            defaultValue={initialValues?.propertyDetail?.tenure ?? "Freehold"}
            options={["Freehold", "Leasehold"]}
            helper="Use full wording in normal rows and form labels."
          />
          <SelectField
            label="Tenure Badge"
            options={["Auto: FH", "Auto: LH"]}
            helper="Automatically derived from Tenure; shown only as an optional compact admin badge."
          />
          <label>
            <span className="text-sm font-bold text-slate-600">
              LACA Status
            </span>
            <select
              name="isLaca"
              defaultValue={
                initialValues?.propertyDetail?.isLaca ? "true" : "false"
              }
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              LACA (Land Acquisition Cost Allocation), if applicable.
            </p>
          </label>
          <SelectField
            label="Bumi Status"
            name="bumiStatus"
            defaultValue={
              initialValues?.propertyDetail?.bumiStatus ?? "OpenMarket"
            }
            options={["Bumi", "NonBumi", "OpenMarket"]}
          />
        </div>
        <div className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Property Type"
              name="propertyType"
              defaultValue={initialValues?.propertyDetail?.propertyType}
            />
            <Field
              label="Reserve Price"
              name="reservePrice"
              type="number"
              defaultValue={initialValues?.propertyDetail?.reservePrice}
            />
            <Field
              label="Built-Up"
              name="builtUpArea"
              defaultValue={initialValues?.propertyDetail?.builtUpArea}
            />
            <Field
              label="Land Area"
              name="landArea"
              defaultValue={initialValues?.propertyDetail?.landArea}
            />
            <Field
              label="Bedrooms"
              name="bedrooms"
              type="number"
              defaultValue={initialValues?.propertyDetail?.bedrooms}
            />
            <Field
              label="Bathrooms"
              name="bathrooms"
              type="number"
              defaultValue={initialValues?.propertyDetail?.bathrooms}
            />
            <Field
              label="Auction Date"
              name="auctionDate"
              defaultValue={initialValues?.propertyDetail?.auctionDate}
            />
            <Field
              label="State"
              name="state"
              defaultValue={initialValues?.propertyDetail?.state}
            />
            <Field
              label="Location"
              name="location"
              defaultValue={initialValues?.propertyDetail?.location}
            />
            <Field
              label="Full Address"
              name="fullAddress"
              className="sm:col-span-2 lg:col-span-3"
              defaultValue={initialValues?.propertyDetail?.fullAddress}
            />
            <Field
              label="Year Built"
              name="yearBuilt"
              defaultValue={initialValues?.propertyDetail?.yearBuilt}
            />
          </div>
        </div>
      </Section>

      <Section
        id="media-documents"
        title="Media & Documents"
        description="Manage the member-facing gallery, image metadata and document readiness."
      >
        <div className="grid gap-5">
          <SubsectionCard
            title="Gallery"
            description="Images used in the campaign detail gallery."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <UploadZone
                title="Hero Image"
                name="heroImage"
                supported="JPG, PNG, WEBP"
                helper="Use one hero image as the primary listing image."
                error={fieldErrors.heroImage}
                currentFileNames={
                  heroImage?.fileAsset?.originalFilename
                    ? [heroImage.fileAsset.originalFilename]
                    : []
                }
              />
              <input
                type="hidden"
                name="heroMediaId"
                value={heroImage?.id ?? ""}
              />
              <UploadZone
                title="Gallery Images"
                name="galleryImages"
                multiple
                supported="JPG, PNG, WEBP"
                helper="Add multiple supporting gallery images for the listing."
                currentFileNames={galleryImages
                  .map((media) => media.fileAsset?.originalFilename)
                  .filter((fileName): fileName is string => Boolean(fileName))}
              />
              <Field
                label="Image Caption"
                name="heroCaption"
                defaultValue={heroImage?.caption}
              />
              <Field
                label="Image Alt Text"
                name="heroAltText"
                defaultValue={heroImage?.altText}
              />
              <CalculatedField
                label="Gallery Count"
                helper="Calculated from uploaded gallery images."
              />
            </div>
            {heroImage ? (
              <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4 text-sm">
                {heroImage.fileAsset?.objectKey ? (
                  <div
                    className="mb-4 h-48 rounded-lg bg-slate-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage.fileAsset.objectKey})` }}
                    aria-label="Current hero image preview"
                  />
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-papaipay-ink">
                      Current hero image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {heroImage.fileAsset?.originalFilename ??
                        "Uploaded image"}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-red-600">
                    <input
                      type="checkbox"
                      name="deleteHeroImage"
                      value="true"
                    />{" "}
                    Delete
                  </label>
                </div>
              </div>
            ) : null}
            {galleryImages.length > 0 ? (
              <div className="mt-4 space-y-3">
                {galleryImages.map((media, index) => (
                  <div
                    key={media.id}
                    className="rounded-xl border border-slate-100 bg-white p-4"
                  >
                    {media.fileAsset?.objectKey ? (
                      <div
                        className="mb-3 h-32 rounded-lg bg-slate-100 bg-cover bg-center"
                        style={{ backgroundImage: `url(${media.fileAsset.objectKey})` }}
                        aria-label={`Gallery image ${index + 1} thumbnail`}
                      />
                    ) : null}
                    <input
                      type="hidden"
                      name="galleryMediaId"
                      value={media.id}
                    />
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-papaipay-ink">
                          Gallery image {index + 1}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {media.fileAsset?.originalFilename ??
                            "Uploaded image"}
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-xs font-bold text-red-600">
                        <input
                          type="checkbox"
                          name="deleteGalleryMediaId"
                          value={media.id}
                        />{" "}
                        Delete
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field
                        label="Image Caption"
                        name={`galleryCaption:${media.id}`}
                        defaultValue={media.caption}
                      />
                      <Field
                        label="Image Alt Text"
                        name={`galleryAltText:${media.id}`}
                        defaultValue={media.altText}
                      />
                      <Field
                        label="Sort Order"
                        name={`gallerySortOrder:${media.id}`}
                        type="number"
                        defaultValue={media.sortOrder}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </SubsectionCard>
          <SubsectionCard
            title="Documents"
            description="Document categories prepared for member review or internal operations."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField
                label="Document Visibility"
                name="newDocumentVisibility"
                options={["Internal Only", "Member Visible"]}
              />
              <SelectField
                label="Document Status"
                name="newDocumentStatus"
                options={["Draft", "Ready", "Published"]}
              />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {documentCategories.map((category) => (
                <UploadZone
                  key={category}
                  title={`${category} Upload`}
                  name={`documentFile:${category}`}
                  helper="Upload document."
                  supported={
                    category === "Property Photos"
                      ? "JPG, PNG, WEBP"
                      : "PDF, DOCX"
                  }
                />
              ))}
            </div>
            {documents.length > 0 ? (
              <div className="mt-5 space-y-3">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-xl border border-slate-100 bg-white p-4"
                  >
                    <input
                      type="hidden"
                      name="documentId"
                      value={document.id}
                    />
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="text-sm font-black text-papaipay-ink">
                        {document.fileAsset?.originalFilename ?? document.title}
                      </p>
                      <label className="flex items-center gap-2 text-xs font-bold text-red-600">
                        <input
                          type="checkbox"
                          name="deleteDocumentId"
                          value={document.id}
                        />{" "}
                        Delete
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field
                        label="Document Title"
                        name={`documentTitle:${document.id}`}
                        defaultValue={document.title}
                      />
                      <SelectField
                        label="Document Visibility"
                        name={`documentVisibility:${document.id}`}
                        defaultValue={
                          document.visibility === "MemberVisible"
                            ? "Member Visible"
                            : "Internal Only"
                        }
                        options={["Internal Only", "Member Visible"]}
                      />
                      <SelectField
                        label="Document Status"
                        name={`documentStatus:${document.id}`}
                        defaultValue={document.documentStatus}
                        options={["Draft", "Ready", "Published", "Archived"]}
                      />
                      <SelectField
                        label="Document Category"
                        name={`documentCategory:${document.id}`}
                        defaultValue={document.category}
                        options={[
                          "ProclamationOfSale",
                          "ConditionsOfSale",
                          "TitleSearch",
                          "ValuationReport",
                          "PropertyPhotos",
                          "LocationMap",
                          "LegalDocuments",
                          "OtherDocuments",
                        ]}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </SubsectionCard>
        </div>
      </Section>

      <Section
        id="campaign-content"
        title="Campaign Content"
        description="Control member-facing campaign narrative, important information, timeline, updates, FAQ and risk text."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField
            label="About This Campaign"
            name="aboutCampaign"
            rows={7}
            defaultValue={initialValues?.content?.aboutCampaign}
            helper="Member-facing campaign overview displayed on the campaign detail page."
          />
          <TextAreaField
            label="Important Information"
            name="importantInformation"
            rows={7}
            defaultValue={initialValues?.content?.importantInformation}
          />
        </div>
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <h3 className="text-sm font-black text-papaipay-ink">
            Campaign Timeline
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Read-only lifecycle display. Stage changes will be system-generated
            later from campaign events.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {timelineStages.map((stage, index) => (
              <div
                key={stage}
                className="rounded-xl border border-slate-100 bg-white p-3 text-sm font-bold text-slate-700"
              >
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500">
                  {index + 1}
                </span>
                <p>{stage}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  System-generated stage
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <RepeaterPreview
            title="Updates"
            description="Add member-facing update entries for upcoming release workflows."
            buttonLabel="Add Update"
            items={[
              {
                primary: "Update Title",
                secondary: "Update Date",
                body: "Update Description / Body",
              },
            ]}
          />
          <RepeaterPreview
            title="FAQ"
            description="Add member-facing FAQ entries for upcoming release workflows."
            buttonLabel="Add FAQ"
            items={[
              {
                primary: "Question",
                secondary: "Display Order",
                body: "Answer",
              },
            ]}
          />
          <div className="lg:col-span-2">
            <TextAreaField
              label="Risk / Disclaimer"
              name="riskDisclaimer"
              rows={5}
              defaultValue={initialValues?.content?.riskDisclaimer}
            />
          </div>
        </div>
      </Section>

      <Section
        id="return-protection"
        title="Return & Protection"
        description="Configure the holding return model and the member-facing final distribution explanation."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Holding Return Rate"
            name="holdingReturnRateMonthly"
            type="number"
            step="0.01"
            defaultValue={initialValues?.holdingReturnRateMonthly ?? 0}
          />
          <SelectField
            label="Return Type"
            name="returnType"
            defaultValue={initialValues?.returnType ?? "Target"}
            options={["Fixed", "Target", "UpTo"]}
          />
          <Field
            label="Maximum Holding Period Months"
            name="maximumHoldingPeriodMonths"
            type="number"
            defaultValue={initialValues?.maximumHoldingPeriodMonths ?? 24}
          />
          <label>
            <span className="text-sm font-bold text-slate-600">
              Principal Protection Enabled
            </span>
            <select
              name="principalProtectionEnabled"
              defaultValue={
                initialValues?.principalProtectionEnabled === false
                  ? "false"
                  : "true"
              }
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </label>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextAreaField
            label="Holding Return Explanation"
            name="holdingReturnExplanation"
            rows={5}
            defaultValue={initialValues?.content?.holdingReturnExplanation}
            helper="Holding Return accrues during the holding period and is paid once during final distribution."
          />
          <TextAreaField
            label="Final Distribution Explanation"
            name="finalDistributionExplanation"
            rows={5}
            defaultValue={initialValues?.content?.finalDistributionExplanation}
            helper="Explain Principal Return, Holding Return and Profit Distribution clearly."
          />
        </div>
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">
            Locked 24-Month Rule
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-blue-900">
            If not sold within 24 months, Participation Amount only will be
            returned.
          </p>
          <div className="mt-4">
            <TextAreaField
              label="24-Month Rule Display Text"
              rows={3}
              helper="Keep this aligned with the approved rule text."
            />
          </div>
        </div>
      </Section>

      <Section
        id="settlement-fees"
        title="Settlement & Fees"
        description="Finance workflow and calculation section for acquisition, holding, preparation, disposal, platform costs and final distribution fields. Calculation logic is not implemented yet."
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_2fr] lg:items-start">
              <SelectField
                label="Calculation Status"
                options={["Draft", "Reviewed", "Approved", "Locked"]}
              />
              <div className="rounded-xl border border-amber-200 bg-white/70 p-4 text-sm leading-6 text-amber-900">
                <p className="text-xs font-black uppercase tracking-wide">
                  Finance workflow / calculation
                </p>
                <p className="mt-1">
                  <strong>Locked calculation note:</strong> if Calculation
                  Status is Locked, finance values should not be edited
                  casually. Add remarks before requesting a change.
                </p>
              </div>
            </div>
          </div>
          <CostAccordion
            title="Acquisition Costs"
            fields={acquisitionCostFields}
            defaultOpen
          />
          <CostAccordion title="Holding Costs" fields={holdingCostFields} />
          <CostAccordion
            title="Renovation / Preparation Costs"
            fields={renovationCostFields}
          />
          <CostAccordion
            title="Disposal / Sale Costs"
            fields={disposalCostFields}
          />
          <CostAccordion
            title="Platform / Management Costs"
            fields={platformCostFields}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Member Profit Distribution Percentage" />
            <Field label="Platform Profit Share Percentage" />
          </div>
          <SubsectionCard
            title="Calculation Preview"
            description="Read-only values calculated from the entered settlement and distribution fields."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {calculationFields.map((field) => (
                <CalculatedField
                  key={field}
                  label={field}
                  helper="Calculated from settlement values."
                />
              ))}
            </div>
          </SubsectionCard>
          <TextAreaField label="Calculation Remarks" rows={4} />
        </div>
      </Section>

      <Section
        id="review-publish"
        title="Review & Publish"
        description="Confirm readiness before saving, publishing or previewing the member-facing listing."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Campaign ID present",
            "Campaign Code present",
            "Campaign Target set",
            "Min / Max Participation set",
            "Property Snapshot complete",
            "Gallery ready",
            "Required documents ready",
            "About This Campaign completed",
            "Important Information completed",
            "Return & Protection completed",
            "24-month rule visible",
            "Settlement reviewed if applicable",
            "Member Preview checked",
          ].map((item) => (
            <ChecklistItem key={item} label={item} />
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-papaipay-green/20 bg-emerald-50/70 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-papaipay-green">
                Preview Member View
              </p>
              <h3 className="mt-1 text-lg font-bold text-papaipay-ink">
                Review exactly what members will see
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Open the member-facing campaign detail page before publishing or
                updating this campaign.
              </p>
            </div>
            {memberPreviewHref ? (
              <a
                href={memberPreviewHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-papaipay-green px-5 py-3 text-center text-sm font-bold text-white shadow-[0_10px_24px_rgba(34,139,76,0.22)]"
              >
                Preview Member View
              </a>
            ) : (
              <span className="rounded-xl bg-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-500">
                Save a draft first to preview
              </span>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">
          Save Draft stores Draft status. Publish Listing stores Published
          status and makes the listing member visible.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {mode === "create" ? (
            <>
              <SubmitButton intent="draft" pendingLabel="Saving draft..." className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                Save Draft
              </SubmitButton>
              <SubmitButton intent="publish" pendingLabel="Publishing..." className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">
                Publish Listing
              </SubmitButton>
            </>
          ) : (
            <>
              <SubmitButton intent="draft" pendingLabel="Saving changes..." className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
                Save Changes
              </SubmitButton>
              {initialValues?.publishStatus === "Published" ? (
                <SubmitButton intent="unpublish" pendingLabel="Unpublishing..." className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
                  Unpublish Listing
                </SubmitButton>
              ) : (
                <SubmitButton intent="publish" pendingLabel="Publishing..." className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">
                  Publish Listing
                </SubmitButton>
              )}
            </>
          )}
        </div>
      </Section>
    </form>
  );
}
