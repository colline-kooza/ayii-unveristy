"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { useGalleryImage, useCreateGalleryImage, useUpdateGalleryImage } from "@/hooks/useGallery";

interface GalleryImageFormProps {
  mode: "create" | "edit";
  imageId?: string;
}

const CATEGORIES = ["Campus", "Events", "Students", "Sports", "Academics", "Graduation", "Other"];

export function GalleryImageForm({ mode, imageId }: GalleryImageFormProps) {
  const router = useRouter();
  const { data: existing, isLoading } = useGalleryImage(imageId || "");
  const createMutation = useCreateGalleryImage();
  const updateMutation = useUpdateGalleryImage();

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    order: 0,
    featured: false,
  });

  useEffect(() => {
    if (mode === "edit" && existing) {
      setForm({
        title: existing.title,
        description: existing.description || "",
        imageUrl: existing.imageUrl,
        category: existing.category || "",
        order: existing.order,
        featured: existing.featured,
      });
    }
  }, [existing, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return;

    const payload = {
      ...form,
      description: form.description || null,
      category: form.category || null,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (imageId) {
      await updateMutation.mutateAsync({ id: imageId, ...payload });
    }
    router.push("/dashboard/admin/cms/gallery");
  };

  if (mode === "edit" && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/cms/gallery"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          {mode === "create" ? "Add Gallery Image" : "Edit Gallery Image"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Image <span className="text-red-500">*</span>
            </Label>
            <SimpleImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Annual Graduation Ceremony 2024"
              className="h-9 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the image..."
              className="resize-none text-sm min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order" className="text-sm font-semibold text-gray-700">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="h-9 text-sm"
                min={0}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Featured Image</p>
              <p className="text-xs text-gray-400">Show prominently in the gallery</p>
            </div>
            <Switch
              checked={form.featured}
              onCheckedChange={(v) => setForm((prev) => ({ ...prev, featured: v }))}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSaving || !form.title || !form.imageUrl}
          className="w-full bg-primary hover:bg-primary/90 h-10 text-sm font-semibold"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === "create" ? "Add to Gallery" : "Save Changes"}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
