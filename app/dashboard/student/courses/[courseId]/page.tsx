"use client";

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
  Loader2,
  FileText,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Film,
  Link as LinkIcon,
  FileDown,
  Edit
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useEnroll, useUnenroll } from "@/hooks/useCourses";
import { useCourseResources } from "@/hooks/useCourseResources";
import { EmptyState } from "@/components/shared/EmptyState";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useMe } from "@/hooks/useAuth";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { data: user } = useMe();
  
  const { data: course, isLoading } = useCourse(courseId);
  const { data: resources, isLoading: resourcesLoading } = useCourseResources(courseId);
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
  const isLecturerOrAdmin = user?.role === "LECTURER" || user?.role === "ADMIN";
  const canManage = isLecturerOrAdmin && (user?.id === course.lecturerId || user?.role === "ADMIN");

  // Group resources by category
  const groupedResources = (resources || []).reduce((acc: any, resource: any) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
      case "DOCUMENT":
        return FileText;
      case "VIDEO":
        return Film;
      case "LINK":
        return LinkIcon;
      case "IMAGE":
        return ImageIcon;
      default:
        return FileDown;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-700";
      case "DOCUMENT":
        return "bg-blue-100 text-blue-700";
      case "VIDEO":
        return "bg-purple-100 text-purple-700";
      case "LINK":
        return "bg-green-100 text-green-700";
      case "IMAGE":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto min-h-screen bg-[#fcfdfe]">
      {/* Header */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 hover:bg-gray-50 rounded-xl text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Courses
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary bg-primary/5 border-primary/20">
                {course.unitCode}
              </Badge>
              {isEnrolled && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-tight">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  ENROLLED
                </Badge>
              )}
            </div>
            
            <h1 className="text-xl font-bold tracking-tight text-black lg:text-2xl">
              {course.title}
            </h1>
            
            <p className="text-gray-600 text-sm max-w-3xl">
              {course.description || "Course details will be available soon."}
            </p>

            <div className="flex items-center gap-4 pt-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Lecturer</p>
                  <p className="text-xs font-bold text-gray-700">{course.lecturer?.name || "TBA"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Students</p>
                  <p className="text-xs font-bold text-gray-700">{course._count?.enrollments || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
                  <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Department</p>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-tight">{course.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button - Role Based */}
          <div className="lg:w-56">
            {canManage ? (
              <Button
                onClick={() => router.push(`/dashboard/${user?.role === 'ADMIN' ? 'admin' : user?.role === 'LECTURER' ? 'lecturer' : 'student'}/courses/${courseId}/edit`)}
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-[10px] uppercase tracking-wide shadow-lg shadow-primary/20 transition-all gap-2"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Course
              </Button>
            ) : isEnrolled ? (
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl border-gray-100 font-bold text-[10px] uppercase tracking-wide text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                onClick={handleUnenroll}
                disabled={unenroll.isPending}
              >
                {unenroll.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Unenroll from Course"
                )}
              </Button>
            ) : (
              <Button
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-[10px] uppercase tracking-wide shadow-lg shadow-primary/20 transition-all"
                onClick={handleEnroll}
                disabled={enroll.isPending}
              >
                {enroll.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
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

      {/* Course Outline Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-black">
            Course <span className="text-primary">Outline</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Comprehensive course information and syllabus
          </p>
        </div>

        <Card className="rounded-2xl border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            {course.outline ? (
              <div 
                className="prose prose-sm max-w-none text-sm"
                style={{ direction: 'ltr' }}
                dangerouslySetInnerHTML={{ __html: course.outline }}
              />
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No outline yet"
                description={canManage ? "Click 'Edit Course' to add course information" : "The course outline will be available soon"}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Resources Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-black">
            Course <span className="text-primary">Resources</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Study materials, notes, and additional content
          </p>
        </div>

        {resourcesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : Object.keys(groupedResources).length === 0 ? (
          <Card className="rounded-2xl border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <EmptyState
                icon={FileText}
                title="No resources yet"
                description={canManage ? "Click 'Edit Course' to upload course materials" : "Resources will be added by your lecturer"}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResources).map(([category, categoryResources]: [string, any]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="h-0.5 w-6 bg-primary rounded-full" />
                  {category}
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {categoryResources.map((resource: any, index: number) => {
                    const Icon = getResourceIcon(resource.type);
                    const colorClass = getResourceColor(resource.type);
                    
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="group relative overflow-hidden rounded-xl border-0 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-white h-full">
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <Badge className="bg-gray-100 text-gray-700 border-gray-200 border px-1.5 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-tight">
                                {resource.type}
                              </Badge>
                            </div>
                            
                            <CardTitle className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-2">
                              {resource.title}
                            </CardTitle>
                            {resource.description && (
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                {resource.description}
                              </p>
                            )}
                          </CardHeader>

                          <CardContent className="p-4 pt-0">
                            {resource.type === "LINK" && resource.url && (
                              <Button
                                className="w-full h-8 rounded-lg bg-primary hover:bg-primary-600 text-white font-bold text-[9px] uppercase tracking-wide shadow-md shadow-primary/20 transition-all gap-1.5"
                                onClick={() => window.open(resource.url, "_blank")}
                              >
                                <ExternalLink className="h-3 w-3" />
                                Open Link
                              </Button>
                            )}
                            
                            {(resource.type === "PDF" || resource.type === "DOCUMENT") && resource.fileKey && (
                              <Button
                                className="w-full h-8 rounded-lg bg-primary hover:bg-primary-600 text-white font-bold text-[9px] uppercase tracking-wide shadow-md shadow-primary/20 transition-all gap-1.5"
                                onClick={() => window.open(`/api/r2/download?key=${resource.fileKey}`, "_blank")}
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            )}

                            {resource.type === "VIDEO" && resource.url && (
                              <Button
                                className="w-full h-8 rounded-lg bg-primary hover:bg-primary-600 text-white font-bold text-[9px] uppercase tracking-wide shadow-md shadow-primary/20 transition-all gap-1.5"
                                onClick={() => window.open(resource.url, "_blank")}
                              >
                                <Film className="h-3 w-3" />
                                Watch Video
                              </Button>
                            )}

                            {resource.type === "EMBEDDED_CONTENT" && resource.content && (
                              <div 
                                className="prose prose-xs max-w-none text-gray-600 line-clamp-3 text-[11px]"
                                style={{ direction: 'ltr' }}
                                dangerouslySetInnerHTML={{ __html: resource.content }}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Live Lectures Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-black">
            Live <span className="text-primary">Lectures</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"} available
          </p>
        </div>

        {lectures.length === 0 ? (
          <Card className="rounded-2xl border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <EmptyState
                icon={Video}
                title="No lectures yet"
                description="Lectures will appear here once the lecturer starts them"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {lectures.map((lecture: any, index: number) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden rounded-xl border-0 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-white">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />
                  
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <Badge 
                        className={`${
                          lecture.status === "LIVE" 
                            ? "bg-red-100 text-red-700 border-red-200" 
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        } border px-1.5 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-tight`}
                      >
                        {lecture.status === "LIVE" && (
                          <span className="w-1 h-1 rounded-full bg-red-500 mr-1 animate-pulse" />
                        )}
                        {lecture.status}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xs font-bold group-hover:text-primary transition-colors">
                      Lecture #{index + 1}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">
                          {format(new Date(lecture.startedAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">
                          {format(new Date(lecture.startedAt), "hh:mm a")}
                          {lecture.endedAt && ` - ${format(new Date(lecture.endedAt), "hh:mm a")}`}
                        </span>
                      </div>
                    </div>

                    {lecture.status === "LIVE" && lecture.meetingUrl && isEnrolled && (
                      <Button
                        className="w-full h-8 rounded-lg bg-primary hover:bg-primary-600 text-white font-bold text-[9px] uppercase tracking-wide shadow-md shadow-primary/20 transition-all"
                        onClick={() => window.open(lecture.meetingUrl, "_blank")}
                      >
                        Join Live Lecture
                      </Button>
                    )}
                    
                    {lecture.status === "LIVE" && !isEnrolled && (
                      <p className="text-[11px] text-gray-400 text-center py-1">
                        Enroll to join live lectures
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
