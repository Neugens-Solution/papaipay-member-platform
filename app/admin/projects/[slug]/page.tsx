import { notFound } from "next/navigation";
import { PendingLink } from "@/components/common/PendingLink";
import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminProjectWorkspaceBySlug } from "@/lib/admin/data/listings";
import { createProjectUpdateAction, updateProjectStatusAction } from "@/lib/admin/project-progress/actions";
import { deriveLifecycleFallbackProjectStatus, isProjectProgressStatus, PROJECT_PROGRESS_BY_STATUS, PROJECT_PROGRESS_STATUSES, progressForProjectStatus, type ProjectProgressStatus } from "@/lib/admin/project-progress/statuses";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

type ProjectWorkspace = NonNullable<Awaited<ReturnType<typeof getAdminProjectWorkspaceBySlug>>>;

function deriveFundingStatus(status: string, progress: number) {
  if (["Sold", "DistributionProcessing", "Distributed"].includes(status)) return "Completed";
  if (["Funded", "Holding"].includes(status) || progress >= 100) return "Closed";
  return "Open";
}

function completedDatePlaceholder(projectStatus: string) {
  return projectStatus === "Completed" ? "Completed date not recorded" : "Not completed yet";
}


function deriveCurrentProjectStatus(project: ProjectWorkspace) {
  const latestStatusEvent = project.timelineEvents.find((event) => isProjectProgressStatus(event.title));
  if (latestStatusEvent) {
    const status = latestStatusEvent.title as ProjectProgressStatus;
    return { status, event: latestStatusEvent, source: "Timeline event" };
  }

  return {
    status: deriveLifecycleFallbackProjectStatus(String(project.lifecycleStatus)),
    event: null,
    source: "Lifecycle fallback",
  };
}

function visibilityLabel(visibility: string) {
  if (visibility === "MemberVisible") return "Public";
  if (visibility === "ParticipantsOnly") return "Participants Only";
  return "Internal";
}

function bodyPreview(body: string) {
  return body.length > 180 ? `${body.slice(0, 180)}…` : body;
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
  const currentProjectStatus = deriveCurrentProjectStatus(project);
  const projectStatus = currentProjectStatus.status;
  const projectProgress = progressForProjectStatus(projectStatus);
  const property = project.propertyDetail;
  const latestSettlement = project.settlements[0];
  const participantCount = project._count.participations;

  async function updateProjectStatusFormAction(formData: FormData): Promise<void> {
    "use server";

    await updateProjectStatusAction({}, formData);
  }

  async function createProjectUpdateFormAction(formData: FormData): Promise<void> {
    "use server";

    await createProjectUpdateAction({}, formData);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Listing Management" />
      <PageHeader
        eyebrow={`${project.campaignRef} • ${project.campaignCode}`}
        title="Project Workspace"
        description="Project operations workspace for admin-side project progress, participant management placeholders, financials placeholders and distributions placeholders."
        action={
          <PendingLink className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600" href={`/admin/listings/${project.slug}`} pendingLabel="Opening...">
            View Listing Details
          </PendingLink>
        }
      />
      <p className="text-sm font-semibold text-slate-600">Listing: {project.title}</p>

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
          <SectionHeading title="Project Progress">Operational progress derived from the latest recognized project timeline status.</SectionHeading>
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
        <SectionHeading title="Project Progress">Manage admin-only operational project progress. This is separate from funding progress and does not change listing lifecycle status.</SectionHeading>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-papaipay-green">Current Project Status</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-papaipay-ink">{projectStatus}</p>
            <p className="mt-2 text-sm text-slate-600">Project progress: <span className="font-bold text-papaipay-green">{projectProgress}%</span></p>
            <div className="mt-4"><ProgressBar value={projectProgress} /></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Last status update: {currentProjectStatus.event?.eventDate ? formatDate(currentProjectStatus.event.eventDate) : currentProjectStatus.event ? formatDate(currentProjectStatus.event.createdAt) : "No timeline status recorded"}</p>
            <p className="mt-2 text-xs font-semibold text-slate-500">Source: {currentProjectStatus.source}. Operational progress is not funding progress.</p>
          </div>

          <form action={updateProjectStatusFormAction} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <input type="hidden" name="campaignId" value={project.id} />
            <p className="font-bold text-papaipay-ink">Change Project Status</p>
            <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={projectStatus} className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-papaipay-green">
              {PROJECT_PROGRESS_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="note">Optional note</label>
            <textarea id="note" name="note" rows={4} placeholder="Add operational context for the internal project timeline." className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-papaipay-green" />
            <button className="mt-4 rounded-lg bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-papaipay-ink" type="submit">Update Project Status</button>
          </form>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-7">
          {PROJECT_PROGRESS_STATUSES.map((status) => (
            <div key={status} className={`rounded-xl border p-3 ${status === projectStatus ? "border-emerald-200 bg-emerald-50/70" : "border-slate-100 bg-white"}`}>
              <p className="text-xs font-bold text-papaipay-ink">{status}</p>
              <p className="mt-2 text-sm font-semibold text-papaipay-green">{PROJECT_PROGRESS_BY_STATUS[status]}%</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <SectionHeading title="Project Timeline">Status events are shown newest first. Status changes created here are Internal visibility for now.</SectionHeading>
          {project.timelineEvents.length > 0 ? (
            <div className="space-y-3">{project.timelineEvents.map((event) => <div key={event.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p className="font-bold text-papaipay-ink">{event.title}</p><Badge>{visibilityLabel(String(event.visibility))}</Badge></div>{event.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p> : null}<p className="mt-2 text-xs font-semibold text-slate-400">{formatDate(event.eventDate || event.createdAt)}</p></div>)}</div>
          ) : <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">No timeline events have been recorded yet.</p>}
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
        <SectionHeading title="Project Updates">Create admin-side operational communications. These are stored now but are not displayed in the member portal in this sprint.</SectionHeading>
        <form action={createProjectUpdateFormAction} className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <input type="hidden" name="campaignId" value={project.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="updateTitle">Title</label>
              <input id="updateTitle" name="title" className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-papaipay-green" placeholder="e.g. Buyer due diligence update" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="visibility">Visibility</label>
              <select id="visibility" name="visibility" defaultValue="InternalOnly" className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-papaipay-green">
                <option value="MemberVisible">Public</option>
                <option value="ParticipantsOnly">Participants Only</option>
                <option value="InternalOnly">Internal</option>
              </select>
            </div>
          </div>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-400" htmlFor="body">Body</label>
          <textarea id="body" name="body" rows={5} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-papaipay-green" placeholder="Write a concise project update." />
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-papaipay-green" type="submit" name="publishMode" value="draft">Save Draft</button>
            <button className="rounded-lg bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-papaipay-ink" type="submit" name="publishMode" value="publish">Publish</button>
          </div>
        </form>
        {project.updates.length > 0 ? (
          <div className="space-y-3">{project.updates.map((update) => <div key={update.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p className="font-bold text-papaipay-ink">{update.title}</p><div className="flex gap-2"><Badge>{visibilityLabel(String(update.visibility))}</Badge><Badge>{update.publishedAt ? "Published" : "Draft"}</Badge></div></div><p className="mt-2 text-sm leading-6 text-slate-600">{bodyPreview(update.body)}</p><p className="mt-2 text-xs font-semibold text-slate-400">{update.publishedAt ? `Published ${formatDate(update.publishedAt)}` : `Created ${formatDate(update.createdAt)}`}</p></div>)}</div>
        ) : <p className="text-sm text-slate-500">No project updates have been recorded yet.</p>}
      </Card>
    </div>
  );
}
