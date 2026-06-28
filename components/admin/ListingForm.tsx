"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { ListingFormState } from "@/lib/admin/actions/listings";
import { Card } from "@/components/admin/AdminUI";
import { PublishReadinessChecklist } from "@/components/admin/listing-workspace/PublishReadinessChecklist";
import { WorkspaceStepNav } from "@/components/admin/listing-workspace/WorkspaceStepNav";
import { WorkspaceSummaryBar } from "@/components/admin/listing-workspace/WorkspaceSummaryBar";
import type { WorkspaceStepStatus } from "@/components/admin/listing-workspace/WorkspaceStatusBadge";
import { saveListingWorkspaceAction } from "@/lib/admin/actions/listings";
import {
  campaignLifecycleStatuses,
  documentCategories,
} from "@/lib/adminMockData";
import { fileAssetPublicUrl } from "@/lib/storage/fileAssetUrl";

const wizardSteps = [
  { id: "listing-overview", label: "Overview", optional: false },
  { id: "property-details", label: "Property", optional: false },
  { id: "participation-details", label: "Participation", optional: false },
  { id: "settlement-fees", label: "Settlement", optional: true },
  { id: "media", label: "Media", optional: true },
  { id: "documents", label: "Documents", optional: true },
  { id: "member-information", label: "Member Info", optional: true },
  { id: "publish", label: "Publish Review", optional: false },
] as const;

const requiredFieldsByStep: Record<number, { name: string; label: string }[]> =
  {
    0: [
      { name: "title", label: "Listing Title" },
      { name: "aboutCampaign", label: "Short Description" },
      { name: "campaignOpenDate", label: "Publish Date" },
      { name: "campaignCloseDate", label: "Expiry Date" },
    ],
    1: [
      { name: "propertyType", label: "Property Type" },
      { name: "assetCategory", label: "Asset Category" },
      { name: "occupancyStatus", label: "Occupancy Status" },
      { name: "location", label: "City" },
      { name: "state", label: "State" },
      { name: "fullAddress", label: "Full Address" },
      { name: "tenure", label: "Tenure" },
      { name: "builtUpArea", label: "Built-Up" },
      { name: "landArea", label: "Land Area" },
      { name: "bedrooms", label: "Bedrooms" },
      { name: "bathrooms", label: "Bathrooms" },
      { name: "reservePrice", label: "Market Value" },
      { name: "yearBuilt", label: "Year Built / Completion Year" },
    ],
    2: [
      { name: "campaignTarget", label: "Participation Target" },
      {
        name: "minimumParticipationAmount",
        label: "Minimum Participation Amount",
      },
      {
        name: "maximumParticipationAmount",
        label: "Maximum Participation Amount",
      },
      { name: "holdingReturnRateMonthly", label: "Holding Return" },
      { name: "returnType", label: "Expected Distribution / Return Type" },
      {
        name: "maximumHoldingPeriodMonths",
        label: "Participation Period / Holding Period",
      },
      { name: "holdingReturnExplanation", label: "Holding Return Explanation" },
      {
        name: "finalDistributionExplanation",
        label: "Final Return Explanation",
      },
    ],
  };

const fieldLabels = Object.values(requiredFieldsByStep)
  .flat()
  .reduce<Record<string, string>>((labels, field) => {
    labels[field.name] = field.label;
    return labels;
  }, {});

const propertyTypeOptions = [
  "Apartment / Condominium",
  "Terrace House",
  "Semi-D",
  "Bungalow",
  "Shoplot",
  "Office Lot",
  "Retail Unit",
  "Industrial Lot",
  "Development Land",
  "Agricultural Land",
  "Mixed Development",
  "Others",
];
const assetCategoryOptions = [
  "Residential Asset",
  "Commercial Asset",
  "Industrial Asset",
  "Land Asset",
  "Retail Asset",
  "Hospitality Asset",
  "Mixed Use Asset",
  "Others",
];
const occupancyStatusOptions = [
  "Vacant",
  "Tenanted",
  "Owner Occupied",
  "Under Construction",
  "Not Applicable",
];
const malaysiaStateOptions = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Pulau Pinang",
  "Perak",
  "Perlis",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur",
  "Putrajaya",
  "Labuan",
];

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

This is an illustration only. Actual returns may vary depending on the final campaign duration and overall asset performance.`;
const defaultFinalReturnExplanation = `Final Return will be calculated after the campaign has been successfully completed and the property disposal process has been finalised.

All approved campaign-related expenses, taxes, operational costs and platform charges will be deducted before the remaining return is distributed to members based on the approved participation structure.

Members will receive a detailed Final Return calculation together with the final distribution statement once the campaign is completed.`;
const defaultLockedRuleText = `If the property is not successfully disposed of within the maximum holding period of 24 months, members will receive a return of their original Participation Amount only.

No Holding Return or Final Return will be payable unless otherwise stated in the listing terms.`;
const defaultSettlementNotes = `Settlement and fee details are prepared during the final campaign review. Any final distribution calculations, approved costs and platform fee allocations will be confirmed before member distributions are processed.`;
const defaultImportantInformation = `This listing is prepared for member participation based on the approved listing terms. Members should review the listing details, participation structure, projected returns, timeline, risks, and supporting information before making any participation decision.`;
const defaultRiskDisclaimer = `Participation in any listing carries inherent risks, including the possibility that projected returns may differ from actual outcomes.

