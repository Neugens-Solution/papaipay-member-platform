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
  type = "text",
  className = "",
}: {
  label: string;
  type?: string;
  className?: string;
}) {
  const normalizedType = label.includes("Date") ? "date" : type;
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input
        type={normalizedType}
        className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10"
      />
    </label>
  );
}

function SelectField({
  label,
  options,
  helper,
  className = "",
}: {
  label: string;
  options: readonly string[];
  helper?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  rows = 5,
  helper,
}: {
  label: string;
  rows?: number;
  helper?: string;
}) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
      ) : null}
      <textarea
        rows={rows}
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
      {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <textarea rows={rows} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10" />
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
}: {
  title: string;
  supported: string;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-center transition hover:border-papaipay-green/40 hover:bg-emerald-50/40">
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
      <p className="mt-3 text-sm font-bold text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
      <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-papaipay-green ring-1 ring-emerald-100">
        Choose file
      </span>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Supported: {supported} · Upload pending
      </p>
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

  return (
    <div className="space-y-5">
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
              <Field label="Campaign Title" />
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
                <Field key={field} label={field} />
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
          <FieldGrid fields={propertyFields} />
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
                title="Primary Image"
                supported="JPG, PNG, WEBP"
                helper="Drag and drop the hero image, or choose file. Placeholder preview only for now."
              />
              <UploadZone
                title="Gallery Images"
                supported="JPG, PNG, WEBP"
                helper="Drag and drop multiple gallery images. Upload pending until storage is connected."
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
        description="Control member-facing campaign narrative, important information, timeline, updates, FAQ and risk text."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField
            label="About This Campaign"
            rows={7}
            helper="Member-facing campaign overview displayed on the campaign detail page."
          />
          <TextAreaField label="Important Information" rows={7} />
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
          Action buttons are UI-only placeholders for Phase 1; server actions
          and database writes are not wired yet.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
            Save Draft
          </button>
          <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
            Submit for Review
          </button>
          <button className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">
            Publish Campaign
          </button>
          <button className="rounded-md bg-papaipay-ink px-4 py-2 text-sm font-bold text-white">
            Update Campaign
          </button>
        </div>
      </Section>
    </div>
  );
}
