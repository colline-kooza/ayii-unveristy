"use client";

import { useBooks, useDeleteBook } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Book } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { useSearchParams } from "next/navigation";

export default function BooksPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: books, isLoading } = useBooks({ search });
  const deleteBook = useDeleteBook();

  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this book?")) await deleteBook.mutateAsync(id);
  };

  if (isLoading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl" />)}</div>;

  if (!books?.data?.length) return <EmptyState icon={Book} title="No books found" description="The library collection is being updated." />;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {books.data.map((book: any) => (
          <ResourceCard 
            key={book.id} 
            resource={book} 
            type="book" 
            isAdmin={isAdmin}
            onEdit={(b) => { setEditingAsset(b); setModalOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <LibraryAssetModal open={modalOpen} onOpenChange={setModalOpen} type="book" asset={editingAsset} />
    </>
  );
}
