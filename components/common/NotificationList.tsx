import Link from "next/link";
import type { NotificationRow } from "@/lib/data/notifications";

function timeLabel(date: Date) {
  return date.toLocaleString("en-MY", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kuala_Lumpur" });
}

export function NotificationList({
  notifications,
  markAllAction,
  campaignHref,
}: {
  notifications: NotificationRow[];
  markAllAction: () => Promise<void>;
  campaignHref: (slug: string) => string;
}) {
  const unread = notifications.filter((notification) => !notification.readAt).length;
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">{unread ? `${unread} unread` : "All caught up"}</p>
        {unread ? (
          <form action={markAllAction}>
            <button type="submit" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-kasset-green hover:bg-emerald-50">
              Mark all as read
            </button>
          </form>
        ) : null}
      </div>
      {notifications.length ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex gap-3 py-4">
              <span className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${notification.readAt ? "bg-slate-200" : "bg-rose-500"}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${notification.readAt ? "font-semibold text-slate-600" : "font-bold text-kasset-ink"}`}>{notification.title}</p>
                <p className="mt-1 break-words text-sm leading-6 text-slate-600">{notification.body}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {timeLabel(notification.sentAt ?? notification.createdAt)}
                  {notification.campaign ? (
                    <>
                      {" · "}
                      <Link className="text-kasset-green underline" href={campaignHref(notification.campaign.slug)}>{notification.campaign.title}</Link>
                    </>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">No notifications yet.</p>
      )}
    </section>
  );
}
