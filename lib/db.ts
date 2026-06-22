import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __papaipayPrismaClient?: PrismaClient;
};

export const db =
  globalForPrisma.__papaipayPrismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__papaipayPrismaClient = db;
}
