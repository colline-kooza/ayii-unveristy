"use client";

import * as React from "react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GraduationCap, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { getSessionToken } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useConversations } from "@/hooks/useMessages";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  // Initialize Socket.io connection
  const { isConnected, onlineUsers } = useSocket();
  
  // Get unread counts for mobile nav
  const { data: unreadNotifications = 0 } = useUnreadCount();
  const { data: conversations = [] } = useConversations();
  const unreadMessages = conversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);

  // Log connection status for debugging
  React.useEffect(() => {
    if (isConnected) {
      console.log("✅ Socket.io connected");
    } else {
      console.warn("⚠️ Socket.io disconnected");
    }
  }, [isConnected]);

  const handleSearch = (query: string) => {
    // Implement search logic
    setSearchResults([]);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={user} />
      <SidebarInset className="pb-16 lg:pb-0">
        <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-rose-100 bg-white/80 backdrop-blur-sm z-50">
            <div className="flex items-center gap-2 px-2 lg:px-4 flex-1">
              <SidebarTrigger className="-ml-1 hover:bg-rose-50 hover:text-[#8B1538] hidden lg:block" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-rose-200 hidden lg:block"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/dashboard"
                      className="flex items-center gap-2 text-primary hover:text-[#8B1538] font-bold"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">AYii University</span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-rose-300" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-primary/90 lg:font-medium font-bold">
                      Dashboard
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              {/* Connection Status Indicator */}
              <div className="ml-2 hidden sm:block">
                {isConnected ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    <span className="text-xs">Live</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                    <WifiOff className="h-3 w-3" />
                    <span className="text-xs">Offline</span>
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex-1">
              <Navbar
                onSearch={handleSearch}
                searchResults={searchResults}
                user={user}
              />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-2 md:p-4 lg:p-2">{children}</div>
          </main>
        </div>
      </SidebarInset>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        role={user.role} 
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />
      
      {/* AI Assistant */}
      <AIAssistant />
    </SidebarProvider>
  );
}

