import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useGalleryImages(category?: string) {
  return useQuery<{ data: GalleryImage[] }>({
    queryKey: ["gallery", { category }],
    queryFn: async () => {
      const url = category ? `/api/gallery?category=${encodeURIComponent(category)}` : "/api/gallery";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch gallery images");
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useGalleryImage(id: string) {
  return useQuery<GalleryImage>({
    queryKey: ["gallery", id],
    queryFn: async () => {
      const res = await fetch(`/api/gallery/${id}`);
      if (!res.ok) throw new Error("Failed to fetch gallery image");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<GalleryImage>) => {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create gallery image");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery image added successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<GalleryImage> & { id: string }) => {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update gallery image");
      }
      return res.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery", vars.id] });
      toast.success("Gallery image updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete gallery image");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Gallery image deleted");
    },
    onError: () => toast.error("Failed to delete gallery image"),
  });
}
