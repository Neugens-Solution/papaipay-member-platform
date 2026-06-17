import { MemberSectionPage } from "@/components/member/MemberSectionPage";
import { memberSections } from "@/lib/memberMockData";

export default function Page() {
  return (
    <MemberSectionPage
      eyebrow="Notifications"
      title="Notifications"
      description="View mock member notifications for listing, profile, and property events."
      items={memberSections.notifications}
    />
  );
}
