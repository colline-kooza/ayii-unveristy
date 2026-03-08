"use client";

import { easeOut } from "framer-motion";
import type * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { NavUser } from "@/components/dashboard/NavUser";
import {
  getNavigationForRole,
  type NavigationItem,
} from "@/lib/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { type AuthUser } from "@/lib/auth";
import { UnifiedHeader } from "./levels/UnifiedHeader";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useConversations } from "@/hooks/useMessages";

const pathMatches = (url: string, pathname: string) => {
  if (url === pathname) return true;
  if (url !== "/dashboard" && pathname.startsWith(url)) return true;
  return false;
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AuthUser;
  schools?: { id: string; name: string }[];
}

const NavMainContent = ({ 
  items, 
  pathname, 
  isCollapsed, 
  itemVariants, 
  badgeVariants 
}: { 
  items: NavigationItem[]; 
  pathname: string;
  isCollapsed: boolean;
  itemVariants: Variants;
  badgeVariants: Variants;
}) => (
  <SidebarGroup className="px-0">
    <SidebarMenu className="space-y-0.5">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.02 }}
            className="sidebar-item"
          >
            {item.items ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathMatches(item.url, pathname)}
                  className={`group relative ${
                    isCollapsed ? "px-2.5 py-2 mx-1" : "px-4 py-2 mx-2"
                  } rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-primary/10 data-[active=true]:text-primary transition-all duration-200 ease-out`}
                >
                  <Link
                    href={item.url}
                    className="flex items-center justify-between w-full min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <item.icon className="h-4 w-4 transition-colors duration-200" />
                      </div>
                      <span className="truncate text-gray-500 text-sm font-semibold uppercase tracking-wider text-[11px]">
                        {item.title}
                      </span>
                    </div>
                    {item.badge && (typeof item.badge === 'number' ? item.badge > 0 : true) && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-2 text-xs bg-red-100 text-red-700 hover:bg-red-200 border-0 font-bold"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub className="ml-6 mt-1 space-y-1 border-l-2 border-primary/10">
                  {item.items.map((subItem, subIndex) => (
                    <motion.div
                      key={subItem.title}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: subIndex * 0.03 }}
                    >
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathMatches(subItem.url, pathname)}
                          className="px-3 py-1.5 mx-2 text-sm font-medium text-gray-500 hover:text-primary hover:bg-primary/5 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/15 data-[active=true]:to-primary/5 data-[active=true]:text-primary data-[active=true]:font-bold transition-all duration-150 rounded-md relative"
                        >
                          <Link
                            href={subItem.url}
                            className="flex items-center justify-between w-full min-w-0"
                          >
                            <span className="truncate">
                              {subItem.title}
                            </span>
                            {subItem.badge && (typeof subItem.badge === 'number' ? subItem.badge > 0 : true) && (
                                <Badge
                                  variant="secondary"
                                  className="h-4 px-1.5 text-xs bg-red-100 text-red-700 hover:bg-red-200 border-0 font-bold flex-shrink-0"
                                >
                                {subItem.badge}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </motion.div>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathMatches(item.url, pathname)}
                  className={`group relative ${
                    isCollapsed ? "px-2.5 py-2 mx-1" : "px-4 py-2 mx-2"
                  } rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/20 data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary data-[active=true]:to-primary/90 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-primary/30 transition-all duration-200 ease-out`}
                >
                  <Link
                    href={item.url}
                    className="flex items-center justify-between w-full min-w-0"
                  >
                    <motion.div
                      className="flex items-center gap-3 min-w-0"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="relative flex-shrink-0">
                        <item.icon className="h-4 w-4 transition-colors duration-200" />
                      </div>
                      <span className="font-medium truncate text-sm">
                        {item.title}
                      </span>
                    </motion.div>

                    {item.badge && (typeof item.badge === 'number' ? item.badge > 0 : true) && (
                      <motion.div
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-shrink-0"
                      >
                        <Badge
                          variant="secondary"
                          className="h-5 px-2 text-xs bg-red-100 text-red-700 group-data-[active=true]:bg-white group-data-[active=true]:text-red-700 hover:bg-red-200 border-0 font-bold shadow-none"
                        >
                          {item.badge}
                        </Badge>
                      </motion.div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </SidebarMenu>
  </SidebarGroup>
);

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { data: unreadNotifications = 0 } = useUnreadCount();
  const { data: conversations = [] } = useConversations();
  
  // Calculate unread messages count
  const unreadMessages = conversations.reduce((sum: number, conv: { unreadCount?: number }) => sum + (conv.unreadCount || 0), 0);
  
  const navigationItems = getNavigationForRole(user.role, {
    unreadNotifications,
    unreadMessages,
  });
  const isCollapsed = state === "collapsed";

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: easeOut },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring" as const, stiffness: 500, damping: 30 },
    },
  };

  const renderHeader = () => {
    return <UnifiedHeader user={user} />;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar
        collapsible="icon"
        // overflow-x-hidden on the sidebar itself is the main fix
        className="hidden lg:flex border-r border-primary/20 bg-gradient-to-b from-white via-primary/5 to-white shadow-sm overflow-x-hidden"
        {...props}
      >
        <SidebarHeader className="border-b border-gray-200/50 bg-white/95 backdrop-blur-sm px-3 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderHeader()}
          </motion.div>
        </SidebarHeader>

        <SidebarContent className="bg-gradient-to-b from-primary/5 via-transparent to-primary/10 custom-scrollbar py-1 overflow-x-hidden">
          <NavMainContent 
            items={navigationItems} 
            pathname={pathname}
            isCollapsed={isCollapsed}
            itemVariants={itemVariants}
            badgeVariants={badgeVariants}
          />
        </SidebarContent>

        {/* overflow-hidden on footer stops NavUser from expanding sidebar width */}
        <SidebarFooter className="border-t border-primary/20 bg-white/90 backdrop-blur-sm p-3 overflow-hidden">
          <NavUser user={{ ...user, image: user.image || undefined }} />
        </SidebarFooter>

        <SidebarRail className="bg-gradient-to-b from-primary/20 to-primary/30" />
      </Sidebar>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        {/* Mobile logic here if needed */}
      </div>
    </>
  );
}