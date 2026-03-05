"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: async () => {
      const { data } = await apiClient.get("/admin/stats");
      return data;
    },
    refetchInterval: 30 * 1000, // auto-refresh every 30s
    staleTime: 20 * 1000,
  });
}

export function useAdminAllCourses(
  filters: { page?: number; search?: string; department?: string } = {},
) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.department) params.set("department", filters.department);
  if (filters.search && filters.search.length >= 3)
    params.set("search", filters.search);

  return useQuery({
    queryKey: queryKeys.admin.allCourses(filters),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/admin/courses?${params.toString()}`,
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
}
