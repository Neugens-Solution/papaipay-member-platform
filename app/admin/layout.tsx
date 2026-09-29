import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth/guards";
import { countUnreadAdminNotifications } from "@/lib/data/notifications";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, admin } = await requireAdmin();
  const unreadNotifications = await countUnreadAdminNotifications();
  return <AdminShell identity={{ name: admin.displayName, email: user.email, role: admin.role.name }} unreadNotifications={unreadNotifications}>{children}</AdminShell>;
}
