import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Announcements"
      title="Announcements"
      description="Read member-facing announcements published for portal review."
      items={memberSections.announcements}
    />
  );
}
