"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Card } from "@/components/admin/AdminUI";
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
  "Final Distribution Pool",
];
type FormValues = Record<string, string>;
type FormErrors = Record<string, string>;

const fieldNameByLabel: Record<string, string> = {
  "Listing Title": "title",
  "Property Type": "property.propertyType",
  Location: "property.location",
  "Full Address": "property.fullAddress",
  "About This Listing": "content.aboutCampaign",
  "Important Information": "content.importantInformation",
  "Campaign Target": "campaignTarget",
  "Minimum Participation Amount": "minimumParticipationAmount",
  "Maximum Participation Amount": "maximumParticipationAmount",
};

const validationLabels: Record<string, string> = {
  title: "Listing Title",
  "property.propertyType": "Property Type",
  "property.location": "Location",
  "property.fullAddress": "Full Address",
  "content.aboutCampaign": "About This Listing",
  "content.importantInformation": "Important Information",
  campaignTarget: "Campaign Target",
  minimumParticipationAmount: "Minimum Participation Amount",
  maximumParticipationAmount: "Maximum Participation Amount",
};

const requiredFields = Object.keys(validationLabels);
const fieldSection: Record<string, string> = {
  title: "campaign-setup",
  campaignTarget: "campaign-setup",
  minimumParticipationAmount: "campaign-setup",
  maximumParticipationAmount: "campaign-setup",
  "property.propertyType": "property-details",
  "property.location": "property-details",
  "property.fullAddress": "property-details",
  "content.aboutCampaign": "campaign-content",
  "content.importantInformation": "campaign-content",
};

function messageFor(name: string) {
  const label = validationLabels[name] || "This field";
  return name.startsWith("property.propertyType") ? `Please select ${label}.` : `Please enter ${label}.`;
}

function inputClass(hasError?: boolean) {
  return `mt-2 min-h-11 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-4 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"
  }`;
}


function Field({
  label,
  type = "text",
  className = "",
  values,
  errors,
  onChange,
}: {
  label: string;
  type?: string;
  className?: string;
  values?: FormValues;
  errors?: FormErrors;
  onChange?: (name: string, value: string) => void;
}) {
  const normalizedType = label.includes("Date") ? "date" : type;
  const name = fieldNameByLabel[label] || label;
  const error = errors?.[name];
  return (
    <label className={className} data-field-name={name}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input
        name={name}
        value={values?.[name] || ""}
        onChange={(event) => onChange?.(name, event.target.value)}
        type={normalizedType}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(Boolean(error))}
      />
      {error ? <p id={`${name}-error`} className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  );
}

function SelectField({
  label,
  options,
  helper,
  className = "",
  values,
  errors,
  onChange,
}: {
  label: string;
  options: readonly string[];
  helper?: string;
  className?: string;
  values?: FormValues;
  errors?: FormErrors;
  onChange?: (name: string, value: string) => void;
}) {
  const name = fieldNameByLabel[label] || label;
  const error = errors?.[name];
  return (
    <label className={className} data-field-name={name}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <select name={name} value={values?.[name] || ""} onChange={(event) => onChange?.(name, event.target.value)} aria-invalid={Boolean(error)} className={inputClass(Boolean(error)) + " font-semibold text-slate-600"}>
        <option value="">Select {label}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </label>
  );
}

