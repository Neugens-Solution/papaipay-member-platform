import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Completed Properties"
      title="Completed Properties"
      description="Review historical auction property summaries and archived distribution records."
      items={memberSections.completedProperties}
    />
  );
}
