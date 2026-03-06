"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, BookOpen, Users, FileText } from "lucide-react";
import { useMyCoursesLecturer, useCourses } from "@/hooks/useCourses";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { CreateCourseModal } from "@/components/shared/modals/CreateCourseModal";
import { CourseDetailModal } from "@/components/shared/modals/CourseDetailModal";

export default function LecturerMyCoursesPage() {
  const [search, setSearch] = useState("");
  const { data: myCourses, isLoading: loadingMyCourses } = useMyCoursesLecturer();
  const { data: allCourses, isLoading: loadingAll } = useCourses({ search });
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const openCourseDetail = (course: any) => {
    setSelectedCourse(course);
    setDetailModalOpen(true);
  };

  const CourseCard = ({ course, isOwned }: { course: any; isOwned: boolean }) => (
    <Card
      className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all cursor-pointer group"
      onClick={() => openCourseDetail(course)}
    >
      <div className="h-2.5 bg-primary/20 group-hover:h-3.5 transition-all"></div>
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
           <CardTitle className="text-base font-black text-black leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
           <Badge className="bg-gray-100 text-gray-500 border-0 text-[10px] font-black uppercase tracking-widest shrink-0 ml-4">
              {course.unitCode}
           </Badge>
        </div>
        {isOwned && (
           <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest mt-2 w-fit px-2 py-0.5">
             Owned Course
           </Badge>
        )}
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
            {isOwned && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                <FileText className="h-4 w-4 text-orange-500" />
                <span className="text-[11px] font-black text-gray-600 uppercase">{course._count?.assignments || 0} Tasks</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black flex items-center gap-2">
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

      <Tabs defaultValue="my-courses" className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <TabsList className="bg-gray-50 p-1.5 rounded-2xl h-14 border border-gray-100 shadow-sm">
            <TabsTrigger 
              value="my-courses" 
              className="rounded-xl px-10 h-11 text-[11px] font-black italic data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
            >
              My Courses
            </TabsTrigger>
            <TabsTrigger 
              value="browse" 
              className="rounded-xl px-10 h-11 text-[11px] font-black italic data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
            >
              Browse Catalog
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Filter by title or unit code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 pl-12 rounded-[1.5rem] border-gray-100 bg-white shadow-sm focus:ring-primary/20 italic font-medium"
            />
          </div>
        </div>

        <TabsContent value="my-courses" className="space-y-6 pt-4">
          {loadingMyCourses ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : !myCourses || myCourses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Infrastructure Empty"
              description="Claim or initialize your first academic unit to begin distribution"
              actionLabel="Establish Course"
              onAction={() => setCreateModalOpen(true)}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course: any) => (
                <CourseCard key={course.id} course={course} isOwned={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="space-y-6 pt-4">
          {loadingAll ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : !allCourses?.data || allCourses.data.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No courses available"
              description="Check back later for new courses"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCourses.data.map((course: any) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isOwned={myCourses?.some((mc: any) => mc.id === course.id)} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateCourseModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      {selectedCourse && (
        <CourseDetailModal 
          open={detailModalOpen} 
          onOpenChange={setDetailModalOpen} 
          course={selectedCourse}
          isEnrolled={myCourses?.some((mc: any) => mc.id === selectedCourse.id)}
        />
      )}
    </div>
  );
}
