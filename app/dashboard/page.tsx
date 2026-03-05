import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session.user as any;

  // Role-based redirects
  if (user.role === "ADMIN") {
    redirect("/dashboard/admin/overview");
  }

  if (user.role === "LECTURER") {
    redirect("/dashboard/lecturer/my-courses");
  }

  if (user.role === "STUDENT") {
    redirect("/dashboard/student/courses");
  }

  // Default fallback
  redirect("/auth/sign-in");
}
