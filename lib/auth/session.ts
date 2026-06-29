import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "papaipay_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  userId: string;
  accountType: "admin" | "member";
  exp: number;
};

function secret() {
  return process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "papaipay-local-dev-session-secret-change-me";
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionValue(input: { userId: string; accountType: "admin" | "member" }) {
  const payload: SessionPayload = {
    userId: input.userId,
    accountType: input.accountType,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readSessionValue(value?: string): SessionPayload | null {
  if (!value) return null;
  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.userId || !payload.accountType || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  return readSessionValue(cookies().get(SESSION_COOKIE_NAME)?.value);
}

export async function setSession(input: { userId: string; accountType: "admin" | "member" }) {
  cookies().set(SESSION_COOKIE_NAME, createSessionValue(input), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession() {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
