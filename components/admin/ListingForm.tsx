"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Card } from "@/components/admin/AdminUI";
import { saveListingAction } from "@/lib/admin/actions/listings";
import {
  campaignLifecycleStatuses,
  documentCategories,
} from "@/lib/adminMockData";

const wizardSteps = [
  {
    id: "overview",
    title: "Overview",
    description:
      "Set the listing identity, campaign code, readiness and key publishing dates.",
  },
  {
    id: "property-details",
    title: "Property Details",
    description:
      "Capture the member-facing asset snapshot and property valuation details.",
  },
  {
    id: "investment-details",
    title: "Participation Details",
    description:
      "Define participation target, participation limits, holding return expectations and period settings.",
  },
  {
    id: "settlement-fees",
    title: "Settlement & Fees",
    description:
      "Optional planning for future profit distribution and platform fee handling.",
  },
  {
    id: "media",
    title: "Media",
    description: "Upload hero image and optional gallery images.",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload optional member-facing documents.",
  },
  {
    id: "important-faq-risk",
    title: "Important Info, FAQ & Risk",
    description:
      "Optional important information, FAQ and risk text displayed on the member listing detail page.",
  },
  {
    id: "publish",
    title: "Publish",
    description: "Set the final listing status and publish when ready.",
  },
] as const;

const propertyTypeOptions = [
  "Apartment",
  "Condominium",
  "Terrace House",
  "Semi-Detached House",
  "Detached House",
  "Townhouse",
  "Shop Lot",
  "Retail Unit",
  "Office Suite",
  "Industrial Property",
  "Land",
] as const;

const assetCategoryOptions = [
  "Residential",
  "Commercial",
  "Industrial",
  "Mixed Development",
  "Land",
] as const;

const occupancyStatusOptions = [
  "Vacant",
  "Owner Occupied",
  "Tenanted",
  "Partially Tenanted",
  "Under Renovation",
  "To Be Confirmed",
] as const;

const malaysiaStateOptions = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
] as const;

const defaultHoldingReturnExplanation = `Holding Return is the projected return accumulated throughout the campaign holding period. It is not paid monthly, but will be accumulated and distributed together with the Final Return once the campaign has been successfully completed.

Example

Participation Amount:
RM10,000

Holding Return:
1.5% per month

Campaign Duration:
13 months

Estimated Holding Return:

RM10,000 × 1.5% × 13
=
RM1,950

This is an illustration only.
Actual returns may vary depending on the final campaign duration and overall asset performance.`;

const defaultFinalReturnExplanation = `Final Return will be calculated after the campaign has been successfully completed and the property disposal process has been finalised.

All approved campaign-related expenses, taxes, operational costs and platform charges will be deducted before the remaining return is distributed to members based on the approved participation structure.

Members will receive a detailed Final Return calculation together with the final distribution statement once the campaign is completed.`;

const lockedHoldingPeriodRule = `If the property is not successfully disposed of within the maximum holding period of 24 months, members will receive a return of their original Participation Amount only.

No Holding Return or Final Return will be payable unless otherwise stated in the listing terms.`;

const defaultRiskDisclaimer = `Participation in any listing carries inherent risks, including the possibility that projected returns may differ from actual outcomes.

Past performance of any asset or campaign should not be regarded as an indication of future results.

Members are encouraged to read all listing information and supporting documents carefully before making any participation decision.

Each member should assess their own financial circumstances, objectives and risk tolerance before participating in any listing.`;