function TextAreaField({
  label,
  helper,
  rows = 4,
  values,
  errors,
  onChange,
}: {
  label: string;
  helper?: string;
  rows?: number;
  values?: FormValues;
  errors?: FormErrors;
  onChange?: (name: string, value: string) => void;
}) {
  const name = fieldNameByLabel[label] || label;
  const error = errors?.[name];
  return (
    <label data-field-name={name}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <textarea name={name} value={values?.[name] || ""} onChange={(event) => onChange?.(name, event.target.value)} rows={rows} aria-invalid={Boolean(error)} className={`mt-2 w-full rounded-lg border bg-white p-3 text-sm outline-none transition focus:ring-4 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-papaipay-green focus:ring-papaipay-green/10"}`} />
      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
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
  values,
  errors,
  onChange,
}: {
  fields: string[];
  columns?: string;
  values?: FormValues;
  errors?: FormErrors;
  onChange?: (name: string, value: string) => void;
}) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${columns}`}>
      {fields.map((field) => (
        <Field
          key={field}
          label={field}
          className={field === "Full Address" ? "sm:col-span-2 lg:col-span-3" : ""}
          values={values}
          errors={errors}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

function UploadZone({
  title,
  supported,
  helper = "Drag and drop here, or choose file",
  multiple = false,
}: {
  title: string;
  supported: string;
  helper?: string;
  multiple?: boolean;
}) {
  const [files, setFiles] = useState<{ file: File; url?: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = supported.includes("JPG") || supported.includes("PNG") || supported.includes("WEBP");

  function handleFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList || []).map((file) => ({
      file,
      url: isImage ? URL.createObjectURL(file) : undefined,
    }));
    setFiles((current) => (multiple ? [...current, ...nextFiles] : nextFiles.slice(0, 1)));
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="min-w-0 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-center transition hover:border-papaipay-green/40 hover:bg-emerald-50/40">
      <input ref={inputRef} type="file" multiple={multiple} accept={isImage ? "image/png,image/jpeg,image/webp" : undefined} className="sr-only" onChange={(event) => handleFiles(event.target.files)} />
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-papaipay-green ring-1 ring-slate-200">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></svg>
      </div>
      <p className="mt-3 text-sm font-bold text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-papaipay-green ring-1 ring-emerald-100">
        {files.length ? "Replace" : "Choose file"}
      </button>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Supported: {supported}{files.length ? ` · ${files.length} selected` : ""}</p>
      {files.length ? (
        <div className="mt-4 grid max-h-80 min-w-0 gap-3 overflow-y-auto text-left">
          {files.map((item, index) => (
            <div key={`${item.file.name}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-white p-2">
              {item.url ? <Image src={item.url} alt="" width={56} height={56} unoptimized className="h-14 w-14 shrink-0 rounded-lg object-cover" /> : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">DOC</div>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-700">{item.file.name}</p>
                <p className="text-xs text-slate-400">{Math.ceil(item.file.size / 1024)} KB</p>
              </div>
              <button type="button" onClick={() => removeFile(index)} className="shrink-0 rounded-md border border-red-100 px-2 py-1 text-xs font-bold text-red-600">Remove</button>
            </div>
          ))}
        </div>
      ) : null}
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
  campaignRef?: string;
  campaignCode?: string;
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
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState("");
  const [banner, setBanner] = useState("");
  const [processing, setProcessing] = useState<"draft" | "publish" | "update" | "unpublish" | "" | "review">("");
  const [savedPreviewHref, setSavedPreviewHref] = useState(memberPreviewHref);

  const tabsWithErrors = useMemo(() => new Set(Object.keys(errors).map((field) => fieldSection[field])), [errors]);
  const onChange = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      if (value.trim()) delete next[name];
      return next;
    });
  };
  const validate = () => {
    const nextErrors = requiredFields.reduce<FormErrors>((next, name) => {
      if (!values[name]?.trim()) next[name] = messageFor(name);
      return next;
    }, {});
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setBanner("Please complete the required information before publishing.");
      requestAnimationFrame(() => {
        const firstName = Object.keys(nextErrors)[0];
        const target = document.querySelector(`[data-field-name="${firstName}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        (target?.querySelector("input, textarea, select") as HTMLElement | null)?.focus();
      });
      return false;
    }
    setBanner("");
    return true;
  };
  const handleAction = (action: "draft" | "publish" | "update" | "unpublish" | "review") => {
    if (action !== "draft" && !validate()) return;
    setProcessing(action);
    window.setTimeout(() => {
      setProcessing("");
      if (action === "draft") {
        setSavedPreviewHref(memberPreviewHref || "/member/opportunities/preview-draft");
        setToast("Listing saved as Draft.");
      } else if (action === "publish") setToast("Listing published successfully.");
      else if (action === "update") setToast("Listing updated successfully.");
      else if (action === "unpublish") setToast("Listing unpublished successfully.");
    }, 350);
  };

  return (
    <div className="space-y-5">
      {toast ? <div className="fixed right-4 top-4 z-50 rounded-xl bg-papaipay-ink px-4 py-3 text-sm font-bold text-white shadow-lg">{toast}</div> : null}
      {banner ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{banner}</div> : null}
      <div className="sticky top-[76px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div
          className="flex gap-2 overflow-x-auto"
          aria-label="Listing form sections"
        >
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black transition hover:border-papaipay-green/40 hover:bg-emerald-50/50 hover:text-papaipay-green ${tabsWithErrors.has(tab.id) ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 bg-white text-slate-600"}`}
            >
              {tab.label}{tabsWithErrors.has(tab.id) ? <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500" aria-label="Section has errors" /> : null}
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
              <Field label="Listing Title" values={values} errors={errors} onChange={onChange} />
              <SelectField
                label="Member Preview Visibility"
                options={["Member Visible", "Internal Only"]}
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
              {campaignDateFields.map((field) => (
                <Field key={field} label={field} />
              ))}
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
              {campaignAmountFields.map((field) => (
                <Field key={field} label={field} values={values} errors={errors} onChange={onChange} />
              ))}
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
            options={["Freehold", "Leasehold"]}
            helper="Use full wording in normal rows and form labels."
          />
          <SelectField
            label="Tenure Badge"
            options={["FH", "LH"]}
            helper="Use FH / LH only as a compact badge or alias."
          />
          <SelectField label="LACA Status" options={["Yes", "No"]} />
          <SelectField
            label="Bumi Status"
            options={["Bumi", "Non-Bumi", "Open Market"]}
          />
        </div>
        <div className="mt-4">
          <FieldGrid fields={propertyFields} values={values} errors={errors} onChange={onChange} />
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
            description="Images used in the listing detail gallery."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <UploadZone
                title="Hero Image"
                supported="JPG, PNG, WEBP"
                helper="Drag and drop the hero image, or choose file. Placeholder preview only for now."
              />
              <UploadZone
                title="Gallery Images"
                supported="JPG, PNG, WEBP"
                helper="Drag and drop multiple gallery images. Upload pending until storage is connected."
                multiple
              />
              <Field label="Image Caption" />
              <Field label="Image Alt Text" />
              <CalculatedField
                label="Gallery Count"
                helper="Calculated from uploaded gallery images."
              />
            </div>
          </SubsectionCard>
          <SubsectionCard
            title="Documents"
            description="Document categories prepared for member review or internal operations."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SelectField
                label="Document Visibility"
                options={["Internal Only", "Member Visible"]}
              />
              <SelectField
                label="Document Status"
                options={["Draft", "Ready", "Published"]}
              />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {documentCategories.map((category) => (
                <UploadZone
                  key={category}
                  title={`${category} Upload`}
                  helper="Document upload control placeholder. Storage connection pending."
                  supported={
                    category === "Property Photos"
                      ? "JPG, PNG, WEBP"
                      : "PDF, DOCX"
                  }
                />
              ))}
            </div>
          </SubsectionCard>
        </div>
      </Section>

      <Section
        id="campaign-content"
        title="Campaign Content"
        description="Control member-facing listing narrative, important information, timeline, updates, FAQ and risk text."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField
            label="About This Listing"
            rows={7}
            helper="Member-facing listing overview displayed on the listing detail page."
            values={values}
            errors={errors}
            onChange={onChange}
          />
          <TextAreaField label="Important Information" rows={7} values={values} errors={errors} onChange={onChange} />
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
            description="Repeater-style update entries. UI only; persistence will be added during CRUD implementation."
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
            description="Repeater-style FAQ entries. UI only; persistence will be added during CRUD implementation."
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
            <TextAreaField label="Risk / Disclaimer" rows={5} />
          </div>
        </div>
      </Section>

      <Section
        id="return-protection"
        title="Return & Protection"
        description="Configure the holding return model and the member-facing final distribution explanation."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Holding Return Rate" />
          <SelectField
            label="Return Type"
            options={["Fixed", "Target", "Up To"]}
          />
          <Field label="Maximum Holding Period Months" />
          <SelectField
            label="Principal Protection Enabled"
            options={["Enabled", "Disabled"]}
          />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextAreaField
            label="Holding Return Explanation"
            rows={5}
            helper="Holding Return accrues during the holding period and is paid once during final distribution."
          />
          <TextAreaField
            label="Final Distribution Explanation"
            rows={5}
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
            "About This Listing completed",
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
                Open the member-facing listing detail page before publishing or
                updating this listing.
              </p>
            </div>
            {savedPreviewHref ? (
              <a
                href={savedPreviewHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-papaipay-green px-5 py-3 text-center text-sm font-bold text-white shadow-[0_10px_24px_rgba(34,139,76,0.22)]"
              >
                Preview Member View
              </a>
            ) : (
              <span className="rounded-xl bg-slate-200 px-5 py-3 text-center text-sm font-bold text-slate-500">
                Preview available after save
              </span>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">
          Required fields are checked in your browser before any listing action continues.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" disabled={Boolean(processing)} onClick={() => handleAction("draft")} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            {processing === "draft" ? "Saving..." : "Save Draft"}
          </button>
          <button type="button" disabled={Boolean(processing)} onClick={() => handleAction("review")} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
            Submit for Review
          </button>
          {mode === "create" ? (
            <button type="button" disabled={Boolean(processing)} onClick={() => handleAction("publish")} className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {processing === "publish" ? "Publishing..." : "Publish Listing"}
            </button>
          ) : null}
          {mode === "edit" ? (
            <>
              <button type="button" disabled={Boolean(processing)} onClick={() => handleAction("update")} className="rounded-md bg-papaipay-ink px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {processing === "update" ? "Updating..." : "Update Listing"}
              </button>
              <button type="button" disabled={Boolean(processing)} onClick={() => handleAction("unpublish")} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                Unpublish Listing
              </button>
            </>
          ) : null}
        </div>
      </Section>
    </div>
  );
}
