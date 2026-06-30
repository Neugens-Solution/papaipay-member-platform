import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const HASH_PREFIX = "scrypt";
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES).toString("base64url");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${HASH_PREFIX}$${salt}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(passwordHash: string | null | undefined, password: string) {
  if (!passwordHash) return false;

  const [algorithm, salt, storedHash] = passwordHash.split("$");
  if (algorithm !== HASH_PREFIX || !salt || !storedHash) {
    // argon2/native legacy hashes are intentionally not verified in the Vercel runtime.
    // Re-run prisma/seed.js or update passwordHash values to the scrypt$<salt>$<hash> format.
    return false;
  }

  try {
    const storedBuffer = Buffer.from(storedHash, "base64url");
    const derivedKey = (await scryptAsync(password, salt, storedBuffer.length)) as Buffer;

    if (storedBuffer.length !== derivedKey.length) return false;
    return timingSafeEqual(storedBuffer, derivedKey);
  } catch {
    return false;
  }
}
