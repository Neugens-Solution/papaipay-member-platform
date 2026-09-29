import Link from "next/link";

export function NotificationBell({ href, unreadCount }: { href: string; unreadCount: number }) {
  const label = unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications";
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="relative grid min-h-10 min-w-10 place-items-center rounded-full bg-[#172235] text-white transition hover:bg-[#a47c48] focus:outline-none focus:ring-2 focus:ring-[#a47c48]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      {unreadCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[0.65rem] font-bold leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
