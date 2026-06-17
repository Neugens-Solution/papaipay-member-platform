import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Profile & KYC"
      title="Profile & KYC"
      description="Review mock member profile and KYC status information without authentication or uploads."
      items={memberSections.profileKyc}
    />
  );
}
