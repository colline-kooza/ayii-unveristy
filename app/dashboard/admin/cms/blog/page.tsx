"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff, FileText, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { useBlogPosts, useDeleteBlogPost, useUpdateBlogPost } from "@/hooks/useBlog";

export default function AdminBlogPage() {
  const router = useRouter();
  const { data, isLoading } = useBlogPosts(false);
  const deleteMutation = useDeleteBlogPost();
  const updateMutation = useUpdateBlogPost();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const posts = data?.data ?? [];
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublish = (id: string, current: boolean) => {
    updateMutation.mutate({ id, published: !current });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all blog articles published on the website</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-9 text-sm font-semibold shadow-sm">
          <Link href="/dashboard/admin/cms/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? "No posts match your search" : "No blog posts yet"}
          description={search ? "Try a different search term" : "Create your first blog post to get started"}
          actionLabel={!search ? "Create Post" : undefined}
          onAction={!search ? () => router.push("/dashboard/admin/cms/blog/new") : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Title</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Tags</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Published</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((post) => (
                <TableRow key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm leading-snug">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">/blog/{post.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={post.published
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]"
                        : "bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/10"
                        asChild
                      >
                        <Link href={`/dashboard/admin/cms/blog/${post.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(post.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
