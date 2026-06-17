import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Active Projects"
      title="Active Projects"
      description="Follow mock active project milestones, status summaries, and upcoming distribution context."
      items={memberSections.activeProjects}
    />
  );
}
