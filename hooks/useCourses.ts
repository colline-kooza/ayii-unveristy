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

interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

// ── Browse all courses (student) ──────────
export function useCourses(filters: CourseFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.department) params.set("department", filters.department);
  if (filters.search && filters.search.length >= 3)
    params.set("search", filters.search);

  return useQuery({
    queryKey: queryKeys.courses.all(filters),
    queryFn: async () => {
      const { data } = await apiClient.get(`/courses?${params.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

// ── Course detail ─────────────────────────
export function useCourse(courseId: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/courses/${courseId}`);
      return data;
    },
    enabled: Boolean(courseId),
  });
}

// ── Lecturer's own courses ────────────────
export function useMyCoursesLecturer() {
  return useQuery({
    queryKey: queryKeys.courses.mine,
    queryFn: async () => {
      const { data } = await apiClient.get("/lecturer/courses");
      return data;
    },
  });
}

// ── Student's enrolled courses ────────────
export function useMyEnrollments() {
  return useQuery({
    queryKey: queryKeys.courses.enrolled,
    queryFn: async () => {
      const { data } = await apiClient.get("/courses?enrolled=true");
      return data;
    },
  });
}

// ── Enroll ────────────────────────────────
export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await apiClient.post(`/courses/${courseId}/enroll`);
      return { data, courseId };
    },
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: ["courses"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["courses"],
      });

      // Optimistic: flip isEnrolled = true immediately
      queryClient.setQueriesData({ queryKey: ["courses"] }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((c: any) =>
            c.id === courseId
              ? {
                  ...c,
                  isEnrolled: true,
                  _count: {
                    ...c._count,
                    enrollments: (c._count?.enrollments ?? 0) + 1,
                  },
                }
              : c,
          ),
        };
      });

      return { previousData };
    },
    onSuccess: () => toast.success("Enrolled successfully!"),
    onError: (error, _, ctx) => {
      ctx?.previousData.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      const msg = getErrorMessage(error);
      if (msg.includes("Already"))
        toast.error("Already enrolled in this course");
      else toast.error("Enrollment failed", { description: msg });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled });
    },
  });
}

// ── Unenroll ──────────────────────────────
export function useUnenroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      await apiClient.delete(`/courses/${courseId}/enroll`);
      return courseId;
    },
    onMutate: async (courseId) => {
      const previousData = queryClient.getQueriesData({
        queryKey: ["courses"],
      });
      queryClient.setQueriesData({ queryKey: ["courses"] }, (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((c: any) =>
            c.id === courseId
              ? {
                  ...c,
                  isEnrolled: false,
                  _count: {
                    ...c._count,
                    enrollments: Math.max(0, (c._count?.enrollments ?? 1) - 1),
                  },
                }
              : c,
          ),
        };
      });
      return { previousData };
    },
    onSuccess: () => toast.success("Unenrolled from course"),
    onError: (error, _, ctx) => {
      ctx?.previousData.forEach(([key, value]) =>
        queryClient.setQueryData(key, value),
      );
      toast.error("Failed to unenroll", {
        description: getErrorMessage(error),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled });
    },
  });
}

// ── Create course (lecturer) ──────────────
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description?: string;
      unitCode: string;
      department: string;
    }) => {
      const { data } = await apiClient.post("/lecturer/courses", payload);
      return data;
    },
    onSuccess: (newCourse) => {
      // Update the "mine" query data if it exists
      queryClient.setQueryData<any>(queryKeys.courses.mine, (old: any) => {
        if (!old) return [newCourse];
        if (Array.isArray(old)) return [newCourse, ...old];
        return old;
      });

      // Invalidate everything under "courses" to catch "all", "mine", "enrolled", etc.
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      
      toast.success("Course created", {
        description: `"${newCourse.title}" is now live.`,
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      if (msg.includes("Unit code")) toast.error("Unit code already exists");
      else toast.error("Failed to create course", { description: msg });
    },
  });
}

// ── Update course ─────────────────────────
export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updates: Partial<{
        title: string;
        description: string;
        department: string;
      }>,
    ) => {
      const { data } = await apiClient.patch(
        `/lecturer/courses/${courseId}`,
        updates,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated");
    },
    onError: (error) =>
      toast.error("Update failed", { description: getErrorMessage(error) }),
  });
}
