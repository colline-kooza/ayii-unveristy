"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Bell,
  User,
  Library,
  GraduationCap,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileBottomNavProps {
  role: string;
  unreadNotifications?: number;
  unreadMessages?: number;
}

export function MobileBottomNav({ role, unreadNotifications = 0, unreadMessages = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();

  const getNavItems = () => {
    const baseItems: Array<{ icon: any; label: string; href: string; badge?: number }> = [
      {
        icon: LayoutDashboard,
        label: "Home",
        href: "/dashboard",
      },
    ];

    if (role === "ADMIN") {
      return [
        ...baseItems,
        { icon: Users, label: "Users", href: "/dashboard/admin/users/students" },
        { icon: BookOpen, label: "Courses", href: "/dashboard/admin/courses" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: unreadMessages },
        { icon: Bell, label: "Alerts", href: "/dashboard/notifications", badge: unreadNotifications },
      ];
    }

    if (role === "LECTURER") {
      return [
        ...baseItems,
        { icon: BookOpen, label: "Courses", href: "/dashboard/lecturer/my-courses" },
        { icon: Library, label: "Library", href: "/dashboard/library" },
        { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: unreadMessages },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
      ];
    }

    // STUDENT
    return [
      ...baseItems,
      { icon: BookOpen, label: "Courses", href: "/dashboard/student/courses" },
      { icon: Library, label: "Library", href: "/dashboard/library" },
      { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: unreadMessages },
      { icon: Bell, label: "Alerts", href: "/dashboard/notifications", badge: unreadNotifications },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full group"
            >
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 group-hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 text-xs bg-red-500 border-2 border-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
