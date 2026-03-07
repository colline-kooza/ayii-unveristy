import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export function useCourseResources(courseId: string) {
  return useQuery({
    queryKey: ["course-resources", courseId],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${courseId}/resources`);
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useCreateCourseResource(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(
        `/courses/${courseId}/resources`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-resources", courseId],
      });
      toast.success("Resource added successfully");
    },
    onError: () => {
      toast.error("Failed to add resource");
    },
  });
}

export function useUpdateCourseResource(courseId: string, resourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.patch(
        `/courses/${courseId}/resources/${resourceId}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-resources", courseId],
      });
      toast.success("Resource updated successfully");
    },
    onError: () => {
      toast.error("Failed to update resource");
    },
  });
}

export function useDeleteCourseResource(courseId: string, resourceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/courses/${courseId}/resources/${resourceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-resources", courseId],
      });
      toast.success("Resource deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete resource");
    },
  });
}
