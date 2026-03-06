"use client";
import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Search,
  Bell,
  MoreHorizontal,
  Video,
  GraduationCap,
  ClipboardList,
  Activity,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { EventCalendar } from "@/components/dashboard/event-calendar";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { CreateCourseModal } from "@/components/shared/modals/CreateCourseModal";
import { LiveLectureModal } from "@/components/shared/modals/LiveLectureModal";
import { CreateAssignmentModal } from "@/components/shared/modals/CreateAssignmentModal";
import { ViewSubmissionsModal } from "@/components/shared/modals/ViewSubmissionsModal";
import { Loader2, Plus } from "lucide-react";

// --- Mock Data ---
const mockCourseStats = [
  { course: "Math 101", students: 45, engagement: 88 },
  { course: "Physics 2A", students: 32, engagement: 75 },
  { course: "Comp Sci 3", students: 50, engagement: 92 },
  { course: "Gen Bio", students: 28, engagement: 80 },
];

const mockMarkingQueue = [
  { id: 1, title: "Calculus Quiz 3", course: "Math 101", pending: 15, dueDate: "2 days left", color: "text-[#6b21a8]" },
  { id: 2, title: "Lab Report 2", course: "Physics 2A", pending: 8, dueDate: "Tomorrow", color: "text-orange-500" },
  { id: 3, title: "Final Essay", course: "English 102", pending: 22, dueDate: "5 days left", color: "text-[#8B1538]" },
];

const mockRecentActivity = [
  { id: 1, student: "Alice Green", activity: "Submitted Physics Lab", time: "10m ago", status: "New" },
  { id: 2, student: "Bob White", activity: "Completed Math Quiz", time: "45m ago", status: "Graded" },
  { id: 3, student: "Charlie Rose", activity: "Asked a question", time: "1h ago", status: "Pending" },
];

const mockSchedule = [
  { id: 1, time: "10:00 AM", title: "Live Q&A: Math 101", platform: "Zoom", students: 42 },
  { id: 2, time: "01:30 PM", title: "Lecture: Thermodynamics", platform: "Teams", students: 28 },
];

