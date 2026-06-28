import { notFound } from "next/navigation";
import { PendingLink } from "@/components/common/PendingLink";
import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminProjectWorkspaceBySlug } from "@/lib/admin/data/listings";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

const projectProgressByStatus = {
  "Asset Secured": 10,
  "Preparing Asset": 25,
  "Seeking Buyer": 40,
  "Buyer Found": 60,
  "Legal Completion": 80,
  Distribution: 95,
  Completed: 100,
} as const;

const projectStatuses = Object.keys(projectProgressByStatus) as (keyof typeof projectProgressByStatus)[];

type ProjectWorkspace = NonNullable<Awaited<ReturnType<typeof getAdminProjectWorkspaceBySlug>>>;

function deriveFundingStatus(status: string, progress: number) {
  if (["Sold", "DistributionProcessing", "Distributed"].includes(status)) return "Completed";
  if (["Funded", "Holding"].includes(status) || progress >= 100) return "Closed";
  return "Open";
}

function deriveProjectStatus(status: string): keyof typeof projectProgressByStatus {
  if (status === "Distributed") return "Completed";
  if (status === "DistributionProcessing") return "Distribution";
  if (status === "Sold") return "Legal Completion";
  if (status === "Holding") return "Seeking Buyer";
  if (status === "Funded") return "Preparing Asset";
  return "Asset Secured";
}

function completedDatePlaceholder(projectStatus: string) {
  return projectStatus === "Completed" ? "Completed date not recorded" : "Not completed yet";
}

function SectionHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-papaipay-ink">{title}</h2>
      {children ? <p className="mt-1 text-sm leading-6 text-slate-500">{children}</p> : null}
    </div>
  );
}

