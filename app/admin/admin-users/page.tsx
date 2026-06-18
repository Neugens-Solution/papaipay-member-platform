import Link from "next/link";
import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { adminUsers } from "@/lib/adminMockData";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Admin Users" description="Manage Super Admin, Admin and Manager prototype users. All roles currently access the same UI." action={<Link className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white" href="/admin/admin-users/invite">Create Admin User</Link>} />
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-papaipay-green" placeholder="Search admin users" />
        <select className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-papaipay-green"><option>All roles</option><option>Super Admin</option><option>Admin</option><option>Manager</option></select>
        <select className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-papaipay-green"><option>All statuses</option><option>Invited</option><option>Active</option><option>Suspended</option></select>
      </div>
      <TableWrap>
        <thead><tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Last Login</Th><Th>Actions</Th></tr></thead>
        <tbody>{adminUsers.map((user) => <tr key={user.email} className="border-t border-slate-100"><Td><b>{user.name}</b></Td><Td>{user.email}</Td><Td>{user.role}</Td><Td><Badge>{user.status}</Badge></Td><Td>{user.lastLogin}</Td><Td><div className="flex gap-3"><Link className="font-bold text-papaipay-green" href="/admin/profile">View</Link><Link className="font-bold text-papaipay-green" href="/admin/admin-users/invite">Edit</Link></div></Td></tr>)}</tbody>
      </TableWrap>
    </div>
  );
}
