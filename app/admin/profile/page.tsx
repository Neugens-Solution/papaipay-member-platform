import { Card, InfoGrid, PageHeader } from "@/components/admin/AdminUI";

export default function AdminProfilePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Admin Profile" description="Review admin account profile, security, account activity and permission summary." />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Profile Information</h2>
          <InfoGrid items={[{ label: "Full Name", value: "Sarah Lim" }, { label: "Email", value: "sarah.lim@papaipay.test" }, { label: "Phone Number", value: "+60 12-884 2201" }, { label: "Role", value: "Super Admin" }]} />
        </Card>
        <Card>
          <h2 className="font-bold">Security</h2>
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-sm font-bold text-papaipay-ink">Change Password</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Password update flow will be available in a later release.</p>
            <button className="mt-4 rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">Change Password</button>
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">Account Information</h2>
          <InfoGrid items={[{ label: "Status", value: "Active" }, { label: "Role", value: "Super Admin" }, { label: "Created Date", value: "04 Jan 2026" }]} />
        </Card>
        <Card>
          <h2 className="font-bold">Activity</h2>
          <InfoGrid items={[{ label: "Last Login", value: "18 Jun 2026, 09:12" }, { label: "Last Activity", value: "Viewed Distribution Detail" }]} />
        </Card>
      </section>

      <Card>
        <h2 className="font-bold">Permission Summary</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["Super Admin", "Admin", "Manager"].map((role) => (
            <div key={role} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-sm font-bold text-papaipay-ink">{role}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Read-only role summary. Detailed permissions will be defined in a later release.</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
