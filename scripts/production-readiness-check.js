#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const failures = [];

function rel(filePath) {
  return path.join(root, filePath);
}

function read(filePath) {
  return fs.readFileSync(rel(filePath), "utf8");
}

function exists(filePath) {
  return fs.existsSync(rel(filePath));
}

function pass(message) {
  console.log(`✓ ${message}`);
}

function check(message, predicate) {
  if (predicate) {
    pass(message);
  } else {
    failures.push(message);
    console.error(`✗ ${message}`);
  }
}

function routeExists(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  const appDir = rel("app");
  const candidates = [path.join(appDir, ...segments, "page.tsx")];

  if (segments.length > 0) {
    candidates.push(path.join(appDir, "(auth)", ...segments, "page.tsx"));
  }

  return candidates.some((candidate) => fs.existsSync(candidate));
}

function routeMissing(routePath) {
  const segments = routePath.split("/").filter(Boolean);
  const appDir = rel("app");
  const exact = path.join(appDir, ...segments, "page.tsx");
  const auth = path.join(appDir, "(auth)", ...segments, "page.tsx");

  return !fs.existsSync(exact) && !fs.existsSync(auth);
}

function includesAll(content, needles) {
  return needles.every((needle) => content.includes(needle));
}

check("/member/login route exists", routeExists("/member/login"));
check("/member/signup route exists", routeExists("/member/signup"));
check("/admin/login route exists", routeExists("/admin/login"));
check("/admin/signup route does not exist", routeMissing("/admin/signup"));

check("app/member/layout.tsx uses requireMember()", /requireMember\s*\(\s*\)/.test(read("app/member/layout.tsx")));
check("app/admin/layout.tsx uses requireAdmin()", /requireAdmin\s*\(\s*\)/.test(read("app/admin/layout.tsx")));

const session = read("lib/auth/session.ts");
check(
  "lib/auth/session.ts accepts AUTH_SESSION_SECRET or NEXTAUTH_SECRET",
  session.includes("process.env.AUTH_SESSION_SECRET") && session.includes("process.env.NEXTAUTH_SECRET"),
);
check(
  "lib/auth/session.ts fails closed in production when no session secret is configured",
  session.includes('process.env.NODE_ENV === "production"') && /throw new Error\([^)]*AUTH_SESSION_SECRET[^)]*NEXTAUTH_SECRET[^)]*\)/s.test(session),
);

const envExample = read(".env.example");
check(
  ".env.example includes required production variables",
  includesAll(envExample, ["DATABASE_URL", "DIRECT_DATABASE_URL", "BLOB_READ_WRITE_TOKEN", "AUTH_SESSION_SECRET", "NEXTAUTH_SECRET"]),
);

check(".github/workflows/ci.yml exists", exists(".github/workflows/ci.yml"));
const ci = exists(".github/workflows/ci.yml") ? read(".github/workflows/ci.yml") : "";
check("CI installs dependencies with npm ci", ci.includes("npm ci"));
check("CI runs lint", ci.includes("npm run lint"));
check("CI runs npm test", ci.includes("npm test"));
check("CI validates Prisma schema", ci.includes("npx prisma validate"));
check("CI pushes schema to local CI Postgres", ci.includes("npx prisma db push --skip-generate"));
check("CI builds application", ci.includes("npm run build"));
check("CI defines local Postgres service", ci.includes("postgres:") && ci.includes("POSTGRES_DB: papaipay_ci"));

const memberParticipations = read("lib/data/memberParticipations.ts");
check(
  "member data access contains member ownership checks",
  memberParticipations.includes("where: { memberId }") &&
    memberParticipations.includes("where: { id, memberId: member.id }") &&
    memberParticipations.includes("payments: { where: { memberId: member.id }"),
);

const memberCampaigns = read("lib/data/memberCampaigns.ts");
check(
  "member document access filters member-visible documents",
  memberCampaigns.includes("visibility: Visibility.MemberVisible") &&
    memberCampaigns.includes("documentStatus: { in: [...MEMBER_DOCUMENT_STATUSES] }") &&
    memberCampaigns.includes("document.visibility !== Visibility.MemberVisible"),
);
check(
  "member document access filters accessible file visibility",
  memberCampaigns.includes("MEMBER_ACCESSIBLE_FILE_VISIBILITIES") &&
    memberCampaigns.includes("fileAsset: { is: { visibility: { in: [...MEMBER_ACCESSIBLE_FILE_VISIBILITIES] } } }") &&
    memberCampaigns.includes("canMemberAccessFileAsset"),
);

if (failures.length > 0) {
  console.error(`\nProduction readiness check failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nProduction readiness check passed.");
