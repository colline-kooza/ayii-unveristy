import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import {
  UserRole,
  UserStatus,
  JournalStatus,
  LiveLectureStatus,
} from "@/lib/generated/prisma";

export async function GET() {
  const { error } = await requireAuth([UserRole.ADMIN]);
  if (error) return error;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalStudents,
    totalLecturers,
    totalCourses,
    totalEnrollments,
    pendingJournals,
    suspendedAccounts,
    activeLiveLectures,
    submissionsToday,
  ] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.STUDENT } }),
    prisma.user.count({ where: { role: UserRole.LECTURER } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.journal.count({ where: { status: JournalStatus.PENDING } }),
    prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
    prisma.liveLecture.count({ where: { status: LiveLectureStatus.LIVE } }),
    prisma.submission.count({ where: { submittedAt: { gte: today } } }),
  ]);

  return NextResponse.json({
    totalStudents,
    totalLecturers,
    totalCourses,
    totalEnrollments,
    pendingJournals,
    suspendedAccounts,
    activeLiveLectures,
    submissionsToday,
  });
}
