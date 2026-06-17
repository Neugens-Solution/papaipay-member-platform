import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Settings"
      title="Settings"
      description="Review mock member preferences without persistence or platform settings APIs."
      items={memberSections.settings}
    />
  );
}
