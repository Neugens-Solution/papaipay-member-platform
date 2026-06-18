import { BackLink, Card, PageHeader } from "@/components/admin/AdminUI";

export default function InviteAdminPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <BackLink href="/admin/admin-users" />
      <PageHeader title="Create Admin User" description="Frontend prototype for creating an admin user invitation." />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className="text-sm font-bold">Full Name</span><input className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3" /></label>
          <label><span className="text-sm font-bold">Email</span><input className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3" /></label>
          <label><span className="text-sm font-bold">Role</span><select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3"><option>Super Admin</option><option>Admin</option><option>Manager</option></select></label>
          <label><span className="text-sm font-bold">Status</span><select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3"><option>Invited</option><option>Active</option><option>Suspended</option></select></label>
        </div>
        <button className="mt-6 rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Send Invite</button>
      </Card>
    </div>
  );
}
