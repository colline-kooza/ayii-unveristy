"use client";

import { useParams } from "next/navigation";
import CourseDetailPage from "@/app/dashboard/student/courses/[courseId]/page";

// Lecturers use the same course detail page as students
// The page automatically shows management controls based on user role
export default CourseDetailPage;
