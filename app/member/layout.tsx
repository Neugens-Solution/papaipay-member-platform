import { MemberShell } from "@/components/member/MemberShell";
import { requireMember } from "@/lib/auth/guards";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const { user, member } = await requireMember();
  return <MemberShell identity={{ name: member.fullName, email: user.email }}>{children}</MemberShell>;
}
