import { BackLink, Card, PageHeader } from "@/components/admin/AdminUI";

const fields = ["Listing Title", "Location", "Property Type", "Tenure", "Target Amount", "Minimum Participation", "Maximum Participation", "Campaign Start Date", "Campaign End Date", "Estimated Outcome", "Description", "Status"];

function UploadZone({ title, supported }: { title: string; supported: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center transition hover:border-papaipay-green/40 hover:bg-emerald-50/40">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-papaipay-green ring-1 ring-slate-200">↑</div>
      <p className="mt-3 text-sm font-bold text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Supported: {supported}</p>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href="/admin/listings" />
      <PageHeader title="Create Listing" description="Frontend prototype for drafting and publishing a campaign listing." />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className={field === "Description" ? "sm:col-span-2" : ""}>
              <span className="text-sm font-bold text-slate-600">{field}</span>
              {field === "Description" ? <textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-200 p-3" /> : <input className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3" />}
            </label>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <UploadZone title="Drag & Drop Property Images" supported="JPG, PNG, WEBP" />
          <UploadZone title="Upload Campaign Documents" supported="PDF, DOCX" />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold">Save Draft</button>
          <button className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Publish Listing</button>
        </div>
      </Card>
    </div>
  );
}
