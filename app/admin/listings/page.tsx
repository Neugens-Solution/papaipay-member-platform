import Link from "next/link";
import { Badge, PageHeader, ProgressBar, SearchFilter, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { listings } from "@/lib/adminMockData";

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Listings" description="Manage campaign listing records and monitor collection progress." action={<Link className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white" href="/admin/listings/create">Create Listing</Link>} />
      <SearchFilter placeholder="Search listings" />
      <TableWrap><thead><tr><Th>Campaign ID</Th><Th>Campaign Code</Th><Th>Listing Name</Th><Th>Location</Th><Th>Property</Th><Th>Status</Th><Th>Campaign Target</Th><Th>Collected Amount</Th><Th>Progress</Th><Th>Participants</Th><Th>Actions</Th></tr></thead><tbody>{listings.map((listing) => <tr key={listing.slug} className="border-t border-slate-100"><Td>{listing.id}</Td><Td>{listing.campaignCode}</Td><Td><b className="text-papaipay-ink">{listing.name}</b></Td><Td>{listing.location}</Td><Td>{listing.propertyType} • {listing.tenureAlias} • {listing.bumiStatus}{listing.isLaca ? " • LACA" : ""}</Td><Td><Badge>{listing.status}</Badge></Td><Td>RM{listing.target.toLocaleString()}</Td><Td>RM{listing.collected.toLocaleString()}</Td><Td><ProgressBar value={(listing.collected / listing.target) * 100} /></Td><Td>{listing.participants}</Td><Td><div className="flex gap-3"><Link className="font-bold text-papaipay-green" href={`/admin/listings/${listing.slug}`}>View</Link><Link className="font-bold text-papaipay-green" href={`/admin/listings/${listing.slug}/edit`}>Edit</Link></div></Td></tr>)}</tbody></TableWrap>
    </div>
  );
}
