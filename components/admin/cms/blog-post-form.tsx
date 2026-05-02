"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Eye, EyeOff, Plus, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlog";
import { Switch } from "@/components/ui/switch";

interface BlogPostFormProps {
  mode: "create" | "edit";
  postId?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function BlogPostForm({ mode, postId }: BlogPostFormProps) {
  const router = useRouter();
  const { data: existing, isLoading } = useBlogPost(postId || "");
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: [] as string[],
    published: false,
    authorName: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (mode === "edit" && existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        excerpt: existing.excerpt || "",
        content: existing.content,
        coverImage: existing.coverImage || "",
        tags: existing.tags,
        published: existing.published,
        authorName: existing.authorName || "",
      });
      setSlugManuallyEdited(true);
    }
  }, [existing, mode]);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManuallyEdited ? prev.slug : slugify(title),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) return;

    const payload = {
      ...form,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      authorName: form.authorName || null,
    };

    if (mode === "create") {
      const post = await createMutation.mutateAsync(payload);
      router.push("/dashboard/admin/cms/blog");
    } else if (postId) {
      await updateMutation.mutateAsync({ id: postId, ...payload });
      router.push("/dashboard/admin/cms/blog");
    }
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
          href="/dashboard/admin/cms/blog"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  className="h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug" className="text-sm font-semibold text-gray-700">URL Slug <span className="text-red-500">*</span></Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 shrink-0">/blog/</span>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                      setSlugManuallyEdited(true);
                    }}
                    placeholder="post-url-slug"
                    className="h-9 text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short description shown in listings..."
                  className="resize-none text-sm min-h-[80px]"
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-sm font-semibold text-gray-700">Content <span className="text-red-500">*</span></Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here..."
                  className="resize-y text-sm min-h-[320px]"
                  required
                />
                <p className="text-[11px] text-gray-400">HTML and Markdown are supported</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Publish Settings</h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Published</p>
                  <p className="text-xs text-gray-400">Visible on the website</p>
                </div>
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm((prev) => ({ ...prev, published: v }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="authorName" className="text-sm font-semibold text-gray-700">Author Name</Label>
                <Input
                  id="authorName"
                  value={form.authorName}
                  onChange={(e) => setForm((prev) => ({ ...prev, authorName: e.target.value }))}
                  placeholder="e.g. Admin Team"
                  className="h-9 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isSaving || !form.title || !form.slug || !form.content}
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
                    {mode === "create" ? "Create Post" : "Save Changes"}
                  </>
                )}
              </Button>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Cover Image</h3>
              <SimpleImageUpload
                value={form.coverImage}
                onChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Tags</h3>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="h-8 text-sm flex-1"
                />
                <Button type="button" size="sm" variant="outline" onClick={addTag} className="h-8 px-2">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {form.tags.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No tags added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
