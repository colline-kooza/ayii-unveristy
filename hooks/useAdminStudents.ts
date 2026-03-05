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
import { PaginatedResponse, Student } from "@/types/admin";

interface StudentFilters {
  page?: number;
  search?: string;
  status?: string;
  limit?: number;
}

// ── List students (paginated + search) ────
export function useStudents(filters: StudentFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status) params.set("status", filters.status);
  // Only send search if 3+ characters
  if (filters.search && filters.search.length >= 3)
    params.set("search", filters.search);

  return useQuery<PaginatedResponse<Student>>({
    queryKey: queryKeys.students.all(filters),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Student>>(
        `/admin/students?${params.toString()}`,
      );
      return data;
    },
    placeholderData: keepPreviousData, // smooth pagination
  });
}

// ── Create single student ─────────────────
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      registrationNumber?: string;
      department: string;
      program?: string;
    }) => {
      const { data } = await apiClient.post("/admin/students", payload);
      return data;
    },
    onSuccess: (newStudent) => {
      // Optimistic: add to list cache immediately
      queryClient.setQueryData<any>(queryKeys.students.all(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [newStudent, ...old.data],
          meta: { ...old.meta, total: (old.meta?.total ?? 0) + 1 },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });

      toast.success("Student created successfully", {
        description: `Welcome email sent to ${newStudent.email}`,
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      if (msg.includes("Email")) toast.error("Email already in use");
      else if (msg.includes("Registration"))
        toast.error("Registration number already in use");
      else toast.error("Failed to create student", { description: msg });
    },
  });
}

// ── Bulk create students ──────────────────
export function useCreateStudentsBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (csvFile: File) => {
      const formData = new FormData();
      formData.append("csv", csvFile);
      const { data } = await apiClient.post("/admin/students/bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });

      toast.success(`${result.created} students created successfully`, {
        description:
          result.created > 0
            ? `Welcome emails sent to all ${result.created} students.`
            : undefined,
        duration: 6000,
      });
    },
    onError: (error: any) => {
      const data = error?.response?.data;
      if (data?.rowErrors) {
        toast.error(`Validation failed on ${data.rowErrors.length} rows`, {
          description: "Download the error report to fix and re-upload.",
          duration: 8000,
        });
      } else if (data?.conflicts) {
        toast.error(`${data.conflicts.length} duplicate entries found`, {
          description:
            "Registration numbers or emails already exist in the system.",
          duration: 8000,
        });
      } else {
        toast.error("Bulk upload failed", {
          description: getErrorMessage(error),
        });
      }
    },
  });
}

// ── Update student status (suspend/reinstate) ──
export function useUpdateStudentStatus() {
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
      const { data } = await apiClient.patch(`/admin/students/${id}/status`, {
        action,
        reason,
      });
      return { data, id, action };
    },
    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: ["students"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["students"],
      });

      // Optimistic update across all student list caches
      queryClient.setQueriesData({ queryKey: ["students"] }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s: any) =>
            s.id === id
              ? { ...s, status: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE" }
              : s,
          ),
        };
      });

      return { previousData };
    },
    onSuccess: ({ action }) => {
      toast.success(
        action === "SUSPEND" ? "Account suspended" : "Account reinstated",
        {
          description:
            action === "SUSPEND"
              ? "The student can no longer access the platform."
              : "The student can now access the platform.",
        },
      );
    },
    onError: (error, _, ctx) => {
      ctx?.previousData.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      toast.error("Status update failed", {
        description: getErrorMessage(error),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
    },
  });
}

// ── Reset student password ────────────────
export function useResetStudentPassword() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(
        `/admin/students/${id}/reset-password`,
      );
      return data;
    },
    onSuccess: () =>
      toast.success(
        "Password reset. New temporary password emailed to student.",
      ),
    onError: (error) =>
      toast.error("Reset failed", { description: getErrorMessage(error) }),
  });
}
// ── Update student profile ────────────────
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: {
      id: string;
      name: string;
      email: string;
      department: string;
      program?: string;
      image?: string;
    }) => {
      const { data } = await apiClient.patch(`/admin/students/${id}`, payload);
      return data;
    },
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student profile updated");
    },
    onError: (error) => {
      toast.error("Update failed", { description: getErrorMessage(error) });
    },
  });
}
