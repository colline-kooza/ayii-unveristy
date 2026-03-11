"use client";
import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Video,
  GraduationCap,
  ClipboardList,
  Award,
  Plus,
  LayoutDashboard,
  Bell,
  ChevronRight,
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
} from "recharts";
import { EventCalendar } from "@/components/dashboard/event-calendar";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { CreateCourseModal } from "@/components/shared/modals/CreateCourseModal";
import { LiveLectureModal } from "@/components/shared/modals/LiveLectureModal";
import { CreateAssignmentModal } from "@/components/shared/modals/CreateAssignmentModal";
import { ViewSubmissionsModal } from "@/components/shared/modals/ViewSubmissionsModal";
import { useMe } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const mockRecentActivity = [
  { id: 1, student: "Alice Green", activity: "Submitted Physics Lab", time: "10m ago", status: "New" },
  { id: 2, student: "Bob White", activity: "Completed Math Quiz", time: "45m ago", status: "Graded" },
  { id: 3, student: "Charlie Rose", activity: "Asked a question", time: "1h ago", status: "Pending" },
];

export default function LecturerDashboard() {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<{id: string, title: string} | null>(null);

  const { data: user } = useMe();
  const { data: myCourses, isLoading } = useMyCoursesLecturer();
  
  const firstCourseId = myCourses?.[0]?.id;
  const { data: assignments, isLoading: isLoadingAssignments } = useAssignments(selectedCourseId || firstCourseId || "");

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const courses = myCourses || [];
  const totalStudents = courses.reduce((sum: number, c: any) => sum + (c._count?.enrollments || 0), 0);
  const activeCourses = courses.filter((c: any) => c.status === "ACTIVE").length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white space-y-4">
      {/* Professional Minimalist Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1 border-b border-gray-50 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black flex items-center gap-2 uppercase tracking-tight">
             Academic Command Center 🎓
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5">
             Curriculum Management & Student Synchronization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsLiveModalOpen(true)}
            variant="ghost" 
            className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest gap-2 h-9 px-3"
          >
             <Video className="h-3.5 w-3.5" />
             Live Stream
          </Button>
          <Button 
            onClick={() => setIsCourseModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2 h-9 px-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            New Course
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden px-1">
        {/* Core Metrics Row */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Vertical Stat Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-2">
            <Card className="border-none bg-primary text-white shrink-0 h-28 rounded-xl shadow-none group relative overflow-hidden">
              <CardContent className="p-4 flex flex-col justify-between h-full relative z-10">
                <div className="flex justify-between items-start">
                   <div className="p-1.5 bg-white/10 rounded-lg">
                      <GraduationCap className="h-3.5 w-3.5 text-white" />
                   </div>
                   <Badge className="bg-white/10 text-white border-0 text-[8px] font-black uppercase tracking-widest">Global</Badge>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-0.5 tracking-tighter">{totalStudents}</h3>
                  <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">Total Students Enrolled</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-50 bg-gray-50/30 hover:bg-white hover:border-orange-100 transition-all h-24 rounded-xl flex flex-col">
              <CardContent className="p-4 flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start">
                   <div className="p-1.5 bg-orange-50 rounded-lg border border-orange-100">
                      <BookOpen className="h-3.5 w-3.5 text-orange-600" />
                   </div>
                   <Badge className="bg-orange-50 text-orange-600 border-0 text-[8px] font-black uppercase tracking-widest">Active</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-black text-black tracking-tighter">{activeCourses}</h3>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Curriculum Units</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-50 bg-gray-50/30 hover:bg-white hover:border-green-100 transition-all h-24 rounded-xl flex flex-col">
              <CardContent className="p-4 flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start">
                   <div className="p-1.5 bg-green-50 rounded-lg border border-green-100">
                      <Award className="h-3.5 w-3.5 text-green-600" />
                   </div>
                   <Badge className="bg-green-50 text-green-600 border-0 text-[8px] font-black uppercase tracking-widest">Health</Badge>
                </div>
                <div>
                  <h3 className="text-xl font-black text-black tracking-tighter">84%</h3>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Efficiency Index</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Chart */}
          <Card className="lg:col-span-6 border-gray-100 bg-white rounded-xl flex flex-col h-full shadow-none overflow-hidden">
            <CardHeader className="py-4 px-6 border-b border-gray-50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">Analytic Visualization</CardTitle>
              <CardDescription className="text-sm font-bold text-black mt-1 uppercase tracking-tight">Course Engagement Matrix</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px] pb-4 px-2 pt-4">
               {mounted ? (
                 <ChartContainer
                  config={{
                    students: { label: "Enrollment", color: "#8B1538" },
                    engagement: { label: "Engagement", color: "#f97316" },
                  }}
                  className="h-full w-full aspect-auto"
                >
                  <BarChart data={courses.map((c: any) => ({
                      course: c.unitCode,
                      students: c._count?.enrollments || 0,
                      engagement: 75 
                    }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="course" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="students" fill="var(--color-students)" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ChartContainer>
               ) : (
                 <div className="flex h-full items-center justify-center">
                   <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
                 </div>
               )}
            </CardContent>
          </Card>

          {/* Calendar Sidebar */}
          <div className="lg:col-span-3">
            <EventCalendar />
          </div>
        </div>

        {/* Action Tiers Row */}
        <div className="grid gap-4 lg:grid-cols-12 pb-10">
          {/* Main Activity */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="border-gray-100 bg-white rounded-xl shadow-none overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-gray-50">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-400">Synchronization Log</CardTitle>
                <CardDescription className="text-sm font-bold text-black mt-1 uppercase tracking-tight">Real-time Activity Stream</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-gray-50">
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest px-6 h-10">Agent</TableHead>
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest h-10">Operation</TableHead>
                      <TableHead className="font-black text-gray-400 text-[9px] uppercase tracking-widest h-10">Verify</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecentActivity.map((activity) => (
                      <TableRow key={activity.id} className="border-gray-50 hover:bg-gray-50/30 transition-colors group">
                        <TableCell className="font-bold text-black text-[11px] px-6 h-12 uppercase">{activity.student}</TableCell>
                        <TableCell className="text-gray-400 text-[10px] font-bold uppercase">{activity.activity}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                            activity.status === "New" ? "bg-primary text-white border-0" :
                            activity.status === "Graded" ? "bg-green-50 text-green-600 border-0" :
                            "bg-gray-100 text-gray-400 border-0"
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

          {/* Sidebar Queues */}
          <div className="space-y-4 lg:col-span-4">
            <Card className="border-gray-100 bg-white rounded-xl shadow-none h-fit overflow-hidden">
              <CardHeader className="py-4 px-5 border-b border-gray-50 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <ClipboardList className="h-3.5 w-3.5 text-primary" />
                  Academic Queue
                </CardTitle>
                {myCourses?.[0] && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-rose-50"
                    onClick={() => {
                        setSelectedCourseId(myCourses[0].id);
                        setIsAssignmentModalOpen(true);
                    }}
                  >
                     <Plus className="h-3 w-3" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingAssignments ? (
                   <div className="flex justify-center p-6"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
                ) : assignments && assignments.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {assignments.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="p-4 group hover:bg-gray-50/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-[11px] font-bold text-black group-hover:text-primary transition-colors uppercase tracking-tight">{item.title}</h4>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{item.course?.unitCode}</p>
                          </div>
                          <Badge className="bg-rose-50 text-primary border-0 text-[8px] font-black uppercase tracking-widest px-1.5 h-4 flex items-center">
                             {item._count?.submissions || 0} New
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-bold text-gray-300 flex items-center gap-1.5 uppercase">
                             <Clock className="h-2.5 w-2.5" /> {new Date(item.dueDate).toLocaleDateString()}
                           </span>
                           <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[9px] font-black uppercase tracking-widest text-primary h-6 px-2 hover:bg-rose-50 rounded-md"
                            onClick={() => {
                               setSelectedAssignment({ id: item.id, title: item.title });
                               setIsSubmissionsModalOpen(true);
                            }}
                          >
                            Audit Log
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="text-center p-8 text-gray-200 uppercase tracking-widest font-black text-[9px]">Pipeline Cleared</div>
                )}
              </CardContent>
              <CardFooter className="p-3 border-t border-gray-50">
                 <Button variant="ghost" className="w-full text-center text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Complete Ledger</Button>
              </CardFooter>
            </Card>

            {/* Terminal Card */}
            <Card className="border-none bg-black text-white rounded-xl shadow-none h-fit overflow-hidden">
              <CardHeader className="py-4 px-5 border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
                  Live Transmission
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-tight">Interactive QA</h5>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">10:00 AM • Pending</p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-white/20 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateCourseModal open={isCourseModalOpen} onOpenChange={setIsCourseModalOpen} isAdmin={false} />
      <LiveLectureModal open={isLiveModalOpen} onOpenChange={setIsLiveModalOpen} />
      <CreateAssignmentModal open={isAssignmentModalOpen} onOpenChange={setIsAssignmentModalOpen} courseId={selectedCourseId} />
      {selectedAssignment && (
        <ViewSubmissionsModal open={isSubmissionsModalOpen} onOpenChange={setIsSubmissionsModalOpen} assignment={selectedAssignment} />
      )}
    </div>
  );
}
