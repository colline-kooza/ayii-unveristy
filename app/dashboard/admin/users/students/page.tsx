"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Search, MoreVertical, Eye, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudents, useUpdateStudentStatus, useDeleteStudent } from "@/hooks/useAdminStudents";
import { getAvatarUrl } from "@/lib/avatarUtils";
import { CreateStudentModal } from "@/components/shared/modals/CreateStudentModal";
import { UpdateStudentModal } from "@/components/shared/modals/UpdateStudentModal";
import { BulkUploadModal } from "@/components/shared/modals/BulkUploadModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { ViewStudentProfileModal } from "@/components/shared/modals/ViewStudentProfileModal";
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

export default function StudentsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const { data, isLoading } = useStudents({ page, search, limit: 10 });
  const updateStatus = useUpdateStudentStatus();
  const deleteStudent = useDeleteStudent();

  const handleStatusChange = async (id: string, action: "SUSPEND" | "REINSTATE") => {
    await updateStatus.mutateAsync({ id, action });
  };

  const handleDelete = (id: string) => {
    setStudentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete) {
      await deleteStudent.mutateAsync(studentToDelete);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 bg-rose-50/50 animate-pulse rounded-lg w-64"></div>
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
          <h1 className="text-2xl font-bold tracking-tight text-black">
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
            className="flex items-center gap-2 h-10"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Button>
          <Button onClick={() => setCreateModalOpen(true)} className="bg-primary hover:bg-primary/90 flex items-center gap-2 h-10 px-6">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>

      {/* Table Card View */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-black">Student Directory</CardTitle>
              <CardDescription className="text-xs text-gray-500">A complete list of registered students and their current status</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, email or reg no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-sm"
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
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Student Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Email Address</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Reg. Number</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Department</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: Student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-3 px-4">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full border border-gray-200 overflow-hidden bg-rose-50 flex items-center justify-center flex-shrink-0">
                              <img 
                                src={getAvatarUrl(student.image, student.name, 'student')} 
                                alt={student.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex flex-col">
                               <span className="font-semibold text-black text-sm">{student.name}</span>
                               <span className="text-xs text-gray-400">{student.id.substring(0, 8)}...</span>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-600 text-sm">{student.email}</TableCell>
                      <TableCell className="py-3 px-4">
                        <code className="bg-rose-50 text-[#8B1538] px-2 py-1 rounded text-xs font-medium border border-rose-200">
                          {student.registrationNumber}
                        </code>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-700 text-sm">{student.department}</TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge
                          variant={student.status === "ACTIVE" ? "default" : "destructive"}
                          className={cn(
                            "font-medium px-2 py-0.5 text-xs",
                            student.status === "ACTIVE" 
                              ? "bg-green-100 text-green-700 hover:bg-green-100" 
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          )}
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                             <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Administration</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem 
                               className="cursor-pointer gap-2"
                               onClick={() => {
                                 setSelectedStudent(student);
                                 setViewModalOpen(true);
                               }}
                             >
                               <Eye className="h-4 w-4" /> <span>View Portfolio</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                               className="cursor-pointer gap-2"
                               onClick={() => {
                                 setSelectedStudent(student);
                                 setEditModalOpen(true);
                               }}
                             >
                               <Edit className="h-4 w-4" /> <span>Edit Profile</span>
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             {student.status === "ACTIVE" ? (
                               <DropdownMenuItem
                                 className="text-red-600 cursor-pointer gap-2"
                                 onClick={() => handleStatusChange(student.id, "SUSPEND")}
                               >
                                <Trash2 className="h-4 w-4" /> <span>Suspend Student</span>
                               </DropdownMenuItem>
                             ) : (
                               <DropdownMenuItem
                                 className="text-green-600 cursor-pointer gap-2"
                                 onClick={() => handleStatusChange(student.id, "REINSTATE")}
                                >
                                <CheckCircle2 className="h-4 w-4" /> <span>Activate Student</span>
                               </DropdownMenuItem>
                             )}
                             <DropdownMenuSeparator />
                             <DropdownMenuItem
                               className="text-red-600 cursor-pointer gap-2"
                               onClick={() => handleDelete(student.id)}
                             >
                               <Trash2 className="h-4 w-4" /> <span>Delete Account</span>
                             </DropdownMenuItem>
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
      <ViewStudentProfileModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        student={selectedStudent}
      />
      <BulkUploadModal open={bulkModalOpen} onOpenChange={setBulkModalOpen} />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Student Account"
        description="Are you sure you want to delete this student? This action will permanently remove their access and data from the system."
        isLoading={deleteStudent.isPending}
      />
    </div>
  );
}
