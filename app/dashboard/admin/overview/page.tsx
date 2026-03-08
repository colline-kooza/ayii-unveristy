"use client";
import React, { type ElementType, useState } from "react";
import Link from "next/link";
import {
  Users, School, Bell, TrendingUp, ArrowUpRight, ArrowDownRight,
  Search, Info, X, MoreHorizontal, DollarSign, FileText,
  CalendarCheck, BarChart3, GraduationCap, BookOpen, Plus,
  XCircle, Award, User, Library, ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid,
  Pie, PieChart, Bar, BarChart, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// --- Inline EventCalendar ---
const EVENT_COLORS: Record<string, string> = {
  purple: "bg-[#6b21a8] text-white",
  orange: "bg-orange-500 text-white",
  green: "bg-green-500 text-white",
  red: "bg-red-500 text-white",
};

interface CalendarEvent {
  date: number;
  title: string;
  color: keyof typeof EVENT_COLORS;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { date: 3, title: "Staff Meeting", color: "purple" },
  { date: 7, title: "Exam Day", color: "orange" },
  { date: 12, title: "Sports Day", color: "green" },
  { date: 15, title: "Parent-Teacher", color: "red" },
  { date: 20, title: "Holiday", color: "red" },
  { date: 25, title: "Fee Deadline", color: "purple" },
  { date: 28, title: "Board Meeting", color: "orange" },
];

function EventCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDate = MOCK_EVENTS.reduce<Record<number, CalendarEvent>>((acc, ev) => {
    acc[ev.date] = ev;
    return acc;
  }, {});

  const upcomingEvents = MOCK_EVENTS
    .filter((e) => e.date >= today.getDate())
    .sort((a, b) => a.date - b.date)
    .slice(0, 3);

  return (
    <Card className="border-none shadow-sm bg-white flex flex-col h-full overflow-hidden">
      <CardHeader className="flex-shrink-0 py-2 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{monthName} {year}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden flex flex-col px-3 pb-2 gap-2">
        <div className="grid grid-cols-7 gap-0.5 flex-shrink-0">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-0.5">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5 flex-shrink-0">
          {cells.map((day, idx) => {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasEvent = day !== null && eventsByDate[day];
            return (
              <div key={idx} className={cn(
                "relative flex items-center justify-center rounded text-[11px] h-7 cursor-pointer transition-colors",
                day === null && "invisible",
                isToday && "bg-[#6b21a8] text-white font-bold",
                !isToday && hasEvent && "bg-[#E8DFFC] text-[#6b21a8] font-semibold",
                !isToday && !hasEvent && day !== null && "hover:bg-gray-100 text-foreground",
              )}>
                {day}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#6b21a8]" />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto mt-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Upcoming</p>
          <div className="flex flex-col gap-1.5">
            {upcomingEvents.map((ev) => (
              <div key={ev.date} className="flex items-center gap-2">
                <div className={cn("flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold", EVENT_COLORS[ev.color])}>
                  {ev.date}
                </div>
                <span className="text-xs text-foreground truncate">{ev.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Interfaces ---
interface StatCardData {
  title: string; value: string; change: string; trend: "up" | "down";
  icon: ElementType; iconBgColor: string; iconColor: string; description: string;
}
interface FeesData { month: string; collection: number; expenses: number; }
interface AttendanceData { day: string; present: number; absent: number; }
interface EnquiryData { month: string; inquiries: number; }
interface AdmissionStatusData { status: string; count: number; color: string; }
interface RecentApplication { id: string; applicantName: string; status: "Pending" | "Approved" | "Rejected"; date: string; }
interface FinancialPerformanceData { month: string; revenue: number; sales: number; }
interface StudentProgressItem { status: string; value: number; color: string; }
interface StudentProgressData { totalStudents: number; breakdown: StudentProgressItem[]; }
interface ProgramEnrollmentData { type: string; students: number; fill: string; }
interface ApplicationStats { pending: number; rejected: number; }
interface OverallAnalyticsData { totalUsers: number; totalCourses: number; averageEngagement: string; }

// --- Mock Data ---
const MOCK_STATS: StatCardData[] = [
  { title: "Total Students", value: "1,250", change: "5.2%", trend: "up", icon: Users, iconBgColor: "bg-[#E8DFFC]", iconColor: "text-[#6b21a8]", description: "Total number of students enrolled." },
  { title: "Total Teachers", value: "85", change: "1.5%", trend: "up", icon: User, iconBgColor: "bg-rose-100", iconColor: "text-[#8B1538]", description: "Total number of teaching staff." },
  { title: "Total Users", value: "2,320", change: "3.1%", trend: "up", icon: School, iconBgColor: "bg-green-100", iconColor: "text-green-600", description: "Total platform users across all roles." },
];

const mockFeesCollectionData: FeesData[] = [
  { month: "Jan", collection: 25000, expenses: 15000 },
  { month: "Feb", collection: 28000, expenses: 16000 },
  { month: "Mar", collection: 26000, expenses: 14000 },
  { month: "Apr", collection: 30000, expenses: 18000 },
  { month: "May", collection: 32000, expenses: 19000 },
  { month: "Jun", collection: 35000, expenses: 20000 },
];

const mockStudentAttendanceData: AttendanceData[] = [
  { day: "Mon", present: 920, absent: 80 },
  { day: "Tue", present: 950, absent: 50 },
  { day: "Wed", present: 910, absent: 90 },
  { day: "Thu", present: 930, absent: 70 },
  { day: "Fri", present: 880, absent: 120 },
];

const mockEnquiryData: EnquiryData[] = [
  { month: "Jan", inquiries: 120 },
  { month: "Feb", inquiries: 150 },
  { month: "Mar", inquiries: 130 },
  { month: "Apr", inquiries: 180 },
  { month: "May", inquiries: 160 },
  { month: "Jun", inquiries: 200 },
];

const mockFeesOverviewData = {
  monthlyExpenses: 15000,
  monthlyFeesCollection: 25000,
  feesAwaitingPayment: 8000,
  incomeAugust2025: 22000,
};

const mockAdmissionStatusData: AdmissionStatusData[] = [
  { status: "New", count: 15, color: "#6b21a8" },
  { status: "In Review", count: 8, color: "#F97316" },
  { status: "Accepted", count: 25, color: "#22C55E" },
  { status: "Rejected", count: 5, color: "#EF4444" },
];

const mockStorageUsageData = { usedGB: 750, totalGB: 1000 };

const mockRecentApplications: RecentApplication[] = [
  { id: "1", applicantName: "Alice Johnson", status: "Pending", date: "2024-07-20" },
  { id: "2", applicantName: "Bob Williams", status: "Approved", date: "2024-07-19" },
  { id: "3", applicantName: "Charlie Brown", status: "Pending", date: "2024-07-18" },
  { id: "4", applicantName: "Diana Miller", status: "Rejected", date: "2024-07-17" },
  { id: "5", applicantName: "Eve Davis", status: "Approved", date: "2024-07-16" },
];

const mockFinancialPerformanceData: FinancialPerformanceData[] = [
  { month: "Jan", revenue: 15000, sales: 1000 },
  { month: "Feb", revenue: 17000, sales: 1200 },
  { month: "Mar", revenue: 16000, sales: 1100 },
  { month: "Apr", revenue: 19000, sales: 1500 },
  { month: "May", revenue: 22000, sales: 1800 },
  { month: "Jun", revenue: 25000, sales: 2000 },
  { month: "Jul", revenue: 28000, sales: 2300 },
  { month: "Aug", revenue: 26000, sales: 2100 },
  { month: "Sep", revenue: 29000, sales: 2400 },
  { month: "Oct", revenue: 31000, sales: 2500 },
  { month: "Nov", revenue: 29500, sales: 2350 },
  { month: "Dec", revenue: 30000, sales: 2400 },
];

const mockStudentProgressData: StudentProgressData = {
  totalStudents: 1250,
  breakdown: [
    { status: "Passed", value: 50, color: "#22C55E" },
    { status: "Failed", value: 10, color: "#EF4444" },
    { status: "Overdue", value: 5, color: "#F97316" },
    { status: "In Progress", value: 25, color: "#6b21a8" },
    { status: "Not Started", value: 10, color: "#E5E7EB" },
  ],
};

const mockProgramEnrollmentData: ProgramEnrollmentData[] = [
  { type: "Science", students: 450, fill: "#6b21a8" },
  { type: "Arts", students: 280, fill: "#F97316" },
  { type: "Commerce", students: 120, fill: "#22C55E" },
  { type: "Vocational", students: 90, fill: "#C41E3A" },
  { type: "Other", students: 60, fill: "#EF4444" },
];

const mockApplicationStats: ApplicationStats = { pending: 45, rejected: 12 };

const mockOverallAnalyticsData: OverallAnalyticsData = {
  totalUsers: 2320, totalCourses: 500, averageEngagement: "75%",
};

const mockSubjectPerformanceData = [
  { subject: "Math", A: 120, B: 98, fullMark: 150 },
  { subject: "English", A: 98, B: 130, fullMark: 150 },
  { subject: "Science", A: 86, B: 90, fullMark: 150 },
  { subject: "History", A: 99, B: 85, fullMark: 150 },
  { subject: "Art", A: 85, B: 110, fullMark: 150 },
  { subject: "PE", A: 65, B: 85, fullMark: 150 },
];

const mockRevenueAreaData = [
  { month: "Jan", revenue: 25000, target: 22000 },
  { month: "Feb", revenue: 28000, target: 24000 },
  { month: "Mar", revenue: 26000, target: 25000 },
  { month: "Apr", revenue: 32000, target: 27000 },
  { month: "May", revenue: 35000, target: 29000 },
  { month: "Jun", revenue: 38000, target: 31000 },
];

const mockGradeDistributionData = [
  { grade: "A+", count: 180, fill: "#6b21a8" },
  { grade: "A", count: 240, fill: "#6D28D9" },
  { grade: "B+", count: 310, fill: "#F97316" },
  { grade: "B", count: 275, fill: "#FB923C" },
  { grade: "C", count: 160, fill: "#22C55E" },
  { grade: "D", count: 85, fill: "#EF4444" },
];

// --- Shared Components ---


function StatCard({
  icon: Icon,
  title,
  value,
  change,
  trend,
  iconBgColor,
  iconColor,
  description,
}: StatCardData) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  return (
    <Card className="flex flex-col relative overflow-hidden shadow-sm border-none bg-white h-full !py-2 rounded">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-full", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold text-foreground">{value}</div>
        <p className={cn("text-xs flex items-center mt-1 line-clamp-1", trendColor)}>
          <TrendIcon className="inline-block h-3 w-3 mr-1" />
          {change} from last month
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-1">
          {description}
        </p>
      </CardFooter>
      <div className="absolute -bottom-2 -right-2 opacity-[0.08]">
        <Icon className="h-20 w-20 text-[#6b21a8]" />
      </div>
    </Card>
  );
}


export function QuickAccessButton({
  icon: Icon, label, link, showPlus = false, className, iconBgColor, iconColor, ...props
}: {
  icon: ElementType; label: string; link?: string | null; showPlus?: boolean;
  iconBgColor: string; iconColor: string;
} & React.ComponentProps<typeof Button>) {
  const content = (
    <Button variant="outline" className={cn("flex items-center gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 h-9 text-sm font-medium", className)} {...props}>
      <div className={cn("p-1 rounded-md", iconBgColor)}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      {label}
      {showPlus && <Plus className="h-3 w-3 ml-1" />}
    </Button>
  );
  if (link) return <Link href={link} className="inline-block">{content}</Link>;
  return content;
}

// --- Above-fold Section ---
function AboveFoldSection() {
  return (
    <div className="grid grid-cols-12 gap-4 h-full min-h-0">

      {/* LEFT: Quick access + stat cards */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 h-full min-h-0">
        <div className="flex-shrink-0 flex flex-wrap gap-2">
          <QuickAccessButton icon={GraduationCap} label="Add Students" showPlus link="/dashboard/admin/users/students" iconBgColor="bg-[#E8DFFC]" iconColor="text-[#6b21a8]" />
          <QuickAccessButton icon={BookOpen} label="Manage Courses" showPlus link="/dashboard/admin/courses" iconBgColor="bg-orange-100" iconColor="text-orange-600" />
          <QuickAccessButton icon={BarChart3} label="Library" showPlus link="/dashboard/library" iconBgColor="bg-red-100" iconColor="text-red-600" />
          {/* <QuickAccessButton icon={Users} label="Manage Staff" showPlus iconBgColor="bg-green-100" iconColor="text-green-600" />
          <QuickAccessButton icon={FileText} label="Resources" showPlus iconBgColor="bg-red-100" iconColor="text-red-600" /> */}
        </div>
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {MOCK_STATS.map((stat, index) => (
            <div key={index} className="flex-1 min-h-0">
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE: Fees bar chart */}
      <Card className="col-span-12 lg:col-span-6 border-none shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
        <CardHeader className="flex-shrink-0 py-2 px-4">
          <CardTitle className="text-sm">Fees Collection & Expenses</CardTitle>
          <CardDescription className="text-xs">Monthly financial overview.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden pb-2 px-3">
          <ChartContainer
            config={{
              collection: { label: "Collection", color: "#6b21a8" },
              expenses: { label: "Expenses", color: "#F97316" },
            }}
            className="h-full w-full"
          >
            <BarChart data={mockFeesCollectionData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${v / 1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="collection" fill="var(--color-collection)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-shrink-0 px-4 pb-2 pt-0">
          <div className="flex gap-2 text-xs text-muted-foreground items-center">
            <TrendingUp className="h-3 w-3 text-green-600" />
            Fees collection trending up by 5.2% this month
          </div>
        </CardFooter>
      </Card>

      {/* RIGHT: Event calendar */}
      <div className="col-span-12 lg:col-span-3 h-full min-h-0 overflow-hidden flex flex-col">
        <EventCalendar />
      </div>
    </div>
  );
}

// --- Below-fold Components ---

function FeesOverviewCard({ data }: { data: typeof mockFeesOverviewData }) {
  const { monthlyExpenses, monthlyFeesCollection, feesAwaitingPayment, incomeAugust2025 } = data;
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Fees Overview</CardTitle>
        <CardDescription className="text-xs">Current month financial summary.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {[
          { label: "Monthly Expenses", value: `$${monthlyExpenses.toLocaleString()}`, color: "text-red-600" },
          { label: "Monthly Collection", value: `$${monthlyFeesCollection.toLocaleString()}`, color: "text-green-600" },
          { label: "Fees Awaiting Payment", value: `$${feesAwaitingPayment.toLocaleString()}`, color: "text-yellow-600" },
          { label: "Income — Aug 2025", value: `$${incomeAugust2025.toLocaleString()}`, color: "text-[#6b21a8]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className={cn("text-base font-bold", color)}>{value}</span>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-1 bg-transparent text-[#6b21a8] border-[#E8DFFC] hover:bg-[#F5F0FF] text-xs h-8">
          View Financial Reports
        </Button>
      </CardContent>
    </Card>
  );
}

function RecentApplicationsTable({ data }: { data: RecentApplication[] }) {
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = data.filter((app) =>
    (statusFilter === "All" || app.status === statusFilter) &&
    app.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div>
          <CardTitle className="text-base">Recent Applications</CardTitle>
          <CardDescription className="text-xs">Overview of new student applications.</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs text-[#6b21a8] border-[#E8DFFC] hover:bg-[#F5F0FF] bg-transparent" asChild>
          <Link href="/admin/applications">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="search" placeholder="Search applicants..." className="pl-8 h-8 text-xs" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>Applicant Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? filtered.map((app) => (
              <TableRow key={app.id} className="text-sm">
                <TableCell className="font-medium text-xs">{app.applicantName}</TableCell>
                <TableCell>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                    app.status === "Approved" && "bg-green-100 text-green-800",
                    app.status === "Rejected" && "bg-red-100 text-red-800",
                    app.status === "Pending" && "bg-yellow-100 text-yellow-800"
                  )}>{app.status}</span>
                </TableCell>
                <TableCell className="text-xs">{app.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                      <DropdownMenuItem>Reject</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-xs text-muted-foreground">No applications found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AdmissionsStatusChart({ data }: { data: AdmissionStatusData[] }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Admissions Status</CardTitle>
        <CardDescription className="text-xs">Current pipeline of admissions.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-2">
        <ChartContainer config={{ count: { label: "Admissions" } }} className="aspect-square max-h-[160px]">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={50} outerRadius={70}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 p-4 pt-0">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.status}</span>
            </div>
            <span className="font-bold">{item.count}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

function StudentProgressCard({ data }: { data: StudentProgressData }) {
  const total = data.breakdown.reduce((s, i) => s + i.value, 0);
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Students Progress</CardTitle>
        <CardDescription className="text-xs">Overall performance status breakdown.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="text-2xl font-bold">{data.totalStudents} <span className="text-sm font-normal text-muted-foreground">students</span></div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
          {data.breakdown.map((item) => (
            <div key={item.status} className="h-full" style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }} />
          ))}
        </div>
        <div className="grid gap-1.5">
          {data.breakdown.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.status}
              </div>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full bg-transparent text-[#6b21a8] border-[#E8DFFC] hover:bg-[#F5F0FF] text-xs h-8">View Details</Button>
      </CardContent>
    </Card>
  );
}

function FinancialPerformanceChart({ data }: { data: FinancialPerformanceData[] }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Financial Performance</CardTitle>
        <CardDescription className="text-xs">Monthly revenue and sales trends.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ revenue: { label: "Revenue", color: "#6b21a8" }, sales: { label: "Sales", color: "#F97316" } }} className="h-[200px] w-full">
          <RechartsLineChart data={data} margin={{ left: -10, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${v / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
            <Line dataKey="sales" type="monotone" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function EnquiryOverviewChart({ data }: { data: EnquiryData[] }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Enquiry Overview</CardTitle>
        <CardDescription className="text-xs">Monthly trend of new inquiries.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ inquiries: { label: "Inquiries", color: "#6b21a8" } }} className="h-[180px] w-full">
          <RechartsLineChart data={data} margin={{ left: -10, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="inquiries" type="monotone" stroke="var(--color-inquiries)" strokeWidth={2} dot={true} />
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-0 pb-3 px-4">
        <div className="flex gap-2 text-xs text-muted-foreground items-center">
          <TrendingUp className="h-3 w-3 text-green-600" />
          Inquiries trending up by 8% this quarter
        </div>
      </CardFooter>
    </Card>
  );
}

function StudentAttendanceChart({ data }: { data: AttendanceData[] }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Student Attendance</CardTitle>
        <CardDescription className="text-xs">Daily attendance overview.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ present: { label: "Present", color: "#6b21a8" }, absent: { label: "Absent", color: "#EF4444" } }} className="h-[180px] w-full">
          <BarChart data={data} margin={{ left: -10, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={[0, 0, 4, 4]} stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-0 pb-3 px-4">
        <div className="flex gap-2 text-xs text-muted-foreground items-center">
          <TrendingUp className="h-3 w-3 text-green-600" />
          Overall attendance rate: 92%
        </div>
      </CardFooter>
    </Card>
  );
}

function RevenueVsTargetChart() {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Revenue vs Target</CardTitle>
        <CardDescription className="text-xs">Monthly revenue performance against targets.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ revenue: { label: "Revenue", color: "#6b21a8" }, target: { label: "Target", color: "#F97316" } }} className="h-[180px] w-full">
          <AreaChart data={mockRevenueAreaData} margin={{ left: -10, right: 8 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6b21a8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${v / 1000}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="revenue" stroke="#6b21a8" strokeWidth={2} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="target" stroke="#F97316" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorTarget)" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-0 pb-3 px-4">
        <div className="flex gap-2 text-xs text-muted-foreground items-center">
          <TrendingUp className="h-3 w-3 text-green-600" />
          Tracking monthly revenue vs targets
        </div>
      </CardFooter>
    </Card>
  );
}

function GradeDistributionChart() {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Grade Distribution</CardTitle>
        <CardDescription className="text-xs">Student performance breakdown by grade.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ count: { label: "Students", color: "#6b21a8" } }} className="h-[180px] w-full">
          <BarChart data={mockGradeDistributionData} margin={{ left: -10, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="grade" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {mockGradeDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function SubjectPerformanceRadar() {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Subject Performance</CardTitle>
        <CardDescription className="text-xs">Average student scores by subject.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={{ A: { label: "This Year", color: "#6b21a8" }, B: { label: "Last Year", color: "#F97316" } }} className="h-[180px] w-full">
          <RadarChart data={mockSubjectPerformanceData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fontSize: 8 }} />
            <Radar name="This Year" dataKey="A" stroke="#6b21a8" fill="#6b21a8" fillOpacity={0.3} />
            <Radar name="Last Year" dataKey="B" stroke="#F97316" fill="#F97316" fillOpacity={0.2} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function ProgramEnrollmentChart({ data }: { data: ProgramEnrollmentData[] }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Program Enrollment</CardTitle>
        <CardDescription className="text-xs">Students enrolled by program type.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-2">
        <ChartContainer config={{ students: { label: "Students" } }} className="aspect-square max-h-[160px]">
          <PieChart>
            <Pie data={data} dataKey="students" nameKey="type" innerRadius={45} outerRadius={70}>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 p-4 pt-0">
        {data.map((item) => (
          <div key={item.type} className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }} />
              <span>{item.type}</span>
            </div>
            <span className="font-bold">{item.students}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

function ApplicationStatsCard({ data }: { data: ApplicationStats }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">School Applications</CardTitle>
        <CardDescription className="text-xs">Overview of new school applications.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-[#6b21a8]" />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 text-sm font-bold animate-pulse">{data.pending}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Rejected</span>
          </div>
          <span className="text-lg font-bold">{data.rejected}</span>
        </div>
        <Button className="w-full text-xs h-8 bg-[#6b21a8] text-white hover:bg-[#6A2ED0]">See All Applications</Button>
      </CardContent>
    </Card>
  );
}

function OverallAnalyticsCard({ data }: { data: OverallAnalyticsData }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Overall Analytics</CardTitle>
        <CardDescription className="text-xs">Key performance indicators across all users.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {[
          { icon: Users, label: "Total Users", value: data.totalUsers.toLocaleString(), color: "text-[#6b21a8]" },
          { icon: BookOpen, label: "Total Courses", value: data.totalCourses.toLocaleString(), color: "text-orange-500" },
          { icon: Award, label: "Avg. Engagement", value: data.averageEngagement, color: "text-yellow-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-base font-bold">{value}</span>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-1 bg-transparent text-[#6b21a8] border-[#E8DFFC] hover:bg-[#F5F0FF] text-xs h-8">View Full Analytics</Button>
      </CardContent>
    </Card>
  );
}

function StorageUsageCard({ data }: { data: typeof mockStorageUsageData }) {
  const pct = (data.usedGB / data.totalGB) * 100;
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Storage Usage</CardTitle>
        <CardDescription className="text-xs">Platform storage utilization.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{data.usedGB} GB</span>
          <span className="text-sm text-muted-foreground">of {data.totalGB} GB</span>
        </div>
        <Progress value={pct} className="h-3 bg-gray-200 [&>*]:bg-[#6b21a8]" />
        <p className="text-xs text-muted-foreground">{pct.toFixed(1)}% used</p>
        <Button variant="outline" className="w-full bg-transparent text-[#6b21a8] border-[#E8DFFC] hover:bg-[#F5F0FF] text-xs h-8">Manage Storage</Button>
      </CardContent>
    </Card>
  );
}

// --- MAIN PAGE ---
export default function AdminDashboard() {
  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 p-4 overflow-hidden">


      {/* Header */}
      <header className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Welcome back, Admin <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm">Everything you need to manage your school platform.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search everything..." className="w-full bg-white pl-8" />
          </div>
          <Button variant="outline" size="icon" className="relative bg-white flex-shrink-0">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500">3</Badge>
          </Button>
          <Button variant="outline" className="hidden lg:flex items-center gap-2 text-xs bg-transparent text-[#6b21a8] hover:bg-[#F5F0FF] flex-shrink-0 border-[#E8DFFC]">
            <School className="h-4 w-4" />
            View School Profile
          </Button>
        </div>
      </header>

      {/* Scrollable content — only vertical scroll, no horizontal */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-4">

        {/* Above-the-fold: fills remaining viewport height */}
        <div className="flex-shrink-0 h-[calc(100vh-160px)] min-h-[380px]">
          <AboveFoldSection />
        </div>

        {/* Row 1: Fees Overview | Applications Table | Admissions Pie */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3"><SubjectPerformanceRadar /></div>
          <div className="col-span-12 lg:col-span-6"><RecentApplicationsTable data={mockRecentApplications} /></div>
          <div className="col-span-12 lg:col-span-3"><AdmissionsStatusChart data={mockAdmissionStatusData} /></div>
        </div>

        {/* Row 2: Financial Performance | Student Progress | Application Stats */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-5"><FinancialPerformanceChart data={mockFinancialPerformanceData} /></div>
          <div className="col-span-12 lg:col-span-4"><StudentProgressCard data={mockStudentProgressData} /></div>
          <div className="col-span-12 lg:col-span-3"><ApplicationStatsCard data={mockApplicationStats} /></div>
        </div>

        {/* Row 3: Enquiry | Attendance | Revenue vs Target */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4"><EnquiryOverviewChart data={mockEnquiryData} /></div>
          <div className="col-span-12 lg:col-span-4"><StudentAttendanceChart data={mockStudentAttendanceData} /></div>
          <div className="col-span-12 lg:col-span-4"><RevenueVsTargetChart /></div>
        </div>

        {/* Row 4: Grade Distribution | Subject Radar | Program Enrollment */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4"><GradeDistributionChart /></div>
          <div className="col-span-12 lg:col-span-4"><SubjectPerformanceRadar /></div>
          <div className="col-span-12 lg:col-span-4"><ProgramEnrollmentChart data={mockProgramEnrollmentData} /></div>
        </div>

        {/* Row 5: Overall Analytics | Storage */}
        <div className="grid grid-cols-12 gap-4 pb-6">
          <div className="col-span-12 lg:col-span-4"><OverallAnalyticsCard data={mockOverallAnalyticsData} /></div>
          <div className="col-span-12 lg:col-span-4"><StorageUsageCard data={mockStorageUsageData} /></div>
        </div>

      </div>
    </div>
  );
}