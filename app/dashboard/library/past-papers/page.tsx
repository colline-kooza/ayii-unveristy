"use client";

import { usePastPapers, useDeletePastPaper } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { ResourceGridSkeleton } from "@/components/dashboard/library/ResourceCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useSearchParams } from "next/navigation";

interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: number;
  courseUnit: string;
  fileKey: string;
}

export default function PastPapersPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: papers, isLoading } = usePastPapers({ search });
  const deletePaper = useDeletePastPaper();

  const [editingAsset, setEditingAsset] = useState<PastPaper | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPaperToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (paperToDelete) {
      await deletePaper.mutateAsync(paperToDelete);
      setDeleteModalOpen(false);
      setPaperToDelete(null);
    }
  };

  if (isLoading) return <ResourceGridSkeleton />;

  return (
    <>
      {papers?.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {papers.data.map((paper: PastPaper) => (
            <ResourceCard
              key={paper.id}
              resource={paper}
              type="paper"
              isAdmin={isAdmin}
              onEdit={(p) => { setEditingAsset(p); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No papers found"
          description="Our examination archive is currently empty."
        />
      )}

      {/* Edit modal (Create is handled by the layout's Add Resource button) */}
      <LibraryAssetModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingAsset(null);
        }}
        type="paper"
        asset={editingAsset}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Remove Past Paper"
        description="Are you sure you want to remove this past paper? This will permanently delete the examination record from the archive."
        isLoading={deletePaper.isPending}
      />
    </>
  );
}
