import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Active Properties"
      title="Active Properties"
      description="Follow auction property milestones, status summaries, and upcoming distribution context."
      items={memberSections.activeProperties}
    />
  );
}
