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
      whileHover={{ y: -5 }}
    >
      <Card 
        className="group relative overflow-hidden rounded-[2rem] border-0 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-white min-h-[340px] flex flex-col cursor-pointer"
        onClick={() => router.push(`/dashboard/student/courses/${course.id}`)}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <CardHeader className="p-7 pb-2 flex-1">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-black text-gray-300 tracking-[0.2em] italic uppercase">
              {course.unitCode}
            </span>
            {isEnrolled && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 rounded-md font-bold text-[9px] uppercase tracking-tighter">
                <span className="w-1 h-1 rounded-full bg-green-500 mr-1 animate-pulse" />
                ENROLLED
              </Badge>
            )}
          </div>
          <CardTitle className="text-base font-black italic group-hover:text-primary transition-colors leading-[1.2]">
            {course.title}
          </CardTitle>
          <p className="text-xs font-bold text-gray-400 mt-2 italic line-clamp-2">
            {course.description || "Course details will be available soon."}
          </p>
        </CardHeader>

        <CardContent className="p-7 pt-0 space-y-5">
          <div className="flex items-center gap-4 border-y border-gray-50 py-4">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-xl bg-primary/5 flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-[11px] font-black italic text-gray-500">{course._count?.enrollments || 0} Students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <span className="text-[11px] font-black italic text-gray-500 uppercase tracking-tighter truncate max-w-[100px]">{course.department}</span>
            </div>
          </div>

          {isEnrolled ? (
            <Button
              variant="outline"
              className="w-full h-12 rounded-2xl border-gray-100 font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all italic"
              onClick={(e) => handleUnenroll(e, course.id)}
              disabled={unenroll.isPending}
            >
              Already Enrolled
            </Button>
          ) : (
            <Button
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-primary/20 transition-all italic"
              onClick={(e) => handleEnroll(e, course.id)}
              disabled={enroll.isPending}
            >
              Enroll in Course
            </Button>
          )}
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
