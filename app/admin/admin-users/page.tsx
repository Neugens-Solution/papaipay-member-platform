import Link from "next/link";
import { Badge, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { adminUsers } from "@/lib/adminMockData";

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader eyebrow="Admin Users" title="Admin Users" description="Prototype list of Super Admin, Admin and Manager users. All roles currently access the same UI." action={<Link className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white" href="/admin/admin-users/invite">Invite Admin</Link>} />
      <TableWrap>
        <thead><tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Last Login</Th></tr></thead>
        <tbody>{adminUsers.map((user) => <tr key={user.email} className="border-t border-slate-100"><Td><b>{user.name}</b></Td><Td>{user.email}</Td><Td>{user.role}</Td><Td><Badge>{user.status}</Badge></Td><Td>{user.lastLogin}</Td></tr>)}</tbody>
      </TableWrap>
    </div>
  );
}
