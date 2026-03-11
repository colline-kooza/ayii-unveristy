"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Users, Clock } from "lucide-react";
import { useCourses, useMyEnrollments, useEnroll, useUnenroll } from "@/hooks/useCourses";
import { EmptyState } from "@/components/shared/EmptyState";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function StudentCoursesPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { data: allCourses, isLoading: loadingAll } = useCourses({ search });
  const { data: enrolledCourses, isLoading: loadingEnrolled } = useMyEnrollments();
  const enroll = useEnroll();
  const unenroll = useUnenroll();

  const handleEnroll = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    try {
      await enroll.mutateAsync(courseId);
    } catch (e) {
      // toast in hook
    }
  };

  const handleUnenroll = async (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to unenroll from this course?")) return;
    try {
      await unenroll.mutateAsync(courseId);
    } catch (e) {
      // toast in hook
    }
  };

  const CourseCard = ({ course, isEnrolled }: { course: any; isEnrolled: boolean }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card 
        className="group relative overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md bg-white h-full flex flex-col"
      >
        <CardHeader className="p-6 pb-2 flex-1">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="outline" className="text-[10px] font-bold text-gray-400 border-gray-100 px-2 py-0 rounded transition-colors group-hover:border-primary/20 group-hover:text-primary/70">
              {course.unitCode}
            </Badge>
            {isEnrolled && (
              <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-100 px-2 rounded font-bold text-[9px] uppercase tracking-tight">
                <span className="w-1 h-1 rounded-full bg-green-500 mr-1.5" />
                Enrolled
              </Badge>
            )}
          </div>
          <CardTitle className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
            {course.title}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {course.description || "Comprehensive course materials and curriculum details are provided within."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          <div className="flex items-center gap-4 py-3 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-medium text-slate-600">{course._count?.enrollments || 0} Students</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-medium text-slate-600 truncate">{course.department}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 rounded-lg border-slate-200 font-bold text-[11px] uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
            >
              View
            </Button>
            {isEnrolled ? (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-9 rounded-lg font-bold text-[11px] uppercase tracking-wider text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnenroll(e, course.id);
                }}
                disabled={unenroll.isPending}
              >
                Unenroll
              </Button>
            ) : (
              <Button
                size="sm"
                className="flex-1 h-9 rounded-lg bg-primary hover:bg-primary-600 text-white font-bold text-[11px] uppercase tracking-wider transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnroll(e, course.id);
                }}
                disabled={enroll.isPending}
              >
                Enroll
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto min-h-screen bg-[#fcfdfe]">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-gray-100 pb-8">
        <div className="space-y-2">
          <Badge className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 border-primary/20">
            Course Catalog
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-black lg:text-3xl italic">
            My <span className="text-primary">Courses.</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium italic">
            Browse and enroll in available courses.
          </p>
        </div>
      </header>

      <Tabs defaultValue="browse" className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <TabsList className="bg-gray-50 p-1.5 rounded-2xl h-14 border border-gray-100 shadow-sm">
            <TabsTrigger 
              value="browse" 
              className="rounded-xl px-10 h-11 text-[11px] font-black italic data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
            >
              Browse Catalog
            </TabsTrigger>
            <TabsTrigger 
              value="enrolled" 
              className="rounded-xl px-10 h-11 text-[11px] font-black italic data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
            >
              My Enrolled Courses
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
                <CourseCard key={course.id} course={course} isEnrolled={course.isEnrolled} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-4">
          {loadingEnrolled ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : !enrolledCourses?.data || enrolledCourses.data.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No enrolled courses"
              description="Browse courses and enroll to get started"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.data.map((course: any) => (
                <CourseCard key={course.id} course={course} isEnrolled={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
