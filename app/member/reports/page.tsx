import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Reports"
      title="Reports"
      description="Browse mock member report records and availability statuses."
      items={memberSections.reports}
    />
  );
}
