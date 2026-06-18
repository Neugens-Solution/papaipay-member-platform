import { Badge, Card, PageHeader } from "@/components/admin/AdminUI";
import { activityLog } from "@/lib/adminMockData";

export default function ActivityLogPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader eyebrow="Activity Log" title="Activity Log" description="Recent system activity across members, campaigns, distributions and announcements." />
      <Card>
        <div className="space-y-1">
          {activityLog.map((item, index) => (
            <div key={`${item.activity}-${item.dateTime}`} className="relative grid gap-3 border-l border-slate-200 pb-6 pl-6 last:pb-0 sm:grid-cols-[1fr_auto]">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-papaipay-green ring-4 ring-emerald-50" />
              <div>
                <p className="text-sm font-bold text-papaipay-ink">{item.activity}</p>
                <p className="mt-1 text-sm text-slate-500">{item.user} • {item.dateTime}</p>
              </div>
              <div className="sm:text-right"><Badge>{item.type}</Badge><p className="mt-1 text-xs text-slate-400">#{String(index + 1).padStart(3, "0")}</p></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
