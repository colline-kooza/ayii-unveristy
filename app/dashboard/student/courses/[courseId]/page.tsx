"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Video, 
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useEnroll, useUnenroll } from "@/hooks/useCourses";
import { EmptyState } from "@/components/shared/EmptyState";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const { data: course, isLoading } = useCourse(courseId);
  const enroll = useEnroll();
  const unenroll = useUnenroll();

  const handleEnroll = async () => {
    try {
      await enroll.mutateAsync(courseId);
    } catch (e) {
      // Error handled in hook
    }
  };

  const handleUnenroll = async () => {
    if (!confirm("Are you sure you want to unenroll from this course?")) return;
    try {
      await unenroll.mutateAsync(courseId);
    } catch (e) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 lg:p-10">
        <EmptyState
          icon={BookOpen}
          title="Course not found"
          description="The course you're looking for doesn't exist"
        />
      </div>
    );
  }

  const isEnrolled = course.isEnrolled;
  const lectures = course.liveLectures || [];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto min-h-screen bg-[#fcfdfe]">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 hover:bg-gray-50 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 border-primary/20">
                {course.unitCode}
              </Badge>
              {isEnrolled && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 rounded-md font-bold text-[9px] uppercase tracking-tighter">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  ENROLLED
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-black lg:text-4xl italic">
              {course.title}
            </h1>
            
            <p className="text-gray-600 text-base font-medium italic max-w-3xl">
              {course.description || "Course details will be available soon."}
            </p>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lecturer</p>
                  <p className="text-sm font-black italic text-gray-700">{course.lecturer?.name || "TBA"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Students</p>
                  <p className="text-sm font-black italic text-gray-700">{course._count?.enrollments || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</p>
                  <p className="text-sm font-black italic text-gray-700 uppercase tracking-tighter">{course.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Button */}
          <div className="lg:w-64">
            {isEnrolled ? (
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-gray-100 font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all italic"
                onClick={handleUnenroll}
                disabled={unenroll.isPending}
              >
                {unenroll.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Unenroll from Course"
                )}
              </Button>
            ) : (
              <Button
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-primary/20 transition-all italic"
                onClick={handleEnroll}
                disabled={enroll.isPending}
              >
                {enroll.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  "Enroll in Course"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Lectures Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-black italic">
              Course <span className="text-primary">Lectures</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium italic mt-1">
              {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"} available
            </p>
          </div>
        </div>

        {lectures.length === 0 ? (
          <Card className="rounded-[2rem] border-0 shadow-sm bg-white">
            <CardContent className="p-12">
              <EmptyState
                icon={Video}
                title="No lectures yet"
                description="Lectures will appear here once the lecturer starts them"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lectures.map((lecture: any, index: number) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden rounded-[1.5rem] border-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-white">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/10 transition-colors" />
                  
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <Badge 
                        className={`${
                          lecture.status === "LIVE" 
                            ? "bg-red-100 text-red-700 border-red-200" 
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        } border px-2 py-1 rounded-md font-bold text-[9px] uppercase tracking-tighter`}
                      >
                        {lecture.status === "LIVE" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />
                        )}
                        {lecture.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-sm font-black italic group-hover:text-primary transition-colors">
                      Lecture #{index + 1}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {format(new Date(lecture.startedAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {format(new Date(lecture.startedAt), "hh:mm a")}
                          {lecture.endedAt && ` - ${format(new Date(lecture.endedAt), "hh:mm a")}`}
                        </span>
                      </div>
                    </div>

                    {lecture.status === "LIVE" && lecture.meetingUrl && isEnrolled && (
                      <Button
                        className="w-full h-10 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20 transition-all"
                        onClick={() => window.open(lecture.meetingUrl, "_blank")}
                      >
                        Join Live Lecture
                      </Button>
                    )}
                    
                    {lecture.status === "LIVE" && !isEnrolled && (
                      <p className="text-xs text-gray-400 italic text-center py-2">
                        Enroll to join live lectures
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
