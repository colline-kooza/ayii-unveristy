"use client";

import { useJournals, useDeleteJournal } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { ResourceGridSkeleton } from "@/components/dashboard/library/ResourceCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useSearchParams } from "next/navigation";

interface Journal {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  doi?: string;
  status: string;
  fileKey: string;
}

export default function JournalsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: journals, isLoading } = useJournals({ search });
  const deleteJournal = useDeleteJournal();

  const [editingAsset, setEditingAsset] = useState<Journal | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setJournalToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (journalToDelete) {
      await deleteJournal.mutateAsync(journalToDelete);
      setDeleteModalOpen(false);
      setJournalToDelete(null);
    }
  };

  if (isLoading) return <ResourceGridSkeleton />;

  return (
    <>
      {journals?.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {journals.data.map((journal: Journal) => (
            <ResourceCard
              key={journal.id}
              resource={journal}
              type="journal"
              isAdmin={isAdmin}
              onEdit={(j: Journal) => { setEditingAsset(j); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No journals found"
          description="Scholarly articles coming soon."
        />
      )}

      {/* Edit modal (Create is handled by the layout's Add Resource button) */}
      <LibraryAssetModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingAsset(null);
        }}
        type="journal"
        asset={editingAsset}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Remove Journal"
        description="Are you sure you want to remove this scholarly journal? This will permanently delete the article from the digital repository."
        isLoading={deleteJournal.isPending}
      />
    </>
  );
}
