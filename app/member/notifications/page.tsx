import { NotificationList } from "@/components/common/NotificationList";
import { markMemberNotificationsReadAction } from "@/lib/actions/notifications";
import { requireMember } from "@/lib/auth/guards";
import { listMemberNotifications } from "@/lib/data/notifications";

export default async function MemberNotificationsPage() {
  const { member } = await requireMember();
  const notifications = await listMemberNotifications(member.id);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Notifications</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-kasset-ink sm:text-3xl">Notifications</h1>
        <p className="mt-2 text-sm text-slate-600">Updates on your identity verification, payments and distributions.</p>
      </div>
      <NotificationList notifications={notifications} markAllAction={markMemberNotificationsReadAction} campaignHref={(slug) => `/member/opportunities/${slug}`} />
    </div>
  );
}
