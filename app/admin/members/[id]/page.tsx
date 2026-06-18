import { BackLink, Badge, Card, InfoGrid, KpiCard, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { distributionHistory, memberDetail, members, participationHistory } from "@/lib/adminMockData";

export default function MemberDetailPage() {
  const member = members[0];
  const summary = [
    { label: "Total Participation", value: member.participation, helper: "Confirmed participation value" },
    { label: "Total Distribution Received", value: member.distribution, helper: "Completed distributions" },
    { label: "Active Campaigns", value: String(member.activeCampaigns), helper: "Currently participating" },
    { label: "Completed Campaigns", value: String(member.completedCampaigns), helper: "Closed participation records" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/members" />
      <PageHeader eyebrow={member.id} title={member.name} description="Complete member profile, verification, banking, nominee, participation and distribution activity." />

      <section aria-label="Member summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {summary.map((item) => <KpiCard key={item.label} {...item} />)}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="font-bold">Profile Information</h2><InfoGrid items={[{ label: "Email", value: member.email }, { label: "Phone", value: member.phone }, { label: "IC", value: memberDetail.ic }, { label: "Address", value: memberDetail.address }]} /></Card>
        <Card><h2 className="font-bold">Verification Status</h2><div className="mt-4"><Badge>{member.status}</Badge></div><InfoGrid items={[{ label: "Verified Date", value: memberDetail.verified }, { label: "Role Access", value: "Member" }]} /></Card>
        <Card><h2 className="font-bold">Bank Account</h2><InfoGrid items={[{ label: "Primary Bank", value: memberDetail.bank }, { label: "Account Holder", value: member.name }]} /></Card>
        <Card><h2 className="font-bold">Nominee Information</h2><InfoGrid items={[{ label: "Nominee", value: memberDetail.nominee }, { label: "Phone", value: "+60 13-772 1844" }]} /></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="font-bold">Participation Summary</h2><InfoGrid items={[{ label: "Total Participation", value: member.participation }, { label: "Active Campaigns", value: String(member.activeCampaigns) }]} /></Card>
        <Card><h2 className="font-bold">Distribution Summary</h2><InfoGrid items={[{ label: "Total Distribution", value: member.distribution }, { label: "Pending", value: "RM1,240" }]} /></Card>
      </section>

      <Card>
        <h2 className="font-bold">Participation History</h2>
        <TableWrap><thead><tr><Th>Listing</Th><Th>Date</Th><Th>Amount</Th><Th>Status</Th></tr></thead><tbody>{participationHistory.map((record) => <tr key={record.listing} className="border-t border-slate-100"><Td>{record.listing}</Td><Td>{record.date}</Td><Td>{record.amount}</Td><Td><Badge>{record.status}</Badge></Td></tr>)}</tbody></TableWrap>
      </Card>

      <Card>
        <h2 className="font-bold">Distribution History</h2>
        <TableWrap><thead><tr><Th>Listing</Th><Th>Distribution Amount</Th><Th>Status</Th><Th>Paid Date</Th><Th>Reference No</Th></tr></thead><tbody>{distributionHistory.map((record) => <tr key={record.ref} className="border-t border-slate-100"><Td>{record.listing}</Td><Td>{record.amount}</Td><Td><Badge>{record.status}</Badge></Td><Td>{record.paid}</Td><Td>{record.ref}</Td></tr>)}</tbody></TableWrap>
      </Card>
    </div>
  );
}
