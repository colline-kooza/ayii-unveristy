"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Pencil, Trash2 } from "lucide-react";

interface ResourceCardProps {
  resource: any;
  type: "book" | "paper" | "journal" | "newspaper";
  isAdmin: boolean;
  onEdit: (resource: any) => void;
  onDelete: (id: string, type: string) => void;
}

export function ResourceCard({ resource, type, isAdmin, onEdit, onDelete }: ResourceCardProps) {
  return (
    <Card className="border-gray-100 shadow-none hover:border-gray-200 transition-all bg-white overflow-hidden group">
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-bold text-gray-900 line-clamp-1">{resource.title || resource.headline}</CardTitle>
            <CardDescription className="text-[11px] mt-1 text-gray-500 font-medium uppercase tracking-tight">
              {type === "book" && `${resource.author} • ${resource.category}`}
              {type === "paper" && `${resource.subject} • ${resource.year}`}
              {type === "journal" && resource.authors?.join(", ")}
              {type === "newspaper" && `${resource.edition} • ${new Date(resource.publishedDate).toLocaleDateString()}`}
            </CardDescription>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-gray-400 hover:text-blue-600"
                onClick={() => onEdit(resource)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-gray-400 hover:text-red-600"
                onClick={() => onDelete(resource.id, type)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {(type === "journal" || (type === "book" && resource.description)) && (
          <p className="text-[11px] text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {resource.abstract || resource.description}
          </p>
        )}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] h-8 shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 rounded-lg">
          <Download className="h-3 w-3" />
          <span>Download PDF</span>
        </Button>
      </CardContent>
    </Card>
  );
}
