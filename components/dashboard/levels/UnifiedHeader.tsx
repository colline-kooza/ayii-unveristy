"use client";

import * as React from "react";
import { motion } from "framer-motion";
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

/* ---------------- ROLE CONFIG ---------------- */

const roleConfig = {
  ADMIN: {
    icon: Building2,
    gradient: "from-primary via-primary to-primary/90",
    badge: "from-primary to-primary",
  },
  LECTURER: {
    icon: GraduationCap,
    gradient: "from-primary via-orange-500 to-primary",
    badge: "from-primary to-orange-500",
  },
  STUDENT: {
    icon: School,
    gradient: "from-primary via-pink-500 to-primary",
    badge: "from-primary to-pink-600",
  },
  DEFAULT: {
    icon: User,
    gradient: "from-primary to-primary",
    badge: "from-primary to-primary",
  },
};

export function UnifiedHeader({ user }: UnifiedHeaderProps) {
  const config =
    roleConfig[user.role as keyof typeof roleConfig] ??
    roleConfig.DEFAULT;

  const RoleIcon = config.icon;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="
          h-18
          p-3
          rounded-xl
          border
          border-border/50
          bg-background/70
          backdrop-blur-md
          transition-all
          duration-300
          hover:shadow-lg
          hover:shadow-primary/10
        "
        >
          <motion.div
            className="flex items-center gap-4 w-full"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* ---------------- LOGO ---------------- */}

            <div className="relative flex-shrink-0">
              <Avatar className="h-14 w-14 bg-white ring-2 ring-white shadow-md">
                <AvatarImage
                  src="/ayii-logo.png"
                  alt="AYii University"
                  className="object-contain p-1"
                />
              </Avatar>

              {/* Role Icon */}
              <div
                className={`absolute -bottom-1 -right-1 bg-gradient-to-br ${config.gradient}
                text-white rounded-full p-1.5 shadow-md border-2 border-white`}
              >
                <RoleIcon className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* ---------------- CONTENT ---------------- */}

            <div className="flex flex-col min-w-0 flex-1 text-left">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="truncate font-semibold text-sm text-foreground">
                  AYii University
                </span>

                <Badge
                  className={`bg-gradient-to-r ${config.badge} text-white border-0 text-[10px] px-2 py-0.5`}
                >
                  {user.role}
                </Badge>
              </div>

              <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {user.name}
              </span>
            </div>
          </motion.div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}