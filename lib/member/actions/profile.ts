"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/guards";
import { encryptSensitiveValue } from "@/lib/security/encryption";

export type MemberProfileFormState = { error?: string; success?: string };

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optionalEmail(value: string) {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Enter a valid nominee email address.");
  return value || null;
}

export async function updateMemberProfileAction(
  _state: MemberProfileFormState,
  formData: FormData,
): Promise<MemberProfileFormState> {
  const { user, member } = await requireMember();

  try {
    const fullName = text(formData, "fullName");
    const phone = text(formData, "phone");
    const nationality = text(formData, "nationality");
    const dateOfBirthValue = text(formData, "dateOfBirth");
    const addressLine1 = text(formData, "addressLine1");
    const addressLine2 = text(formData, "addressLine2");
    const city = text(formData, "city");
    const state = text(formData, "state");
    const postcode = text(formData, "postcode");
    const country = text(formData, "country") || "Malaysia";
    const bankName = text(formData, "bankName");
    const accountHolderName = text(formData, "accountHolderName");
    const accountNumber = text(formData, "accountNumber").replace(/[\s-]/g, "");
    const nomineeName = text(formData, "nomineeName");
    const nomineeRelationship = text(formData, "nomineeRelationship");
    const nomineePhone = text(formData, "nomineePhone");
    const nomineeEmail = text(formData, "nomineeEmail");

    if (fullName.length < 2 || fullName.length > 150) throw new Error("Full name must be between 2 and 150 characters.");
    if (phone && !/^[+\d][\d\s()-]{6,24}$/.test(phone)) throw new Error("Enter a valid phone number.");

    let dateOfBirth: Date | null = null;
    if (dateOfBirthValue) {
      dateOfBirth = new Date(`${dateOfBirthValue}T00:00:00.000Z`);
      if (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > new Date()) throw new Error("Enter a valid date of birth.");
    }

    const hasAddress = Boolean(addressLine1 || city || state || postcode);
    if (hasAddress && (!addressLine1 || !city || !state || !postcode)) throw new Error("Complete address line 1, city, state and postcode.");

    const hasBank = Boolean(bankName || accountHolderName || accountNumber);
    if (hasBank && (!bankName || !accountHolderName)) throw new Error("Complete the bank name and account holder name.");
    if (accountNumber && !/^\d{5,24}$/.test(accountNumber)) throw new Error("Bank account number must contain 5 to 24 digits.");

    const hasNominee = Boolean(nomineeName || nomineeRelationship || nomineePhone || nomineeEmail);
    if (hasNominee && (!nomineeName || !nomineeRelationship)) throw new Error("Complete the nominee name and relationship.");
    optionalEmail(nomineeEmail);

    const current = await db.member.findUnique({
      where: { id: member.id },
      select: {
        contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1, select: { id: true } },
        addresses: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1, select: { id: true } },
        bankAccounts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1, select: { id: true } },
        nominees: { orderBy: { createdAt: "asc" }, take: 1, select: { id: true } },
      },
    });
    if (!current) throw new Error("Member profile was not found.");

    await db.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { phone: phone || null } });
      await tx.member.update({
        where: { id: member.id },
        data: {
          fullName,
          nationality: nationality || null,
          dateOfBirth,
          profileCompletedAt: phone && nationality && dateOfBirth && hasAddress ? new Date() : null,
        },
      });

      const contactData = { email: user.email, phone: phone || null, isPrimary: true };
      if (current.contacts[0]) await tx.memberContact.update({ where: { id: current.contacts[0].id }, data: contactData });
      else await tx.memberContact.create({ data: { memberId: member.id, ...contactData } });

      if (hasAddress) {
        const addressData = { addressLine1, addressLine2: addressLine2 || null, city, state, postcode, country, isPrimary: true };
        if (current.addresses[0]) await tx.memberAddress.update({ where: { id: current.addresses[0].id }, data: addressData });
        else await tx.memberAddress.create({ data: { memberId: member.id, ...addressData } });
      }

      if (hasBank) {
        const commonBankData = { bankName, accountHolderName, isPrimary: true };
        if (current.bankAccounts[0]) {
          await tx.memberBankAccount.update({
            where: { id: current.bankAccounts[0].id },
            data: accountNumber ? {
              ...commonBankData,
              accountNumberEncrypted: encryptSensitiveValue(accountNumber),
              accountNumberLast4: accountNumber.slice(-4),
              verificationStatus: "Pending",
              verifiedById: null,
              verifiedAt: null,
              rejectedReason: null,
            } : commonBankData,
          });
        } else {
          if (!accountNumber) throw new Error("Bank account number is required for a new bank account.");
          await tx.memberBankAccount.create({ data: { memberId: member.id, ...commonBankData, accountNumberEncrypted: encryptSensitiveValue(accountNumber), accountNumberLast4: accountNumber.slice(-4) } });
        }
      }

      if (hasNominee) {
        const nomineeData = { fullName: nomineeName, relationship: nomineeRelationship, phone: nomineePhone || null, email: optionalEmail(nomineeEmail) };
        if (current.nominees[0]) await tx.memberNominee.update({ where: { id: current.nominees[0].id }, data: nomineeData });
        else await tx.memberNominee.create({ data: { memberId: member.id, ...nomineeData } });
      }

      await tx.auditLog.create({
        data: {
          auditRef: makeRef("AUD"), actorId: user.id, action: "MemberProfileUpdated", entityType: "Member", entityId: member.id,
          afterSnapshot: { memberRef: member.memberRef, fieldsUpdated: ["personalInformation", hasAddress && "address", hasBank && "bankAccount", hasNominee && "nominee"].filter(Boolean) },
        },
      });
    });

    revalidatePath("/member/profile");
    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${member.id}`);
    return { success: "Profile updated successfully." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update your profile." };
  }
}
