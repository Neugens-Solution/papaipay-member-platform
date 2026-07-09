import { BackLink, Card, PageHeader } from "@/components/admin/AdminUI";

export default function InviteAdminPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <BackLink href="/admin/admin-users" label="Back to Admin Users" />
      <PageHeader title="Invite Admin User" description="Admin account creation is invite-only and must be completed by an authorized admin or super-admin." />
      <Card>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Secure admin invitations are not self-service. New admin users must be invited by an authorized admin or super-admin, and invitations default to Invited until activation is completed.
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2" aria-disabled="true">
          <label><span className="text-sm font-bold">Full Name</span><input disabled placeholder="Invitation flow pending" className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" /></label>
          <label><span className="text-sm font-bold">Email</span><input disabled placeholder="Invitation flow pending" className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" /></label>
          <label><span className="text-sm font-bold">Role</span><select disabled className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3"><option>Admin</option><option>Manager</option><option>Super Admin</option></select></label>
          <label><span className="text-sm font-bold">Status</span><input disabled value="Invited" readOnly className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3" /></label>
        </div>
        <button disabled className="mt-6 rounded-md bg-slate-300 px-4 py-2 text-sm font-bold text-white">Invite-only flow pending</button>
      </Card>
    </div>
  );
}
