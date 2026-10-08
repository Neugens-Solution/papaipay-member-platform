import { MemberShell } from "@/components/member/MemberShell";
import { requireMember } from "@/lib/auth/guards";
import { countUnreadMemberNotifications } from "@/lib/data/notifications";
import { getApplicationStatus } from "@/lib/member/applicationStatus";
import { redirect } from "next/navigation";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const { user, member } = await requireMember();
  if (await getApplicationStatus(member.id, member.verificationStatus) !== "Approved") redirect("/application");
  const unreadNotifications = await countUnreadMemberNotifications(member.id);
  return <MemberShell identity={{ name: member.fullName, email: user.email }} unreadNotifications={unreadNotifications}>{children}</MemberShell>;
}
