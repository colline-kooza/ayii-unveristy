"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, BookOpen, Newspaper } from "lucide-react";
import { usePastPapers, useJournals, useNewspapers, useReviewJournal } from "@/hooks/useLibrary";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminContentPage() {
  const { data: pastPapers, isLoading: loadingPapers } = usePastPapers();
  const { data: journals, isLoading: loadingJournals } = useJournals({ status: "PENDING" });
  const { data: newspapers, isLoading: loadingNews } = useNewspapers();
  const reviewJournal = useReviewJournal();

  const handleReviewJournal = async (id: string, action: "APPROVE" | "REJECT") => {
    await reviewJournal.mutateAsync({ id, action });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-1">Manage library resources and publications</p>
      </div>

      <Tabs defaultValue="journals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="journals">Pending Journals</TabsTrigger>
          <TabsTrigger value="papers">Past Papers</TabsTrigger>
          <TabsTrigger value="newspapers">Newspapers</TabsTrigger>
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
          ) : !journals?.data || journals.data.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No pending journals"
              description="All journals have been reviewed"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
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
                  {journals.data.map((journal: any) => (
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
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReviewJournal(journal.id, "REJECT")}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
          ) : !pastPapers?.data || pastPapers.data.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No past papers"
              description="Upload past papers for students to access"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
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
                  {pastPapers.data.map((paper: any) => (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium">{paper.title}</TableCell>
                      <TableCell>{paper.subject}</TableCell>
                      <TableCell>{paper.year}</TableCell>
                      <TableCell>{paper.uploadedBy?.name}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-red-600">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="newspapers" className="space-y-4">
          <div className="flex justify-end">
            <Button className="bg-primary hover:bg-primary/90 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Upload Newspaper</span>
            </Button>
          </div>

          {loadingNews ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          ) : !newspapers?.data || newspapers.data.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No newspapers"
              description="Upload university newspapers for the community"
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Headline</TableHead>
                    <TableHead>Edition</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newspapers.data.map((newspaper: any) => (
                    <TableRow key={newspaper.id}>
                      <TableCell className="font-medium">{newspaper.headline}</TableCell>
                      <TableCell>{newspaper.edition}</TableCell>
                      <TableCell>{new Date(newspaper.publishedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{newspaper.uploadedBy?.name}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="text-red-600">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
