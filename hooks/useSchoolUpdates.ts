import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface SchoolUpdate {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  category: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useSchoolUpdates(publishedOnly = true, category?: string) {
  return useQuery<{ data: SchoolUpdate[]; total: number }>({
    queryKey: ["updates", { publishedOnly, category }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (!publishedOnly) params.set("published", "false");
      if (category) params.set("category", category);
      const url = `/api/updates${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch updates");
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useSchoolUpdate(id: string) {
  return useQuery<SchoolUpdate>({
    queryKey: ["updates", id],
    queryFn: async () => {
      const res = await fetch(`/api/updates/${id}`);
      if (!res.ok) throw new Error("Failed to fetch update");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateSchoolUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SchoolUpdate>) => {
      const res = await fetch("/api/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create update");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updates"] });
      toast.success("Update created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSchoolUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SchoolUpdate> & { id: string }) => {
      const res = await fetch(`/api/updates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update");
      }
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["updates"] });
      queryClient.invalidateQueries({ queryKey: ["updates", vars.id] });
      toast.success("Update saved successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSchoolUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/updates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updates"] });
      toast.success("Update deleted");
    },
    onError: () => toast.error("Failed to delete update"),
  });
}
