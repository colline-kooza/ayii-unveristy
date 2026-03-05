"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

export function useNotifications(
  filters: { page?: number; unreadOnly?: boolean } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.unreadOnly) params.set("unreadOnly", "true");

  return useQuery({
    queryKey: queryKeys.notifications.all(filters),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/notifications?${params.toString()}`,
      );
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/notifications?unreadOnly=true&limit=1",
      );
      return data.unreadCount as number;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // fallback poll
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
      return id;
    },
    onMutate: async (id) => {
      // Optimistic: mark as read in cache
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((n: any) =>
              n.id === id ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(0, (old.unreadCount ?? 0) - 1),
          };
        },
      );
      queryClient.setQueryData<number>(
        queryKeys.notifications.unreadCount,
        (old = 0) => Math.max(0, old - 1),
      );
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.error("Failed to mark as read", {
        description: getErrorMessage(error),
      });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.patch("/notifications/read-all");
    },
    onMutate: () => {
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((n: any) => ({ ...n, isRead: true })),
            unreadCount: 0,
          };
        },
      );
      queryClient.setQueryData(queryKeys.notifications.unreadCount, 0);
    },
    onSuccess: () => toast.success("All notifications marked as read"),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.error("Failed to mark all as read");
    },
  });
}
