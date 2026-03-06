"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  Newspaper,
  Book,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  UploadCloud,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { ContentUploadModal } from "@/components/shared/modals/ContentUploadModal";

import { Database } from "lucide-react";

// --- Mock Data ---
const mockActivity = [
  { name: "Math Final 2023.pdf", type: "Past Paper", size: "2.4 MB", uploader: "Dr. Smith", status: "Published" },
  { name: "Physics Lab Guide.pdf", type: "Book", size: "1.8 MB", uploader: "Prof. Jane", status: "Published" },
  { name: "Chemistry Specimen.pdf", type: "Past Paper", size: "3.2 MB", uploader: "Dr. Brown", status: "Archived" },
];

export default function AdminUploadsPage() {
  const [search, setSearch] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 bg-red-50/50 animate-pulse rounded-lg w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl"></div>
          ))}
        </div>
        <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Content Repository ({mockActivity.length})
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage university digital library assets
          </p>
        </div>
        <Button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-500/20 h-10 px-6 transition-all"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Content</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Uploads", value: "1,284", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
          { label: "Storage Used", value: "12.4 GB", icon: Database, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Review", value: "12", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-none hover:border-gray-200 transition-all bg-white">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card View */}
      <Card className="bg-white border-gray-100 shadow-none overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-black">Recent Activity</CardTitle>
              <CardDescription className="text-xs text-gray-500">A detailed log of all recent file uploads and their current status</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by filename or uploader..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-gray-50/50 border-gray-100 focus:bg-white text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">File Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Size</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Uploader</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockActivity.map((file, i) => (
                  <TableRow key={i} className="hover:bg-red-50/30 transition-colors border-b border-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-gray-50 rounded border border-gray-100">
                          <FileText className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                        <span className="font-bold text-black text-sm">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant="outline" className="text-[10px] font-bold border-gray-100 bg-gray-50/50 text-gray-600 shadow-none">
                        {file.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-500 text-sm font-medium">{file.size}</TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-[10px] font-bold text-red-700 border border-red-100">
                          {file.uploader.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{file.uploader}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className={cn(
                        "font-bold px-2 py-0.5 rounded-full text-[10px] tracking-tight border shadow-none",
                        file.status === "Published" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {file.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors">
                            <MoreVertical className="h-4 w-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 p-1.5 shadow-xl border-gray-100">
                           <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1.5">File Ops</DropdownMenuLabel>
                           <DropdownMenuSeparator className="bg-gray-50" />
                           <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-red-50 focus:text-red-700 rounded-md">
                             <Eye className="h-4 w-4 opacity-70" /> <span>Preview File</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-red-50 focus:text-red-700 rounded-md">
                             <Edit className="h-4 w-4 opacity-70" /> <span>Edit Metadata</span>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator className="bg-gray-50" />
                           <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2 rounded-md">
                             <Trash2 className="h-4 w-4" /> <span>Delete Content</span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {/* Pagination Footer */}
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          totalItems={mockActivity.length}
          itemsPerPage={mockActivity.length}
          itemName="files"
        />
      </Card>
      <ContentUploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </div>
  );
}
