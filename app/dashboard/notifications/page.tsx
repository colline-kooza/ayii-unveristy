"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markRead.mutateAsync(notification.id);
    }

    if (notification.metadata?.url) {
      router.push(notification.metadata.url);
    } else if (notification.type === "ASSIGNMENT_POSTED" && notification.metadata?.courseId) {
      router.push(`/dashboard/student/courses/${notification.metadata.courseId}`);
    } else if (notification.type === "LIVE_LECTURE" && notification.metadata?.courseId) {
      router.push(`/dashboard/student/courses/${notification.metadata.courseId}`);
    } else if (notification.type === "GRADE_PUBLISHED" && notification.metadata?.assignmentId) {
      router.push(`/dashboard/student/courses/${notification.metadata.courseId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ASSIGNMENT_POSTED":
        return "📋";
      case "GRADE_PUBLISHED":
        return "✅";
      case "LIVE_LECTURE":
        return "🔴";
      case "COURSE_ENROLLED":
        return "📚";
      case "MESSAGE":
        return "💬";
      default:
        return "🔔";
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? (
              <>You have <span className="text-red-600 font-bold">{unreadCount}</span> unread alert{unreadCount > 1 ? 's' : ''}</>
            ) : 'You\'re all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            onClick={handleMarkAllRead} 
            className="flex items-center space-x-2 text-red-600 font-bold text-xs hover:bg-red-50 transition-all px-4"
            disabled={markAllRead.isPending}
          >
            {markAllRead.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-20 bg-white rounded-2xl border border-gray-50 shadow-none">
          <EmptyState
            icon={Bell}
            title="Clean slate"
            description="We'll notify you here when there are new updates about your courses or account."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-none overflow-hidden divide-y divide-gray-50">
          {notifications.map((notification: any) => (
            <div
              key={notification.id}
              className={`p-5 hover:bg-red-50/30 cursor-pointer transition-colors relative ${
                !notification.isRead ? "bg-red-50/10" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              {!notification.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
              )}
              <div className="flex items-start space-x-4">
                <div className="shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border ${
                    !notification.isRead ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${
                        !notification.isRead ? "text-black" : "text-gray-700"
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                        {notification.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2.5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                        {!notification.isRead && (
                          <Badge className="bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0 shadow-lg shadow-red-500/20 border-0">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-gray-400 font-bold">
                        {new Date(notification.createdAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
