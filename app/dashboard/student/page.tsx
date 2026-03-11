"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Target,
  Trophy,
  ArrowUpRight,
  GraduationCap,
  LayoutDashboard,
  Bell,
  MoreVertical,
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { EventCalendar } from "@/components/dashboard/event-calendar";
import { useMyEnrollments, useCourses } from "@/hooks/useCourses";
import { useMyAssignments } from "@/hooks/useAssignments";
import { SubmitAssignmentModal } from "@/components/shared/modals/SubmitAssignmentModal";
import { useMe } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const mockAttendanceData = [
  { month: "Jan", attendance: 95 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 88 },
  { month: "Apr", attendance: 94 },
  { month: "May", attendance: 98 },
  { month: "Jun", attendance: 91 },
];

export default function StudentDashboard() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{id: string, title: string} | null>(null);
  
  const { data: user } = useMe();
  const { data: enrollments, isLoading: isLoadingEnrolled } = useMyEnrollments();
  const { data: assignments, isLoading: isLoadingAssignments } = useMyAssignments();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmitClick = (item: any) => {
    setSelectedAssignment({ id: item.id, title: item.title });
    setIsSubmitModalOpen(true);
  };

  const nameParts = user?.name?.split(" ") || ["", ""];
  const firstName = nameParts[0] || "Student";
  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("") : "ST";

  return (
    <div className="flex min-h-screen w-full flex-col bg-white space-y-4">
      {/* Premium Compact Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-1 ring-rose-100 border-2 border-white">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-rose-50 text-primary text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-black flex items-center gap-2">
              Welcome back, {firstName} <span className="animate-pulse">👋</span>
            </h1>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mt-0.5">
              <LayoutDashboard className="h-3 w-3 text-primary" />
              {user?.program || "Academic Portal"} • {user?.registrationNumber || "ID: --"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-primary transition-colors">
              <Bell className="h-4.5 w-4.5" />
           </Button>
           <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-lg h-9 px-5 text-xs font-bold transition-all">
             Rescan Modules
           </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden px-1">
        {/* Top Analytics Row */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Key Metrics */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-2">
             {[
               { icon: Target, label: "Current GPA", value: "3.84", color: "text-purple-600", bg: "bg-purple-50/50" },
               { icon: CheckCircle2, label: "Completed", value: "12 Units", color: "text-green-600", bg: "bg-green-50/50" },
               { icon: Clock, label: "Learning Time", value: "142 Hours", color: "text-primary", bg: "bg-rose-50/50" },
             ].map((stat, i) => (
               <Card key={i} className="border-gray-50 bg-gray-50/30 hover:bg-white hover:border-rose-100 transition-all cursor-default group">
                 <CardContent className="p-3 flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bg)}>
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{stat.label}</span>
                      <span className="text-base font-black text-black">{stat.value}</span>
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          {/* Performance Area */}
          <Card className="lg:col-span-6 border-gray-100 bg-white shadow-none">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-gray-400">Consistency Matrix</CardTitle>
                <CardDescription className="text-sm font-bold text-black mt-0.5">Average Attendance & Engagement</CardDescription>
              </div>
              <Badge variant="outline" className="text-[9px] font-black tracking-widest uppercase border-rose-100 text-primary">Academic Year 2024</Badge>
            </CardHeader>
            <CardContent className="min-h-[200px] pb-2 px-0">
               {mounted ? (
                 <ChartContainer
                  config={{ attendance: { label: "Attendance %", color: "#8B1538" } }}
                  className="h-full w-full aspect-auto"
                >
                  <AreaChart data={mockAttendanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B1538" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8B1538" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#8B1538" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#colorAttendance)" 
                    />
                  </AreaChart>
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

        {/* Action Row */}
        <div className="grid gap-4 lg:grid-cols-12 pb-8">
          {/* Enrollments / Courses */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Active Enrollments</h2>
              <Button variant="ghost" className="text-primary font-black text-[10px] uppercase tracking-widest h-6 hover:bg-rose-50 transition-colors">Expand Catalog</Button>
            </div>
            
            {isLoadingEnrolled ? (
               <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3">
                {enrollments.map((enrolled: any) => (
                  <Card key={enrolled.id} className="border-gray-50 bg-gray-50/20 hover:bg-white hover:border-rose-100 transition-all group cursor-pointer h-fit">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                         <Badge className="bg-rose-50 text-primary border-0 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md mb-2">
                           {enrolled.course?.unitCode}
                         </Badge>
                         <div className="h-8 w-8 rounded-lg bg-gray-100/50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowUpRight className="h-4 w-4" />
                         </div>
                      </div>
                      <CardTitle className="text-sm font-bold text-black leading-tight">{enrolled.course?.title}</CardTitle>
                      <CardDescription className="text-xs font-medium text-gray-500">{enrolled.course?.lecturer?.name || "Senior Lecturer"}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>Module Sync</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-1 bg-gray-100" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50/30 border border-dashed border-gray-100 rounded-2xl">
                <BookOpen className="h-8 w-8 text-gray-200 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No active academic units found</p>
                <Button variant="outline" className="mt-4 text-[10px] font-black uppercase tracking-widest border-gray-200 h-8 rounded-lg">Browse Library</Button>
              </div>
            )}
          </div>

          {/* Assignments / Tasks */}
          <div className="lg:col-span-4">
            <Card className="border-gray-100 bg-white shadow-none h-fit">
              <CardHeader className="py-4 px-5 border-b border-gray-50">
                <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Task Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingAssignments ? (
                   <div className="flex justify-center p-6"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
                ) : assignments && assignments.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {assignments.map((assignment: any) => (
                      <div key={assignment.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="text-[13px] font-bold text-black leading-tight group-hover:text-primary transition-colors">{assignment.title}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{assignment.course?.unitCode}</p>
                          </div>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md",
                            assignment.submission
                              ? "bg-green-50 text-green-700 border-0"
                              : "bg-rose-50 text-primary border-0"
                          )}>
                            {assignment.submission ? "Synced" : "Pending"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                             <Calendar className="h-3 w-3" />
                             {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSubmitClick(assignment)}
                            className="h-6 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-rose-50 px-2.5 rounded-md transition-all"
                          >
                             {assignment.submission ? "Update Submission" : "Initiate Upload"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="text-center p-8 text-gray-300">
                      <CheckCircle2 className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-[10px] font-black tracking-widest uppercase">Pipeline Empty</p>
                   </div>
                )}
              </CardContent>
              <CardFooter className="p-3 border-t border-gray-50">
                 <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Access Audit Logs</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {selectedAssignment && (
        <SubmitAssignmentModal 
          open={isSubmitModalOpen}
          onOpenChange={setIsSubmitModalOpen}
          assignment={selectedAssignment}
        />
      )}
    </div>
  );
}
