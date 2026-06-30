const { PrismaClient } = require('@prisma/client')
const { randomBytes, scrypt } = require('crypto')
const { promisify } = require('util')

const prisma = new PrismaClient()
const scryptAsync = promisify(scrypt)

const ADMIN_EMAIL = 'admin@example.local'
const MEMBER_EMAIL = 'member@example.local'
const DEFAULT_PASSWORD = 'PapaipayDemo123!'
const ADMIN_REF = 'ADM-000001'
const MEMBER_REF = 'MEM-000001'

async function hashPassword(password) {
  const salt = randomBytes(16).toString('base64url')
  const derivedKey = await scryptAsync(password, salt, 64)
  return `scrypt$${salt}$${derivedKey.toString('base64url')}`
}

function assertSafeToRun() {
  if (process.env.ALLOW_AUTH_DEMO_USERS !== 'true') {
    throw new Error('Refusing to update auth demo users. Set ALLOW_AUTH_DEMO_USERS=true to run this manual helper.')
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to update auth demo users when NODE_ENV=production.')
  }
}

async function createOrUpdateAdminProfile(userId, roleId) {
  const existing = await prisma.adminProfile.findUnique({ where: { userId } })
  if (existing) {
    return prisma.adminProfile.update({
      where: { userId },
      data: { displayName: 'Operations Admin', roleId, status: 'Active', activatedAt: existing.activatedAt || new Date() },
    })
  }

  const refOwner = await prisma.adminProfile.findUnique({ where: { adminRef: ADMIN_REF } })
  return prisma.adminProfile.create({
    data: {
      userId,
      adminRef: refOwner ? null : ADMIN_REF,
      displayName: 'Operations Admin',
      roleId,
      status: 'Active',
      activatedAt: new Date(),
    },
  })
}

async function createOrUpdateMemberProfile(userId) {
  const existingByUser = await prisma.member.findUnique({ where: { userId } })
  if (existingByUser) {
    return prisma.member.update({
      where: { userId },
      data: { fullName: 'Sample Member', verificationStatus: 'Approved', profileCompletedAt: existingByUser.profileCompletedAt || new Date() },
    })
  }

  const existingByRef = await prisma.member.findUnique({ where: { memberRef: MEMBER_REF } })
  if (existingByRef) {
    return prisma.member.update({
      where: { memberRef: MEMBER_REF },
      data: { userId, fullName: 'Sample Member', verificationStatus: 'Approved', profileCompletedAt: existingByRef.profileCompletedAt || new Date() },
    })
  }

  return prisma.member.create({
    data: {
      userId,
      memberRef: MEMBER_REF,
      fullName: 'Sample Member',
      nationality: 'Malaysian',
      verificationStatus: 'Approved',
      profileCompletedAt: new Date(),
    },
  })
}

async function main() {
  assertSafeToRun()

  const password = process.env.AUTH_DEMO_PASSWORD || DEFAULT_PASSWORD
  const passwordHash = await hashPassword(password)

  const role = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: { description: 'Full platform governance' },
    create: { name: 'Super Admin', description: 'Full platform governance' },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { status: 'Active', passwordHash, authProvider: 'auth-demo-users' },
    create: { email: ADMIN_EMAIL, status: 'Active', authProvider: 'auth-demo-users', passwordHash },
  })
  const adminProfile = await createOrUpdateAdminProfile(adminUser.id, role.id)

  const memberUser = await prisma.user.upsert({
    where: { email: MEMBER_EMAIL },
    update: { status: 'Active', passwordHash, authProvider: 'auth-demo-users', phone: '+60120000001' },
    create: { email: MEMBER_EMAIL, phone: '+60120000001', status: 'Active', authProvider: 'auth-demo-users', passwordHash },
  })
  const memberProfile = await createOrUpdateMemberProfile(memberUser.id)

  console.log('Auth demo users updated successfully.')
  console.log(`Admin: ${ADMIN_EMAIL} (${adminProfile.adminRef || 'no adminRef'})`)
  console.log(`Member: ${MEMBER_EMAIL} (${memberProfile.memberRef})`)
  console.log(`Password: ${process.env.AUTH_DEMO_PASSWORD ? 'AUTH_DEMO_PASSWORD override was used' : DEFAULT_PASSWORD}`)
  console.log('No campaign, listing, payment, distribution, Prisma schema, or migration changes were performed by this helper.')
}

main()
  .catch((error) => {
    console.error(error.message || error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
