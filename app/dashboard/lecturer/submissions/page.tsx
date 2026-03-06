"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Search, Eye, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { ViewSubmissionsModal } from "@/components/shared/modals/ViewSubmissionsModal";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for submission feed since we don't have a "global submissions" hook yet
const mockSubmissions = [
  { id: "1", student: "Sarah Jenkins", assignment: "Calculus Final", course: "MATH 101", timestamp: "2h ago", status: "PENDING", grade: null },
  { id: "2", student: "Michael Chen", assignment: "Lab Report 2", course: "PHYS 202", timestamp: "5h ago", status: "GRADED", grade: "A" },
  { id: "3", student: "Emma Wilson", assignment: "Calculus Final", course: "MATH 101", timestamp: "6h ago", status: "PENDING", grade: null },
  { id: "4", student: "David Brown", assignment: "Project Proposal", course: "CS 301", timestamp: "1d ago", status: "GRADED", grade: "B+" },
  { id: "5", student: "Lisa Garcia", assignment: "Lab Report 2", course: "PHYS 202", timestamp: "1d ago", status: "PENDING", grade: null },
];

export default function LecturerSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{id: string, title: string} | null>(null);

  const { data: myCourses, isLoading: isLoadingCourses } = useMyCoursesLecturer();
  
  // Filtering logic
  const filteredSubmissions = mockSubmissions.filter(sub => 
    sub.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.assignment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = filteredSubmissions.filter(s => s.status === "PENDING").length;

  if (isLoadingCourses) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 bg-rose-50/50 animate-pulse rounded-lg w-64"></div>
        <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-8 space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Submissions {filteredSubmissions.length > 0 ? `(${filteredSubmissions.length})` : "(0)"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and grade student assignment submissions
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 px-3 py-1 text-xs font-medium">
            {pendingCount} Pending
          </Badge>
        )}
      </div>

      {/* Table Card View */}
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-semibold text-black">Submission Queue</CardTitle>
              <CardDescription className="text-xs text-gray-500">Recent student submissions awaiting review</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students or assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!filteredSubmissions || filteredSubmissions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <EmptyState
                icon={ClipboardList}
                title="No submissions found"
                description="Student submissions will appear here once they submit their assignments"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Student Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Assignment</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Course</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Submitted</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-xs">Grade</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3 px-4 text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full border border-gray-200 overflow-hidden bg-rose-50 flex items-center justify-center shrink-0">
                            <span className="text-accent-crimson font-bold text-xs">
                              {submission.student.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <span className="font-semibold text-black text-sm">{submission.student}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-700 text-sm font-medium">{submission.assignment}</TableCell>
                      <TableCell className="py-3 px-4">
                        <code className="bg-rose-50 text-accent-crimson px-2 py-1 rounded text-xs font-medium border border-rose-200">
                          {submission.course}
                        </code>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-gray-600 text-sm">{submission.timestamp}</TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge
                          variant={submission.status === "PENDING" ? "default" : "default"}
                          className={cn(
                            "font-medium px-2 py-0.5 text-xs",
                            submission.status === "PENDING" 
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-100" 
                              : "bg-green-100 text-green-700 hover:bg-green-100"
                          )}
                        >
                          {submission.status === "PENDING" ? (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Pending
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Graded
                            </span>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {submission.grade ? (
                          <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                            <span className="text-sm font-bold text-black">{submission.grade}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-3 gap-2"
                          onClick={() => {
                            setSelectedAssignment({ id: "mock-id", title: submission.assignment });
                            setIsSubmissionsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
