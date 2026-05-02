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
import { useSchoolUpdate, useCreateSchoolUpdate, useUpdateSchoolUpdate } from "@/hooks/useSchoolUpdates";

interface SchoolUpdateFormProps {
  mode: "create" | "edit";
  updateId?: string;
}

const CATEGORIES = ["Academic", "Events", "Sports", "Announcement", "General"];

export function SchoolUpdateForm({ mode, updateId }: SchoolUpdateFormProps) {
  const router = useRouter();
  const { data: existing, isLoading } = useSchoolUpdate(updateId || "");
  const createMutation = useCreateSchoolUpdate();
  const updateMutation = useUpdateSchoolUpdate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    category: "",
    published: false,
  });

  useEffect(() => {
    if (mode === "edit" && existing) {
      setForm({
        title: existing.title,
        content: existing.content,
        excerpt: existing.excerpt || "",
        imageUrl: existing.imageUrl || "",
        category: existing.category || "",
        published: existing.published,
      });
    }
  }, [existing, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return;

    const payload = {
      ...form,
      excerpt: form.excerpt || null,
      imageUrl: form.imageUrl || null,
      category: form.category || null,
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
    } else if (updateId) {
      await updateMutation.mutateAsync({ id: updateId, ...payload });
    }
    router.push("/dashboard/admin/cms/updates");
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/cms/updates"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Updates
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          {mode === "create" ? "New School Update" : "Edit School Update"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Registration Opens for 2025 Academic Year"
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">Short Summary</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief summary shown in the updates listing..."
                  className="resize-none text-sm min-h-[80px]"
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
                  Full Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write the full update content here..."
                  className="resize-y text-sm min-h-[320px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Settings</h3>

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

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Published</p>
                  <p className="text-xs text-gray-400">Visible on the website</p>
                </div>
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm((prev) => ({ ...prev, published: v }))}
                />
              </div>

              <Button
                type="submit"
                disabled={isSaving || !form.title || !form.content}
                className="w-full bg-primary hover:bg-primary/90 h-9 text-sm font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === "create" ? "Publish Update" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Cover Image</h3>
              <SimpleImageUpload
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