const defaultFaqs = [
  {
    question: "What is Holding Return?",
    answer: `Holding Return is the projected return accumulated throughout the campaign holding period.

It is not paid monthly but will be distributed together with the Final Return after campaign completion.

Example

Participation Amount

RM10,000

Holding Return

1.5%

Campaign Duration

13 months

Estimated Holding Return

RM1,950`,
  },
  {
    question: "How is Holding Return distributed?",
    answer:
      "Holding Return is accumulated throughout the campaign and paid together with the Final Return once the campaign has been successfully completed.",
  },
  {
    question:
      "Can I withdraw my participation before the campaign is completed?",
    answer: `No.

Participation cannot be withdrawn once the campaign has started.

However, if the property is not successfully disposed of within 24 months, members will receive their original Participation Amount back.`,
  },
  {
    question: "How is Final Return calculated?",
    answer:
      "Final Return will be calculated after deducting all approved campaign-related expenses, taxes, operational costs and platform charges.\n\nMembers will receive a detailed Final Return calculation after campaign completion.",
  },
  {
    question: "Where can I monitor my participation?",
    answer:
      "Members can monitor campaign progress and updates through their Member Portal.",
  },
];

const requiredFieldsByStep: Record<number, string[]> = {
  0: ["title", "aboutCampaign"],
  1: [
    "propertyType",
    "assetCategory",
    "occupancyStatus",
    "state",
    "location",
    "fullAddress",
  ],
  2: [
    "campaignTarget",
    "minimumParticipationAmount",
    "maximumParticipationAmount",
    "holdingReturnRateMonthly",
    "maximumHoldingPeriodMonths",
  ],
  4: ["heroImage"],
};

const campaignAmountFields = [
  "Participation Target",
  "Minimum Participation Amount",
  "Maximum Participation Amount",
];
const campaignDateFields = ["Campaign Open Date", "Campaign Close Date"];

const propertyFields = [
  "Asset Category",
  "Asset Type",
  "Market Value",
  "Estimated Yield",
  "Occupancy Status",
  "Built-Up",
  "Land Area",
  "Bedrooms",
  "Bathrooms",
  "State",
  "City",
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
  "Purchase Price",
  "Initial Deposit",
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
  "Final Return Pool",
];

