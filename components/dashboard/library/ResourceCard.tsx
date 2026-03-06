"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Pencil, Trash2, ExternalLink } from "lucide-react";

interface ResourceCardProps {
  resource: any;
  type: "book" | "paper" | "journal";
  isAdmin: boolean;
  onEdit: (resource: any) => void;
  onDelete: (id: string, type: string) => void;
}

export function ResourceCard({ resource, type, isAdmin, onEdit, onDelete }: ResourceCardProps) {
  const handleDownload = () => {
    if (type === "book" && resource.link) {
      window.open(resource.link, "_blank");
    } else {
      // Handle file download for papers and journals
      window.open(`/api/upload/download?key=${resource.fileKey}`, "_blank");
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all bg-white overflow-hidden group hover:border-red-300">
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-bold text-gray-900 line-clamp-1">{resource.title || resource.headline}</CardTitle>
            <CardDescription className="text-xs mt-1.5 text-gray-600 font-medium">
              {type === "book" && `${resource.publisher} • ${resource.category}`}
              {type === "paper" && `${resource.subject} • ${resource.year}`}
              {type === "journal" && (
                <span className="line-clamp-1">{resource.authors?.join(", ")}</span>
              )}
            </CardDescription>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                onClick={() => onEdit(resource)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                onClick={() => onDelete(resource.id, type)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {(type === "journal" || (type === "book" && resource.description)) && (
          <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {resource.abstract || resource.description}
          </p>
        )}
        {type === "journal" && resource.doi && (
          <p className="text-xs text-gray-500 mb-3 font-mono">
            DOI: {resource.doi}
          </p>
        )}
        <Button 
          onClick={handleDownload}
          className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-xs h-9 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 rounded-lg"
        >
          {type === "book" ? (
            <>
              <ExternalLink className="h-4 w-4" />
              <span>View Book</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
