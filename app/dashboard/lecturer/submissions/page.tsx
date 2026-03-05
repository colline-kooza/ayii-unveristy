"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  GraduationCap,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { useAssignments } from "@/hooks/useAssignments";
import { ViewSubmissionsModal } from "@/components/shared/modals/ViewSubmissionsModal";
import { cn } from "@/lib/utils";

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

  if (isLoadingCourses) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen">
      {/* Compact Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Academic Audit & grading
          </h1>
          <p className="text-[13px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Student Performance Verification System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-0 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            {filteredSubmissions.filter(s => s.status === "PENDING").length} Pending Actions
          </Badge>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search students or assignments..." 
            className="pl-10 h-10 text-[13px] border-none bg-gray-50 rounded-xl focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 px-5 rounded-xl border-gray-100 text-[12px] font-black uppercase tracking-widest gap-2">
            <Filter className="h-4 w-4" /> Filter Parameters
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map((submission) => (
          <Card key={submission.id} className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all group">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between p-5 gap-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className="h-12 w-12 rounded-2xl border border-gray-100 shadow-sm">
                    <AvatarFallback className="bg-primary/5 text-primary font-black text-[13px]">
                      {submission.student.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-gray-900 truncate tracking-tight">{submission.student}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Submitted to:</span>
                      <span className="text-[11px] font-black text-primary uppercase tracking-widest truncate">{submission.assignment}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:flex lg:items-center gap-10 lg:px-10 lg:border-x lg:border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <GraduationCap className="h-3 w-3" /> Unit
                    </p>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                      {submission.course}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Clock className="h-3 w-3" /> Timestamp
                    </p>
                    <span className="text-[13px] font-black text-gray-900 uppercase tracking-tight">{submission.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-8 flex-1">
                  <div className="flex items-center gap-4">
                    {submission.status === "PENDING" ? (
                      <Badge className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md gap-2">
                        <AlertCircle className="h-3 w-3" /> Awaiting Audit
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md gap-2">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </Badge>
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-[13px] font-black text-gray-900">
                          {submission.grade}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="h-10 px-5 text-[12px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10 transition-all gap-2"
                    onClick={() => {
                        setSelectedAssignment({ id: "mock-id", title: submission.assignment });
                        setIsSubmissionsModalOpen(true);
                    }}
                  >
                    Open Artifact <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
