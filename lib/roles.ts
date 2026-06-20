import type { PlatformRole } from "@/types/role";

export type RolePlaceholder = {
  name: PlatformRole;
  description: string;
};

export const rolePlaceholders: RolePlaceholder[] = [
  {
    name: "Member",
    description: "Member-facing portal placeholder for future listings and participations.",
  },
  {
    name: "Admin",
    description: "Operational administration placeholder for future member and KYC workflows.",
  },
  {
    name: "Manager",
    description: "Management placeholder for future portfolio, project, and reporting views.",
  },
  {
    name: "Super Admin",
    description: "Governance placeholder for future roles, permissions, and global settings.",
  },
];
