import { notFound } from "next/navigation";
import { PendingLink } from "@/components/common/PendingLink";
import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { FinancialApprovalStatusCard } from "@/components/admin/project-workspace/FinancialApprovalStatusCard";
import { FinancialSummaryForm } from "@/components/admin/project-workspace/FinancialSummaryForm";
import { DistributionBatchActionsForm } from "@/components/admin/project-workspace/DistributionBatchActionsForm";
import { getAdminProjectWorkspaceBySlug } from "@/lib/admin/data/listings";
import { confirmManualPaymentAction } from "@/lib/admin/project-payments-actions";
import { createProjectUpdateAction, updateProjectStatusAction } from "@/lib/admin/project-progress/actions";
import { deriveLifecycleFallbackProjectStatus, isProjectProgressStatus, PROJECT_PROGRESS_BY_STATUS, PROJECT_PROGRESS_STATUSES, progressForProjectStatus, type ProjectProgressStatus } from "@/lib/admin/project-progress/statuses";
import { calculateDistributionPreview, type DistributionPreviewResult } from "@/lib/distributions/preview";
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

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (["confirmed", "approved", "succeeded", "paid", "completed"].some((value) => normalized.includes(value))) {
    return "border-emerald-200 bg-emerald-50 text-papaipay-green";
  }

  if (["pending", "processing", "review"].some((value) => normalized.includes(value))) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (["cancelled", "refunded", "failed", "rejected", "expired"].some((value) => normalized.includes(value))) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function StatusBadge({ status, fallback = "Not available" }: { status?: string | null; fallback?: string }) {
  const label = status ? formatEnumLabel(status) : fallback;

  return (
    <span className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${statusBadgeClass(label)}`}>
      {label}
    </span>
  );
}

function dateInputValue(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function decimalInputValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function nullableCurrency(value: unknown) {
  return value === null || value === undefined ? "Not available" : formatCurrency(decimalToNumber(value));
}

function moneyFromPreview(value?: string | null) {
  return value ? formatCurrency(Number(value)) : "Not available";
}

function reconciliationStatus(line: { difference: string }) {
  return Number(line.difference) === 0 ? "Reconciled" : "Difference";
}

function previewStatus(preview: DistributionPreviewResult) {
  if (preview.summary.blockerCount > 0) return "Blocked";
  if (preview.summary.warningCount > 0) return "Warning";
  return "Valid";
}

function previewStatusClass(status: string) {
  if (status === "Valid") return "border-emerald-200 bg-emerald-50 text-papaipay-green";
  if (status === "Warning") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function distributionFindingCopy(code: string, message: string) {
  const copy: Record<string, string> = {
    NO_SETTLEMENT_FOUND: "Financials must be completed before a distribution preview can be generated.",
    SETTLEMENT_DRAFT_NOT_ALLOWED: "This settlement is still Draft or Reviewed. Approve or lock the settlement before treating the preview as valid.",
    SETTLEMENT_NOT_APPROVED: "Settlement must be Approved or Locked before a valid distribution preview is available.",
    NO_ELIGIBLE_PARTICIPANTS: "No confirmed participants with succeeded payment coverage are eligible for preview.",
    COMPONENT_POOLS_DO_NOT_MATCH_FINAL_POOL: "Component pools must add up exactly to the Final Distribution Pool.",
    ALL_PARTICIPANTS_MISSING_PAYMENT_COVERAGE: "No participation has succeeded payment coverage.",
    SOME_PARTICIPANTS_EXCLUDED: "Some participants are excluded from this preview. Review the excluded participant table below.",
    SETTLEMENT_APPROVED_NOT_LOCKED: "Settlement is approved but not locked. Preview is available, but finance should verify final lock timing.",
    MISSING_OPTIONAL_REMARKS: "Settlement calculation remarks are missing. Add finance context for audit clarity.",
  };

  return copy[code] ?? message;
}

const activeDistributionBatchStatuses = new Set(["Draft", "Approved", "Processing", "Completed"]);

function CompletedBatchPaymentSummary({ batch }: { batch: ProjectWorkspace["distributionBatches"][number] }) {
  const paidRow = batch.distributions.find((row) => row.paymentDate || row.paymentReference || row.adminNotes);
  return (
    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold leading-6 text-papaipay-green">
      <p>Distribution batch completed. Manual payment has been recorded.</p>
      <div className="mt-2 grid gap-2 text-slate-700 md:grid-cols-3">
        <span>Paid count: {batch.paidCount ?? 0}</span>
        <span>Payment date: {paidRow?.paymentDate ? formatDate(paidRow.paymentDate) : "Not recorded"}</span>
        <span>Payment reference: {paidRow?.paymentReference || "Not recorded"}</span>
      </div>
      {paidRow?.adminNotes ? <p className="mt-2 text-slate-700">Admin notes: {paidRow.adminNotes}</p> : null}
    </div>
  );
}

function DistributionPreviewSection({ project, latestSettlement }: { project: ProjectWorkspace; latestSettlement: ProjectWorkspace["settlements"][number] | undefined }) {
  const activeBatch = project.distributionBatches.find((batch) => latestSettlement && batch.settlementId === latestSettlement.id && activeDistributionBatchStatuses.has(String(batch.status)));

  if (activeBatch) {
    return (
      <Card>
        <SectionHeading title="Distributions">Distribution batch has been saved for this settlement.</SectionHeading>
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm font-semibold leading-6 text-papaipay-ink">
          A distribution batch has already been saved. New preview generation is disabled to prevent duplicate distributions.
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
          <SectionHeading title={`${formatEnumLabel(String(activeBatch.status))} Batch Summary`}>This batch record is internal. Members only see paid distribution records after completion.</SectionHeading>
          <InfoGrid items={[
            { label: "Batch Ref", value: activeBatch.batchRef },
            { label: "Status", value: formatEnumLabel(String(activeBatch.status)) },
            { label: "Total Members", value: String(activeBatch.totalMembers ?? 0) },
            { label: "Total Final Distribution", value: nullableCurrency(activeBatch.totalFinalDistribution) },
            { label: "Pending Count", value: String(activeBatch.pendingCount ?? 0) },
            { label: "Processing Count", value: String(activeBatch.processingCount ?? 0) },
            { label: "Paid Count", value: String(activeBatch.paidCount ?? 0) },
            { label: "Created At", value: formatDate(activeBatch.createdAt) },
            { label: "Created By", value: activeBatch.createdBy?.email || "Not recorded" },
            { label: "Approved At", value: activeBatch.approvedAt ? formatDate(activeBatch.approvedAt) : "Not approved" },
            { label: "Approved By", value: activeBatch.approvedBy?.email || "Not approved" },
            { label: "Locked Status", value: activeBatch.lockedStatus ? "Locked" : "Unlocked" },
            { label: "Settlement Ref/ID", value: activeBatch.settlementId || latestSettlement?.id || "Not recorded" },
          ]} />
        </div>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <DistributionBatchActionsForm campaignId={project.id} settlementId={latestSettlement?.id} batchId={activeBatch.id} saveDisabled draftSaved approveDisabled={String(activeBatch.status) !== "Draft"} approved={String(activeBatch.status) === "Approved"} completed={String(activeBatch.status) === "Completed"} />
          {String(activeBatch.status) === "Draft" ? <p className="mt-3 text-sm leading-6 text-slate-600">Approve Distribution confirms these amounts for future processing. It does not execute payment transfers.</p> : null}
          {String(activeBatch.status) === "Approved" ? <p className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold leading-6 text-papaipay-green">Approved for manual payment recording. No payment transfer has been executed.</p> : null}
          {String(activeBatch.status) === "Completed" ? <CompletedBatchPaymentSummary batch={activeBatch} /> : null}
        </div>
      </Card>
    );
  }

  const preview = calculateDistributionPreview({
    campaign: { id: project.id, title: project.title, currency: "MYR" },
    settlement: latestSettlement ? {
      id: latestSettlement.id,
      campaignId: project.id,
      calculationStatus: String(latestSettlement.calculationStatus),
      settlementScenario: String(latestSettlement.settlementScenario),
      principalReturnPool: latestSettlement.principalReturnPool,
      holdingReturnPool: latestSettlement.holdingReturnPool,
      profitDistributionPool: latestSettlement.profitDistributionPool,
      finalDistributionPool: latestSettlement.finalDistributionPool,
      calculationRemarks: latestSettlement.calculationRemarks,
    } : null,
    participations: project.participations.map((participation) => ({
      id: participation.id,
      memberId: participation.memberId,
      participationAmount: participation.participationAmount,
      participationStatus: String(participation.participationStatus),
      confirmedAt: participation.confirmedAt,
      member: {
        id: participation.memberId,
        memberRef: participation.member.memberRef,
        fullName: participation.member.fullName,
        user: { email: participation.member.user.email },
      },
      payments: participation.payments.map((payment) => ({ amount: payment.amount, status: String(payment.status) })),
      distributions: participation.distributions.map((distribution) => ({ id: distribution.id, status: String(distribution.status) })),
    })),
    formulaProfile: "STANDARD_FINAL_DISTRIBUTION_V1",
  });
  const status = previewStatus(preview);
  const blockers = preview.findings.filter((finding) => finding.severity === "blocker");
  const warnings = preview.findings.filter((finding) => finding.severity === "warning");
  const succeededCoverageTotal = preview.rows.reduce((sum, row) => sum + Number(row.succeededPaymentAmount), 0) + preview.excludedRows.reduce((sum, row) => sum + Number(row.succeededPaymentAmount), 0);
  const excludedById = new Map(preview.excludedRows.map((row) => [row.participationId, row]));
  const reconciliationRows = [
    ["Principal Return", preview.reconciliation.principalReturn],
    ["Holding Return", preview.reconciliation.holdingReturn],
    ["Profit Distribution", preview.reconciliation.profitDistribution],
    ["Final Distribution", preview.reconciliation.finalDistributionTotal],
  ] as const;
  const isSettlementLocked = latestSettlement ? String(latestSettlement.calculationStatus) === "Locked" : false;
  const isReconciled = Object.values(preview.summary.reconciliationDifferences).every((difference) => Number(difference) === 0);
  const canSaveDraftBatch = isSettlementLocked && preview.summary.isPreviewValid && blockers.length === 0 && preview.rows.length > 0 && isReconciled && !activeBatch;

  return (
    <Card>
      <SectionHeading title="Distributions">Admin-only distribution preview and draft batch persistence powered by the existing preview engine.</SectionHeading>
      <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm font-semibold leading-6 text-papaipay-ink">
        Save Draft Batch creates internal draft distribution records only. It does not approve payments or execute transfers.
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-bold text-papaipay-ink">Settlement Readiness</p>
            <span className={`inline-flex rounded-md border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${previewStatusClass(status)}`}>Preview status: {status}</span>
          </div>
          <InfoGrid items={[
            { label: "Settlement Status", value: latestSettlement ? formatEnumLabel(String(latestSettlement.calculationStatus)) : "No settlement recorded" },
            { label: "Settlement Scenario", value: latestSettlement ? formatEnumLabel(String(latestSettlement.settlementScenario)) : "Not available" },
            { label: "Principal Return Pool", value: moneyFromPreview(preview.summary.sourcePools.principalReturnPool) },
            { label: "Holding Return Pool", value: moneyFromPreview(preview.summary.sourcePools.holdingReturnPool) },
            { label: "Member Profit Distribution Pool", value: moneyFromPreview(preview.summary.sourcePools.profitDistributionPool) },
            { label: "Final Distribution Pool", value: moneyFromPreview(preview.summary.sourcePools.finalDistributionPool) },
            { label: "Distribution Calculation Date", value: latestSettlement?.distributionCalculationDate ? formatDate(latestSettlement.distributionCalculationDate) : "Not recorded" },
            { label: "Formula Profile", value: preview.summary.formulaProfile },
            { label: "Persistence", value: preview.summary.isPersistable ? "Persistable" : "Read-only / not persistable" },
          ]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {[
            ["Eligible Participants", String(preview.summary.eligibleParticipantCount)],
            ["Excluded Participants", String(preview.summary.excludedParticipantCount)],
            ["Total Eligible Participation Amount", moneyFromPreview(preview.summary.totalEligibleParticipationAmount)],
            ["Succeeded Payment Coverage Total", formatCurrency(succeededCoverageTotal)],
          ].map(([label, value]) => <div key={label} className="rounded-2xl border border-emerald-100 bg-white p-4"><p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-papaipay-ink">{value}</p></div>)}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {blockers.map((finding) => <p key={finding.code} className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700">Blocker: {distributionFindingCopy(finding.code, finding.message)}</p>)}
        {warnings.map((finding) => <p key={finding.code} className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm font-semibold text-amber-700">Warning: {distributionFindingCopy(finding.code, finding.message)}</p>)}
      </div>

      {preview.rows.length > 0 ? <div className="mt-6"><SectionHeading title="Distribution Preview Table" /><TableWrap><thead><tr><Th>Participation Ref</Th><Th>Member</Th><Th>Email</Th><Th>Participation Amount</Th><Th>Succeeded Payment Amount</Th><Th>Share %</Th><Th>Principal Return</Th><Th>Holding Return</Th><Th>Profit Distribution</Th><Th>Final Distribution Total</Th></tr></thead><tbody>{preview.rows.map((row) => { const participation = project.participations.find((item) => item.id === row.participationId); return <tr key={row.participationId} className="border-t border-slate-100"><Td>{participation?.participationRef || row.participationId.slice(0, 8)}</Td><Td><span className="font-bold text-papaipay-ink">{row.name || row.memberRef || row.memberId}</span><span className="block text-xs font-semibold text-slate-400">{row.memberRef}</span></Td><Td>{row.email || "Not available"}</Td><Td>{moneyFromPreview(row.participationAmount)}</Td><Td>{moneyFromPreview(row.succeededPaymentAmount)}</Td><Td>{row.memberSharePercent}</Td><Td>{moneyFromPreview(row.principalReturn)}</Td><Td>{moneyFromPreview(row.holdingReturn)}</Td><Td>{moneyFromPreview(row.profitDistribution)}</Td><Td>{moneyFromPreview(row.finalDistributionTotal)}</Td></tr>; })}</tbody></TableWrap></div> : null}

      {preview.excludedRows.length > 0 ? <div className="mt-6"><SectionHeading title="Excluded Participants" /><TableWrap><thead><tr><Th>Member</Th><Th>Participation Amount</Th><Th>Succeeded Payment Amount</Th><Th>Reason</Th></tr></thead><tbody>{project.participations.filter((p) => excludedById.has(p.id)).map((participation) => { const row = excludedById.get(participation.id)!; return <tr key={participation.id} className="border-t border-slate-100"><Td><span className="font-bold text-papaipay-ink">{participation.member.fullName || participation.member.memberRef}</span><span className="block text-xs font-semibold text-slate-400">{participation.member.user.email}</span></Td><Td>{row.participationAmount ? moneyFromPreview(row.participationAmount) : "Invalid amount"}</Td><Td>{moneyFromPreview(row.succeededPaymentAmount)}</Td><Td>{row.reasonMessage}</Td></tr>; })}</tbody></TableWrap></div> : null}

      <div className="mt-6">
        <SectionHeading title="Reconciliation Summary" />
        <TableWrap><thead><tr><Th>Pool</Th><Th>Source Pool</Th><Th>Allocated</Th><Th>Difference</Th><Th>Status</Th></tr></thead><tbody>{reconciliationRows.map(([label, line]) => <tr key={label} className="border-t border-slate-100"><Td>{label}</Td><Td>{moneyFromPreview(line.source)}</Td><Td>{moneyFromPreview(line.allocated)}</Td><Td>{moneyFromPreview(line.difference)}</Td><Td><StatusBadge status={reconciliationStatus(line)} /></Td></tr>)}</tbody></TableWrap>
      </div>


      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
        <DistributionBatchActionsForm campaignId={project.id} settlementId={latestSettlement?.id} saveDisabled={!canSaveDraftBatch} draftSaved={Boolean(activeBatch)} approveDisabled approved={false} />
        <p className="mt-3 text-sm leading-6 text-slate-600">Save Draft Batch creates internal draft distribution records only. It does not approve payments or execute transfers. Approve Distribution is available after a draft batch is saved. After approval, admin can record completed manual payment and mark the batch paid.</p>
        {!canSaveDraftBatch && !activeBatch ? <p className="mt-2 text-sm font-semibold text-slate-500">Save Draft Batch is available only when the latest settlement is locked, the preview is valid and reconciled, eligible rows exist, and no active batch already exists.</p> : null}
      </div>
    </Card>
  );
}

function SectionHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold text-papaipay-ink">{title}</h2>
      {children ? <p className="mt-1 text-sm leading-6 text-slate-500">{children}</p> : null}
    </div>
  );
}


function ProjectWorkspaceUnavailable() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Listing Management" />
      <Card>
        <SectionHeading title="Project Workspace Unavailable">
          The operational project workspace could not load live database data. Fallback sample data is disabled for this admin operations view so participant and payment state cannot be mistaken for real records.
        </SectionHeading>
        <p className="text-sm leading-6 text-slate-600">Please verify database connectivity and try again.</p>
      </Card>
    </div>
  );
}

export default async function ProjectWorkspacePage({ params }: { params: { slug: string } }) {
  let project: ProjectWorkspace | null = null;

  try {
    project = await getAdminProjectWorkspaceBySlug(params.slug);
  } catch (error) {
    console.error("Project workspace unavailable", error);
    return <ProjectWorkspaceUnavailable />;
  }

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
  const totalParticipationAmount = project.participations.reduce((sum, participation) => sum + decimalToNumber(participation.participationAmount), 0);
  const confirmedParticipationCount = project.participations.filter((participation) => ["Confirmed", "Approved"].includes(String(participation.participationStatus))).length;
  const pendingParticipationCount = project.participations.filter((participation) => ["PendingPayment", "Pending", "Processing"].includes(String(participation.participationStatus))).length;

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
        description="Project operations workspace for admin-side progress, participant management, financial review, and distribution workflows."
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
        <SectionHeading title="Participants">Admin-only participant operations. Manual confirmation records received payment only; it does not create a payment transfer or distribution.</SectionHeading>
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">Total Participants</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-papaipay-ink">{participantCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">Total Participation Amount</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-papaipay-ink">{formatCurrency(totalParticipationAmount)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">Confirmed / Approved</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-papaipay-green">{confirmedParticipationCount}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">Pending / Processing</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-amber-700">{pendingParticipationCount}</p>
          </div>
        </div>
        {project.participations.length > 0 ? (
          <TableWrap>
            <thead><tr><Th>Participation Ref</Th><Th>Member</Th><Th>Email</Th><Th>Amount</Th><Th>Date</Th><Th>Participation Status</Th><Th>Payment Status</Th><Th>Distribution Status</Th><Th>Manual Confirmation</Th><Th>Last Updated</Th></tr></thead>
            <tbody>{project.participations.map((p) => {
              const latestPayment = p.payments[0];
              const latestDistribution = p.distributions[0];

              return (
                <tr key={p.id} className="border-t border-slate-100">
                  <Td>{p.participationRef || p.id.slice(0, 8)}</Td>
                  <Td><span className="font-bold text-papaipay-ink">{p.member.fullName || p.member.memberRef}</span><span className="block text-xs font-semibold text-slate-400">{p.member.memberRef}</span></Td>
                  <Td>{p.member.user.email}</Td>
                  <Td>{formatCurrency(decimalToNumber(p.participationAmount))}</Td>
                  <Td>{formatDate(p.createdAt)}</Td>
                  <Td><StatusBadge status={String(p.participationStatus)} /></Td>
                  <Td><StatusBadge status={latestPayment ? String(latestPayment.status) : null} /></Td>
                  <Td><StatusBadge status={latestDistribution ? String(latestDistribution.status) : null} /></Td>
                  <Td>{String(p.participationStatus) === "PendingPayment" && latestPayment ? (
                    <details className="min-w-64 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                      <summary className="cursor-pointer text-sm font-bold text-amber-700">Confirm Payment</summary>
                      <form action={confirmManualPaymentAction} className="mt-3 space-y-3">
                        <input type="hidden" name="campaignId" value={project.id} />
                        <input type="hidden" name="projectSlug" value={project.slug} />
                        <input type="hidden" name="participationId" value={p.id} />
                        <p className="text-xs leading-5 text-slate-600">Manual confirmation records that payment has been received. This does not create a payment transfer or distribution.</p>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Payment amount<input name="paymentAmount" defaultValue={decimalInputValue(p.participationAmount)} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-papaipay-green" /></label>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Payment reference<input name="paymentReference" required placeholder="Bank/reference number" className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-papaipay-green" /></label>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Payment date<input name="paymentDate" required type="date" defaultValue={dateInputValue(new Date())} className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-papaipay-green" /></label>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Notes<textarea name="notes" rows={2} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-papaipay-green" /></label>
                        <button className="w-full rounded-lg bg-papaipay-green px-3 py-2 text-sm font-bold text-white hover:bg-papaipay-ink" type="submit">Confirm manual payment</button>
                      </form>
                    </details>
                  ) : <span className="text-xs font-semibold text-slate-400">No action</span>}</Td>
                  <Td>{formatDate(p.updatedAt)}</Td>
                </tr>
              );
            })}</tbody>
          </TableWrap>
        ) : <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">No participants have joined this project yet.</p>}
        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm leading-6 text-slate-600">Participant detail, filtering, export, and distribution review will be added in later phases.</p>
      </Card>

      <Card>
        <SectionHeading title="Financials">Admin-only summary editing for project financial inputs. This does not calculate member distribution payments or execute distributions.</SectionHeading>
        <InfoGrid items={[
          { label: "Campaign Target", value: formatCurrency(target) },
          { label: "Collected Amount", value: formatCurrency(collected) },
          { label: "Funding Progress", value: `${Math.round(fundingProgress)}%` },
          { label: "Settlement Status", value: latestSettlement ? formatEnumLabel(String(latestSettlement.calculationStatus)) : "No settlement recorded" },
          { label: "Acquisition Price", value: nullableCurrency(latestSettlement?.purchasePrice) },
          { label: "Sale Price / Disposal Price", value: nullableCurrency(latestSettlement?.salePrice) },
          { label: "Total Approved Costs", value: nullableCurrency(latestSettlement?.totalCostsSnapshot) },
          { label: "Gross Return", value: nullableCurrency(latestSettlement?.grossProfitSnapshot) },
          { label: "Net Return", value: nullableCurrency(latestSettlement?.netProfitSnapshot) },
          { label: "Member Return Share", value: latestSettlement?.memberProfitDistributionPercentage ? `${decimalToNumber(latestSettlement.memberProfitDistributionPercentage)}%` : "Not available" },
          { label: "Platform Return Share", value: latestSettlement?.platformProfitSharePercentage ? `${decimalToNumber(latestSettlement.platformProfitSharePercentage)}%` : "Not available" },
          { label: "Platform Share Amount", value: nullableCurrency(latestSettlement?.platformShare) },
          { label: "Principal Return Pool", value: nullableCurrency(latestSettlement?.principalReturnPool) },
          { label: "Holding Return Pool", value: nullableCurrency(latestSettlement?.holdingReturnPool) },
          { label: "Member Profit Distribution Pool", value: nullableCurrency(latestSettlement?.profitDistributionPool) },
          { label: "Final Distribution Pool", value: nullableCurrency(latestSettlement?.finalDistributionPool) },
          { label: "Sale Completed Date", value: latestSettlement?.saleCompletedAt ? formatDate(latestSettlement.saleCompletedAt) : "Not recorded" },
          { label: "Distribution Calculation Date", value: latestSettlement?.distributionCalculationDate ? formatDate(latestSettlement.distributionCalculationDate) : "Not recorded" },
          { label: "Calculation Remarks", value: latestSettlement?.calculationRemarks || "No settlement summary available" },
        ]} />
        <FinancialApprovalStatusCard campaignId={project.id} settlement={latestSettlement} />
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm leading-6 text-slate-600">
          This is a summary-level financial record. Itemized project costs may be added in later phases.
        </div>
        <FinancialSummaryForm
          campaignId={project.id}
          mode={latestSettlement ? "update" : "create"}
          calculationStatus={latestSettlement ? String(latestSettlement.calculationStatus) : null}
          initialValues={{
            purchasePrice: decimalInputValue(latestSettlement?.purchasePrice),
            salePrice: decimalInputValue(latestSettlement?.salePrice),
            totalCostsSnapshot: decimalInputValue(latestSettlement?.totalCostsSnapshot),
            grossProfitSnapshot: decimalInputValue(latestSettlement?.grossProfitSnapshot),
            netProfitSnapshot: decimalInputValue(latestSettlement?.netProfitSnapshot),
            memberProfitDistributionPercentage: decimalInputValue(latestSettlement?.memberProfitDistributionPercentage),
            platformProfitSharePercentage: decimalInputValue(latestSettlement?.platformProfitSharePercentage),
            platformShare: decimalInputValue(latestSettlement?.platformShare),
            principalReturnPool: decimalInputValue(latestSettlement?.principalReturnPool),
            holdingReturnPool: decimalInputValue(latestSettlement?.holdingReturnPool),
            profitDistributionPool: decimalInputValue(latestSettlement?.profitDistributionPool),
            finalDistributionPool: decimalInputValue(latestSettlement?.finalDistributionPool),
            saleCompletedAt: dateInputValue(latestSettlement?.saleCompletedAt),
            distributionCalculationDate: dateInputValue(latestSettlement?.distributionCalculationDate),
            calculationRemarks: latestSettlement?.calculationRemarks ?? "",
          }}
        />
      </Card>

      <DistributionPreviewSection project={project} latestSettlement={latestSettlement} />

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