export default async function ProjectWorkspacePage({ params }: { params: { slug: string } }) {
  const project = await getAdminProjectWorkspaceBySlug(params.slug);

  if (!project) notFound();

  const target = decimalToNumber(project.campaignTarget);
  const collected = decimalToNumber(project.collectedAmountSnapshot);
  const fundingProgress = target > 0 ? (collected / target) * 100 : 0;
  const fundingStatus = deriveFundingStatus(String(project.lifecycleStatus), fundingProgress);
  const projectStatus = deriveProjectStatus(String(project.lifecycleStatus));
  const projectProgress = projectProgressByStatus[projectStatus];
  const property = project.propertyDetail;
  const latestSettlement = project.settlements[0];
  const participantCount = project._count.participations;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Listing Management" />
      <PageHeader
        eyebrow={`${project.campaignRef} • ${project.campaignCode}`}
        title="Project Workspace"
        description={project.title}
        action={
          <div className="flex flex-wrap gap-2">
            <PendingLink className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600" href={`/admin/listings/${project.slug}`} pendingLabel="Opening...">
              View Listing
            </PendingLink>
            <PendingLink className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white" href={`/admin/listings/${project.slug}/edit`} pendingLabel="Loading Workspace...">
              Edit Listing
            </PendingLink>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <SectionHeading title="Status Summary" />
          <InfoGrid items={[
            { label: "Publication Status", value: formatEnumLabel(String(project.publishStatus)) },
            { label: "Funding Status", value: fundingStatus },
            { label: "Project Status", value: projectStatus },
          ]} />
        </Card>
        <Card>
          <SectionHeading title="Funding Progress">{formatCurrency(collected)} collected of {formatCurrency(target)}</SectionHeading>
          <p className="mb-3 text-3xl font-semibold tracking-[-0.04em] text-papaipay-ink">{Math.round(fundingProgress)}%</p>
          <ProgressBar value={fundingProgress} />
        </Card>
        <Card>
          <SectionHeading title="Project Progress">Placeholder progress from the current lifecycle mapping.</SectionHeading>
          <p className="mb-3 text-3xl font-semibold tracking-[-0.04em] text-papaipay-ink">{projectProgress}%</p>
          <ProgressBar value={projectProgress} />
        </Card>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Overview", "Project Progress", "Participants", "Financials", "Distributions", "Activity Log"].map((tab) => (
          <span key={tab} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{tab}</span>
        ))}
      </div>

      <Card>
        <SectionHeading title="Overview" />
        <InfoGrid items={[
          { label: "Campaign ID", value: project.campaignRef },
          { label: "Campaign Code", value: project.campaignCode },
          { label: "Asset / Location", value: [property?.propertyType, property?.location || property?.state].filter(Boolean).join(" • ") || "To be confirmed" },
          { label: "Publication Status", value: formatEnumLabel(String(project.publishStatus)) },
          { label: "Funding Status", value: fundingStatus },
          { label: "Current Project Status", value: projectStatus },
          { label: "Funding Progress", value: `${Math.round(fundingProgress)}%` },
          { label: "Project Progress", value: `${projectProgress}%` },
          { label: "Campaign Target", value: formatCurrency(target) },
          { label: "Collected Amount", value: formatCurrency(collected) },
          { label: "Participant Count", value: String(participantCount) },
          { label: "Open Date", value: formatDate(project.campaignOpenDate) },
          { label: "Close Date", value: formatDate(project.campaignCloseDate) },
          { label: "Published Date", value: project.publishedAt ? formatDate(project.publishedAt) : "Not published" },
          { label: "Completed Date", value: completedDatePlaceholder(projectStatus) },
        ]} />
      </Card>

      <Card>
        <SectionHeading title="Project Progress">Project progress management will be available in the next phase.</SectionHeading>
        <div className="grid gap-3 md:grid-cols-7">
          {projectStatuses.map((status) => (
            <div key={status} className={`rounded-xl border p-3 ${status === projectStatus ? "border-emerald-200 bg-emerald-50/70" : "border-slate-100 bg-slate-50/70"}`}>
              <p className="text-xs font-bold text-papaipay-ink">{status}</p>
              <p className="mt-2 text-sm font-semibold text-papaipay-green">{projectProgressByStatus[status]}%</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title="Participants">Future filters, export and participant detail actions will be added in a later phase.</SectionHeading>
        <p className="mb-4 text-sm font-bold text-slate-600">Participant count: {participantCount}</p>
        {project.participations.length > 0 ? (
          <TableWrap><thead><tr><Th>Participation ID</Th><Th>Member ID</Th><Th>Member Name</Th><Th>Email</Th><Th>Amount</Th><Th>Status</Th><Th>Date</Th></tr></thead><tbody>{project.participations.map((p) => <tr key={p.id} className="border-t border-slate-100"><Td>{p.participationRef}</Td><Td>{p.member.memberRef}</Td><Td>{p.member.fullName}</Td><Td>{p.member.user.email}</Td><Td>{formatCurrency(decimalToNumber(p.participationAmount))}</Td><Td><Badge>{formatEnumLabel(String(p.participationStatus))}</Badge></Td><Td>{formatDate(p.createdAt)}</Td></tr>)}</tbody></TableWrap>
        ) : <p className="text-sm text-slate-500">No participants recorded yet.</p>}
      </Card>

      <Card>
        <SectionHeading title="Financials">Financial operations and project costs will be managed in a later phase.</SectionHeading>
        <InfoGrid items={[
          { label: "Campaign Target", value: formatCurrency(target) },
          { label: "Collected Amount", value: formatCurrency(collected) },
          { label: "Funding Progress", value: `${Math.round(fundingProgress)}%` },
          { label: "Settlement Status", value: latestSettlement ? formatEnumLabel(String(latestSettlement.calculationStatus)) : "No settlement recorded" },
          { label: "Final Distribution Pool", value: latestSettlement ? formatCurrency(decimalToNumber(latestSettlement.finalDistributionPool)) : "Not available" },
          { label: "Calculation Remarks", value: latestSettlement?.calculationRemarks || "No settlement summary available" },
        ]} />
      </Card>

      <Card>
        <SectionHeading title="Distributions">Distribution processing will be available in a later phase.</SectionHeading>
        {project.distributions.length > 0 ? (
          <TableWrap><thead><tr><Th>Distribution ID</Th><Th>Member</Th><Th>Amount</Th><Th>Status</Th><Th>Payment Date</Th></tr></thead><tbody>{project.distributions.map((d) => <tr key={d.id} className="border-t border-slate-100"><Td>{d.distributionRef}</Td><Td>{d.member.fullName}</Td><Td>{formatCurrency(decimalToNumber(d.finalDistributionTotal))}</Td><Td><Badge>{formatEnumLabel(String(d.status))}</Badge></Td><Td>{d.paymentDate ? formatDate(d.paymentDate) : "Pending"}</Td></tr>)}</tbody></TableWrap>
        ) : <p className="text-sm text-slate-500">No distribution records are available yet.</p>}
      </Card>

      <Card>
        <SectionHeading title="Activity Log">Activity updates and visibility controls will be available in a later phase.</SectionHeading>
        {project.updates.length > 0 ? (
          <div className="space-y-3">{project.updates.map((update) => <div key={update.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="font-bold text-papaipay-ink">{update.title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{update.body}</p><p className="mt-2 text-xs font-semibold text-slate-400">{formatDate(update.publishedAt || update.createdAt)}</p></div>)}</div>
        ) : <p className="text-sm text-slate-500">No project activity has been recorded yet.</p>}
      </Card>
    </div>
  );
}
