import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCmsSection(page: string, section: string) {
  return useQuery({
    queryKey: ["cms", page, section],
    queryFn: async () => {
      const res = await fetch(`/api/cms/${page}/${section}`);
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      page,
      section,
      patch,
    }: {
      page: string;
      section: string;
      patch: any;
    }) => {
      const res = await fetch(`/api/cms/${page}/${section}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!res.ok) throw new Error("Failed to update content");
      return res.json();
    },
    onMutate: async ({ page, section, patch }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["cms", page, section] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(["cms", page, section]);

      // Optimistically update
      queryClient.setQueryData(["cms", page, section], patch);

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          ["cms", variables.page, variables.section],
          context.previous,
        );
      }
      toast.error("Failed to save changes");
    },
    onSuccess: (data, variables) => {
      toast.success("Changes saved successfully");
      queryClient.invalidateQueries({
        queryKey: ["cms", variables.page, variables.section],
      });
    },
  });
}

export function useCmsSections(page: string) {
  return useQuery({
    queryKey: ["cms-sections", page],
    queryFn: async () => {
      const res = await fetch(`/api/cms/${page}`);
      if (!res.ok) throw new Error("Failed to fetch sections");
      return res.json() as Promise<{ section: string; updatedAt: string }[]>;
    },
  });
}
