"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Building2,
  School,
  User,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";

type AuthUser = typeof auth.$Infer.Session.user;

interface UnifiedHeaderProps {
  user: AuthUser;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "ADMIN":
      return Building2;
    case "LECTURER":
      return GraduationCap;
    case "STUDENT":
      return School;
    default:
      return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "from-primary via-primary to-primary/100";
    case "LECTURER":
      return "from-primary via-orange-500 to-primary";
    case "STUDENT":
      return "from-primary via-pink-500 to-primary";
    default:
      return "from-primary to-primary";
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-gradient-to-r from-primary to-primary/100 shadow-lg shadow-primary/25";
    case "LECTURER":
      return "bg-gradient-to-r from-primary to-primary shadow-lg shadow-primary/25";
    case "STUDENT":
      return "bg-gradient-to-r from-primary to-pink-600 shadow-lg shadow-primary/25";
    default:
      return "bg-gradient-to-r from-primary to-primary shadow-lg shadow-primary/25";
  }
};

export function UnifiedHeader({
  user,
}: UnifiedHeaderProps) {
  const RoleIcon = getRoleIcon(user.role);
  const roleColorClass = getRoleColor(user.role);
  const roleBadgeColor = getRoleBadgeColor(user.role);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-16 p-2 rounded-xl border-2 border-red-100/60 backdrop-blur-sm bg-gradient-to-br from-white via-red-50/30 to-white transition-all duration-300 group shadow shadow-primary/15"
        >
          <motion.div
            className="flex items-center gap-3 w-full"
            transition={{ duration: 0.2 }}
          >
            {/* School Logo */}
            <div className="relative">
              <Avatar className="h-11 w-11 ring-3 ring-white shadow-xl shadow-primary/25 border-2 border-red-100/50">
                <AvatarImage
                  className="object-cover"
                  src="/images/lecify-1.png"
                />
              </Avatar>

              {/* Role Icon Overlay */}
              <motion.div
                className={`absolute -bottom-1 -right-1 bg-gradient-to-br ${roleColorClass} text-white rounded-full p-1.5 shadow-lg shadow-primary/40 border-2 border-white`}
              >
                <RoleIcon className="h-3.5 w-3.5" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 text-left min-w-0">
              {/* School Name */}
              <div className="flex items-center gap-2 mb-1">
                <span className="truncate font-bold bg-gradient-to-r from-primary via-red-700 to-orange-700 bg-clip-text text-transparent text-sm">
                  AYii University
                </span>
                <Badge
                  className={`${roleBadgeColor} text-white border-0 text-xs px-2.5 py-1 font-semibold shadow-md`}
                >
                  {user.role}
                </Badge>
              </div>

              {/* User Info */}
              <div className="flex items-center justify-between">
                <span className="truncate text-xs text-red-700 font-semibold flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  {user.name}
                </span>
              </div>
            </div>
          </motion.div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
