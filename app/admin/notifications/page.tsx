import { PageHeader } from "@/components/admin/AdminUI";
import { NotificationList } from "@/components/common/NotificationList";
import { markAdminNotificationsReadAction } from "@/lib/actions/notifications";
import { requireAdmin } from "@/lib/auth/guards";
import { listAdminNotifications } from "@/lib/data/notifications";

export default async function AdminNotificationsPage() {
  await requireAdmin();
  const notifications = await listAdminNotifications();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow="Admin Portal"
        title="Notifications"
        description="New registrations, KYC submissions, participations and payment receipts that need admin attention."
      />
      <NotificationList notifications={notifications} markAllAction={markAdminNotificationsReadAction} campaignHref={(slug) => `/admin/projects/${slug}`} />
    </div>
  );
}
