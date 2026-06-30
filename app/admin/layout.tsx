import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, admin } = await requireAdmin();
  return <AdminShell identity={{ name: admin.displayName, email: user.email, role: admin.role.name }}>{children}</AdminShell>;
}
