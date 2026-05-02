"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Images, Star, StarOff, Grid3X3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useGalleryImages, useDeleteGalleryImage, useUpdateGalleryImage } from "@/hooks/useGallery";
import { useRouter } from "next/navigation";

export default function AdminGalleryPage() {
  const router = useRouter();
  const { data, isLoading } = useGalleryImages();
  const deleteMutation = useDeleteGalleryImage();
  const updateMutation = useUpdateGalleryImage();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const images = data?.data ?? [];
  const filtered = images.filter((img) =>
    img.title.toLowerCase().includes(search.toLowerCase()) ||
    (img.category?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleToggleFeatured = (id: string, current: boolean) => {
    updateMutation.mutate({ id, featured: !current });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage images displayed in the school gallery</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-9 text-sm font-semibold shadow-sm">
          <Link href="/dashboard/admin/cms/gallery/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Images}
          title={search ? "No images match your search" : "No gallery images yet"}
          description={search ? "Try a different search term" : "Add your first image to the gallery"}
          actionLabel={!search ? "Add Image" : undefined}
          onAction={!search ? () => router.push("/dashboard/admin/cms/gallery/new") : undefined}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((image) => (
            <div key={image.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {image.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 border-0">
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="h-7 w-7 flex items-center justify-center bg-white/90 hover:bg-white rounded-lg shadow-sm"
                    onClick={() => handleToggleFeatured(image.id, image.featured)}
                    title={image.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    {image.featured
                      ? <StarOff className="h-3.5 w-3.5 text-amber-500" />
                      : <Star className="h-3.5 w-3.5 text-gray-600" />
                    }
                  </button>
                  <Link
                    href={`/dashboard/admin/cms/gallery/${image.id}/edit`}
                    className="h-7 w-7 flex items-center justify-center bg-white/90 hover:bg-white rounded-lg shadow-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 text-gray-600" />
                  </Link>
                  <button
                    className="h-7 w-7 flex items-center justify-center bg-white/90 hover:bg-red-50 rounded-lg shadow-sm"
                    onClick={() => setDeleteId(image.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 truncate">{image.title}</p>
                {image.category && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{image.category}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Gallery Image"
        description="Are you sure you want to delete this image? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
