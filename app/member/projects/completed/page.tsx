import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Completed Projects"
      title="Completed Projects"
      description="Review mock historical project outcomes and archived distribution summaries."
      items={memberSections.completedProjects}
    />
  );
}
