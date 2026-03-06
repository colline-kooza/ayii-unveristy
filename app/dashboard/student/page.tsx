"use client";
import React, { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  CreditCard,
  Target,
  Trophy,
  ArrowUpRight,
  Search,
  Bell,
  MoreHorizontal,
  Bookmark,
  GraduationCap,
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
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { EventCalendar } from "@/components/dashboard/event-calendar";
import { useMyEnrollments } from "@/hooks/useCourses";
import { useMyAssignments, useSubmissions } from "@/hooks/useAssignments";
import { SubmitAssignmentModal } from "@/components/shared/modals/SubmitAssignmentModal";
import { Loader2, Plus } from "lucide-react";

// --- Mock Data ---
const mockAttendanceData = [
  { month: "Jan", attendance: 95 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 88 },
  { month: "Apr", attendance: 94 },
  { month: "May", attendance: 98 },
  { month: "Jun", attendance: 91 },
];

const mockCurrentCourses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    instructor: "Dr. Smith",
    progress: 75,
    lastAccessed: "2 hours ago",
    color: "bg-[#8B1538]",
  },
  {
    id: 2,
    title: "Computer Science 101",
    instructor: "Prof. Jones",
    progress: 40,
    lastAccessed: "Yesterday",
    color: "bg-orange-500",
  },
  {
    id: 3,
    title: "Organic Chemistry",
    instructor: "Dr. White",
    progress: 90,
    lastAccessed: "3 days ago",
    color: "bg-green-500",
  },
];

const mockUpcomingAssignments = [
  { id: 1, title: "Calculus Homework", dueDate: "Tomorrow", subject: "Math", priority: "High" },
  { id: 2, title: "Lab Report: pH Levels", dueDate: "Friday", subject: "Chemistry", priority: "Medium" },
  { id: 3, title: "Final Project Proposal", dueDate: "Next Monday", subject: "CS", priority: "Low" },
];

export default function StudentDashboard() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{id: string, title: string} | null>(null);
  
  const { data: enrollments, isLoading: isLoadingEnrolled } = useMyEnrollments();
  const { data: assignments, isLoading: isLoadingAssignments } = useMyAssignments();

  const handleSubmitClick = (item: any) => {
    setSelectedAssignment({ id: item.id, title: item.title });
    setIsSubmitModalOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50/30 p-4 md:p-8">
      {/* Header Area */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/10 border-2 border-white shadow-sm">
            <AvatarImage src="/avatar-student.png" />
            <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-black">Welcome back, John 👋</h1>
            <p className="text-gray-500 mt-1 text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Sophomore • Computer Science • ID: 29402
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg shadow-sm bg-white border-gray-200">
               <Bell className="h-4 w-4 text-gray-600" />
               <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
             </Button>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm rounded-lg h-10 px-6 font-semibold">
            Continue Learning
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Top Row: Stats, Performance, and Calendar */}
        <div className="grid lg:grid-cols-12 gap-6 h-full min-h-0 flex-1">
          {/* Stats Bar - Span 3 */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3 h-full overflow-y-auto pr-1">
             {[
               { icon: Target, label: "GPA", value: "3.84", color: "text-purple-600", bg: "bg-purple-50" },
               { icon: CheckCircle2, label: "Done", value: "12", color: "text-green-600", bg: "bg-green-50" },
               { icon: Trophy, label: "Medals", value: "8", color: "text-orange-500", bg: "bg-orange-50" },
               { icon: Clock, label: "Study", value: "142h", color: "text-accent-crimson", bg: "bg-rose-50" },
             ].map((stat, i) => (
               <Card key={i} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow h-24">
                 <CardContent className="p-3 flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", stat.bg)}>
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 block">{stat.label}</span>
                      <span className="text-lg font-bold text-black">{stat.value}</span>
                    </div>
                 </CardContent>
               </Card>
             ))}
          </div>

          {/* Performance Flow - Span 6 */}
          <Card className="lg:col-span-6 border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold">Attendance & Performance</CardTitle>
              <CardDescription className="text-xs">Track your consistency over time</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-2">
               <ChartContainer
                config={{
                  attendance: { label: "Attendance %", color: "#6b21a8" },
                }}
                className="h-full w-full"
              >
                <AreaChart data={mockAttendanceData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6b21a8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#6b21a8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAttendance)" 
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Event Calendar - Span 3 */}
          <div className="lg:col-span-3 h-full overflow-hidden">
            <EventCalendar />
          </div>
        </div>

        {/* Below the Fold: Courses, Assignments and Fees */}
        <div className="grid gap-6 lg:grid-cols-12 pb-10">
          {/* Current Courses */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-black">Current Courses</h2>
              <Button variant="link" className="text-primary font-semibold text-sm h-8">View All</Button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {mockCurrentCourses.map((course) => (
                <Card key={course.id} className="border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all h-fit">
                  <div className={cn("h-1 w-full", course.color)} />
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm font-semibold line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="text-xs">{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.lastAccessed}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full group-hover:bg-primary group-hover:text-white"><ArrowUpRight className="h-3 w-3" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Assignments & Fees */}
          <div className="space-y-6 lg:col-span-4">
            {/* Assignments */}
            <Card className="border-gray-200 shadow-sm h-fit">
              <CardHeader className="py-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Due Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {isLoadingAssignments ? (
                   <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
                ) : assignments && assignments.length > 0 ? (
                  assignments.map((assignment: any) => (
                    <div key={assignment.id} className="group p-2.5 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <h4 className="text-sm font-semibold text-black leading-none mb-1">{assignment.title}</h4>
                          <p className="text-xs text-muted-foreground">{assignment.course?.title}</p>
                        </div>
                        <Badge variant="secondary" className={cn(
                          "text-xs px-2 py-0.5",
                          assignment.submission
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-rose-50 text-accent-crimson border-rose-200"
                        )}>
                          {assignment.submission ? "Submitted" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSubmitClick(assignment)}
                          className="h-7 text-xs font-semibold text-primary px-2 hover:bg-primary/5"
                        >
                           {assignment.submission ? "Resubmit" : "Submit"}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center p-4 text-gray-400 text-xs">No assignments due.</div>
                )}
              </CardContent>
            </Card>

            {/* Fee Quick Pay */}
            <Card className="bg-linear-to-br from-purple-600 to-primary border-none shadow-lg text-white h-fit">
              <CardHeader className="py-4">
                 <div className="flex items-center justify-between">
                    <CreditCard className="h-6 w-6 text-white/40" />
                    <Badge className="bg-white/20 text-white border-0 text-xs">Term 2</Badge>
                 </div>
                 <CardTitle className="pt-2 text-white text-base">Balance: $2,450.00</CardTitle>
                 <CardDescription className="text-white/70 text-xs">Payment deadline in 12 days</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                 <Button className="w-full h-9 text-sm bg-white text-primary font-semibold hover:bg-white/90">Pay Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
