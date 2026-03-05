"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users, FileText } from "lucide-react";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { CreateCourseModal } from "@/components/shared/modals/CreateCourseModal";

export default function LecturerMyCoursesPage() {
  const router = useRouter();
  const { data: courses, isLoading } = useMyCoursesLecturer();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Curriculum Assets
          </h1>
          <p className="text-[13px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Manage your institutional course distribution
          </p>
        </div>
        <Button 
          onClick={() => setCreateModalOpen(true)} 
          className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-2 h-10 px-6 rounded-xl text-[13px] font-black transition-all"
        >
          <Plus className="h-4 w-4" />
          Establish Course
        </Button>
      </div>

      {!courses || courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Infrastructure Empty"
          description="Initialize your first academic unit to begin distribution"
          actionLabel="Establish Course"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any) => (
            <Card
              key={course.id}
              className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all cursor-pointer group"
              onClick={() => router.push(`/dashboard/lecturer/my-courses/${course.id}`)}
            >
              <div className="h-2.5 bg-primary/20 group-hover:h-3.5 transition-all"></div>
              <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                   <CardTitle className="text-base font-black text-gray-900 leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                   <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] font-black uppercase tracking-widest shrink-0 ml-4">
                      {course.unitCode}
                   </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-[13px] font-bold text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                  {course.description || "No metadata description provided for this academic unit."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-black text-gray-600 uppercase">{course._count?.enrollments || 0} Agents</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <FileText className="h-4 w-4 text-orange-500" />
                      <span className="text-[11px] font-black text-gray-600 uppercase">{course._count?.assignments || 0} Tasks</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCourseModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
