"use client";

export type WorkspaceStepStatus =
  | "Saved"
  | "Unsaved"
  | "Not Started"
  | "Error"
  | "Saving";

export function workspaceStatusClasses(status: WorkspaceStepStatus) {
  if (status === "Error") return "border-red-200 bg-red-50 text-red-700";
  if (status === "Saved")
    return "border-emerald-100 bg-emerald-50 text-papaipay-green";
  if (status === "Unsaved")
    return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "Saving")
    return "border-blue-100 bg-blue-50 text-blue-700 animate-pulse";
  return "border-slate-200 bg-slate-50 text-slate-500";
}

export function WorkspaceStatusBadge({
  status,
}: {
  status: WorkspaceStepStatus;
}) {
  return (
    <span
      className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-black ${workspaceStatusClasses(status)}`}
    >
      {status}
    </span>
  );
}
