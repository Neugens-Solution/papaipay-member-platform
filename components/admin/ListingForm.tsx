import { Card } from "@/components/admin/AdminUI";

const propertyFields = [
  "Listing Title",
  "Location",
  "Full Address",
  "Property Type",
  "Tenure",
  "Tenure Display Alias (FH / LH)",
  "LACA",
  "Bumi Status",
  "Built-up Area (sq ft)",
  "Land Area (sq ft)",
  "Bedrooms",
  "Bathrooms",
  "Auction Date",
  "Reserve Price",
  "Year Built",
];

const timelineStages = [
  "Campaign Opened",
  "Fully Allocated",
  "Property Secured",
  "Renovation In Progress",
  "Listed For Sale",
  "Under Offer",
  "Sold",
  "Distribution Processing",
  "Completed",
];

const documentCategories = [
  "Auction Proclamation",
  "Valuation Report",
  "Title Search",
  "Legal Documents",
  "Supporting Documents",
];

function Field({ label, type = "text", className = "" }: { label: string; type?: string; className?: string }) {
  return (
    <label className={className}>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input type={type} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-papaipay-green" />
    </label>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-papaipay-green">
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
      <textarea rows={rows} className="mt-2 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-papaipay-green" />
    </label>
  );
}

function UploadZone({ title, supported }: { title: string; supported: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center transition hover:border-papaipay-green/40 hover:bg-emerald-50/40">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-papaipay-green ring-1 ring-slate-200">↑</div>
      <p className="mt-3 text-sm font-bold text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Supported: {supported}</p>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
    </div>
  );
}

export function ListingForm({ mode }: { mode: "create" | "edit" }) {
  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle title="Basic Property Information" description="Manage the property details shown on the member listing detail page." />
        <div className="grid gap-4 sm:grid-cols-2">
          {propertyFields.map((field) => <Field key={field} label={field} className={field === "Full Address" ? "sm:col-span-2" : ""} />)}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Campaign Information" description="Configure campaign amounts, participation limits, date pickers and publication status." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Campaign Target" />
          <Field label="Minimum Participation Amount" />
          <Field label="Maximum Participation Amount" />
          <Field label="Campaign Start Date" type="date" />
          <Field label="Campaign End Date" type="date" />
          <Field label="Holding Return Rate" />
          <SelectField label="Return Type" options={["Fixed", "Target", "Up To"]} />
          <Field label="Maximum Holding Period Months" />
          <Field label="Principal Protection Rule" />
          <Field label="Final Distribution Notes" />
          <SelectField label="Status" options={["Draft", "Published", "Open", "Closing Soon", "Closed", "Completed"]} />
        </div>
      </Card>

      <Card>
        <SectionTitle title="Property Valuation" description="Control the valuation information displayed to members." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Purchase Price / Successful Bid Price" />
          <Field label="Sale Price" />
          <Field label="Valuation Date" type="date" />
          <div className="sm:col-span-2 lg:col-span-4"><TextAreaField label="Valuation Report Summary" rows={4} /></div>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Settlement / Distribution Configuration" description="Prototype calculation fields only; no backend, payment gateway or automated payout." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Auction Deposit", "Balance Purchase Price", "Legal Fee", "Stamp Duty", "Disbursement", "Title Search", "Other Acquisition Costs", "Maintenance Fee", "Sinking Fund", "Quit Rent / Cukai Tanah", "Assessment / Cukai Pintu", "Utilities", "Insurance", "Security / Management Charges", "Other Holding Costs", "Renovation Cost", "Contractor Cost", "Material Cost", "Cleaning Cost", "Defect Rectification", "Other Preparation Costs", "Agent Fee", "Legal Fee on Sale", "RPGT, if applicable", "Marketing Cost", "Documentation Cost", "Other Disposal Costs", "Platform Fee", "Management Fee", "Administration Fee", "Other Platform Costs", "Member Profit Distribution Percentage", "Platform Profit Share Percentage"].map((field) => <Field key={field} label={field} />)}
          <div className="sm:col-span-2 lg:col-span-3"><TextAreaField label="Notes / Calculation Remarks" rows={4} helper="Clearly label any not-finalized formula as a prototype calculation." /></div>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Description" description="Primary property narrative shown to members." />
        <TextAreaField label="Property Description" rows={7} />
      </Card>

      <Card>
        <SectionTitle title="Timeline Management" description="Select the campaign stages that should appear highlighted in the member timeline." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {timelineStages.map((stage, index) => (
            <label key={stage} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm font-bold text-slate-700">
              <input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 rounded border-slate-300 accent-papaipay-green" />
              <span>{stage}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Recent Updates" description="These entries power the member-facing Recent Updates section." />
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div key={item} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Update Date" type="date" /><Field label="Update Title" /></div>
              <div className="mt-4"><TextAreaField label="Update Description" rows={3} /></div>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">+ Add Update</button>
      </Card>

      <Card>
        <SectionTitle title="FAQ" description="Manage listing FAQs shown in the Member Portal." />
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div key={item} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <Field label="Question" />
              <div className="mt-4"><TextAreaField label="Answer" rows={3} /></div>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">+ Add FAQ</button>
      </Card>

      <Card>
        <SectionTitle title="Risk Disclosure" description="Control the risk disclosure text shown on the member listing detail page." />
        <TextAreaField label="Risk Disclosure" rows={6} helper="Example: Auction property participation may be affected by reserve price, title review, vacancy, repairs, market liquidity, timing and disposal conditions." />
      </Card>

      <Card>
        <SectionTitle title="Documents" description="Upload structured campaign documents by category. Prototype only; no upload handling yet." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documentCategories.map((category) => <UploadZone key={category} title={category} supported="PDF, DOCX" />)}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Property Images" description="Upload multiple property images that feed the member listing gallery." />
        <UploadZone title="Drag & Drop Property Images" supported="JPG, PNG, WEBP" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Front view", "Living area", "Exterior detail"].map((placeholder) => <div key={placeholder} className="grid h-24 place-items-center rounded-xl border border-slate-100 bg-slate-50/80 text-xs font-bold text-slate-400">{placeholder}</div>)}
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold">Save Draft</button>
        <button className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">{mode === "create" ? "Publish Listing" : "Update Listing"}</button>
      </div>
    </div>
  );
}
