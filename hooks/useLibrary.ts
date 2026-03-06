"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

// ── Books ──────────────────────────────
export function useBooks(
  filters: { page?: number; search?: string; category?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.category) params.set("category", filters.category);
  if (filters.search && filters.search.length >= 2)
    params.set("search", filters.search);

  return useQuery({
    queryKey: ["library", "books", filters],
    queryFn: async () => {
      const { data } = await apiClient.get(`/library/books?${params.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useUploadBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post("/library/books", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book added to library");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const { data } = await apiClient.patch(`/library/books/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book updated");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/library/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "books"] });
      toast.success("Book removed");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

// ── Past Papers ───────────────────────────
export function usePastPapers(
  filters: {
    page?: number;
    search?: string;
    subject?: string;
    year?: number;
  } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.year) params.set("year", String(filters.year));
  if (filters.search && filters.search.length >= 3)
    params.set("search", filters.search);

  return useQuery({
    queryKey: queryKeys.library.pastPapers(filters),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/library/past-papers?${params.toString()}`,
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useUploadPastPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post("/library/past-papers", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "past-papers"] });
      toast.success("Past paper uploaded successfully");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdatePastPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const { data } = await apiClient.patch(`/library/past-papers/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "past-papers"] });
      toast.success("Past paper updated");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeletePastPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/library/past-papers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "past-papers"] });
      toast.success("Past paper removed");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

// ── Journals ──────────────────────────────
export function useJournals(
  filters: { page?: number; search?: string; status?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.status) params.set("status", filters.status);
  if (filters.search && filters.search.length >= 3)
    params.set("search", filters.search);

  return useQuery({
    queryKey: queryKeys.library.journals(filters),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/library/journals?${params.toString()}`,
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useSubmitJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post("/library/journals", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "journals"] });
      toast.success("Journal submitted");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useReviewJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action, rejectionReason }: any) => {
      const { data } = await apiClient.patch(`/library/journals/${id}/review`, {
        action,
        rejectionReason,
      });
      return { data, id, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "journals"] });
      toast.success("Journal review processed");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const { data } = await apiClient.patch(`/library/journals/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "journals"] });
      toast.success("Journal updated");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteJournal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/library/journals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library", "journals"] });
      toast.success("Journal removed");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

