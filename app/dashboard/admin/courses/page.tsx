"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreVertical, BookOpen, Eye, Edit, Trash2, GraduationCap, Clock } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
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
import { CreateCourseModal } from "@/components/shared/modals/CreateCourseModal";

export default function AdminCoursesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading } = useCourses({ page, search });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 bg-blue-50/50 animate-pulse rounded-lg w-64"></div>
        <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  const courses = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Courses {meta?.total ? `(${meta.total})` : "(0)"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all university course offerings
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/20 h-10 px-6 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </Button>
      </div>

      {/* Table Card View */}
      <Card className="bg-white border-gray-100 shadow-none overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-gray-900">Curriculum Overview</CardTitle>
              <CardDescription className="text-xs text-gray-500">Manage course materials, enrollments, and teaching staff</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 font-bold" />
              <Input
                placeholder="Search by title, code or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 bg-gray-50/50 border-gray-100 focus:bg-white text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!courses || courses.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={BookOpen}
                title="No courses found"
                description="Get started by adding your first course to the curriculum"
                actionLabel="Add Course"
                onAction={() => {}}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Course Title</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Unit Code</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Department</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Lead Lecturer</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-[11px] uppercase tracking-wider">Enrollment</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6 text-right text-[11px] uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: any) => (
                    <TableRow key={course.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                      <TableCell className="py-4 px-6">
                        <span className="font-bold text-gray-900 text-sm">{course.title}</span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <code className="bg-blue-50/50 text-blue-700 px-2.5 py-1 rounded text-[10px] font-bold border border-blue-100/30">
                          {course.unitCode}
                        </code>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-500 text-sm font-medium">{course.department}</TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-100 shadow-sm">
                            {course.lecturer?.name?.charAt(0) || "L"}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{course.lecturer?.name || "Unassigned"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-bold text-[10px] shadow-none">
                          {course._count?.enrollments || 0} students
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
                               <Eye className="h-4 w-4 opacity-70" /> <span>Course Details</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-blue-50 focus:text-blue-700 rounded-md">
                               <Edit className="h-4 w-4 opacity-70" /> <span>Edit Curriculum</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-blue-50 focus:text-blue-700 rounded-md">
                               <GraduationCap className="h-4 w-4 opacity-70" /> <span>Manage Students</span>
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-gray-50" />
                             <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer gap-2 rounded-md">
                               <Trash2 className="h-4 w-4" /> <span>Archive Course</span>
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
            itemName="courses"
          />
        )}
      </Card>

      <CreateCourseModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        isAdmin={true}
      />
    </div>
  );
}
