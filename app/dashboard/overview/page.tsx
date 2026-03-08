"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      const role = (session.user as AuthUser).role;
      
      // Route to role-specific detailed page
      switch (role) {
        case "ADMIN":
          router.push("/dashboard/admin/overview");
          break;
        case "LECTURER":
          router.push("/dashboard/lecturer");
          break;
        case "STUDENT":
          router.push("/dashboard/student");
          break;
        default:
          router.push("/auth/sign-in");
      }
    } else if (!isPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}
