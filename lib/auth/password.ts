import "server-only";

import argon2 from "argon2";

export async function verifyPassword(passwordHash: string | null | undefined, password: string) {
  if (!passwordHash) return false;
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}
