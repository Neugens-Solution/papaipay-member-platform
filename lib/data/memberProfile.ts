import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/guards";

export async function getMemberProfile() {
  const { user, member } = await requireMember();
  const profile = await db.member.findUnique({
    where: { id: member.id },
    select: {
      id: true,
      memberRef: true,
      fullName: true,
      dateOfBirth: true,
      nationality: true,
      verificationStatus: true,
      createdAt: true,
      contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1 },
      addresses: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1 },
      bankAccounts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1 },
      nominees: { orderBy: { createdAt: "asc" }, take: 1 },
      manualKycSubmissions: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { documents: { include: { fileAsset: true }, orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!profile) throw new Error("Member profile was not found.");
  return { user: { email: user.email, phone: user.phone, lastLoginAt: user.lastLoginAt }, profile };
}
