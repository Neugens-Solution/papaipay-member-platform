type PrismaClientConstructor = new () => unknown

declare global {
  // eslint-disable-next-line no-var
  var __papaipayPrismaClient: unknown | undefined
}

function createPrismaClient() {
  // Loaded dynamically so this helper remains inactive until future backend phases import it.
  const { PrismaClient } = require('@prisma/client') as { PrismaClient: PrismaClientConstructor }
  return new PrismaClient()
}

export const db = globalThis.__papaipayPrismaClient ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__papaipayPrismaClient = db
}
