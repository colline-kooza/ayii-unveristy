"use client";

import { PageSelector } from "@/components/admin/cms/page-selector";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, BookOpen, Trash2, Globe } from "lucide-react";
import { usePastPapers, useJournals, useReviewJournal, useDeletePastPaper, useDeleteJournal } from "@/hooks/useLibrary";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Journal {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  status: string;
  submittedBy?: {
    name: string | null;
  };
  createdAt: string; // Added based on usage in the component
}

interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: number;
  uploadedBy?: {
    name: string | null;
  };
}

export default function AdminContentPage() {
  const { data: pastPapersData, isLoading: loadingPapers } = usePastPapers();
  const { data: journalsData, isLoading: loadingJournals } = useJournals({ status: "PENDING" });
  const reviewJournal = useReviewJournal();
  const deletePastPaper = useDeletePastPaper();
  const deleteJournal = useDeleteJournal();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "PAPER" | "JOURNAL" } | null>(null);

  const handleReviewJournal = async (id: string, action: "APPROVE" | "REJECT") => {
    await reviewJournal.mutateAsync({ id, action });
  };

  const handleDelete = (id: string, type: "PAPER" | "JOURNAL") => {
    setItemToDelete({ id, type });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === "PAPER") {
      await deletePastPaper.mutateAsync(itemToDelete.id);
    } else {
      await deleteJournal.mutateAsync(itemToDelete.id);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Content Management</h1>
        <p className="text-gray-600 mt-1">Manage library resources and website content</p>
      </div>

      {/* Website Content Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal" />
              Website Content Editor
            </h2>
            <p className="text-sm text-gray-600 mt-1">Edit homepage and other pages</p>
          </div>
        </div>
        <PageSelector />
      </div>

      <Tabs defaultValue="journals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="journals">Pending Journals</TabsTrigger>
          <TabsTrigger value="papers">Past Papers</TabsTrigger>
        </TabsList>

        <TabsContent value="journals" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Upload Journal</span>
            </Button>
          </div>

          {loadingJournals ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : !journalsData?.data || journalsData.data.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No pending journals"
              description="All journals have been reviewed"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Authors</TableHead>
                      <TableHead>Submitted By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalsData.data.map((journal: Journal) => (
                      <TableRow key={journal.id}>
                        <TableCell className="font-medium">{journal.title}</TableCell>
                        <TableCell>{journal.authors?.join(", ")}</TableCell>
                        <TableCell>{journal.submittedBy?.name}</TableCell>
                        <TableCell>{new Date(journal.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {journal.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleReviewJournal(journal.id, "APPROVE")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(journal.id, "JOURNAL")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="papers" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Upload Past Paper</span>
            </Button>
          </div>

          {loadingPapers ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : !pastPapersData?.data || pastPapersData.data.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No past papers"
              description="Upload past papers for students to access"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastPapersData.data.map((paper: PastPaper) => (
                      <TableRow key={paper.id}>
                        <TableCell className="font-medium">{paper.title}</TableCell>
                        <TableCell>{paper.subject}</TableCell>
                        <TableCell>{paper.year}</TableCell>
                        <TableCell>{paper.uploadedBy?.name}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(paper.id, "PAPER")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

      </Tabs>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title={itemToDelete?.type === "PAPER" ? "Delete Past Paper" : "Remove Journal"}
        description={itemToDelete?.type === "PAPER" 
          ? "Are you sure you want to delete this past paper? This action cannot be undone."
          : "Are you sure you want to remove this journal from the pending review queue?"
        }
        isLoading={deletePastPaper.isPending || deleteJournal.isPending}
      />
    </div>
  );
}
