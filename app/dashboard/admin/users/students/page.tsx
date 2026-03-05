"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Search, MoreVertical, Eye, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudents, useUpdateStudentStatus } from "@/hooks/useAdminStudents";
import { CreateStudentModal } from "@/components/shared/modals/CreateStudentModal";
import { UpdateStudentModal } from "@/components/shared/modals/UpdateStudentModal";
import { BulkUploadModal } from "@/components/shared/modals/BulkUploadModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const { data, isLoading } = useStudents({ page, search, limit: 10 });
  const updateStatus = useUpdateStudentStatus();

  const handleStatusChange = async (id: string, action: "SUSPEND" | "REINSTATE") => {
    await updateStatus.mutateAsync({ id, action });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 bg-blue-50/50 animate-pulse rounded-lg w-64"></div>
        <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  const students = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Students {meta?.total ? `(${meta.total})` : "(0)"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage student accounts and view their progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setBulkModalOpen(true)}
            variant="outline" 
            className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 h-10"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Button>
          <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/20 h-10 px-6 transition-all">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Table Card View */}
      <Card className="bg-white border-gray-100 shadow-none overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900">Student Directory</CardTitle>
              <CardDescription className="text-xs text-gray-500">A complete list of registered students and their current status</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, email or reg no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-gray-50/50 border-gray-100 focus:bg-white text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!students || students.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <EmptyState
                icon={Plus}
                title="No students found"
                description="Get started by adding your first student to the system"
                actionLabel="Add Student"
                onAction={() => setCreateModalOpen(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Student Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Email Address</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Reg. Number</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Department</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: Student) => (
                    <TableRow key={student.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                      <TableCell className="py-4 px-6">
                         <div className="flex items-center gap-3">
                            <Avatar size="sm" className="border border-blue-100">
                              <AvatarImage src={student.avatarUrl} />
                              <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-[10px]">
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                               <span className="font-bold text-gray-900 text-sm">{student.name}</span>
                               <span className="text-[10px] text-gray-400 font-medium">{student.id.substring(0, 8)}...</span>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-500 text-sm font-medium">{student.email}</TableCell>
                      <TableCell className="py-4 px-6">
                        <code className="bg-blue-50/50 text-blue-700 px-2.5 py-1 rounded text-xs font-bold border border-blue-100/30">
                          {student.registrationNumber}
                        </code>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700 text-sm font-medium">{student.department}</TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge
                          variant={student.status === "ACTIVE" ? "default" : "destructive"}
                          className={cn(
                            "font-bold px-2.5 py-0.5 rounded-full text-[10px] tracking-tight border shadow-none",
                            student.status === "ACTIVE" 
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          {student.status}
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
                             <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1.5">Administration</DropdownMenuLabel>
                             <DropdownMenuSeparator className="bg-gray-50" />
                             <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-blue-50 focus:text-blue-700 rounded-md">
                               <Eye className="h-4 w-4 opacity-70" /> <span>View Portfolio</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                               className="cursor-pointer gap-2 focus:bg-blue-50 focus:text-blue-700 rounded-md"
                               onClick={() => {
                                 setSelectedStudent(student);
                                 setEditModalOpen(true);
                               }}
                             >
                               <Edit className="h-4 w-4 opacity-70" /> <span>Edit Profile</span>
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-gray-50" />
                             {student.status === "ACTIVE" ? (
                               <DropdownMenuItem
                                 className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2 rounded-md"
                                 onClick={() => handleStatusChange(student.id, "SUSPEND")}
                               >
                                <Trash2 className="h-4 w-4" /> <span>Suspend Student</span>
                               </DropdownMenuItem>
                             ) : (
                               <DropdownMenuItem
                                 className="text-green-600 focus:bg-green-50 focus:text-green-700 cursor-pointer gap-2 rounded-md"
                                 onClick={() => handleStatusChange(student.id, "REINSTATE")}
                                >
                                <CheckCircle2 className="h-4 w-4" /> <span>Activate Student</span>
                               </DropdownMenuItem>
                             )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {/* Pagination Footer */}
        {meta && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            totalItems={meta.total}
            itemsPerPage={10}
            itemName="students"
          />
        )}
      </Card>

      <CreateStudentModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <UpdateStudentModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        student={selectedStudent} 
      />
      <BulkUploadModal open={bulkModalOpen} onOpenChange={setBulkModalOpen} />
    </div>
  );
}
