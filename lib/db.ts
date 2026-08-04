import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __kassetPrismaClient?: PrismaClient;
};

export const db =
  globalForPrisma.__kassetPrismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__kassetPrismaClient = db;
}
