import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Distributions"
      title="Distributions"
      description="Review mock paid and scheduled distributions associated with member activity."
      items={memberSections.distributions}
    />
  );
}
