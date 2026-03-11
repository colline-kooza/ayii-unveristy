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
import { PaginatedResponse, Lecturer } from "@/types/admin";

interface LecturerFilters {
  page?: number;
  search?: string;
  status?: string;
}

export function useLecturers(filters: LecturerFilters = {}, options: any = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.status) params.set("status", filters.status);
  if (filters.search && filters.search.length >= 3)
    params.set("search", filters.search);

  return useQuery<PaginatedResponse<Lecturer>>({
    queryKey: queryKeys.lecturers.all(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Lecturer>>(
        `/admin/lecturers?${params.toString()}`,
      );
      return data;
    },
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useCreateLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      department: string;
      specialization?: string;
      employeeId?: string;
      image?: string;
      password?: string;
    }) => {
      const { data } = await apiClient.post("/admin/lecturers", payload);
      return data;
    },
    onSuccess: (newLecturer) => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      toast.success("Lecturer account created", {
        description: `Welcome email sent to ${newLecturer.email}`,
      });
    },
    onError: (error) => {
      toast.error("Failed to create lecturer", {
        description: getErrorMessage(error),
      });
    },
  });
}

export function useUpdateLecturerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      action,
      reason,
    }: {
      id: string;
      action: "SUSPEND" | "REINSTATE";
      reason?: string;
    }) => {
      const { data } = await apiClient.patch(`/admin/lecturers/${id}/status`, {
        action,
        reason,
      });
      return { data, id, action };
    },
    onMutate: async ({ id, action }) => {
      const previousData = queryClient.getQueriesData({
        queryKey: ["lecturers"],
      });
      queryClient.setQueriesData({ queryKey: ["lecturers"] }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((l: any) =>
            l.id === id
              ? { ...l, status: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE" }
              : l,
          ),
        };
      });
      return { previousData };
    },
    onSuccess: ({ action }) => {
      toast.success(
        action === "SUSPEND"
          ? "Lecturer account suspended"
          : "Lecturer account reinstated",
      );
    },
    onError: (error, _, ctx) => {
      ctx?.previousData.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      toast.error("Update failed", { description: getErrorMessage(error) });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["lecturers"] }),
  });
}

export function useUpdateLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: {
      id: string;
      name: string;
      email: string;
      department: string;
      specialization?: string;
      image?: string;
    }) => {
      const { data } = await apiClient.patch(`/admin/lecturers/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      toast.success("Lecturer details updated");
    },
    onError: (error) => {
      toast.error("Update failed", { description: getErrorMessage(error) });
    },
  });
}

export function useDeleteLecturer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/lecturers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
      toast.success("Lecturer removed successfully");
    },
    onError: (error) => {
      toast.error("Deletion failed", { description: getErrorMessage(error) });
    },
  });
}
