import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink, Badge, Card, InfoGrid, PageHeader, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { reviewManualKycAction } from "@/lib/admin/actions/manualKyc";
import { getAdminMemberById } from "@/lib/admin/data/members";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getAdminMemberById(id);
  if (!member) notFound();

  const latestKyc = member.manualKycSubmissions[0];
  const primaryAddress = member.addresses.find((address) => address.isPrimary) || member.addresses[0];
  const primaryBank = member.bankAccounts.find((bank) => bank.isPrimary) || member.bankAccounts[0];
  const totalParticipation = member.participations.filter((record) => String(record.participationStatus) === "Confirmed").reduce((sum, record) => sum + decimalToNumber(record.participationAmount), 0);
  const totalDistribution = member.distributions.reduce((sum, record) => sum + decimalToNumber(record.finalDistributionTotal), 0);
  const address = primaryAddress ? [primaryAddress.addressLine1, primaryAddress.addressLine2, primaryAddress.postcode, primaryAddress.city, primaryAddress.state].filter(Boolean).join(", ") : "Not provided";
  const kycPending = latestKyc && ["Submitted", "UnderReview"].includes(String(latestKyc.status));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/members" label="Back to Members" />
      <PageHeader eyebrow={member.memberRef} title={member.fullName} description="Member profile, manual verification, payments and participation history." />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Summary label="Verification" value={formatEnumLabel(String(latestKyc?.status || member.verificationStatus))} />
        <Summary label="Confirmed Participation" value={formatCurrency(totalParticipation)} />
        <Summary label="Paid Distributions" value={formatCurrency(totalDistribution)} />
        <Summary label="Last Login" value={member.user.lastLoginAt ? formatDate(member.user.lastLoginAt) : "Never"} />
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card><h2 className="font-bold">Profile Information</h2><InfoGrid items={[{ label: "Email", value: member.user.email }, { label: "Phone", value: member.user.phone || member.contacts[0]?.phone || "Not provided" }, { label: "Nationality", value: member.nationality || "Not provided" }, { label: "Address", value: address }]} /></Card>
        <Card><h2 className="font-bold">Bank & Nominee</h2><InfoGrid items={[{ label: "Bank", value: primaryBank?.bankName || "Not provided" }, { label: "Account", value: primaryBank?.accountNumberLast4 ? `•••• ${primaryBank.accountNumberLast4}` : "Not provided" }, { label: "Bank Verification", value: primaryBank ? formatEnumLabel(String(primaryBank.verificationStatus)) : "Not started" }, { label: "Nominee", value: member.nominees[0]?.fullName || "Not provided" }]} /></Card>
      </section>

      <Card>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-bold">Manual Identity Verification</h2><p className="mt-1 text-sm leading-6 text-slate-500">Review both IC sides before approving. Files are private and access is logged through the authenticated portal.</p></div>
          <Badge>{formatEnumLabel(String(latestKyc?.status || member.verificationStatus))}</Badge>
        </div>
        {latestKyc ? (
          <div className="mt-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {latestKyc.documents.map((document) => (
                <Link key={document.id} href={`/files/${document.fileAsset.id}`} target="_blank" className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-kasset-green/40">
                  <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">{formatEnumLabel(String(document.documentType))}</span>
                  <span className="mt-2 block truncate text-sm font-bold text-kasset-green">{document.fileAsset.originalFilename} ↗</span>
                  <span className="mt-1 block text-xs text-slate-500">{formatEnumLabel(String(document.documentStatus))}</span>
                </Link>
              ))}
            </div>
            {latestKyc.rejectionReason ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Previous review note: {latestKyc.rejectionReason}</p> : null}
            {kycPending ? (
              <form action={reviewManualKycAction} className="mt-5 grid gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
                <input type="hidden" name="memberId" value={member.id} />
                <input type="hidden" name="submissionId" value={latestKyc.id} />
                <label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Reason if resubmission is required</span><input name="reason" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-kasset-green" placeholder="Explain what needs to be clearer" /></label>
                <button name="decision" value="ResubmissionRequired" className="min-h-11 rounded-xl border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700">Request Resubmission</button>
                <button name="decision" value="Approved" className="min-h-11 rounded-xl bg-kasset-green px-4 text-sm font-bold text-white">Approve Verification</button>
              </form>
            ) : null}
          </div>
        ) : <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No manual KYC submission yet.</p>}
      </Card>

      <Card>
        <h2 className="font-bold">Participation & Payment Receipts</h2>
        <TableWrap>
          <thead><tr><Th>Opportunity</Th><Th>Amount</Th><Th>Status</Th><Th>Payment</Th><Th>Receipt</Th><Th>Date</Th></tr></thead>
          <tbody>{member.participations.map((record) => {
            const payment = record.payments[0];
            return <tr key={record.id} className="border-t border-slate-100 align-top"><Td><Link href={`/admin/projects/${record.campaign.slug}`} className="font-bold text-kasset-green">{record.campaign.title}</Link><span className="block text-xs text-slate-400">{record.participationRef}</span></Td><Td>{formatCurrency(decimalToNumber(record.participationAmount))}</Td><Td><Badge>{formatEnumLabel(String(record.participationStatus))}</Badge></Td><Td><Badge>{formatEnumLabel(String(payment?.status || "Not available"))}</Badge>{payment?.submittedReference ? <span className="mt-1 block text-xs text-slate-500">Ref: {payment.submittedReference}</span> : null}</Td><Td>{payment?.receiptFileAsset ? <Link href={`/files/${payment.receiptFileAsset.id}`} target="_blank" className="font-bold text-kasset-green">View receipt ↗</Link> : <span className="text-slate-400">Not submitted</span>}</Td><Td>{formatDate(record.createdAt)}</Td></tr>;
          })}</tbody>
        </TableWrap>
      </Card>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 min-w-0 break-words text-xl font-semibold tracking-tight text-kasset-ink">{value}</p></article>;
}
