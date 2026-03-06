"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  Upload,
  Award,
  Filter,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyAssignments } from "@/hooks/useAssignments";
import { SubmitAssignmentModal } from "@/components/shared/modals/SubmitAssignmentModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import { format, isPast, isFuture, isToday } from "date-fns";

interface Assignment {
  id: string;
  title: string;
  instructions?: string;
  dueDate: string;
  fileKey?: string;
  course: {
    id: string;
    title: string;
    unitCode: string;
  };
  createdBy?: {
    name: string;
  };
  submission?: {
    id: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
    fileKey: string;
  };
}

export default function StudentAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  const { data: assignments, isLoading } = useMyAssignments();

  const handleSubmitClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmitModalOpen(true);
  };

  // Filter assignments
  const filteredAssignments = assignments?.filter((assignment: Assignment) => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.unitCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = selectedCourse === "all" || assignment.course.id === selectedCourse;
    
    return matchesSearch && matchesCourse;
  }) || [];

  // Categorize assignments
  const pendingAssignments = filteredAssignments.filter((a: Assignment) => 
    !a.submission && isFuture(new Date(a.dueDate))
  );
  
  const overdueAssignments = filteredAssignments.filter((a: Assignment) => 
    !a.submission && isPast(new Date(a.dueDate))
  );
  
  const submittedAssignments = filteredAssignments.filter((a: Assignment) => 
    a.submission && !a.submission.grade
  );
  
  const gradedAssignments = filteredAssignments.filter((a: Assignment) => 
    a.submission?.grade !== undefined
  );

  // Get unique courses for filter
  const courses = assignments 
    ? Array.from(
        new Map(
          assignments.map((a: Assignment) => [
            a.course.id, 
            { id: a.course.id, title: a.course.title, unitCode: a.course.unitCode }
          ])
        ).values()
      )
    : [];

  const getStatusBadge = (assignment: Assignment) => {
    if (assignment.submission?.grade !== undefined) {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 font-bold text-[10px]">
          <Award className="h-3 w-3 mr-1" /> Graded
        </Badge>
      );
    }
    if (assignment.submission) {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[10px]">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Submitted
        </Badge>
      );
    }
    if (isPast(new Date(assignment.dueDate))) {
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 font-bold text-[10px]">
          <XCircle className="h-3 w-3 mr-1" /> Overdue
        </Badge>
      );
    }
    return (
      <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-bold text-[10px]">
        <Clock className="h-3 w-3 mr-1" /> Pending
      </Badge>
    );
  };

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = !assignment.submission && isPast(dueDate);
    const isDueToday = isToday(dueDate);

    return (
      <Card className={cn(
        "border-0 shadow-sm hover:shadow-xl bg-white rounded-2xl overflow-hidden transition-all duration-300 group",
        isOverdue && "border-l-4 border-l-red-500",
        isDueToday && !assignment.submission && "border-l-4 border-l-orange-500"
      )}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Assignment Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center border-2 transition-colors shrink-0",
                assignment.submission?.grade !== undefined 
                  ? "bg-green-50 border-green-200" 
                  : assignment.submission 
                  ? "bg-blue-50 border-blue-200"
                  : isOverdue
                  ? "bg-red-50 border-red-200"
                  : "bg-orange-50 border-orange-200"
              )}>
                <FileText className={cn(
                  "h-6 w-6",
                  assignment.submission?.grade !== undefined 
                    ? "text-green-600" 
                    : assignment.submission 
                    ? "text-blue-600"
                    : isOverdue
                    ? "text-red-600"
                    : "text-orange-600"
                )} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    {assignment.course.unitCode}
                  </code>
                  {getStatusBadge(assignment)}
                </div>
                <h3 className="text-base font-bold text-black truncate group-hover:text-red-600 transition-colors">
                  {assignment.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                  {assignment.course.title}
                </p>
                {assignment.instructions && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                    {assignment.instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Due Date & Actions */}
            <div className="flex items-center gap-6 lg:border-l lg:pl-6 border-gray-100">
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Due Date
                  </p>
                  <span className={cn(
                    "text-sm font-bold",
                    isOverdue ? "text-red-600" : isDueToday ? "text-orange-600" : "text-gray-700"
                  )}>
                    {format(dueDate, "MMM dd, yyyy")}
                  </span>
                </div>
                
                {assignment.submission && (
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Submitted
                    </p>
                    <span className="text-sm font-bold text-gray-700">
                      {format(new Date(assignment.submission.submittedAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
              </div>

              {/* Grade or Submit Button */}
              <div className="flex flex-col items-end gap-3">
                {assignment.submission?.grade !== undefined ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {assignment.submission.grade}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Out of 100</span>
                  </div>
                ) : assignment.submission ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Awaiting Grade</span>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleSubmitClick(assignment)}
                    className={cn(
                      "h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-wider",
                      isOverdue 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {assignment.submission?.feedback && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                    Lecturer Feedback
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {assignment.submission.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            My Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, submit, and view grades for all your course assignments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-bold px-3 py-1">
            {pendingAssignments.length} Pending
          </Badge>
          <Badge className="bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1">
            {gradedAssignments.length} Graded
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-100 shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search assignments or courses..." 
                className="pl-10 h-10 bg-gray-50/50 border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="h-10 px-4 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Courses</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.unitCode} - {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border border-gray-100">
          <TabsTrigger value="all">
            All ({filteredAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue ({overdueAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="submitted">
            Submitted ({submittedAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded ({gradedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment: Assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <EmptyState
              icon={FileText}
              title="No assignments found"
              description="You don't have any assignments yet. Enroll in courses to get started."
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment: Assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No pending assignments"
              description="You're all caught up! No pending assignments at the moment."
            />
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueAssignments.length > 0 ? (
            overdueAssignments.map((assignment: Assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No overdue assignments"
              description="Great job! You don't have any overdue assignments."
            />
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments.length > 0 ? (
            submittedAssignments.map((assignment: Assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <EmptyState
              icon={Upload}
              title="No submitted assignments"
              description="Assignments you submit will appear here awaiting grading."
            />
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedAssignments.length > 0 ? (
            gradedAssignments.map((assignment: Assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))
          ) : (
            <EmptyState
              icon={Award}
              title="No graded assignments"
              description="Your graded assignments will appear here once lecturers review your submissions."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Assignment Modal */}
      {selectedAssignment && (
        <SubmitAssignmentModal
          open={submitModalOpen}
          onOpenChange={setSubmitModalOpen}
          assignment={{
            id: selectedAssignment.id,
            title: selectedAssignment.title,
            courseTitle: selectedAssignment.course.title,
            dueDate: selectedAssignment.dueDate,
          }}
        />
      )}
    </div>
  );
}
