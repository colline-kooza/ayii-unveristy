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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  _optimistic?: boolean;
  sender?: {
    id: string;
    name: string;
    image?: string | null;
    role: string;
  };
}

export interface ThreadPage {
  data: Message[];
  meta: {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface InfiniteThreadData {
  pages: ThreadPage[];
  pageParams: number[];
}

export interface Conversation {
  id: string;
  partner: {
    id: string;
    name: string;
    image?: string | null;
    role: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export function useConversations() {
  return useQuery<Conversation[]>({
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
      const tempMessage: Message = {
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

      queryClient.setQueryData<InfiniteThreadData>(
        queryKeys.messages.thread(receiverId),
        (old) => {
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
        queryClient.setQueryData<InfiniteThreadData>(
          queryKeys.messages.thread(ctx.receiverId),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.filter((m) => !m._optimistic),
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
