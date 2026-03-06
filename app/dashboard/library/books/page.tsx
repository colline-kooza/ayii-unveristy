"use client";

import { useBooks, useDeleteBook } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { ResourceGridSkeleton } from "@/components/dashboard/library/ResourceCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Book as BookIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useSearchParams } from "next/navigation";

interface Book {
  id: string;
  title: string;
  publisher: string;
  category: string;
  coverImage?: string;
  link: string;
}

export default function BooksPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: books, isLoading } = useBooks({ search });
  const deleteBook = useDeleteBook();

  const [editingAsset, setEditingAsset] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (bookToDelete) {
      await deleteBook.mutateAsync(bookToDelete);
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  if (isLoading) return <ResourceGridSkeleton />;

  return (
    <>
      {books?.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {books.data.map((book: Book) => (
            <ResourceCard
              key={book.id}
              resource={book}
              type="book"
              isAdmin={isAdmin}
              onEdit={(b: Book) => { setEditingAsset(b); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookIcon}
          title="No books found"
          description="The library collection is being updated."
        />
      )}

      {/* Edit modal (Create is handled by the layout's Add Resource button) */}
      <LibraryAssetModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingAsset(null);
        }}
        type="book"
        asset={editingAsset}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Remove Book from Library"
        description="Are you sure you want to remove this book? This will permanently delete the entry and associated files from the digital library."
        isLoading={deleteBook.isPending}
      />
    </>
  );
}
