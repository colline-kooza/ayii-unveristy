import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const dynamic = "force-dynamic";

export default async function DLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const user = session.user as any;

  return (
    <DashboardLayout user={user}>
      {children}
    </DashboardLayout>
  );
}
