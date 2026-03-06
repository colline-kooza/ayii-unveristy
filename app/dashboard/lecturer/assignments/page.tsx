"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  Users, 
  ChevronRight,
  Loader2,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { useAssignments, useDeleteAssignment } from "@/hooks/useAssignments";
import { CreateAssignmentModal } from "@/components/shared/modals/CreateAssignmentModal";
import { ViewSubmissionsModal } from "@/components/shared/modals/ViewSubmissionsModal";
import { ConfirmDeleteModal } from "@/components/shared/modals/ConfirmDeleteModal";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  instructions?: string;
  dueDate: string | Date;
  fileKey?: string;
  courseId: string;
  course?: {
    title: string;
    unitCode: string;
  };
  _count?: {
    submissions: number;
  };
}

export default function LecturerAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{id: string, title: string, instructions?: string, dueDate: string | Date, fileKey?: string, courseId?: string} | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<{ courseId: string; assignmentId: string } | null>(null);

  const { data: myCourses, isLoading: isLoadingCourses } = useMyCoursesLecturer();
  
  // For a dedicated assignments page, we ideally want ALL assignments across all courses.
  // The useAssignments hook currently takes a courseId. 
  // For now, we'll implement a course selector or show assignments from all if the backend supports it.
  // Since we are building the UI, let's assume we can filter by course.
  
  const { data: assignments, isLoading: isLoadingAssignments } = useAssignments(selectedCourseId || (myCourses?.[0]?.id || ""));
  const deleteAssignment = useDeleteAssignment();

  const filteredAssignments = assignments?.filter((item: Assignment) => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (courseId: string, id: string) => {
    setAssignmentToDelete({ courseId, assignmentId: id });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (assignmentToDelete) {
      await deleteAssignment.mutateAsync(assignmentToDelete);
      setDeleteModalOpen(false);
      setAssignmentToDelete(null);
    }
  };

  if (isLoadingCourses) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen">
      {/* Compact Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Assignment Ledger
          </h1>
          <p className="text-[13px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Task Orchestration & Academic Distribution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsAssignmentModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-2 h-10 px-6 rounded-xl text-[13px] font-black transition-all"
            disabled={!myCourses || myCourses.length === 0}
          >
            <Plus className="h-4 w-4" />
            Establish Assignment
          </Button>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search assignments..." 
            className="pl-10 h-10 text-[13px] border-none bg-gray-50 rounded-xl focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            className="h-10 px-4 text-[13px] font-bold text-gray-600 bg-gray-50 border-none rounded-xl focus:ring-primary/20 outline-none cursor-pointer"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">All Courses</option>
            {myCourses?.map((course: { id: string; title: string; unitCode: string }) => (
              <option key={course.id} value={course.id}>{course.title} ({course.unitCode})</option>
            ))}
          </select>
          <Button variant="outline" className="h-10 px-5 rounded-xl border-gray-100 text-[12px] font-black uppercase tracking-widest gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Assignments Grid/List */}
      <div className="grid gap-4">
        {isLoadingAssignments ? (
          <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment: Assignment) => (
            <Card key={assignment.id} className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all group">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-black text-black group-hover:text-primary transition-colors">{assignment.title}</h3>
                        <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] font-black uppercase tracking-widest">
                          {assignment.course?.unitCode}
                        </Badge>
                      </div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Course: <span className="text-gray-600">{assignment.course?.title}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 px-8 border-x border-gray-50">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Submissions</p>
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-red-600" />
                        <span className="text-base font-black text-black">{assignment._count?.submissions || 0}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Deadline</p>
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-[13px] font-black text-black">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      className="h-10 px-5 text-[12px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl transition-all"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsSubmissionsModalOpen(true);
                      }}
                    >
                      Audit Submissions
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-gray-300 hover:text-primary transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-gray-100 italic">
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-bold text-xs p-3"
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setIsAssignmentModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-primary" />
                          Refine Task
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer font-bold text-xs p-3 text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(assignment.courseId, assignment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Purged from Registry
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 border-gray-100 shadow-none bg-transparent rounded-[1.5rem] py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-black text-black">Zero Assignments Found</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-2 max-w-xs">
                Initialize your first academic task to begin synchronization with students.
              </p>
              <Button 
                onClick={() => setIsAssignmentModalOpen(true)}
                className="mt-6 bg-primary hover:bg-primary/90 text-white h-9 px-8 rounded-xl text-[11px] font-black uppercase transition-all"
              >
                Establish First Assignment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateAssignmentModal 
        open={isAssignmentModalOpen}
        onOpenChange={(val) => {
          setIsAssignmentModalOpen(val);
          if (!val) setSelectedAssignment(null);
        }}
        courseId={selectedCourseId || (myCourses?.[0]?.id || "")}
        assignment={selectedAssignment || undefined}
      />

      {selectedAssignment && (
        <ViewSubmissionsModal 
          open={isSubmissionsModalOpen}
          onOpenChange={setIsSubmissionsModalOpen}
          assignment={selectedAssignment}
        />
      )}

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Terminate Academic Task"
        description="Are you sure you want to terminate this academic task? All associated student submissions will be archived and inaccessible. This action is irreversible."
        isLoading={deleteAssignment.isPending}
      />
    </div>
  );
}