function Field({
  label,
  name,
  type = "text",
  className = "",
  defaultValue,
  step,
  error,
  helper,
}: {
  label: string;
  name?: string;
  type?: string;
  className?: string;
  defaultValue?: string | number | null;
  step?: string;
  error?: string;
  helper?: string;
}) {
  const normalizedType = label.includes("Date") ? "date" : type;
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <input
        name={name}
        type={normalizedType}
        defaultValue={defaultValue ?? undefined}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={error && name ? `${name}-error` : undefined}
        className={`mt-2 min-h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-4 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`}
      />
      {error && name ? (
        <p id={`${name}-error`} className="mt-1 text-xs font-bold text-red-600">
          {error}
        </p>
      ) : null}
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
  error,
}: {
  label: string;
  name?: string;
  options: readonly string[];
  helper?: string;
  className?: string;
  defaultValue?: string;
  error?: string;
}) {
  const allOptions =
    defaultValue && !options.includes(defaultValue)
      ? [defaultValue, ...options]
      : options;
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <select
        name={name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error && name ? `${name}-error` : undefined}
        className={`mt-2 min-h-11 w-full rounded-lg border bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:ring-4 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`}
      >
        {allOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      {error && name ? (
        <p id={`${name}-error`} className="mt-1 text-xs font-bold text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function TextAreaField({
  label,
  name,
  helper,
  rows = 4,
  defaultValue,
  error,
}: {
  label: string;
  name?: string;
  helper?: string;
  rows?: number;
  defaultValue?: string | null;
  error?: string;
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
        aria-invalid={Boolean(error)}
        aria-describedby={error && name ? `${name}-error` : undefined}
        className={`mt-2 w-full rounded-lg border bg-white p-3 text-sm outline-none transition focus:ring-4 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`}
      />
      {error && name ? (
        <p id={`${name}-error`} className="mt-1 text-xs font-bold text-red-600">
          {error}
        </p>
      ) : null}
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
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      </div>
      <p className="mt-3 text-sm font-bold text-papaipay-ink">
        {title}
        {title === "Hero Image" ? " *" : ""}
      </p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
      <label className="mt-3 inline-flex cursor-pointer rounded-full bg-white px-3 py-1 text-xs font-black text-papaipay-green ring-1 ring-emerald-100">
        <input
          ref={inputRef}
          type="file"
          name={name}
          multiple={multiple}
          accept={
            supported.includes("PDF")
              ? ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp"
              : "image/jpeg,image/png,image/webp"
          }
          className="sr-only"
          onChange={(event) => {
            const nextFiles = Array.from(event.currentTarget.files ?? []).map(
              (file) => ({
                id: `${file.name}-${file.size}-${file.lastModified}`,
                name: file.name,
                url: file.type.startsWith("image/")
                  ? URL.createObjectURL(file)
                  : undefined,
              }),
            );
            setSelectedFiles((previous) => {
              previous.forEach(
                (file) => file.url && URL.revokeObjectURL(file.url),
              );
              return nextFiles;
            });
          }}
        />
        Choose file{multiple ? "s" : ""}
      </label>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Supported: {supported} ·{" "}
        {selectedFiles.length > 0
          ? `${selectedFiles.length} image${selectedFiles.length === 1 ? "" : "s"} selected`
          : "No new file selected"}
      </p>
      {error ? (
        <p className="mt-2 text-xs font-bold text-red-600">{error}</p>
      ) : null}
      {displayedFileNames.length > 0 ? (
        <div className="mt-3 max-h-80 overflow-y-auto rounded-lg border border-emerald-100 bg-white px-3 py-2 text-left">
          <p className="text-xs font-black uppercase tracking-wide text-papaipay-green">
            {selectedFiles.length > 0 ? "Selected" : "Current upload"}
          </p>
          <div className="mt-2 grid gap-2">
            {(selectedFiles.length > 0
              ? selectedFiles
              : displayedFileNames.map((fileName) => ({
                  id: fileName,
                  name: fileName,
                  url: undefined,
                }))
            ).map((file) => (
              <div
                key={file.id}
                className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2"
              >
                {typeof file.url === "string" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt=""
                    className="h-12 w-12 flex-none rounded-md object-cover"
                  />
                ) : (
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-md bg-emerald-50 text-xs font-black text-papaipay-green">
                    IMG
                  </div>
                )}
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-600">
                  {file.name}
                </span>
                {selectedFiles.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(file.id)}
                    className="flex-none rounded-full px-2 py-1 text-xs font-black text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SubmitButton({
  intent,
  children,
  pendingLabel,
  className,
}: {
  intent: string;
  children: React.ReactNode;
  pendingLabel: string;
  className: string;
}) {
  const { pending, data } = useFormStatus();
  const isPending = pending && data?.get("intent") === intent;
  return (
    <button
      name="intent"
      value={intent}
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isPending ? pendingLabel : children}
    </button>
  );
}

function Toast({
  message,
  tone = "success",
}: {
  message: string;
  tone?: "success" | "warning" | "error";
}) {
  const isError = tone === "error";
  const isWarning = tone === "warning";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border bg-white px-5 py-4 text-sm font-bold text-papaipay-ink shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${isError ? "border-red-200" : isWarning ? "border-amber-200" : "border-emerald-100"}`}
    >
      <span
        className={
          isError
            ? "text-red-600"
            : isWarning
              ? "text-amber-600"
              : "text-papaipay-green"
        }
      >
        {isError ? "!" : isWarning ? "⚠" : "✓"}
      </span>{" "}
      {message}
    </div>
  );
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
  memberProfitDistributionPercentagePlanned?: string | number | null;
  platformProfitSharePercentagePlanned?: string | number | null;
  propertyDetail?: any;
  content?: any;
  media?: any[];
  documents?: any[];
  faqs?: any[];
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
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "warning" | "error";
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [memberFinalReturn, setMemberFinalReturn] = useState(
    Number(initialValues?.memberProfitDistributionPercentagePlanned ?? 90),
  );
  const [platformFinalReturn, setPlatformFinalReturn] = useState(
    Number(initialValues?.platformProfitSharePercentagePlanned ?? 10),
  );
  const fieldErrors = useMemo(
    () => state.fieldErrors ?? {},
    [state.fieldErrors],
  );

  const fieldSections: Record<string, string> = {
    title: "basic-information",
    campaignTarget: "investment-information",
    minimumParticipationAmount: "investment-information",
    maximumParticipationAmount: "investment-information",
    campaignOpenDate: "investment-information",
    campaignCloseDate: "investment-information",
    propertyType: "property-information",
    assetCategory: "property-information",
    occupancyStatus: "property-information",
    tenure: "property-information",
    bumiStatus: "property-information",
    builtUpArea: "property-information",
    landArea: "property-information",
    bedrooms: "property-information",
    bathrooms: "property-information",
    reservePrice: "property-information",
    state: "property-information",
    location: "property-information",
    fullAddress: "property-information",
    yearBuilt: "property-information",
    heroImage: "media",
    documents: "documents",
    aboutCampaign: "basic-information",
    importantInformation: "important-information",
    riskDisclaimer: "risk-disclaimer",
    holdingReturnExplanation: "investment-information",
    finalDistributionExplanation: "investment-information",
    holdingReturnRateMonthly: "investment-information",
    maximumHoldingPeriodMonths: "investment-information",
    returnType: "investment-information",
    faqQuestion: "faq",
    faqAnswer: "faq",
  };
  const sectionsWithErrors = new Set(
    Object.keys(fieldErrors)
      .map((field) => fieldSections[field])
      .filter(Boolean),
  );

  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    const messages: Record<string, string> = {
      draft: "Draft saved successfully.",
      publish: "Listing published successfully.",
      unpublish: "Listing unpublished successfully.",
    };
    if (!saved || !messages[saved]) return;
    setToast({
      message:
        mode === "edit" && saved === "draft"
          ? "Draft saved successfully."
          : messages[saved],
      tone: "success",
    });
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    if (state.errors.length === 0) return;
    setToast({
      message:
        state.errors[0]?.includes("Hero Image") ||
        Object.keys(fieldErrors).length > 0
          ? "Unable to publish listing. Please review the highlighted fields."
          : "Unable to save draft. Please try again.",
      tone: "error",
    });
    const timer = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(timer);
  }, [state.errors, fieldErrors]);

  useEffect(() => {
    const firstField = Object.keys(fieldErrors)[0];
    if (!firstField) return;
    const element = document.querySelector<HTMLElement>(
      `[name="${CSS.escape(firstField)}"], [data-field="${CSS.escape(firstField)}"]`,
    );
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
      )
        element.focus({ preventScroll: true });
    }, 350);
  }, [fieldErrors]);
  function fieldHasValue(formData: FormData, field: string) {
    if (field === "heroImage")
      return Boolean(
        formData.get("heroMediaId") ||
        (formData.get("heroImage") instanceof File &&
          (formData.get("heroImage") as File).size > 0),
      );
    return String(formData.get(field) ?? "").trim().length > 0;
  }

  function missingFieldsForStep(stepIndex: number) {
    const form = formRef.current;
    if (!form) return [];
    const formData = new FormData(form);
    return (requiredFieldsByStep[stepIndex] ?? []).filter(
      (field) => !fieldHasValue(formData, field),
    );
  }

  function handleNext() {
    if (missingFieldsForStep(currentStep).length > 0) {
      setToast({
        message:
          "Some required information is still missing. You can continue, but it must be completed before publishing.",
        tone: "warning",
      });
      window.setTimeout(() => setToast(null), 4500);
    }
    setCurrentStep((step) => Math.min(step + 1, wizardSteps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    if (submitter?.value !== "publish") return;
    const missing = Object.values(requiredFieldsByStep)
      .flat()
      .filter(
        (field) => !fieldHasValue(new FormData(event.currentTarget), field),
      );
    if (missing.length > 0) {
      event.preventDefault();
      setToast({
        message: "Please complete the required fields before publishing.",
        tone: "warning",
      });
      setCurrentStep(7);
      window.setTimeout(() => setToast(null), 6000);
    }
  }

  const currentWizardStep = wizardSteps[currentStep];
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
  const editableFaqs = initialValues?.faqs?.length
    ? [...initialValues.faqs, { question: "", answer: "" }]
    : defaultFaqs;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
      <input type="hidden" name="campaignId" value={initialValues?.id ?? ""} />
      {state.errors.length > 0 ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700"
          role="alert"
        >
          <p className="text-xs font-black uppercase tracking-wide">
            Please complete the following before publishing
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="sticky top-[76px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="sm:hidden">
          <p className="text-xs font-black uppercase tracking-wide text-papaipay-green">
            Step {currentStep + 1} of {wizardSteps.length}
          </p>
          <h2 className="mt-1 text-lg font-bold text-papaipay-ink">
            {currentWizardStep.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {currentWizardStep.description}
          </p>
        </div>
        <div
          className="hidden gap-2 overflow-x-auto sm:flex"
          aria-label="Listing wizard steps"
        >
          {wizardSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete =
              index < currentStep && missingFieldsForStep(index).length === 0;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`min-w-[150px] rounded-2xl border px-4 py-3 text-left transition ${isActive ? "border-papaipay-green bg-emerald-50 text-papaipay-green" : "border-slate-200 bg-white text-slate-600 hover:border-papaipay-green/40"}`}
              >
                <span className="text-[10px] font-black uppercase tracking-wide">
                  Step {index + 1}
                </span>
                <span className="mt-1 block text-xs font-black">
                  {step.title}
                </span>
                <span className="mt-1 block text-[10px] font-bold text-slate-400">
                  {isComplete
                    ? "🟢 Complete"
                    : missingFieldsForStep(index).length > 0
                      ? "🔴 Required"
                      : "⚪ Optional"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-papaipay-green">
              Step {currentStep + 1} of {wizardSteps.length}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-papaipay-ink">
              {currentWizardStep.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {currentWizardStep.description}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-papaipay-green ring-1 ring-emerald-100">
            {missingFieldsForStep(currentStep).length === 0
              ? "🟢 Complete"
              : "🔴 Required"}
          </span>
        </div>
      </Card>

      <div hidden={currentStep !== 0}>
        <Section
          id="basic-information"
          title="Basic Information"
          description="Manage the core listing identity, status, readiness and publishing metadata."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <SubsectionCard
              title="Identity"
              description="Campaign code and campaign ID are generated by the system and locked after creation."
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
                  label="Listing Title"
                  name="title"
                  error={fieldErrors.title}
                  defaultValue={initialValues?.title}
                />
                <input
                  type="hidden"
                  name="visibility"
                  value={initialValues?.visibility ?? "InternalOnly"}
                />
                <ReadOnlyField
                  label="Listing Readiness"
                  helper="Draft records remain internal; publishing sets the listing to member-visible when required fields pass validation."
                  value={
                    initialValues?.publishStatus === "Published"
                      ? "Ready / Published"
                      : "Draft / In preparation"
                  }
                />
                <Field
                  label="Short Description"
                  name="aboutCampaign"
                  error={fieldErrors.aboutCampaign}
                  defaultValue={initialValues?.content?.aboutCampaign}
                  className="sm:col-span-2"
                  helper="Short member-facing overview used on listing detail."
                />
                <ReadOnlyField
                  label="Slug"
                  helper="Generated from listing title and kept unique automatically."
                  value={slug ?? "Auto-generated after save"}
                />
                <ReadOnlyField
                  label="Publish Status"
                  helper="Controlled by Save Draft and the final Preview & Publish step."
                  value={initialValues?.publishStatus ?? "Draft"}
                />
              </div>
            </SubsectionCard>
            <SubsectionCard
              title="Lifecycle & Dates"
              description="Operational status and campaign timing."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Listing Status"
                  options={campaignLifecycleStatuses}
                  className="sm:col-span-2"
                />
                <Field
                  label="Publish Date"
                  name="campaignOpenDate"
                  error={fieldErrors.campaignOpenDate}
                  defaultValue={initialValues?.campaignOpenDate}
                />
                <Field
                  label="Expiry Date"
                  name="campaignCloseDate"
                  error={fieldErrors.campaignCloseDate}
                  defaultValue={initialValues?.campaignCloseDate}
                />
                <CalculatedField
                  label="Days Remaining"
                  helper="Calculated from the campaign close date."
                />
              </div>
            </SubsectionCard>
            <SubsectionCard
              title="Participation Information"
              description="Participation target, participation limits, expected return and campaign period."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Participation Target"
                  name="campaignTarget"
                  error={fieldErrors.campaignTarget}
                  type="number"
                  defaultValue={initialValues?.campaignTarget ?? 0}
                />
                <Field
                  label="Minimum Participation Amount"
                  name="minimumParticipationAmount"
                  error={fieldErrors.minimumParticipationAmount}
                  type="number"
                  defaultValue={initialValues?.minimumParticipationAmount ?? 0}
                />
                <Field
                  label="Maximum Participation Amount"
                  name="maximumParticipationAmount"
                  error={fieldErrors.maximumParticipationAmount}
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
      </div>

      <div hidden={currentStep !== 1}>
        <Section
          id="property-information"
          title="Property Information"
          description="Maintain the Malaysian asset benchmark fields that appear in the member asset snapshot."
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
              error={fieldErrors.bumiStatus}
            />
          </div>
          <div className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SelectField
                label="Property Type"
                name="propertyType"
                error={fieldErrors.propertyType}
                defaultValue={initialValues?.propertyDetail?.propertyType}
                options={propertyTypeOptions}
              />
              <SelectField
                label="Asset Category"
                name="assetCategory"
                error={fieldErrors.assetCategory}
                defaultValue={initialValues?.propertyDetail?.assetCategory}
                options={assetCategoryOptions}
              />
              <SelectField
                label="Occupancy Status"
                name="occupancyStatus"
                error={fieldErrors.occupancyStatus}
                defaultValue={initialValues?.propertyDetail?.occupancyStatus}
                options={occupancyStatusOptions}
              />
              <Field
                label="Market Value"
                name="reservePrice"
                error={fieldErrors.reservePrice}
                type="number"
                defaultValue={initialValues?.propertyDetail?.reservePrice}
              />
              <Field
                label="Built-Up"
                name="builtUpArea"
                error={fieldErrors.builtUpArea}
                defaultValue={initialValues?.propertyDetail?.builtUpArea}
              />
              <Field
                label="Land Area"
                name="landArea"
                error={fieldErrors.landArea}
                defaultValue={initialValues?.propertyDetail?.landArea}
              />
              <Field
                label="Bedrooms"
                name="bedrooms"
                error={fieldErrors.bedrooms}
                type="number"
                defaultValue={initialValues?.propertyDetail?.bedrooms}
              />
              <Field
                label="Bathrooms"
                name="bathrooms"
                error={fieldErrors.bathrooms}
                type="number"
                defaultValue={initialValues?.propertyDetail?.bathrooms}
              />
              <SelectField
                label="State"
                name="state"
                error={fieldErrors.state}
                defaultValue={initialValues?.propertyDetail?.state}
                options={malaysiaStateOptions}
              />
              <Field
                label="City"
                name="location"
                error={fieldErrors.location}
                defaultValue={initialValues?.propertyDetail?.location}
              />
              <Field
                label="Full Address"
                name="fullAddress"
                error={fieldErrors.fullAddress}
                className="sm:col-span-2 lg:col-span-3"
                defaultValue={initialValues?.propertyDetail?.fullAddress}
              />
              <Field
                label="Year Built"
                name="yearBuilt"
                error={fieldErrors.yearBuilt}
                defaultValue={initialValues?.propertyDetail?.yearBuilt}
              />
            </div>
          </div>
        </Section>
      </div>

      <div hidden={currentStep !== 2}>
        <Section
          id="investment-information"
          title="Participation Information"
          description="Review return expectations, distribution wording and investment period settings."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Holding Return"
              name="holdingReturnRateMonthly"
              error={fieldErrors.holdingReturnRateMonthly}
              type="number"
              step="0.01"
              defaultValue={initialValues?.holdingReturnRateMonthly ?? 0}
            />
            <SelectField
              label="Return Type"
              name="returnType"
              defaultValue={initialValues?.returnType ?? "Target"}
              options={["Fixed", "Target", "UpTo"]}
              error={fieldErrors.returnType}
            />
            <Field
              label="Participation Period (Months)"
              name="maximumHoldingPeriodMonths"
              error={fieldErrors.maximumHoldingPeriodMonths}
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
              error={fieldErrors.holdingReturnExplanation}
              rows={5}
              defaultValue={
                initialValues?.content?.holdingReturnExplanation ||
                defaultHoldingReturnExplanation
              }
              helper="Holding Return accrues during the holding period and is paid once during final distribution."
            />
            <TextAreaField
              label="Final Return Explanation"
              name="finalDistributionExplanation"
              error={fieldErrors.finalDistributionExplanation}
              rows={5}
              defaultValue={
                initialValues?.content?.finalDistributionExplanation ||
                defaultFinalReturnExplanation
              }
              helper="Explain Principal Return, Holding Return and Profit Distribution clearly."
            />
          </div>
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">
              Locked 24-Month Rule
            </p>
            <p className="mt-2 whitespace-pre-line text-sm font-bold leading-6 text-blue-900">
              {lockedHoldingPeriodRule}
            </p>
            <input
              type="hidden"
              name="lockedHoldingPeriodRule"
              value={lockedHoldingPeriodRule}
            />
          </div>
        </Section>
      </div>

      <div hidden={currentStep !== 3}>
        <Section
          id="settlement-fees"
          title="Settlement & Fees"
          description="Optional / Later Stage finance workflow after acquisition, holding, preparation, disposal and final settlement details are available."
        >
          <details className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
            <summary className="cursor-pointer text-sm font-black text-amber-900">
              Optional / Later Stage — expand Settlement & Fees
            </summary>
            <p className="mt-3 text-sm leading-6 text-amber-900">
              Finance and settlement details can be completed later after
              acquisition, holding, preparation, and sale details are available.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-bold text-slate-600">
                  Member Final Return %
                </span>
                <input
                  name="memberProfitDistributionPercentagePlanned"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={memberFinalReturn}
                  onChange={(event) => {
                    const value = Math.min(
                      100,
                      Math.max(0, Number(event.currentTarget.value) || 0),
                    );
                    setMemberFinalReturn(value);
                    setPlatformFinalReturn(Number((100 - value).toFixed(2)));
                  }}
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
                />
              </label>
              <label>
                <span className="text-sm font-bold text-slate-600">
                  Platform Final Return %
                </span>
                <input
                  name="platformProfitSharePercentagePlanned"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={platformFinalReturn}
                  onChange={(event) => {
                    const value = Math.min(
                      100,
                      Math.max(0, Number(event.currentTarget.value) || 0),
                    );
                    setPlatformFinalReturn(value);
                    setMemberFinalReturn(Number((100 - value).toFixed(2)));
                  }}
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
                />
              </label>
              <ReadOnlyField
                label="Total"
                helper="Member and platform final return percentages must total 100%."
                value={`${Number(memberFinalReturn) + Number(platformFinalReturn)}%`}
              />
              <TextAreaField
                label="Settlement Notes"
                name="settlementFeeNotes"
                rows={4}
                helper="Optional operational notes for future fee-calculation workflows."
              />
            </div>
          </details>
        </Section>
      </div>

      <div hidden={currentStep !== 4}>
        <Section
          id="media"
          title="Media"
          description="Manage the member-facing thumbnail, hero image, gallery previews and display ordering."
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
                />
                <input
                  type="hidden"
                  name="heroCaption"
                  value={heroImage?.caption ?? ""}
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
                      style={{
                        backgroundImage: `url(${heroImage.fileAsset.objectKey})`,
                      }}
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
                          style={{
                            backgroundImage: `url(${media.fileAsset.objectKey})`,
                          }}
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
                        <input
                          type="hidden"
                          name={`galleryCaption:${media.id}`}
                          value={media.caption ?? ""}
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
          </div>
        </Section>
      </div>

      <div hidden={currentStep !== 5}>
        <Section
          id="documents"
          title="Documents"
          description="Upload optional member-facing documents. Missing documents do not block publishing."
        >
          <SubsectionCard
            title="Documents"
            description="Document categories prepared for member review or internal operations."
          >
            <div
              data-field="documents"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
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
        </Section>
      </div>

      <div hidden={currentStep !== 6}>
        <Section
          id="important-information"
          title="Important Information"
          description="Maintain member-facing important information with formatting preserved."
        >
          <div className="grid gap-5">
            <TextAreaField
              label="Important Information"
              name="importantInformation"
              error={fieldErrors.importantInformation}
              rows={7}
              defaultValue={initialValues?.content?.importantInformation}
            />
          </div>
        </Section>
        <Section
          id="faq"
          title="FAQ"
          description="Manage optional member-facing questions and answers. This section is optional and can be completed later."
        >
          <div className="grid gap-5">
            <SubsectionCard
              title="FAQ"
              description="Default FAQs are generated automatically. Admin may edit, delete, or add FAQ content. FAQ is optional for publishing."
            >
              <div className="space-y-4">
                {editableFaqs.map((faq, index) => (
                  <div
                    key={`${faq.question}-${index}`}
                    className="rounded-xl border border-slate-100 bg-white p-4"
                  >
                    <input
                      type="hidden"
                      name={`faqId:${index}`}
                      value={faq.id ?? ""}
                    />
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-papaipay-ink">
                        FAQ {index + 1}
                      </p>
                      {faq.id ? (
                        <label className="flex items-center gap-2 text-xs font-bold text-red-600">
                          <input
                            type="checkbox"
                            name="deleteFaqId"
                            value={faq.id}
                          />{" "}
                          Delete
                        </label>
                      ) : null}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Question"
                        name={`faqQuestion:${index}`}
                        defaultValue={faq.question}
                      />
                      <Field
                        label="Display Order"
                        name={`faqSortOrder:${index}`}
                        type="number"
                        defaultValue={index}
                      />
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Answer"
                        name={`faqAnswer:${index}`}
                        defaultValue={faq.answer}
                        rows={6}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SubsectionCard>
          </div>
        </Section>

        <Section
          id="risk-disclaimer"
          title="Risk Disclaimer"
          description="Optional member-facing risk text. This section is optional and can be completed later. Formatting is preserved on the member detail page."
        >
          <div>
            <TextAreaField
              label="Risk Disclaimer"
              name="riskDisclaimer"
              error={fieldErrors.riskDisclaimer}
              rows={5}
              defaultValue={
                initialValues?.content?.riskDisclaimer || defaultRiskDisclaimer
              }
            />
          </div>
        </Section>
      </div>

      <div hidden={currentStep !== 7}>
        <Section
          id="review-publish"
          title="Publish"
          description="Set the listing status and publish when ready."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Draft",
              missingFieldsForStep(0).length === 0 &&
              missingFieldsForStep(1).length === 0 &&
              missingFieldsForStep(2).length === 0 &&
              missingFieldsForStep(4).length === 0
                ? "Ready"
                : "Required",
              initialValues?.publishStatus === "Published"
                ? "Published"
                : "Not Published",
            ].map((status) => (
              <div
                key={status}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-center"
              >
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Listing Status
                </p>
                <p className="mt-2 text-lg font-black text-papaipay-ink">
                  {status}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
            disabled={currentStep === 0}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SubmitButton
              intent="draft"
              pendingLabel="Saving draft..."
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              Save Draft
            </SubmitButton>
            {currentStep < wizardSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white"
              >
                Next
              </button>
            ) : (
              <SubmitButton
                intent="publish"
                pendingLabel="Publishing..."
                className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white"
              >
                Publish Listing
              </SubmitButton>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