export default function LecturerDashboard() {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<{id: string, title: string} | null>(null);

  const { data: myCourses, isLoading } = useMyCoursesLecturer();
  
  // Fetch assignments for all courses to show in the marking queue
  // In a real app, we might have a dedicated /api/lecturer/assignments/pending route
  // For now, we'll fetch them based on the first course or show a merged list if possible.
  // Let's assume we show assignments from the most active course or just the first one for this demo.
  const firstCourseId = myCourses?.[0]?.id;
  const { data: assignments, isLoading: isLoadingAssignments } = useAssignments(selectedCourseId || firstCourseId || "");

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const courses = myCourses || [];
  const totalStudents = courses.reduce((sum: number, c: any) => sum + (c._count?.enrollments || 0), 0);
  const activeCourses = courses.filter((c: any) => c.status === "ACTIVE").length;
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#fcfdfe] p-6 lg:p-8 space-y-6">
      {/* Compact Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-black flex items-center gap-2">
             Professional Dashboard 🎓
          </h1>
          <p className="text-[13px] text-gray-500 font-bold uppercase tracking-widest mt-1">
             Academics & Course Synchronization Protocol
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsLiveModalOpen(true)}
            variant="ghost" 
            className="text-[12px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest gap-2"
          >
             <Video className="h-3 w-3" />
             Initiate Live Stream
          </Button>
          <Button 
            onClick={() => setIsCourseModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-2 h-10 px-6 rounded-xl text-[13px] font-black transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            Establish Course
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Top Row: Main Stats, Chart, and Calendar */}
        <div className="grid lg:grid-cols-12 gap-6 h-full min-h-0 flex-1">
          {/* Main Stats Column - Span 3 */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar">
            <Card className="border-none shadow-xl shadow-[#8B1538]/10 bg-gradient-to-br from-[#5A0F23] to-[#8B1538] text-white shrink-0 min-h-[120px] rounded-[1.5rem] overflow-hidden group flex flex-col">
              <div className="absolute inset-0 bg-white/5 opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <CardContent className="p-5 relative z-10 flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start mb-2">
                   <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                      <GraduationCap className="h-3.5 w-3.5 text-white" />
                   </div>
                   <Badge className="bg-white/10 text-white border-0 text-[10px] font-black uppercase tracking-widest">Global Reach</Badge>
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-0.5 tracking-tighter">{totalStudents}</h3>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                     <TrendingUp className="h-3.5 w-3.5" /> 12% Engagement Boost
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white shrink-0 min-h-[110px] rounded-[1.5rem] hover:ring-2 hover:ring-orange-500/10 transition-all flex flex-col">
              <CardContent className="p-5 flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start mb-2">
                   <div className="p-2 bg-orange-50 rounded-xl border border-orange-100">
                      <BookOpen className="h-3.5 w-3.5 text-orange-600" />
                   </div>
                   <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-0 text-[10px] font-black uppercase tracking-widest">Active Units</Badge>
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-0.5 text-black tracking-tighter">{activeCourses}</h3>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Institutional Assets</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white shrink-0 min-h-[110px] rounded-[1.5rem] hover:ring-2 hover:ring-green-500/10 transition-all flex flex-col">
              <CardContent className="p-5 flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start mb-2">
                   <div className="p-2 bg-green-50 rounded-xl border border-green-100">
                      <Award className="h-3.5 w-3.5 text-green-600" />
                   </div>
                   <Badge variant="secondary" className="bg-green-50 text-green-600 border-0 text-[10px] font-black uppercase tracking-widest">Efficiency</Badge>
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-0.5 text-black tracking-tighter">84%</h3>
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Network Health</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart - Span 6 */}
          <Card className="lg:col-span-6 border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] flex flex-col h-full overflow-hidden">
            <CardHeader className="py-5 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Analytic Visualization</CardTitle>
              <CardDescription className="text-lg font-black text-black mt-1">Course Performance & Acquisition</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-6 px-4">
               <ChartContainer
                config={{
                  students: { label: "Enrollment", color: "#8B1538" },
                  engagement: { label: "Engagement", color: "#f97316" },
                }}
                className="h-full w-full"
              >
                <BarChart data={courses.map((c: any) => ({
                    course: c.unitCode,
                    students: c._count?.enrollments || 0,
                    engagement: 80 // Mock engagement for now
                  }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="course" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="students" fill="var(--color-students)" radius={[6, 6, 0, 0]} barSize={24} />
                  <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Event Calendar - Span 3 */}
          <div className="lg:col-span-3 h-full overflow-hidden">
            <EventCalendar />
          </div>
        </div>

        {/* Below the Fold: Activity, Queue, and Sessions */}
        <div className="grid gap-6 lg:grid-cols-12 pb-10">
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden">
              <CardHeader className="py-6 px-8">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Global Activity Feed</CardTitle>
                <CardDescription className="text-lg font-black text-black mt-1">Real-time Student Synchronization</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-50 hover:bg-transparent">
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest">Protocol Agent</TableHead>
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest">Operation</TableHead>
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest">Timestamp</TableHead>
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest">Verification</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecentActivity.map((activity) => (
                      <TableRow key={activity.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <TableCell className="font-black text-black text-[11px] h-12">{activity.student}</TableCell>
                        <TableCell className="text-gray-500 text-[10px] font-bold">{activity.activity}</TableCell>
                        <TableCell className="text-gray-400 text-[9px] font-black uppercase tracking-widest">{activity.time}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                            activity.status === "New" ? "bg-primary text-white shadow-lg shadow-primary/20" :
                            activity.status === "Graded" ? "bg-green-100 text-green-600 border-0" :
                            "bg-gray-100 text-gray-600 border-0"
                          )}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-4">
            {/* Marking Queue */}
            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] h-fit overflow-hidden">
              <CardHeader className="py-5 px-6 flex flex-row items-center justify-between border-b border-gray-50">
                <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                  <ClipboardList className="h-3.5 w-3.5 text-primary" />
                  Academic Queue
                </CardTitle>
                <div className="flex gap-2">
                   {myCourses && myCourses.length > 0 && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 px-3 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-rose-50 rounded-lg p-1 transition-all"
                        onClick={() => {
                           setSelectedCourseId(myCourses[0].id);
                           setIsAssignmentModalOpen(true);
                        }}
                      >
                         <Plus className="h-3 w-3 mr-1" /> Deploy 
                      </Button>
                   )}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {isLoadingAssignments ? (
                   <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
                ) : assignments && assignments.length > 0 ? (
                  assignments.map((item: any) => (
                    <div key={item.id} className="p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[11px] font-black text-black group-hover:text-primary transition-colors tracking-tight">{item.title}</h4>
                        <span className="text-[8px] uppercase font-black tracking-widest text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">{item.course?.unitCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-rose-50 text-primary border-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">
                             {item._count?.submissions || 0} Submissions
                          </Badge>
                          <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5">
                            <Clock className="h-2.5 w-2.5" /> Due {new Date(item.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 px-2 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-rose-50 rounded-lg transition-all"
                          onClick={() => {
                             setSelectedAssignment({ id: item.id, title: item.title });
                             setIsSubmissionsModalOpen(true);
                          }}
                        >
                          Audit 
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center p-6 text-gray-400 text-[10px] font-bold uppercase tracking-widest">No Active Assignments</div>
                )}
                <Button variant="outline" className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-gray-100 text-gray-400 hover:border-gray-200 transition-all rounded-lg">Access Full Ledger</Button>
              </CardContent>
            </Card>

            {/* Live Sessions */}
            <Card className="border-none shadow-xl shadow-gray-900/10 bg-black text-white overflow-hidden relative h-fit rounded-[1.5rem]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader className="py-5 px-6 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                  Live Terminal
                </CardTitle>
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                {mockSchedule.map((session) => (
                  <div key={session.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all group">
                    <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-rose-400 font-black text-[10px] border border-primary/20 shadow-inner">
                       {session.time.split(" ")[0]}
                    </div>
                    <div>
                      <h5 className="text-[11px] font-black tracking-tight">{session.title}</h5>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{session.platform} • {session.students} Joined</p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 rounded-lg text-white/20 group-hover:text-rose-400 transition-colors">
                       <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateCourseModal 
        open={isCourseModalOpen}
        onOpenChange={setIsCourseModalOpen}
        isAdmin={false}
      />

      <LiveLectureModal 
        open={isLiveModalOpen}
        onOpenChange={setIsLiveModalOpen}
      />

      <CreateAssignmentModal 
        open={isAssignmentModalOpen}
        onOpenChange={setIsAssignmentModalOpen}
        courseId={selectedCourseId}
      />

      {selectedAssignment && (
        <ViewSubmissionsModal 
          open={isSubmissionsModalOpen}
          onOpenChange={setIsSubmissionsModalOpen}
          assignment={selectedAssignment}
        />
      )}
    </div>
  );
}

