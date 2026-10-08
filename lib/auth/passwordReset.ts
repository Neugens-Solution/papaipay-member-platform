import "server-only";

import { createHash, randomBytes } from "crypto";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function requestMemberPasswordReset(emailInput: string) {
  const email = emailInput.trim().toLowerCase();
  if (!emailPattern.test(email)) return;
  const user = await db.user.findUnique({ where: { email }, select: { id: true, member: { select: { id: true } }, status: true } });
  if (!user?.member || user.status !== "Active") return;

  const existing = await db.passwordReset.findUnique({ where: { userId: user.id } });
  if (existing && Date.now() - existing.requestedAt.getTime() < 60_000) return;

  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.APP_URL;
  if (!key || !from || !appUrl || !/^https:\/\/[^/]+$/.test(appUrl)) {
    console.error("Password reset email unavailable: server email configuration incomplete");
    return;
  }

  const token = randomBytes(32).toString("base64url");
  const url = `${appUrl}/member/reset-password?token=${token}`;
  const reset = await db.passwordReset.upsert({
    where: { userId: user.id },
    create: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 60_000) },
    update: { tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 30 * 60_000), requestedAt: new Date() },
  });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `member-reset-${user.id}-${reset.tokenHash.slice(0,20)}` },
      body: JSON.stringify({
        from, to: [email], subject: "Reset your K Asset Ventures member password",
        html: `<div style="max-width:560px;margin:auto;font-family:Arial,sans-serif;color:#172235;padding:24px"><img src="${appUrl}/kav-favicon.png" alt="K Asset Ventures logo" width="56" height="56"><h1>Reset your password</h1><p>We received a request to reset your Member Portal password. This link expires in 30 minutes.</p><p><a href="${url}" style="display:inline-block;background:#172235;color:#fff;padding:14px 20px;text-decoration:none">Reset password</a></p><p>If you did not request this, you can ignore this email. Your password has not changed.</p><p>Link: <a href="${url}">${url}</a></p></div>`,
        text: `Reset your K Asset Ventures Member Portal password: ${url}\n\nThis link expires in 30 minutes. If you did not request this, ignore this email.`,
      }),
    });
    if (!response.ok) {
      await db.passwordReset.deleteMany({ where: { userId: user.id, tokenHash: reset.tokenHash } });
      console.error("Password reset email rejected", { status: response.status });
    }
  } catch {
    await db.passwordReset.deleteMany({ where: { userId: user.id, tokenHash: reset.tokenHash } });
    console.error("Password reset email request failed");
  }
}

export async function completeMemberPasswordReset(token: string, password: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const tokenHash = hashToken(token);
  const reset = await db.passwordReset.findUnique({ where: { tokenHash }, include: { user: { select: { status: true, member: { select: { id: true } } } } } });
  if (!reset || reset.expiresAt.getTime() < Date.now() || reset.user.status !== "Active" || !reset.user.member) return false;
  const passwordHash = await hashPassword(password);
  return db.$transaction(async (tx) => {
    const consumed = await tx.passwordReset.deleteMany({ where: { userId: reset.userId, tokenHash, expiresAt: { gt: new Date() } } });
    if (consumed.count !== 1) return false;
    await tx.user.update({ where: { id: reset.userId }, data: { passwordHash } });
    return true;
  });
}