Past performance of any asset or campaign should not be regarded as an indication of future results.

Members are encouraged to read all listing information and supporting documents carefully before making any participation decision.

Each member should assess their own financial circumstances, objectives and risk tolerance before participating in any listing.`;
const defaultFaqs = [
  {
    question: "What is Holding Return?",
    answer:
      "Holding Return is the projected return accumulated throughout the campaign holding period. It is not paid monthly but will be distributed together with the Final Return after campaign completion.\n\nExample:\nParticipation Amount: RM10,000\nHolding Return: 1.5%\nCampaign Duration: 13 months\nEstimated Holding Return: RM1,950",
  },
  {
    question: "How is Holding Return distributed?",
    answer:
      "Holding Return is accumulated throughout the campaign and paid together with the Final Return once the campaign has been successfully completed.",
  },
  {
    question:
      "Can I withdraw my participation before the campaign is completed?",
    answer:
      "No. Participation cannot be withdrawn once the campaign has started. However, if the property is not successfully disposed of within 24 months, members will receive their original Participation Amount back.",
  },
  {
    question: "How is Final Return calculated?",
    answer:
      "Final Return will be calculated after deducting all approved campaign-related expenses, taxes, operational costs and platform charges. Members will receive a detailed Final Return calculation after campaign completion.",
  },
  {
    question: "Where can I monitor my participation?",
    answer:
      "Members can monitor campaign progress and updates through their Member Portal.",
  },
];

function toDateInput(value?: string | null) {
  return value ? String(value).slice(0, 10) : undefined;
}
function withDefault(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
function toPreviewUrl(
  fileAsset?: { bucket?: string | null; objectKey?: string | null } | null,
) {
  return fileAssetPublicUrl(fileAsset) ?? undefined;
}

function Field({
  label,
  name,
  type = "text",
  className = "",
  defaultValue,
  step,
  error,
  helper,
  readOnly = false,
}: {
  label: string;
  name?: string;
  type?: string;
  className?: string;
  defaultValue?: string | number | null;
  step?: string;
  error?: string;
  helper?: string;
  readOnly?: boolean;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        step={step}
        readOnly={readOnly}
        aria-invalid={Boolean(error)}
        className={`mt-2 min-h-11 w-full rounded-lg border px-3 text-sm outline-none transition focus:ring-4 ${readOnly ? "bg-slate-100 font-semibold text-slate-500" : "bg-white"} ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`}
      />
      {error && name ? (
        <p className="mt-1 text-xs font-bold text-red-600">{error}</p>
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
        className={`mt-2 min-h-11 w-full rounded-lg border bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:ring-4 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && name ? (
        <p className="mt-1 text-xs font-bold text-red-600">{error}</p>
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
        className={`mt-2 w-full rounded-lg border bg-white p-3 text-sm outline-none transition focus:ring-4 ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`}
      />
      {error && name ? (
        <p className="mt-1 text-xs font-bold text-red-600">{error}</p>
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
    <div>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <div className="mt-2 min-h-11 rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-500">
        {value}
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </div>
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
  tone?: "success" | "error";
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border bg-white px-5 py-4 text-sm font-bold shadow-[0_18px_45px_rgba(15,23,42,0.18)] ${tone === "error" ? "border-red-200 text-red-700" : "border-emerald-100 text-papaipay-green"}`}
    >
      {tone === "error" ? "!" : "✓"} {message}
    </div>
  );
}

function UploadZone({
  title,
  supported,
  helper,
  name,
  multiple = false,
  currentFileNames = [],
  currentFiles = [],
  error,
}: {
  title: string;
  supported: string;
  helper: string;
  name?: string;
  multiple?: boolean;
  currentFileNames?: string[];
  currentFiles?: { id: string; name: string; url?: string }[];
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<
    { id: string; name: string; url?: string }[]
  >([]);
  const files: { id: string; name: string; url?: string }[] =
    selectedFiles.length
      ? selectedFiles
      : currentFiles.length
        ? currentFiles
        : currentFileNames.map((name) => ({ id: name, name }));
  useEffect(
    () => () =>
      selectedFiles.forEach(
        (file) => file.url && URL.revokeObjectURL(file.url),
      ),
    [selectedFiles],
  );
  function remove(id: string) {
    if (inputRef.current?.files) {
      const transfer = new DataTransfer();
      Array.from(inputRef.current.files)
        .filter(
          (file) => `${file.name}-${file.size}-${file.lastModified}` !== id,
        )
        .forEach((file) => transfer.items.add(file));
      inputRef.current.files = transfer.files;
    }
    setSelectedFiles((prev) =>
      prev.filter((file) => {
        if (file.id === id && file.url) URL.revokeObjectURL(file.url);
        return file.id !== id;
      }),
    );
  }
  return (
    <div
      data-field={name}
      className={`min-w-0 rounded-2xl border border-dashed bg-slate-50 p-4 ${error ? "border-red-300" : "border-slate-300"}`}
    >
      <p className="text-sm font-black text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
      <label className="mt-3 inline-flex cursor-pointer rounded-full bg-white px-3 py-2 text-xs font-black text-papaipay-green ring-1 ring-emerald-100">
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
            const next = Array.from(event.currentTarget.files ?? []).map(
              (file) => ({
                id: `${file.name}-${file.size}-${file.lastModified}`,
                name: file.name,
                url: file.type.startsWith("image/")
                  ? URL.createObjectURL(file)
                  : undefined,
              }),
            );
            setSelectedFiles((prev) => {
              prev.forEach((file) => file.url && URL.revokeObjectURL(file.url));
              return next;
            });
          }}
        />
        Choose file{multiple ? "s" : ""}
      </label>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Supported: {supported}
      </p>
      {error ? (
        <p className="mt-2 text-xs font-bold text-red-600">{error}</p>
      ) : null}
      {files.length ? (
        <div className="mt-3 grid gap-2">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-100 bg-white p-2"
            >
              <div className="grid h-14 w-14 flex-none place-items-center overflow-hidden rounded-md bg-emerald-50 text-xs font-black text-papaipay-green">
                {file.url ? (
                  <span
                    className="block h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${file.url})` }}
                    aria-label="Selected image preview"
                  />
                ) : supported.includes("PDF") ? (
                  "DOC"
                ) : (
                  "IMG"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-700">
                  {file.name}
                </p>
                {index === 0 && name === "heroImage" ? (
                  <p className="text-[11px] font-black uppercase text-papaipay-green">
                    Main / Hero
                  </p>
                ) : null}
              </div>
              {selectedFiles.length ? (
                <button
                  type="button"
                  onClick={() => remove(file.id)}
                  className="flex-none rounded-full px-2 py-1 text-xs font-black text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type ListingFormInitialValues = {
  id?: string;
  campaignRef?: string;
  campaignCode?: string;
  title?: string;
  visibility?: string;
  publishStatus?: string;
  updatedAt?: string | null;
  campaignTarget?: string | number;
  minimumParticipationAmount?: string | number;
  maximumParticipationAmount?: string | number;
  campaignOpenDate?: string | null;
  campaignCloseDate?: string | null;
  holdingReturnRateMonthly?: string | number;
  returnType?: string;
  maximumHoldingPeriodMonths?: number;
  principalProtectionEnabled?: boolean;
  twentyFourMonthRuleText?: string | null;
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
  const [state, formAction] = useFormState(saveListingWorkspaceAction, {
    errors: [],
  } as ListingFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
    () => new Set([0]),
  );
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const [clientFieldErrors, setClientFieldErrors] = useState<
    Record<string, string>
  >({});
  const [dirtySteps, setDirtySteps] = useState<Set<number>>(() => new Set());
  const [savedSteps, setSavedSteps] = useState<Set<number>>(() => new Set());
  const submittedStepRef = useRef<number | null>(null);
  const serverFieldErrors = useMemo(
    () => state.fieldErrors ?? {},
    [state.fieldErrors],
  );
  const fieldErrors = useMemo(
    () => ({ ...serverFieldErrors, ...clientFieldErrors }),
    [serverFieldErrors, clientFieldErrors],
  );
  const fieldSteps = useMemo<Record<string, number>>(
    () => ({
      title: 0,
      aboutCampaign: 0,
      campaignOpenDate: 0,
      campaignCloseDate: 0,
      propertyType: 1,
      assetCategory: 1,
      occupancyStatus: 1,
      tenure: 1,
      builtUpArea: 1,
      landArea: 1,
      bedrooms: 1,
      bathrooms: 1,
      reservePrice: 1,
      state: 1,
      location: 1,
      fullAddress: 1,
      yearBuilt: 1,
      campaignTarget: 2,
      minimumParticipationAmount: 2,
      maximumParticipationAmount: 2,
      holdingReturnRateMonthly: 2,
      returnType: 2,
      maximumHoldingPeriodMonths: 2,
      holdingReturnExplanation: 2,
      finalDistributionExplanation: 2,
      heroImage: 4,
      documents: 5,
      importantInformation: 6,
      riskDisclaimer: 6,
      faqQuestion: 6,
      faqAnswer: 6,
    }),
    [],
  );
  const errorSteps = new Set(
    Object.keys(fieldErrors)
      .map((field) => fieldSteps[field])
      .filter(
        (step): step is number =>
          typeof step === "number" &&
          (visitedSteps.has(step) || Object.keys(serverFieldErrors).length > 0),
      ),
  );
  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    const messages: Record<string, string> = {
      overview: "Overview saved successfully.",
      publish: "Listing published successfully.",
      unpublish: "Listing unpublished successfully.",
    };
    if (!saved || !messages[saved]) return;
    setToast({ message: messages[saved], tone: "success" });
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (state.status !== "saved" || !state.message) return;
    const savedIndex = submittedStepRef.current ?? activeStep;
    setDirtySteps((prev) => {
      const next = new Set(prev);
      next.delete(savedIndex);
      return next;
    });
    setSavedSteps((prev) => new Set(prev).add(savedIndex));
    submittedStepRef.current = null;
    setToast({ message: state.message, tone: "success" });
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [state.status, state.message, activeStep]);
  useEffect(() => {
    if (!state.errors.length) return;
    const grouped = Object.entries(serverFieldErrors).reduce<
      Record<string, string[]>
    >((groups, [field]) => {
      const stepIndex = fieldSteps[field];
      const stepLabel =
        typeof stepIndex === "number"
          ? (wizardSteps[stepIndex]?.label ?? "Listing")
          : "Listing";
      groups[stepLabel] = groups[stepLabel] ?? [];
      groups[stepLabel].push(fieldLabels[field] ?? field);
      return groups;
    }, {});
    const message = Object.keys(grouped).length
      ? `Unable to publish listing. Missing required fields: ${Object.entries(
          grouped,
        )
          .map(([step, labels]) => `${step}: ${labels.join(", ")}`)
          .join("; ")}.`
      : state.errors[0] || "Unable to save this step. Please try again.";
    setToast({ message, tone: "error" });
    const firstField = Object.keys(serverFieldErrors)[0];
    if (firstField) {
      const targetStep = fieldSteps[firstField] ?? 0;
      setActiveStep(targetStep);
      setVisitedSteps((prev) => new Set(prev).add(targetStep));
      window.setTimeout(
        () =>
          document
            .querySelector<HTMLElement>(
              `[name="${CSS.escape(firstField)}"], [data-field="${CSS.escape(firstField)}"]`,
            )
            ?.scrollIntoView({ behavior: "smooth", block: "center" }),
        100,
      );
    }
    const timer = window.setTimeout(() => setToast(null), 9000);
    return () => window.clearTimeout(timer);
  }, [state.errors, serverFieldErrors, fieldSteps]);
  const heroImage = initialValues?.media?.find(
    (media) => media.mediaType === "PrimaryImage",
  );
  const galleryImages =
    initialValues?.media?.filter(
      (media) => media.mediaType === "GalleryImage",
    ) ?? [];
  const documents = initialValues?.documents ?? [];
  const savedFaqs = initialValues?.faqs ?? [];
  const faqs =
    savedFaqs.length > 0
      ? [...savedFaqs, ...defaultFaqs.slice(savedFaqs.length)].slice(
          0,
          Math.max(5, savedFaqs.length),
        )
      : defaultFaqs;
  const [memberShare, setMemberShare] = useState(
    initialValues?.memberProfitDistributionPercentagePlanned?.toString() ??
      "90",
  );
  const [platformShare, setPlatformShare] = useState(
    initialValues?.platformProfitSharePercentagePlanned?.toString() ??
      String(100 - Number(memberShare || 0)),
  );
  const saveIntents = [
    "save-overview",
    "save-property",
    "save-participation",
    "save-settlement",
    "save-media",
    "save-documents",
    "save-member-info",
    "publish",
  ] as const;
  const saveIntent = saveIntents[activeStep] ?? "save-overview";
  const readiness = state.readiness;
  const listingStatus =
    initialValues?.publishStatus === "Published"
      ? "Published"
      : initialValues?.publishStatus === "Ready"
        ? "Draft"
        : "Not Published";
  const lastUpdated =
    (state as ListingFormState & { updatedAt?: string }).updatedAt ??
    initialValues?.updatedAt;
  const moduleSummaries: Record<number, string> = {
    4: `${heroImage ? "Hero uploaded" : "No hero yet"} · ${galleryImages.length} gallery`,
    5: `Optional · ${documents.length} document${documents.length === 1 ? "" : "s"}`,
    6: `${initialValues?.content?.importantInformation ? "Important info" : "Info draft"} · ${savedFaqs.length || defaultFaqs.length} FAQ · ${initialValues?.content?.riskDisclaimer ? "Risk ready" : "Risk draft"}`,
  };
  const stepStatus = (
    index: number,
    pendingIntent?: string,
  ): WorkspaceStepStatus =>
    pendingIntent === saveIntents[index]
      ? "Saving"
      : errorSteps.has(index)
        ? "Error"
        : dirtySteps.has(index)
          ? "Unsaved"
          : savedSteps.has(index)
            ? "Saved"
            : "Not Started";
  const visitStep = (index: number) => {
    setActiveStep(index);
    setVisitedSteps((prev) => new Set(prev).add(index));
  };
  const fieldValue = (field: Element | RadioNodeList | null) =>
    field instanceof RadioNodeList
      ? field.value
      : field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement ||
          field instanceof HTMLSelectElement
        ? field.value
        : "";
  const validateCurrentStep = () => {
    const requiredFields = requiredFieldsByStep[activeStep] ?? [];
    if (!requiredFields.length) return true;
    const nextErrors = requiredFields.reduce<Record<string, string>>(
      (errors, field) => {
        const value = fieldValue(
          formRef.current?.elements.namedItem(field.name) ?? null,
        );
        if (!String(value ?? "").trim())
          errors[field.name] = `${field.label} is required.`;
        return errors;
      },
      {},
    );
    setClientFieldErrors((prev) => {
      const clean = { ...prev };
      requiredFields.forEach((field) => delete clean[field.name]);
      return { ...clean, ...nextErrors };
    });
    if (!Object.keys(nextErrors).length) return true;
    setToast({
      message:
        "Please complete the required fields in this step before continuing.",
      tone: "error",
    });
    window.setTimeout(() => setToast(null), 4500);
    const firstField = Object.keys(nextErrors)[0];
    window.setTimeout(
      () =>
        document
          .querySelector<HTMLElement>(
            `[name="${CSS.escape(firstField)}"], [data-field="${CSS.escape(firstField)}"]`,
          )
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      100,
    );
    return false;
  };
  const goNext = () => {
    if (activeStep >= wizardSteps.length - 1) return;
    if (!validateCurrentStep()) return;
    visitStep(activeStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    const nextStep = Math.max(0, activeStep - 1);
    visitStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const daysRemaining = useMemo(() => {
    const close = initialValues?.campaignCloseDate
      ? new Date(initialValues.campaignCloseDate)
      : null;
    if (!close || Number.isNaN(close.getTime()))
      return "Derived from Expiry Date";
    return `${Math.max(0, Math.ceil((close.getTime() - Date.now()) / 86400000))} days`;
  }, [initialValues?.campaignCloseDate]);
  return (
    <form
      ref={formRef}
      action={formAction}
      encType="multipart/form-data"
      className="space-y-4 overflow-x-hidden"
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent)
          .submitter as HTMLButtonElement | null;
        const intent = submitter?.name === "intent" ? submitter.value : "";
        const submittedStep = saveIntents.indexOf(
          intent as (typeof saveIntents)[number],
        );
        submittedStepRef.current = submittedStep >= 0 ? submittedStep : null;
      }}
      onChange={(event) => {
        const target = event.target as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement;
        const name = target.name;
        setDirtySteps((prev) => new Set(prev).add(activeStep));
        setSavedSteps((prev) => {
          if (!prev.has(activeStep)) return prev;
          const next = new Set(prev);
          next.delete(activeStep);
          return next;
        });
        if (!name || !clientFieldErrors[name]) return;
        if (String(target.value ?? "").trim())
          setClientFieldErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
      }}
    >
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
      <input type="hidden" name="campaignId" value={initialValues?.id ?? ""} />
      <input
        type="hidden"
        name="visibility"
        value={initialValues?.visibility ?? "InternalOnly"}
      />
      <Card>
        <div className="space-y-3">
          <WorkspaceSummaryBar
            listingStatus={listingStatus}
            readinessPercentage={readiness?.completionPercentage}
            lastUpdated={lastUpdated}
          />
          <WorkspaceStepNav
            steps={wizardSteps}
            activeStep={activeStep}
            statuses={wizardSteps.map((_, index) => stepStatus(index))}
            moduleSummaries={moduleSummaries}
            saveIntent={saveIntent}
            isCurrentStepSaved={
              savedSteps.has(activeStep) && !dirtySteps.has(activeStep)
            }
            hasUnsavedChanges={dirtySteps.has(activeStep)}
            onVisitStep={visitStep}
          />
        </div>
      </Card>
      <div className="space-y-4">
        {/* keep all steps mounted and hide inactive panels so uncontrolled field values and file selections do not reset while moving Back/Next */}
        <div className={activeStep === 0 ? "block" : "hidden"}>
          <Card>
            <section id="listing-overview" className="space-y-4">
              <h2 className="text-base font-bold">Listing Overview</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <SubsectionCard
                  title="Identity"
                  description="Campaign identifiers are generated by the system and cannot be typed by admins."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ReadOnlyField
                      label="Campaign ID"
                      helper="System-generated database identifier."
                      value={
                        initialValues?.campaignRef ??
                        "Auto-generated after save"
                      }
                    />
                    <ReadOnlyField
                      label="Campaign Code"
                      helper="System-generated campaign code."
                      value={
                        initialValues?.campaignCode ??
                        "Auto-generated after save"
                      }
                    />
                    <Field
                      label="Listing Title"
                      name="title"
                      error={fieldErrors.title}
                      defaultValue={initialValues?.title}
                    />
                    <Field
                      label="Short Description"
                      name="aboutCampaign"
                      error={fieldErrors.aboutCampaign}
                      defaultValue={initialValues?.content?.aboutCampaign}
                    />
                    <ReadOnlyField
                      label="Slug"
                      helper="Generated from listing title and kept unique automatically."
                      value={slug ?? "Auto-generated after save"}
                    />
                    <ReadOnlyField
                      label="Listing Readiness"
                      helper="Drafts remain internal until published."
                      value={
                        initialValues?.publishStatus === "Published"
                          ? "Ready / Published"
                          : "Draft / In preparation"
                      }
                    />
                  </div>
                </SubsectionCard>
                <SubsectionCard
                  title="Status & Dates"
                  description="Publishing dates use native date inputs and days remaining is derived."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                      label="Listing Status"
                      options={campaignLifecycleStatuses.filter(
                        (status) => status !== "Funded",
                      )}
                      defaultValue="Draft"
                    />
                    <ReadOnlyField
                      label="Current Publish Status"
                      helper="Controlled by Save Step, Publish Listing, and Unpublish Listing."
                      value={initialValues?.publishStatus ?? "Draft"}
                    />
                    <Field
                      label="Publish Date"
                      name="campaignOpenDate"
                      type="date"
                      error={fieldErrors.campaignOpenDate}
                      defaultValue={toDateInput(
                        initialValues?.campaignOpenDate,
                      )}
                    />
                    <Field
                      label="Expiry Date"
                      name="campaignCloseDate"
                      type="date"
                      error={fieldErrors.campaignCloseDate}
                      defaultValue={toDateInput(
                        initialValues?.campaignCloseDate,
                      )}
                    />
                    <ReadOnlyField
                      label="Days Remaining"
                      helper="Derived from the expiry date after save."
                      value={daysRemaining}
                    />
                  </div>
                </SubsectionCard>
              </div>
            </section>
          </Card>
        </div>
        <div className={activeStep === 1 ? "block" : "hidden"}>
          <Card>
            <section id="property-details" className="space-y-4">
              <h2 className="text-base font-bold">Property Details</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <ReadOnlyField
                  label="Property Name"
                  helper="Uses Listing Title until a dedicated property-name column is available."
                  value={initialValues?.title ?? "Use Listing Title"}
                />
                <SelectField
                  label="Property Type"
                  name="propertyType"
                  options={propertyTypeOptions}
                  error={fieldErrors.propertyType}
                  defaultValue={
                    initialValues?.propertyDetail?.propertyType ??
                    propertyTypeOptions[0]
                  }
                />
                <SelectField
                  label="Asset Category"
                  name="assetCategory"
                  options={assetCategoryOptions}
                  error={fieldErrors.assetCategory}
                  defaultValue={
                    initialValues?.propertyDetail?.assetCategory ??
                    assetCategoryOptions[0]
                  }
                />
                <SelectField
                  label="Occupancy Status"
                  name="occupancyStatus"
                  options={occupancyStatusOptions}
                  error={fieldErrors.occupancyStatus}
                  defaultValue={
                    initialValues?.propertyDetail?.occupancyStatus ??
                    occupancyStatusOptions[0]
                  }
                />
                <SelectField
                  label="Bumi Status"
                  name="bumiStatus"
                  defaultValue={
                    initialValues?.propertyDetail?.bumiStatus ?? "OpenMarket"
                  }
                  options={["Bumi", "NonBumi", "OpenMarket"]}
                  error={fieldErrors.bumiStatus}
                />
                <Field
                  label="City"
                  name="location"
                  error={fieldErrors.location}
                  defaultValue={initialValues?.propertyDetail?.location}
                />
                <SelectField
                  label="State"
                  name="state"
                  options={malaysiaStateOptions}
                  error={fieldErrors.state}
                  defaultValue={
                    initialValues?.propertyDetail?.state ??
                    malaysiaStateOptions[0]
                  }
                />
                <Field
                  label="Full Address"
                  name="fullAddress"
                  error={fieldErrors.fullAddress}
                  className="sm:col-span-2 lg:col-span-3"
                  defaultValue={initialValues?.propertyDetail?.fullAddress}
                />
                <SelectField
                  label="Tenure"
                  name="tenure"
                  defaultValue={
                    initialValues?.propertyDetail?.tenure ?? "Freehold"
                  }
                  options={["Freehold", "Leasehold"]}
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
                <Field
                  label="Market Value"
                  name="reservePrice"
                  error={fieldErrors.reservePrice}
                  type="number"
                  defaultValue={initialValues?.propertyDetail?.reservePrice}
                />
                <ReadOnlyField
                  label="Developer"
                  helper="No persisted developer field is available in the current listing record."
                  value="Not stored"
                />
                <Field
                  label="Year Built / Completion Year"
                  name="yearBuilt"
                  error={fieldErrors.yearBuilt}
                  defaultValue={initialValues?.propertyDetail?.yearBuilt}
                />
              </div>
              <label>
                <span className="text-sm font-bold text-slate-600">
                  LACA Property
                </span>
                <select
                  name="isLaca"
                  defaultValue={
                    initialValues?.propertyDetail?.isLaca ? "true" : "false"
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </label>
            </section>
          </Card>
        </div>
        <div className={activeStep === 2 ? "block" : "hidden"}>
          <Card>
            <section id="participation-details" className="space-y-4">
              <h2 className="text-base font-bold">Participation Details</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  label="Participation Start Date"
                  helper="Managed in Listing Overview."
                  value={
                    toDateInput(initialValues?.campaignOpenDate) ??
                    "Set in Step 1"
                  }
                />
                <ReadOnlyField
                  label="Participation End Date"
                  helper="Managed in Listing Overview."
                  value={
                    toDateInput(initialValues?.campaignCloseDate) ??
                    "Set in Step 1"
                  }
                />
                <Field
                  label="Holding Return"
                  name="holdingReturnRateMonthly"
                  error={fieldErrors.holdingReturnRateMonthly}
                  type="number"
                  step="0.01"
                  defaultValue={initialValues?.holdingReturnRateMonthly ?? 0}
                />
                <SelectField
                  label="Expected Distribution / Return Type"
                  name="returnType"
                  defaultValue={initialValues?.returnType ?? "Target"}
                  options={["Fixed", "Target", "UpTo"]}
                  error={fieldErrors.returnType}
                />
                <Field
                  label="Participation Period / Holding Period"
                  name="maximumHoldingPeriodMonths"
                  error={fieldErrors.maximumHoldingPeriodMonths}
                  type="number"
                  defaultValue={initialValues?.maximumHoldingPeriodMonths ?? 24}
                />
                <SelectField
                  label="Principal Protection"
                  name="principalProtectionEnabled"
                  defaultValue={
                    initialValues?.principalProtectionEnabled === false
                      ? "false"
                      : "true"
                  }
                  options={["true", "false"]}
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <TextAreaField
                  label="Holding Return Explanation"
                  name="holdingReturnExplanation"
                  error={fieldErrors.holdingReturnExplanation}
                  rows={9}
                  defaultValue={withDefault(
                    initialValues?.content?.holdingReturnExplanation,
                    defaultHoldingReturnExplanation,
                  )}
                />
                <TextAreaField
                  label="Final Return Explanation"
                  name="finalDistributionExplanation"
                  error={fieldErrors.finalDistributionExplanation}
                  rows={9}
                  defaultValue={withDefault(
                    initialValues?.content?.finalDistributionExplanation,
                    defaultFinalReturnExplanation,
                  )}
                />
              </div>
              <TextAreaField
                label="Locked 24-Month Rule Display Text"
                name="lockedRuleText"
                rows={5}
                defaultValue={withDefault(
                  initialValues?.twentyFourMonthRuleText,
                  defaultLockedRuleText,
                )}
              />
            </section>
          </Card>
        </div>
        <div className={activeStep === 3 ? "block" : "hidden"}>
          <Card>
            <section id="settlement-fees" className="space-y-4">
              <h2 className="text-base font-bold">Settlement & Fees</h2>
              <p className="text-sm text-slate-500">
                Optional. Use this section to prepare future Final Return
                distribution and platform share planning.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-bold text-slate-600">
                    Member Final Return %
                  </span>
                  <input
                    name="memberProfitDistributionPercentagePlanned"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={memberShare}
                    onChange={(event) => {
                      setMemberShare(event.target.value);
                      const value = Number(event.target.value);
                      setPlatformShare(
                        Number.isFinite(value)
                          ? String(Math.max(0, Math.min(100, 100 - value)))
                          : "",
                      );
                    }}
                    className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  />
                </label>
                <label>
                  <span className="text-sm font-bold text-slate-600">
                    Platform Final Return %
                  </span>
                  <input
                    name="platformProfitSharePercentagePlanned"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={platformShare}
                    onChange={(event) => {
                      setPlatformShare(event.target.value);
                      const value = Number(event.target.value);
                      setMemberShare(
                        Number.isFinite(value)
                          ? String(Math.max(0, Math.min(100, 100 - value)))
                          : "",
                      );
                    }}
                    className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"
                  />
                </label>
                <ReadOnlyField
                  label="Total"
                  helper="Member and platform percentages auto-balance."
                  value="100%"
                />
                <TextAreaField
                  label="Settlement Notes"
                  name="settlementFeeNotes"
                  rows={4}
                  defaultValue={defaultSettlementNotes}
                />
              </div>
            </section>
          </Card>
        </div>
        <div className={activeStep === 4 ? "block" : "hidden"}>
          <Card>
            <section id="media" className="space-y-4">
              <h2 className="text-base font-bold">Media</h2>
              <p className="text-sm text-slate-500">
                Upload JPG, JPEG, PNG, or WEBP images up to 5MB. Save Step
                persists uploaded media to object storage.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <UploadZone
                  title="Main / Hero Image"
                  name="heroImage"
                  supported="JPG, PNG, WEBP"
                  helper="Uploads to object storage when you save this step."
                  error={fieldErrors.heroImage}
                  currentFiles={
                    heroImage?.fileAsset?.originalFilename
                      ? [
                          {
                            id: heroImage.id,
                            name: heroImage.fileAsset.originalFilename,
                            url: toPreviewUrl(heroImage.fileAsset),
                          },
                        ]
                      : []
                  }
                />
                <UploadZone
                  title="Gallery Images"
                  name="galleryImages"
                  multiple
                  supported="JPG, PNG, WEBP"
                  helper="Uploads to object storage when you save this step."
                  currentFiles={galleryImages.map((media) => ({
                    id: media.id,
                    name: media.fileAsset?.originalFilename ?? "Gallery image",
                    url: toPreviewUrl(media.fileAsset),
                  }))}
                />
              </div>
              <input
                type="hidden"
                name="heroMediaId"
                value={heroImage?.id ?? ""}
              />
              <Field
                label="Hero Image Alt Text"
                name="heroAltText"
                defaultValue={heroImage?.altText}
              />
              {heroImage ? (
                <label className="inline-flex items-center gap-2 text-xs font-bold text-red-600">
                  <input type="checkbox" name="deleteHeroImage" value="true" />{" "}
                  Remove current main image
                </label>
              ) : null}
              {galleryImages.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.map((media, index) => (
                    <div
                      key={media.id}
                      className="min-w-0 rounded-xl border border-slate-100 bg-white p-4"
                    >
                      <input
                        type="hidden"
                        name="galleryMediaId"
                        value={media.id}
                      />
                      <p className="truncate text-sm font-black text-papaipay-ink">
                        Gallery image {index + 1}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {media.fileAsset?.originalFilename ?? "Uploaded image"}
                      </p>
                      <label className="mt-3 flex items-center gap-2 text-xs font-bold text-red-600">
                        <input
                          type="checkbox"
                          name="deleteGalleryMediaId"
                          value={media.id}
                        />{" "}
                        Remove
                      </label>
                      <input
                        type="hidden"
                        name={`galleryAltText:${media.id}`}
                        value={media.altText ?? ""}
                      />
                      <input
                        type="hidden"
                        name={`gallerySortOrder:${media.id}`}
                        value={media.sortOrder ?? index + 1}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          </Card>
        </div>
        <div className={activeStep === 5 ? "block" : "hidden"}>
          <Card>
            <section id="documents" className="space-y-4">
              <h2 className="text-base font-bold">Documents</h2>
              <p className="text-sm text-slate-500">
                Documents are optional and never block workspace save or
                publish.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SelectField
                  label="Document Category"
                  name="newDocumentCategory"
                  options={documentCategories}
                />
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
                <UploadZone
                  title="Document Upload"
                  name="documentFile:Other Documents"
                  helper="Upload one or more optional supporting files."
                  supported="PDF, DOCX, JPG, PNG, WEBP"
                />
              </div>
              {documents.length ? (
                <div className="grid gap-3">
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
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-papaipay-ink">
                            {document.fileAsset?.originalFilename ??
                              document.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {document.category}
                          </p>
                        </div>
                        <label className="flex items-center gap-2 text-xs font-bold text-red-600">
                          <input
                            type="checkbox"
                            name="deleteDocumentId"
                            value={document.id}
                          />{" "}
                          Remove
                        </label>
                      </div>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            </section>
          </Card>
        </div>
        <div className={activeStep === 6 ? "block" : "hidden"}>
          <Card>
            <section id="member-information" className="space-y-4">
              <h2 className="text-base font-bold">Member Information</h2>
              <TextAreaField
                label="Important Information"
                name="importantInformation"
                error={fieldErrors.importantInformation}
                rows={6}
                defaultValue={withDefault(
                  initialValues?.content?.importantInformation,
                  defaultImportantInformation,
                )}
              />
              <SubsectionCard
                title="FAQ"
                description="Five default FAQ rows are generated for new listings. Admins can edit or clear content before saving."
              >
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={faq.id ?? index}
                      className="rounded-xl border border-slate-100 bg-white p-4"
                    >
                      <input type="hidden" name="faqId" value={faq.id ?? ""} />
                      <input
                        type="hidden"
                        name="faqSortOrder"
                        value={faq.sortOrder ?? index}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label={`FAQ ${index + 1} Question`}
                          name="faqQuestion"
                          error={
                            index === 0 ? fieldErrors.faqQuestion : undefined
                          }
                          defaultValue={faq.question}
                        />
                        <TextAreaField
                          label="Answer"
                          name="faqAnswer"
                          error={
                            index === 0 ? fieldErrors.faqAnswer : undefined
                          }
                          defaultValue={faq.answer}
                          rows={5}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SubsectionCard>
              <TextAreaField
                label="Risk Disclaimer"
                name="riskDisclaimer"
                error={fieldErrors.riskDisclaimer}
                rows={6}
                defaultValue={withDefault(
                  initialValues?.content?.riskDisclaimer,
                  defaultRiskDisclaimer,
                )}
              />
            </section>
          </Card>
        </div>
        <div className={activeStep === 7 ? "block" : "hidden"}>
          <Card>
            <PublishReadinessChecklist
              readiness={readiness}
              listingStatus={listingStatus}
              fieldLabels={fieldLabels}
              onGoToStep={visitStep}
              publishAction={
                initialValues?.publishStatus === "Published" &&
                mode === "edit" ? (
                  <SubmitButton
                    intent="unpublish"
                    pendingLabel="Unpublishing..."
                    className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-black text-amber-800"
                  >
                    Unpublish Listing
                  </SubmitButton>
                ) : (
                  <SubmitButton
                    intent="publish"
                    pendingLabel="Publishing..."
                    className="rounded-xl bg-papaipay-green px-5 py-3 text-sm font-black text-white shadow-sm"
                  >
                    Publish Listing
                  </SubmitButton>
                )
              }
            />
          </Card>
        </div>
      </div>
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={activeStep === 0}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={activeStep === wizardSteps.length - 1}
            className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </Card>
    </form>
  );
}
