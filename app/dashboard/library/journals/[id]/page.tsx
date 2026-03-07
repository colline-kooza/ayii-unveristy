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
  Loader2,
  Copy,
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
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    description: "Currently under peer review",
  },
  APPROVED: {
    label: "Published",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
    description: "Peer-reviewed and published",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
    description: "Did not meet publication criteria",
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

  const {
    data: journal,
    isLoading,
    error,
  } = useQuery({
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
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async () => {
    await deleteJournal.mutateAsync(params.id as string);
    setDeleteModalOpen(false);
    router.push("/dashboard/library/journals");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Loading journal…</p>
        </div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-sm">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold mb-1">Journal Not Found</h3>
            <p className="text-xs text-muted-foreground mb-4">
              This journal doesn&apos;t exist or has been removed.
            </p>
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/library/journals")}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to Journals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status =
    statusConfig[journal.status as keyof typeof statusConfig] ||
    statusConfig.APPROVED;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-4">
      {/* Top nav bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/library/journals")}
          className="gap-1.5 text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Journals
        </Button>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground"
                onClick={() => setEditModalOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Hero card */}
      <div className="relative rounded-xl border bg-gradient-to-br from-slate-50 via-white to-primary/5 overflow-hidden shadow-sm">
        {/* Colour strip */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary via-rose-500 to-orange-400" />

        <div className="px-5 pt-6 pb-5 flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <Badge
              variant="outline"
              className={cn(
                "mb-2 text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1",
                status.color
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
              {status.label} · {status.description}
            </Badge>

            {/* Title */}
            <h1 className="text-base font-semibold text-gray-900 leading-snug">
              {journal.title}
            </h1>

            {/* Authors row */}
            {journal.authors?.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {journal.authors.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* ── Left column ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Authors card */}
          <Card className="shadow-none">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <Users className="h-3.5 w-3.5" />
                Authors
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {journal.authors.map((author: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-bold">
                        {author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-gray-800">
                      {author}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Abstract card */}
          <Card className="shadow-none">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <FileText className="h-3.5 w-3.5" />
                Abstract
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                {journal.abstract}
              </p>
            </CardContent>
          </Card>

          {/* Rejection reason */}
          {journal.rejectionReason && journal.status === "REJECTED" && (
            <Card className="shadow-none border-red-200 bg-red-50">
              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold text-red-700 uppercase tracking-wide">
                  <XCircle className="h-3.5 w-3.5" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xs text-red-700 leading-relaxed">
                  {journal.rejectionReason}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right column ────────────────────────────────── */}
        <div className="space-y-4">
          {/* Actions card */}
          <Card className="shadow-none border-primary/20">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <Button
                size="sm"
                onClick={handleDownload}
                className="w-full h-8 text-xs gap-1.5 bg-gradient-to-r from-primary to-rose-600 hover:opacity-90 transition-opacity font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
                onClick={handleShare}
              >
                <Share2 className="h-3.5 w-3.5" />
                Share Journal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs gap-1.5 text-muted-foreground"
              >
                <Bookmark className="h-3.5 w-3.5" />
                Save for Later
              </Button>
            </CardContent>
          </Card>

          {/* Publication details card */}
          <Card className="shadow-none">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Publication Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {/* Date */}
              <div className="flex items-start gap-2.5">
                <Calendar className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    Published
                  </p>
                  <p className="text-xs font-medium text-gray-800">
                    {new Date(journal.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* DOI */}
              {journal.doi && (
                <>
                  <Separator />
                  <div className="flex items-start gap-2.5">
                    <FileText className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        DOI
                      </p>
                      <div className="flex items-center gap-1.5">
                        <code className="text-[10px] font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 break-all flex-1 min-w-0">
                          {journal.doi}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(journal.doi);
                            toast.success("DOI copied");
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Contributors */}
              <Separator />
              <div className="flex items-start gap-2.5">
                <Users className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    Contributors
                  </p>
                  <p className="text-xs font-medium text-gray-800">
                    {journal.authors.length}{" "}
                    {journal.authors.length === 1 ? "Author" : "Authors"}
                  </p>
                </div>
              </div>

              {/* Submitted by */}
              {journal.submittedBy && (
                <>
                  <Separator />
                  <div className="flex items-start gap-2.5">
                    <Users className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                        Submitted By
                      </p>
                      <p className="text-xs font-medium text-gray-800">
                        {journal.submittedBy.name || journal.submittedBy.email}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Citation card */}
          <Card className="shadow-none bg-gray-50/60 border-gray-100">
            <CardHeader className="px-4 pt-4 pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                How to Cite
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <p className="text-[10px] font-mono text-gray-600 leading-relaxed">
                  {journal.authors.join(", ")} (
                  {new Date(journal.createdAt).getFullYear()}). {journal.title}.
                  {journal.doi && ` DOI: ${journal.doi}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  const citation = `${journal.authors.join(", ")} (${new Date(journal.createdAt).getFullYear()}). ${journal.title}.${journal.doi ? ` DOI: ${journal.doi}` : ""}`;
                  navigator.clipboard.writeText(citation);
                  toast.success("Citation copied");
                }}
              >
                <Copy className="h-3 w-3" />
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
