import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Participations"
      title="Portfolio"
      description="Review mock auction property participation records and statuses without backend workflow logic."
      items={memberSections.participations}
    />
  );
}
