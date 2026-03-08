"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import { Message, InfiniteThreadData } from "./useMessages";

export interface Notification {
  id: string;
  type: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    meetingUrl?: string;
    courseId?: string;
    assignmentId?: string;
    [key: string]: any;
  };
}

export interface NotificationPage {
  data: Notification[];
  unreadCount?: number;
}

export interface InfiniteNotificationData {
  pages: NotificationPage[];
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

interface OnlineUser {
  userId: string;
  name: string;
  role: string;
  online: boolean;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineUser>>(
    new Map(),
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setSocket(socket);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });

    // ── Notifications ─────────────────────────
    socket.on("notification:new", (notification: Notification) => {
      // Update notifications cache directly
      queryClient.setQueryData<InfiniteNotificationData>(
        queryKeys.notifications.all(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages?.map((page, i) =>
              i === 0
                ? {
                    ...page,
                    data: [notification, ...page.data],
                    unreadCount: (page.unreadCount ?? 0) + 1,
                  }
                : page,
            ),
          };
        },
      );

      // Increment unread badge
      queryClient.setQueryData<number>(
        queryKeys.notifications.unreadCount,
        (old = 0) => old + 1,
      );

      // Show toast for high-priority notifications
      if (notification.type === "LIVE_LECTURE") {
        toast("🔴 Live Lecture Started!", {
          description: notification.body,
          duration: 8000,
          action: {
            label: "Join Now",
            onClick: () => {
              if (notification.metadata?.meetingUrl) {
                window.open(notification.metadata.meetingUrl, "_blank");
              }
            },
          },
        });
      } else if (notification.type === "ASSIGNMENT_POSTED") {
        toast("📋 New Assignment", {
          description: notification.body,
          duration: 5000,
        });
      }
    });

    // ── Messages ──────────────────────────────
    socket.on("message:new", (message: Message) => {
      const partnerId = message.senderId;

      // Add to thread cache
      queryClient.setQueryData<InfiniteThreadData>(
        queryKeys.messages.thread(partnerId),
        (old) => {
          if (!old) return old;
          const lastPage = old.pages[old.pages.length - 1];
          return {
            ...old,
            pages: [
              ...old.pages.slice(0, -1),
              { ...lastPage, data: [...lastPage.data, message] },
            ],
          };
        },
      );

      // Refresh conversations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations,
      });

      // Increment unread badge
      queryClient.setQueryData<number>(
        queryKeys.notifications.unreadCount,
        (old = 0) => old + 1,
      );
    });

    // ── Live Lecture ──────────────────────────
    socket.on("lecture:started", (data) => {
      queryClient.setQueryData(
        queryKeys.liveLecture.byCourse(data.courseId),
        data,
      );
    });

    socket.on("lecture:ended", (data) => {
      queryClient.setQueryData(
        queryKeys.liveLecture.byCourse(data.courseId),
        null,
      );
    });

    // ── Assignment posted ─────────────────────
    socket.on("assignment:posted", () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    });

    // ── Online users (admin) ──────────────────
    socket.on("user:status", (data: OnlineUser) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        if (data.online) {
          next.set(data.userId, data);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    // ── Account suspended ─────────────────────
    socket.on("account:suspended", (data: { reason: string }) => {
      toast.error("Account Suspended", {
        description: data.reason || "Your account has been suspended.",
        duration: Infinity,
      });
      setTimeout(() => {
        window.location.href = "/login?suspended=true";
      }, 3000);
    });

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [queryClient]);

  // Actions
  const joinCourse = useCallback((courseId: string) => {
    socket?.emit("course:join", { courseId });
  }, [socket]);

  const leaveCourse = useCallback((courseId: string) => {
    socket?.emit("course:leave", { courseId });
  }, [socket]);

  const sendTypingStart = useCallback((receiverId: string) => {
    socket?.emit("typing:start", { receiverId });
  }, [socket]);

  const sendTypingStop = useCallback((receiverId: string) => {
    socket?.emit("typing:stop", { receiverId });
  }, [socket]);

  return useMemo(() => ({
    socket,
    isConnected,
    onlineUsers,
    joinCourse,
    leaveCourse,
    sendTypingStart,
    sendTypingStop,
  }), [socket, isConnected, onlineUsers, joinCourse, leaveCourse, sendTypingStart, sendTypingStop]);
}

// Typing indicator hook
export function useTypingIndicator(
  partnerId: string,
  sendTypingStart: (id: string) => void,
  sendTypingStop: (id: string) => void,
) {
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const onType = useCallback(() => {
    sendTypingStart(partnerId);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => sendTypingStop(partnerId), 2000);
  }, [partnerId, sendTypingStart, sendTypingStop]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return { onType };
}
