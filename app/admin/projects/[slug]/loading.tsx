import { Card, PageHeader } from "@/components/admin/AdminUI";

export default function ProjectWorkspaceLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Project Workspace" description="Loading project operations shell..." />
      <Card>
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      </Card>
    </div>
  );
}
