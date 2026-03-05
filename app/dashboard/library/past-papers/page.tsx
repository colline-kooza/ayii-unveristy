"use client";

import { usePastPapers, useDeletePastPaper } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { FileText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { useSearchParams } from "next/navigation";

export default function PastPapersPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: papers, isLoading } = usePastPapers({ search });
  const deletePaper = useDeletePastPaper();

  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this past paper?")) await deletePaper.mutateAsync(id);
  };

  if (isLoading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl" />)}</div>;

  if (!papers?.data?.length) return <EmptyState icon={FileText} title="No papers found" description="Our examination archive is currently empty." />;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {papers.data.map((paper: any) => (
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
      <LibraryAssetModal open={modalOpen} onOpenChange={setModalOpen} type="paper" asset={editingAsset} />
    </>
  );
}
