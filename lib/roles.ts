import type { PlatformRole } from "@/types/role";

export type RoleArea = {
  name: PlatformRole;
  description: string;
};

export const roleAreas: RoleArea[] = [
  {
    name: "Member",
    description: "Member-facing portal area for future listings and participations.",
  },
  {
    name: "Admin",
    description: "Operational administration area for future member and KYC workflows.",
  },
  {
    name: "Manager",
    description: "Management area for future portfolio, campaign lifecycle and reporting views.",
  },
  {
    name: "Super Admin",
    description: "Governance area for future roles, permissions, and global settings.",
  },
];
