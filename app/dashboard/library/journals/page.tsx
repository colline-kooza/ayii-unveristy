"use client";

import { useJournals, useDeleteJournal } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { useSearchParams } from "next/navigation";

export default function JournalsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: journals, isLoading } = useJournals({ search });
  const deleteJournal = useDeleteJournal();

  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this journal?")) await deleteJournal.mutateAsync(id);
  };

  if (isLoading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl" />)}</div>;

  if (!journals?.data?.length) return <EmptyState icon={BookOpen} title="No journals found" description="Scholarly articles coming soon." />;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {journals.data.map((journal: any) => (
          <ResourceCard 
            key={journal.id} 
            resource={journal} 
            type="journal" 
            isAdmin={isAdmin}
            onEdit={(j) => { setEditingAsset(j); setModalOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <LibraryAssetModal open={modalOpen} onOpenChange={setModalOpen} type="journal" asset={editingAsset} />
    </>
  );
}
