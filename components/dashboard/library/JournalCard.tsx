"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Pencil, Trash2, BookOpen, Calendar, Users, FileText, Eye } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface JournalCardProps {
  journal: {
    id: string;
    title: string;
    abstract: string;
    authors: string[];
    doi?: string;
    status: string;
    fileKey: string;
    createdAt: string;
  };
  isAdmin: boolean;
  onEdit?: (journal: any) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  PENDING: { label: "Under Review", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  APPROVED: { label: "Published", color: "bg-green-100 text-green-800 border-green-200" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
};

export function JournalCard({ journal, isAdmin, onEdit, onDelete }: JournalCardProps) {
  const handleDownload = () => {
    window.open(`/api/upload/download?key=${journal.fileKey}`, "_blank");
  };

  const status = statusConfig[journal.status as keyof typeof statusConfig] || statusConfig.APPROVED;

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group hover:border-primary/30 h-full flex flex-col relative">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-red-500 to-orange-500" />
      
      <CardHeader className="pb-3 pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link 
              href={`/dashboard/library/journals/${journal.id}`}
              className="block group/title"
            >
              <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover/title:text-primary transition-colors">
                {journal.title}
              </h3>
            </Link>
            <Badge 
              variant="outline" 
              className={cn("mt-2 text-xs font-semibold border", status.color)}
            >
              {status.label}
            </Badge>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg"
                onClick={() => onEdit?.(journal)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                onClick={() => onDelete?.(journal.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="line-clamp-1 font-medium">
            {journal.authors.slice(0, 2).join(", ")}
            {journal.authors.length > 2 && ` +${journal.authors.length - 2} more`}
          </span>
        </div>

        {journal.doi && (
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-gray-400" />
            <Badge variant="outline" className="text-xs font-mono text-gray-600 border-gray-300 bg-gray-50">
              DOI: {journal.doi}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-0">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Abstract</p>
          <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
            {journal.abstract}
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">
              {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link href={`/dashboard/library/journals/${journal.id}`} className="w-full">
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold text-xs h-9 rounded-lg transition-all"
              >
                <Eye className="h-4 w-4 mr-1.5" />
                View
              </Button>
            </Link>
            <Button 
              onClick={handleDownload}
              className="w-full bg-linear-to-r from-primary to-red-600 hover:from-primary/90 hover:to-red-700 text-white font-semibold text-xs h-9 shadow-md hover:shadow-lg transition-all rounded-lg"
            >
              <Download className="h-4 w-4 mr-1.5" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
