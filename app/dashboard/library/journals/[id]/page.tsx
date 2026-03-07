"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Download, 
  Users, 
  Calendar, 
  FileText, 
  ExternalLink,
  BookOpen,
  Pencil,
  Trash2,
  Share2,
  Bookmark,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/generated/prisma";
import { useState } from "react";
import { LibraryAssetModal } from "@/components/shared/modals/LibraryAssetModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { useDeleteJournal } from "@/hooks/useLibrary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusConfig = {
  PENDING: { 
    label: "Under Review", 
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "This journal is currently under peer review"
  },
  APPROVED: { 
    label: "Published", 
    icon: CheckCircle2,
    color: "bg-green-100 text-green-800 border-green-200",
    description: "This journal has been peer-reviewed and published"
  },
  REJECTED: { 
    label: "Rejected", 
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    description: "This journal did not meet publication criteria"
  },
};

export default function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isAdmin = (session?.user as any)?.role === UserRole.ADMIN;
  const deleteJournal = useDeleteJournal();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: journal, isLoading, error } = useQuery({
    queryKey: ["journal", params.id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/library/journals/${params.id}`);
      return data;
    },
  });

  const handleDownload = () => {
    if (journal?.fileKey) {
      window.open(`/api/upload/download?key=${journal.fileKey}`, "_blank");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async () => {
    await deleteJournal.mutateAsync(params.id as string);
    setDeleteModalOpen(false);
    router.push("/dashboard/library/journals");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading journal...</p>
        </div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Journal Not Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The journal you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/dashboard/library/journals")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[journal.status as keyof typeof statusConfig] || statusConfig.APPROVED;
  const StatusIcon = status.icon;

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/library/journals")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journals
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {isAdmin && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditModalOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Status */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-primary via-red-500 to-orange-500" />
            <CardHeader className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge 
                    variant="outline" 
                    className={cn("mb-3 text-xs font-semibold border", status.color)}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {journal.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {status.description}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Authors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Authors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {journal.authors.map((author: string, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-900">{author}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Abstract */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {journal.abstract}
              </p>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {journal.rejectionReason && journal.status === "REJECTED" && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-800">
                  <XCircle className="h-5 w-5" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  {journal.rejectionReason}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleDownload}
                className="w-full bg-linear-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Journal
              </Button>
              <Button 
                variant="outline"
                className="w-full"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publication Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Published Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {journal.doi && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Digital Object Identifier
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200 break-all">
                          {journal.doi}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(journal.doi);
                            toast.success("DOI copied");
                          }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Contributors
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {journal.authors.length} {journal.authors.length === 1 ? 'Author' : 'Authors'}
                  </p>
                </div>
              </div>

              {journal.submittedBy && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Submitted By
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {journal.submittedBy.name || journal.submittedBy.email}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Citation */}
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">How to Cite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-xs font-mono text-gray-700 leading-relaxed">
                  {journal.authors.join(", ")} ({new Date(journal.createdAt).getFullYear()}). 
                  {" "}{journal.title}. 
                  {journal.doi && ` DOI: ${journal.doi}`}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full mt-2 text-xs"
                onClick={() => {
                  const citation = `${journal.authors.join(", ")} (${new Date(journal.createdAt).getFullYear()}). ${journal.title}.${journal.doi ? ` DOI: ${journal.doi}` : ''}`;
                  navigator.clipboard.writeText(citation);
                  toast.success("Citation copied");
                }}
              >
                Copy Citation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <LibraryAssetModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        type="journal"
        asset={journal}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        title="Delete Journal"
        description="Are you sure you want to delete this journal? This action cannot be undone."
        isLoading={deleteJournal.isPending}
      />
    </div>
  );
}
