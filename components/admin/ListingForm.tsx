import { Card } from "@/components/admin/AdminUI";
import { campaignLifecycleStatuses, documentCategories } from "@/lib/adminMockData";

const tabs = [
  { id: "campaign-setup", label: "Campaign Setup" },
  { id: "property-details", label: "Property Details" },
  { id: "media-documents", label: "Media & Documents" },
  { id: "campaign-content", label: "Campaign Content" },
  { id: "return-protection", label: "Return & Protection" },
  { id: "settlement-fees", label: "Settlement & Fees" },
  { id: "review-publish", label: "Review & Publish" },
];

const campaignSetupFields = [
  "Campaign ID",
  "Campaign Code",
  "Campaign Title",
  "Campaign Target",
  "Collected Amount",
  "Remaining Amount",
  "Progress Percentage",
  "Minimum Participation Amount",
  "Maximum Participation Amount",
  "Campaign Open Date",
  "Campaign Close Date",
  "Days Remaining",
];

const propertyFields = [
  "Property Type",
  "Built-Up",
  "Land Area",
  "Bedrooms",
  "Bathrooms",
  "Auction Date",
  "Auction Reserve Price",
  "State",
  "Location",
  "Full Address",
  "Year Built",
];

const mediaFields = ["Primary Image", "Gallery Images", "Gallery Count", "Image Caption", "Image Alt Text"];

const timelineStages = ["Campaign Created", "Campaign Opened", "Funded", "Holding", "Sold", "Distribution Processing", "Distributed"];

const acquisitionCostFields = ["Purchase Price / Successful Bid Price", "Auction Deposit", "Balance Purchase Price", "Legal Fee", "Stamp Duty", "Disbursement", "Title Search", "Other Acquisition Costs"];
const holdingCostFields = ["Maintenance Fee", "Sinking Fund", "Quit Rent / Cukai Tanah", "Assessment / Cukai Pintu", "Utilities", "Insurance", "Security / Management Charges", "Other Holding Costs"];
const renovationCostFields = ["Renovation Cost", "Contractor Cost", "Material Cost", "Cleaning Cost", "Defect Rectification", "Other Preparation Costs"];
const disposalCostFields = ["Sale Price", "Agent Fee", "Legal Fee on Sale", "RPGT, if applicable", "Marketing Cost", "Documentation Cost", "Other Disposal Costs"];
const platformCostFields = ["Platform Fee", "Management Fee", "Administration Fee", "Other Platform Costs"];
const calculationFields = ["Gross Profit", "Total Costs", "Net Profit", "Principal Return Pool", "Holding Return Pool", "Profit Distribution Pool", "Platform Share", "Final Distribution Pool"];

function Field({ label, type = "text", className = "" }: { label: string; type?: string; className?: string }) {
  const normalizedType = label.includes("Date") ? "date" : type;
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input type={normalizedType} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10" />
    </label>
  );
}

function SelectField({ label, options, helper }: { label: string; options: readonly string[]; helper?: string }) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TextAreaField({ label, rows = 5, helper }: { label: string; rows?: number; helper?: string }) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      {helper ? <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p> : null}
      <textarea rows={rows} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-papaipay-green/10" />
    </label>
  );
}

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <section id={id} className="scroll-mt-28">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>
        {children}
      </section>
    </Card>
  );
}

function FieldGrid({ fields, columns = "lg:grid-cols-3" }: { fields: string[]; columns?: string }) {
  return <div className={`grid gap-4 sm:grid-cols-2 ${columns}`}>{fields.map((field) => <Field key={field} label={field} className={field === "Full Address" ? "sm:col-span-2 lg:col-span-3" : ""} />)}</div>;
}

function UploadZone({ title, supported }: { title: string; supported: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-center transition hover:border-papaipay-green/40 hover:bg-emerald-50/40">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-papaipay-green ring-1 ring-slate-200">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" /></svg>
      </div>
      <p className="mt-3 text-sm font-bold text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Supported: {supported}</p>
    </div>
  );
}

function CostGroup({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <h3 className="text-sm font-black text-papaipay-ink">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{fields.map((field) => <Field key={field} label={field} />)}</div>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold text-slate-700">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-xs text-papaipay-green">✓</span>
      {label}
    </li>
  );
}

