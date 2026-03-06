"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreVertical, Eye, Edit, Trash2, CheckCircle2, UserCheck, UserX } from "lucide-react";
import { useLecturers, useUpdateLecturerStatus, useDeleteLecturer } from "@/hooks/useAdminLecturers";
import { CreateLecturerModal } from "@/components/shared/modals/CreateLecturerModal";
import { UpdateLecturerModal } from "@/components/shared/modals/UpdateLecturerModal";
import { ViewLecturerProfileModal } from "@/components/shared/modals/ViewLecturerProfileModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Lecturer } from "@/types/admin";
import { getAvatarUrl } from "@/lib/avatarUtils";

export default function LecturersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data, isLoading } = useLecturers({ page, search });
  const updateStatus = useUpdateLecturerStatus();
  const deleteLecturer = useDeleteLecturer();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState<string | null>(null);

  const handleStatusChange = async (id: string, action: "SUSPEND" | "REINSTATE") => {
    await updateStatus.mutateAsync({ id, action });
  };

  const handleDelete = (id: string) => {
    setLecturerToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (lecturerToDelete) {
      await deleteLecturer.mutateAsync(lecturerToDelete);
      setDeleteModalOpen(false);
      setLecturerToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 bg-red-50/50 animate-pulse rounded-lg w-64"></div>
        <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  const lecturers = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Lecturers {meta?.total ? `(${meta.total})` : "(0)"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage academic staff and their departments
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="bg-red-600 hover:bg-red-700 flex items-center gap-2 h-10 px-6">
          <Plus className="h-4 w-4" />
          <span>Add Lecturer</span>
        </Button>
      </div>

      {/* Table Card View */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-black">Academic Staff</CardTitle>
              <CardDescription className="text-xs text-gray-500">View and manage all university lecturers and their accounts</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!lecturers || lecturers.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={Plus}
                title="No lecturers found"
                description="Get started by adding your first lecturer to the faculty"
                actionLabel="Add Lecturer"
                onAction={() => setCreateModalOpen(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Lecturer Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Email Address</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Department</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Specialization</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lecturers.map((lecturer: Lecturer) => (
                    <TableRow key={lecturer.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-3 px-4">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full border border-gray-200 overflow-hidden bg-red-50 flex items-center justify-center flex-shrink-0">
                              <img 
                                src={getAvatarUrl(lecturer.image, lecturer.name, 'lecturer')} 
                                alt={lecturer.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <span className="font-semibold text-black text-sm">{lecturer.name}</span>
                         </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-600 text-sm">{lecturer.email}</TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium text-xs">
                          {lecturer.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-600 text-sm">{lecturer.specialization || "General"}</TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge
                          variant={lecturer.status === "ACTIVE" ? "default" : "destructive"}
                          className={cn(
                            "font-medium px-2 py-0.5 text-xs",
                            lecturer.status === "ACTIVE" 
                              ? "bg-green-100 text-green-700 hover:bg-green-100" 
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          )}
                        >
                          {lecturer.status}
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
                             <DropdownMenuLabel className="text-xs font-semibold text-gray-500">Management</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem 
                               className="cursor-pointer gap-2"
                               onClick={() => {
                                 setSelectedLecturer(lecturer);
                                 setViewModalOpen(true);
                               }}
                             >
                               <Eye className="h-4 w-4" /> <span>View Profile</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                               className="cursor-pointer gap-2"
                               onClick={() => {
                                 setSelectedLecturer(lecturer);
                                 setEditModalOpen(true);
                               }}
                             >
                               <Edit className="h-4 w-4" /> <span>Edit Details</span>
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             {lecturer.status === "ACTIVE" ? (
                               <DropdownMenuItem
                                 className="text-red-600 cursor-pointer gap-2"
                                 onClick={() => handleStatusChange(lecturer.id, "SUSPEND")}
                               >
                                <UserX className="h-4 w-4" /> <span>Suspend Lecturer</span>
                               </DropdownMenuItem>
                             ) : (
                               <DropdownMenuItem
                                 className="text-green-600 cursor-pointer gap-2"
                                 onClick={() => handleStatusChange(lecturer.id, "REINSTATE")}
                                >
                                <UserCheck className="h-4 w-4" /> <span>Activate Lecturer</span>
                               </DropdownMenuItem>
                             )}
                             <DropdownMenuSeparator />
                             <DropdownMenuItem
                               className="text-red-600 cursor-pointer gap-2"
                               onClick={() => handleDelete(lecturer.id)}
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
            itemName="lecturers"
          />
        )}
      </Card>

      <CreateLecturerModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      <UpdateLecturerModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        lecturer={selectedLecturer} 
      />
      <ViewLecturerProfileModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        lecturer={selectedLecturer}
      />
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Lecturer Account"
        description="Are you sure you want to delete this lecturer? This action will permanently remove their access and data from the system."
        isLoading={deleteLecturer.isPending}
      />
    </div>
  );
}
