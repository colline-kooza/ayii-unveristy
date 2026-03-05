"use client";

import { useNewspapers, useDeleteNewspaper } from "@/hooks/useLibrary";
import { ResourceCard } from "@/components/dashboard/library/ResourceCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Newspaper } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { useSearchParams } from "next/navigation";

export default function NewspapersPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const { data: newspapers, isLoading } = useNewspapers(); // Newspapers API may not support search yet but passing anyway
  const deleteNews = useDeleteNewspaper();

  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this newspaper?")) await deleteNews.mutateAsync(id);
  };

  if (isLoading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-xl" />)}</div>;

  if (!newspapers?.data?.length) return <EmptyState icon={Newspaper} title="No newspapers found" description="Daily archives are being indexed." />;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {newspapers.data.map((news: any) => (
          <ResourceCard 
            key={news.id} 
            resource={news} 
            type="newspaper" 
            isAdmin={isAdmin}
            onEdit={(n) => { setEditingAsset(n); setModalOpen(true); }}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <LibraryAssetModal open={modalOpen} onOpenChange={setModalOpen} type="newspaper" asset={editingAsset} />
    </>
  );
}
