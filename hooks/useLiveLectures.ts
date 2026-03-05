"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

export function useActiveLecture(courseId: string) {
  return useQuery({
    queryKey: queryKeys.liveLecture.byCourse(courseId),
    queryFn: async () => {
      const { data } = await apiClient.get(`/courses/${courseId}/live-lecture`);
      return data; // null if no active lecture
    },
    enabled: Boolean(courseId),
    refetchInterval: 30 * 1000, // poll as fallback to socket
  });
}

export function useStartLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { courseId: string; meetingUrl?: string }) => {
      const { data } = await apiClient.post("/lecturer/live-lectures", payload);
      return { data, courseId: payload.courseId };
    },
    onSuccess: ({ data: lecture, courseId }) => {
      queryClient.setQueryData(
        queryKeys.liveLecture.byCourse(courseId),
        lecture,
      );
      toast.success("🔴 Live lecture started!", {
        description: "All enrolled students have been notified.",
        duration: 6000,
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      if (msg.includes("already in progress"))
        toast.error("A live lecture is already running for this course");
      else toast.error("Failed to start lecture", { description: msg });
    },
  });
}

export function useEndLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lectureId,
      courseId,
    }: {
      lectureId: string;
      courseId: string;
    }) => {
      await apiClient.patch(`/lecturer/live-lectures/${lectureId}/end`);
      return courseId;
    },
    onSuccess: (courseId) => {
      queryClient.setQueryData(queryKeys.liveLecture.byCourse(courseId), null);
      toast.success("Live lecture ended");
    },
    onError: (error) =>
      toast.error("Failed to end lecture", {
        description: getErrorMessage(error),
      }),
  });
}