export function ListingForm({ mode }: { mode: "create" | "edit" }) {
  const memberPreviewHref = "/member/opportunities/kajang-terrace-house";

  return (
    <div className="space-y-5">
      <div className="sticky top-[76px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/95 sm:shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex gap-2 overflow-x-auto" aria-label="Listing form sections">
          {tabs.map((tab) => <a key={tab.id} href={`#${tab.id}`} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:border-papaipay-green/40 hover:bg-emerald-50/50 hover:text-papaipay-green">{tab.label}</a>)}
        </div>
      </div>

      <Section id="campaign-setup" title="Campaign Setup" description="Manage identifiers, lifecycle status, participation limits, campaign dates and member preview visibility.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Campaign Lifecycle Status" options={campaignLifecycleStatuses} />
          <SelectField label="Member Preview Visibility" options={["Member Visible", "Internal Only"]} />
          {campaignSetupFields.map((field) => <Field key={field} label={field} />)}
          <div className="sm:col-span-2 lg:col-span-3"><TextAreaField label="Internal Admin Notes" rows={4} /></div>
        </div>
      </Section>

      <Section id="property-details" title="Property Details" description="Maintain the Malaysian property benchmark fields that appear in the member property snapshot.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Tenure" options={["Freehold", "Leasehold"]} helper="Use full wording in normal rows and form labels." />
          <SelectField label="Tenure Badge" options={["FH", "LH"]} helper="Use FH / LH only as a compact badge or alias." />
          <SelectField label="LACA Status" options={["Yes", "No"]} />
          <SelectField label="Bumi Status" options={["Bumi", "Non-Bumi", "Open Market"]} />
        </div>
        <div className="mt-4"><FieldGrid fields={propertyFields} /></div>
      </Section>

      <Section id="media-documents" title="Media & Documents" description="Manage the member-facing gallery, image metadata and document readiness.">
        <FieldGrid fields={mediaFields} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="Document Visibility" options={["Internal Only", "Member Visible"]} />
          <SelectField label="Document Status" options={["Draft", "Ready", "Published"]} />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {documentCategories.map((category) => <UploadZone key={category} title={category} supported={category === "Property Photos" ? "JPG, PNG, WEBP" : "PDF, DOCX"} />)}
        </div>
      </Section>

      <Section id="campaign-content" title="Campaign Content" description="Control member-facing campaign narrative, important information, timeline, updates, FAQ and risk text.">
        <div className="grid gap-5 lg:grid-cols-2">
          <TextAreaField label="About This Campaign" rows={7} helper="This replaces the old property description field." />
          <TextAreaField label="Important Information" rows={7} />
        </div>
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <h3 className="text-sm font-black text-papaipay-ink">Campaign Timeline</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {timelineStages.map((stage, index) => (
              <label key={stage} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 text-sm font-bold text-slate-700">
                <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4 rounded border-slate-300 accent-papaipay-green" />
                <span>{stage}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextAreaField label="Updates" rows={6} helper="Add date, title and update copy for member-facing campaign updates." />
          <TextAreaField label="FAQ" rows={6} helper="Add common questions and answers for member review." />
          <div className="lg:col-span-2"><TextAreaField label="Risk / Disclaimer" rows={5} /></div>
        </div>
      </Section>

      <Section id="return-protection" title="Return & Protection" description="Configure the holding return model and the member-facing final distribution explanation.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Holding Return Rate" />
          <SelectField label="Return Type" options={["Fixed", "Target", "Up To"]} />
          <Field label="Maximum Holding Period Months" />
          <SelectField label="Principal Protection Enabled" options={["Enabled", "Disabled"]} />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <TextAreaField label="Holding Return Explanation" rows={5} helper="Holding Return accrues during the holding period and is paid once during final distribution." />
          <TextAreaField label="Final Distribution Explanation" rows={5} helper="Explain Principal Return, Holding Return and Profit Distribution clearly." />
        </div>
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">Locked 24-Month Rule</p>
          <p className="mt-2 text-sm font-bold leading-6 text-blue-900">If not sold within 24 months, Participation Amount only will be returned.</p>
          <div className="mt-4"><TextAreaField label="24-Month Rule Display Text" rows={3} helper="Keep this aligned with the approved rule text." /></div>
        </div>
      </Section>

      <Section id="settlement-fees" title="Settlement & Fees" description="Review acquisition, holding, preparation, disposal, platform costs and final distribution calculation fields.">
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-900">
          <strong>Locked calculation note:</strong> if Calculation Status is Locked, finance values should not be edited casually. Add remarks before requesting a change.
        </div>
        <div className="space-y-5">
          <CostGroup title="Acquisition Costs" fields={acquisitionCostFields} />
          <CostGroup title="Holding Costs" fields={holdingCostFields} />
          <CostGroup title="Renovation / Preparation Costs" fields={renovationCostFields} />
          <CostGroup title="Disposal / Sale Costs" fields={disposalCostFields} />
          <CostGroup title="Platform / Management Costs" fields={platformCostFields} />
          <CostGroup title="Calculation Preview" fields={calculationFields} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Member Profit Distribution Percentage" />
            <Field label="Platform Profit Share Percentage" />
            <SelectField label="Calculation Status" options={["Draft", "Reviewed", "Approved", "Locked"]} />
          </div>
          <TextAreaField label="Calculation Remarks" rows={4} />
        </div>
      </Section>

      <Section id="review-publish" title="Review & Publish" description="Confirm readiness before saving, publishing or previewing the member-facing listing.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Campaign ID present", "Campaign Code present", "Campaign Target set", "Min / Max Participation set", "Property Snapshot complete", "Gallery ready", "Required documents ready", "About This Campaign completed", "Important Information completed", "Return & Protection completed", "24-month rule visible", "Settlement reviewed if applicable", "Member Preview checked"].map((item) => <ChecklistItem key={item} label={item} />)}
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">Save Draft</button>
          <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">Submit for Review</button>
          <button className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">{mode === "create" ? "Publish Campaign" : "Update Campaign"}</button>
          <a href={memberPreviewHref} className="rounded-md border border-papaipay-green/30 bg-emerald-50 px-4 py-2 text-center text-sm font-bold text-papaipay-green">Preview Member View</a>
        </div>
      </Section>
    </div>
  );
}
