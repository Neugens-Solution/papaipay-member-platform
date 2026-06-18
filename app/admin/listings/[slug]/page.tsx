import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { distributions, listingDocuments, listings, participants } from "@/lib/adminMockData";

function DocumentIcon() {
  return <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-sm font-black text-papaipay-green ring-1 ring-emerald-100">PDF</span>;
}

export default function ListingDetailPage() {
  const listing = listings[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/listings" />
      <PageHeader eyebrow="CAMPAIGN DETAIL" title={listing.name} description="Overview, participants, updates, documents and distribution records for this campaign." action={<a className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600" href="/admin/listings/kajang-terrace-house/edit">Edit Listing</a>} />
      <div className="flex gap-2 overflow-x-auto pb-1">{["Overview", "Participants", "Updates", "Documents", "Distributions"].map((tab) => <span key={tab} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{tab}</span>)}</div>

      <section className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <Card><h2 className="font-bold">Overview</h2><InfoGrid items={[{ label: "Location", value: listing.location }, { label: "Status", value: listing.status }, { label: "Target Amount", value: `RM${listing.target.toLocaleString()}` }, { label: "Collected Amount", value: `RM${listing.collected.toLocaleString()}` }, { label: "Participants", value: String(listing.participants) }, { label: "Estimated Outcome", value: "8.4% illustrative" }]} /></Card>
        <Card><h2 className="font-bold">Campaign Progress</h2><p className="my-4 text-3xl font-semibold tracking-tight">{Math.round((listing.collected / listing.target) * 100)}%</p><ProgressBar value={(listing.collected / listing.target) * 100} /></Card>
      </section>

      <Card>
        <h2 className="font-bold">Participants</h2>
        <TableWrap>
          <thead><tr><Th>Member ID</Th><Th>Member Name</Th><Th>Email</Th><Th>Participation Amount</Th><Th>Date</Th><Th>Payment Status</Th><Th>Distribution Status</Th></tr></thead>
          <tbody>{participants.map((participant) => <tr key={participant.email} className="border-t border-slate-100"><Td>{participant.memberId}</Td><Td>{participant.name}</Td><Td>{participant.email}</Td><Td>RM{participant.amount.toLocaleString()}</Td><Td>{participant.date}</Td><Td><Badge>{participant.paymentStatus}</Badge></Td><Td><Badge>{participant.distributionStatus}</Badge></Td></tr>)}</tbody>
        </TableWrap>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card><h2 className="font-bold">Updates</h2>{["Campaign opened", "Valuation refreshed", "Collection milestone reached"].map((update) => <p key={update} className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">{update}</p>)}</Card>
        <Card>
          <h2 className="font-bold">Documents</h2>
          <div className="mt-4 space-y-3">
            {listingDocuments.map((document) => <div key={document} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3"><DocumentIcon /><div><p className="text-sm font-bold text-papaipay-ink">{document}</p><p className="text-xs text-slate-500">Campaign document</p></div></div>)}
          </div>
        </Card>
        <Card><h2 className="font-bold">Distributions</h2>{distributions.slice(0, 3).map((distribution) => <p key={distribution.id} className="mt-3 text-sm text-slate-600">{distribution.member} • {distribution.amount} • {distribution.status}</p>)}</Card>
      </section>
    </div>
  );
}
