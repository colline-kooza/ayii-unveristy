"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roleCards = [
  {
    role: "ADMIN",
    title: "Admin Dashboard",
    description: "Manage users, courses, and system settings",
    icon: Users,
    route: "/dashboard/admin/overview",
    color: "bg-purple-500",
    gradient: "from-purple-500 to-purple-700",
    features: ["User Management", "Course Administration", "System Analytics", "Content Management"]
  },
  {
    role: "LECTURER",
    title: "Lecturer Dashboard",
    description: "Manage courses, assignments, and student progress",
    icon: GraduationCap,
    route: "/dashboard/lecturer",
    color: "bg-orange-500",
    gradient: "from-orange-500 to-red-600",
    features: ["Course Management", "Assignment Creation", "Grade Submissions", "Live Classes"]
  },
  {
    role: "STUDENT",
    title: "Student Dashboard",
    description: "Access courses, submit assignments, and track progress",
    icon: BookOpen,
    route: "/dashboard/student",
    color: "bg-green-500",
    gradient: "from-green-500 to-emerald-600",
    features: ["Course Enrollment", "Assignment Submission", "Progress Tracking", "Live Classes"]
  }
];

export default function AllRolesDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading dashboards...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/sign-in");
    return null;
  }

  const userRole = (session.user as any)?.role;

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50/30 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">
          Access all available dashboards based on your role
          {userRole && (
            <Badge className="ml-3" variant="secondary">
              Current Role: {userRole}
            </Badge>
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roleCards.map((card) => {
          const Icon = card.icon;
          const isCurrentRole = userRole === card.role;
          
          return (
            <Card 
              key={card.role}
              className={cn(
                "relative overflow-hidden border-2 transition-all hover:shadow-xl",
                isCurrentRole 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 opacity-10 -mr-8 -mt-8 rounded-full bg-gradient-to-br",
                card.gradient
              )} />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    card.color,
                    "bg-opacity-10"
                  )}>
                    <Icon className={cn("h-6 w-6", card.color.replace('bg-', 'text-'))} />
                  </div>
                  {isCurrentRole && (
                    <Badge className="bg-primary text-white">
                      Your Role
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative">
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                    Key Features
                  </p>
                  <ul className="space-y-1.5">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", card.color)} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => router.push(card.route)}
                  className={cn(
                    "w-full group",
                    isCurrentRole && "bg-primary hover:bg-primary/90"
                  )}
                  variant={isCurrentRole ? "default" : "outline"}
                >
                  {isCurrentRole ? "Go to Dashboard" : "View Dashboard"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-black mb-1">Quick Navigation</h3>
            <p className="text-sm text-gray-600 mb-3">
              Each dashboard is tailored to your specific role and provides access to relevant features and tools.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard/library")}
              >
                Library
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard/messages")}
              >
                Messages
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard/notifications")}
              >
                Notifications
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard/settings")}
              >
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push("/dashboard/profile")}
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
