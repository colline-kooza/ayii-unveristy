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

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.messages.conversations,
    queryFn: async () => {
      const { data } = await apiClient.get("/messages/conversations");
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useMessageThread(partnerId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.messages.thread(partnerId),
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get(
        `/messages/conversations/${partnerId}?page=${pageParam}&limit=50`,
      );
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: Boolean(partnerId),
    staleTime: 10 * 1000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { receiverId: string; content: string }) => {
      const { data } = await apiClient.post("/messages", payload);
      return { data, receiverId: payload.receiverId };
    },
    onMutate: async ({ receiverId, content }) => {
      // Get current user from cache
      const me = queryClient.getQueryData<any>(["me"]);

      // Optimistic: append message to thread immediately
      const tempMessage = {
        id: `temp-${Date.now()}`,
        senderId: me?.id || "temp-user",
        receiverId,
        content,
        sentAt: new Date().toISOString(),
        isRead: false,
        _optimistic: true,
        sender: me
          ? {
              id: me.id,
              name: me.name,
              image: me.image,
              role: me.role,
            }
          : undefined,
      };

      queryClient.setQueryData<any>(
        queryKeys.messages.thread(receiverId),
        (old: any) => {
          if (!old) return old;
          const pages = old.pages;
          const lastPage = pages[pages.length - 1];
          return {
            ...old,
            pages: [
              ...pages.slice(0, -1),
              { ...lastPage, data: [...lastPage.data, tempMessage] },
            ],
          };
        },
      );

      return { tempMessage, receiverId };
    },
    onError: (error, _, ctx) => {
      // Rollback optimistic message
      if (ctx?.receiverId) {
        queryClient.setQueryData<any>(
          queryKeys.messages.thread(ctx.receiverId),
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                data: page.data.filter((m: any) => !m._optimistic),
              })),
            };
          },
        );
      }
      toast.error("Failed to send message", {
        description: getErrorMessage(error),
      });
    },
    onSettled: (_, __, { receiverId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.thread(receiverId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations,
      });
    },
  });
}
