import { UserRole, UserStatus } from "../lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  extraFields?: Record<string, unknown>;
}) {
  // Use Better Auth's API so password is hashed correctly
  await auth.api.signUpEmail({
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      isTemporaryPassword: true,
      status: UserStatus.ACTIVE,
      ...(data.extraFields as any),
    },
  });

  // Update role, status, and any extra fields
  return prisma.user.update({
    where: { email: data.email },
    data: {
      emailVerified: true,
      role: data.role,
      isTemporaryPassword: false,
      status: UserStatus.ACTIVE,
      ...data.extraFields,
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Seed Logic
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear DB (respect FK order)
  console.log("🗑️  Clearing existing data...");
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ All existing data cleared.");

  // ─── Admin ─────────────────────────────
  const admin = await createUser({
    email: "admin@ayii.edu",
    password: "Admin@2025",
    name: "System Administrator",
    role: UserRole.ADMIN,
  });
  console.log("✅ Admin created:", admin.email);

  // ─── Lecturer ──────────────────────────
  const lecturer = await createUser({
    email: "lecturer@ayii.edu",
    password: "Lecturer@2025",
    name: "Dr. John Kamau",
    role: UserRole.LECTURER,
    extraFields: {
      department: "Computer Science",
      employeeId: "LEC-2025-001",
    },
  });
  console.log("✅ Lecturer created:", lecturer.email);

  // ─── Student ───────────────────────────
  const student = await createUser({
    email: "student@ayii.edu",
    password: "Student@2025",
    name: "Jane Wanjiku",
    role: UserRole.STUDENT,
    extraFields: {
      registrationNumber: "2025/CS/001",
      department: "Computer Science",
      program: "Bachelor of Science in Computer Science",
    },
  });
  console.log("✅ Student created:", student.email);

  // ─── Verify accounts were created ──────
  const accountCount = await prisma.account.count();
  console.log(`\n📊 Total accounts in DB: ${accountCount} (expected 3)`);

  if (accountCount !== 3) {
    throw new Error(`Expected 3 accounts but found ${accountCount}. Something went wrong!`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin:    admin@ayii.edu    | Admin@2025");
  console.log("Lecturer: lecturer@ayii.edu | Lecturer@2025");
  console.log("Student:  student@ayii.edu  | Student@2025");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// ─────────────────────────────────────────────────────────────
// Execute
// ─────────────────────────────────────────────────────────────

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });