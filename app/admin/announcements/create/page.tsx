import { BackLink, Card, PageHeader } from "@/components/admin/AdminUI";

export default function CreateAnnouncementPage() {
  return <div className="mx-auto max-w-4xl space-y-6"><BackLink href="/admin/announcements" label="Back to Announcements" /><PageHeader title="Create Announcement" description="Create and publish admin announcements." /><AnnouncementForm /></div>;
}

function AnnouncementForm() {
  return (
    <Card>
      <div className="grid gap-4">
        <label><span className="text-sm font-bold">Title</span><input className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3" /></label>
        <label><span className="text-sm font-bold">Content</span><textarea className="mt-2 min-h-36 w-full rounded-lg border border-slate-200 p-3" /></label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label><span className="text-sm font-bold">Audience</span><select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3"><option>All Members</option><option>Verified Members</option><option>Active Participants</option><option>Specific Campaign Participants</option></select></label>
          <label><span className="text-sm font-bold">Publish Date</span><input type="date" className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3" /></label>
          <label><span className="text-sm font-bold">Status</span><select className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3"><option>Draft</option><option>Scheduled</option><option>Published</option></select></label>
        </div>
        <button className="w-fit rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Save Announcement</button>
      </div>
    </Card>
  );
}
