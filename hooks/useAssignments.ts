"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

export function useAssignments(courseId: string) {
  return useQuery({
    queryKey: queryKeys.assignments.byCourse(courseId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/lecturer/courses/${courseId}/assignments`,
      );
      return data;
    },
    enabled: Boolean(courseId),
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      courseId: string;
      title: string;
      instructions?: string;
      dueDate: string;
      fileKey?: string;
    }) => {
      const { courseId, ...body } = payload;
      const { data } = await apiClient.post(
        `/lecturer/courses/${courseId}/assignments`,
        body,
      );
      return { data, courseId };
    },
    onSuccess: ({ data: newAssignment, courseId }) => {
      queryClient.setQueryData<any>(
        queryKeys.assignments.byCourse(courseId),
        (old: any) => {
          if (!Array.isArray(old)) return [newAssignment];
          return [newAssignment, ...old];
        },
      );
      toast.success("Assignment posted", {
        description: "All enrolled students have been notified.",
      });
    },
    onError: (error) =>
      toast.error("Failed to post assignment", {
        description: getErrorMessage(error),
      }),
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      courseId: string;
      assignmentId: string;
      title: string;
      instructions?: string;
      dueDate: string;
      fileKey?: string;
    }) => {
      const { courseId, assignmentId, ...body } = payload;
      const { data } = await apiClient.patch(
        `/lecturer/courses/${courseId}/assignments/${assignmentId}`,
        body,
      );
      return { data, courseId };
    },
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.byCourse(courseId),
      });
      toast.success("Assignment updated successfully");
    },
    onError: (error) =>
      toast.error("Update failed", { description: getErrorMessage(error) }),
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      assignmentId,
    }: {
      courseId: string;
      assignmentId: string;
    }) => {
      await apiClient.delete(
        `/lecturer/courses/${courseId}/assignments/${assignmentId}`,
      );
      return { courseId };
    },
    onSuccess: ({ courseId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.byCourse(courseId),
      });
      toast.success("Assignment deleted");
    },
    onError: (error) =>
      toast.error("Deletion failed", { description: getErrorMessage(error) }),
  });
}

export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: queryKeys.submissions.byAssignment(assignmentId),
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/lecturer/assignments/${assignmentId}/submissions`,
      );
      return data;
    },
    enabled: Boolean(assignmentId),
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      submissionId,
      grade,
      feedback,
    }: {
      submissionId: string;
      assignmentId: string;
      grade: string;
      feedback?: string;
    }) => {
      const { data } = await apiClient.patch(
        `/lecturer/submissions/${submissionId}/grade`,
        { grade, feedback },
      );
      return data;
    },
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions.byAssignment(assignmentId),
      });
      toast.success("Grade submitted");
    },
    onError: (error) =>
      toast.error("Grading failed", { description: getErrorMessage(error) }),
  });
}

// Student: submit assignment
export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      fileKey,
    }: {
      assignmentId: string;
      fileKey: string;
    }) => {
      const { data } = await apiClient.post(
        `/assignments/${assignmentId}/submit`,
        { fileKey },
      );
      return { data, assignmentId };
    },
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions.mine(assignmentId),
      });
      toast.success("Assignment submitted successfully!");
    },
    onError: (error) =>
      toast.error("Submission failed", { description: getErrorMessage(error) }),
  });
}
