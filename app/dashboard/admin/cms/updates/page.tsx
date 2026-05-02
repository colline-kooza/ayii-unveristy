"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff, Newspaper, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useSchoolUpdates, useDeleteSchoolUpdate, useUpdateSchoolUpdate } from "@/hooks/useSchoolUpdates";
import { useRouter } from "next/navigation";

const CATEGORY_COLORS: Record<string, string> = {
  Academic: "bg-blue-50 text-blue-700 border-blue-200",
  Events: "bg-purple-50 text-purple-700 border-purple-200",
  General: "bg-gray-50 text-gray-700 border-gray-200",
  Sports: "bg-green-50 text-green-700 border-green-200",
  Announcement: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function AdminUpdatesPage() {
  const router = useRouter();
  const { data, isLoading } = useSchoolUpdates(false);
  const deleteMutation = useDeleteSchoolUpdate();
  const updateMutation = useUpdateSchoolUpdate();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const updates = data?.data ?? [];
  const filtered = updates.filter((u) =>
    u.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleTogglePublish = (id: string, current: boolean) => {
    updateMutation.mutate({ id, published: !current });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">School Updates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage news and announcements published to the website</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-9 text-sm font-semibold shadow-sm">
          <Link href="/dashboard/admin/cms/updates/new">
            <Plus className="h-4 w-4 mr-2" />
            New Update
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search updates..."
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
          icon={Newspaper}
          title={search ? "No updates match your search" : "No school updates yet"}
          description={search ? "Try a different search term" : "Create your first school update or announcement"}
          actionLabel={!search ? "Create Update" : undefined}
          onAction={!search ? () => router.push("/dashboard/admin/cms/updates/new") : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Title</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Published</TableHead>
                <TableHead className="text-right font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((update) => (
                <TableRow key={update.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm leading-snug">{update.title}</p>
                      {update.excerpt && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{update.excerpt}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {update.category ? (
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-semibold border ${CATEGORY_COLORS[update.category] || "bg-gray-50 text-gray-700 border-gray-200"}`}
                      >
                        {update.category}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={update.published
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]"
                        : "bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]"
                      }
                    >
                      {update.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {update.publishedAt ? format(new Date(update.publishedAt), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleTogglePublish(update.id, update.published)}
                        title={update.published ? "Unpublish" : "Publish"}
                      >
                        {update.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-primary/10"
                        asChild
                      >
                        <Link href={`/dashboard/admin/cms/updates/${update.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(update.id)}
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
        title="Delete School Update"
        description="Are you sure you want to delete this update? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
