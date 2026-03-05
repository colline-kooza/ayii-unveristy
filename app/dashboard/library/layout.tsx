"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Library } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;

  const [modalOpen, setModalOpen] = useState(false);
  const activeTab = pathname.split("/").pop() || "books";

  const onTabChange = (value: string) => {
    router.push(`/dashboard/library/${value}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/20 min-h-screen">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Library className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Digital Library</h1>
            <p className="text-xs text-gray-500 font-medium">Research, journals, and academic archives</p>
          </div>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-fit">
            <TabsList className="bg-gray-100/50 p-1 border border-gray-100 italic">
              <TabsTrigger value="books" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-[11px] px-5 h-7">Books</TabsTrigger>
              <TabsTrigger value="past-papers" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-[11px] px-5 h-7">Past Papers</TabsTrigger>
              <TabsTrigger value="journals" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-[11px] px-5 h-7">Journals</TabsTrigger>
              <TabsTrigger value="newspapers" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-bold text-[11px] px-5 h-7">Newspapers</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 font-bold" />
            <Input
              placeholder="Search library assets..."
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.value) params.set("search", e.target.value);
                else params.delete("search");
                router.replace(`${pathname}?${params.toString()}`);
              }}
              defaultValue={typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("search") || "" : ""}
              className="pl-9 h-9 bg-white border-gray-100 focus:border-blue-200 focus:ring-blue-100 text-xs shadow-none rounded-xl"
            />
          </div>
        </div>

        {children}
      </div>

      <LibraryAssetModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        type={activeTab === "past-papers" ? "paper" : activeTab as any} 
      />
    </div>
  );
}
