"use client";

import React, { useState, useEffect } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  GraduationCap,
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/students/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        toast.error("Failed to retrieve submission history");
      }
    } catch (error) {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter(sub => 
    sub.assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.assignment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.assignment.course.unitCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6">
        <div>
          <Badge className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-2">
            Academic Record
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-black italic">
            Submission <span className="text-primary">History.</span>
          </h1>
          <p className="text-[12px] text-gray-500 font-medium italic mt-1">
            Track your grades, feedback and verify your submitted artifacts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-50 text-green-700 border-green-100 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
            {submissions.filter(s => s.grade).length} Marked Tasks
          </Badge>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-gray-100/50">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Filter by course or assignment..." 
            className="pl-10 h-11 text-[13px] border-none bg-gray-50/50 rounded-2xl focus-visible:ring-primary/20 italic font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="border-0 shadow-sm hover:shadow-xl hover:shadow-primary/5 bg-white rounded-[2rem] overflow-hidden transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 transition-colors group-hover:bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-[10px] font-black text-gray-300 tracking-[0.2em] italic uppercase whitespace-nowrap">
                           {submission.assignment.course.unitCode}
                         </span>
                      </div>
                      <h3 className="text-base font-black text-black truncate tracking-tight italic group-hover:text-primary transition-colors">
                        {submission.assignment.title}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter truncate mt-0.5">
                        {submission.assignment.course.title}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:flex lg:items-center gap-8 lg:px-8 lg:border-x lg:border-gray-50">
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5 italic">
                        <Clock className="h-3 w-3" /> Submitted
                      </p>
                      <span className="text-xs font-black text-gray-600 italic">
                        {format(new Date(submission.submittedAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5 italic">
                        <GraduationCap className="h-3 w-3" /> Lecturer
                      </p>
                      <span className="text-xs font-black text-gray-600 italic truncate max-w-[120px] block">
                        {submission.assignment.createdBy?.name || "Academic Staff"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-6 flex-1">
                    <div className="flex items-center gap-4">
                      {submission.grade ? (
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-50 text-green-600 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
                            Marked
                          </Badge>
                          <div className="h-10 w-auto px-4 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/5 text-sm font-black text-primary shadow-sm group-hover:scale-110 transition-transform">
                            {submission.grade}/100
                          </div>
                        </div>
                      ) : (
                        <Badge className="bg-orange-50 text-orange-600 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md flex items-center gap-1.5">
                          <AlertCircle className="h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="h-10 px-5 rounded-xl border-gray-100 font-black text-[11px] uppercase tracking-widest text-gray-400 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all italic gap-2"
                    >
                      View File <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {submission.feedback && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-gray-100">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Feedback from instructor</span>
                        <p className="text-xs text-gray-600 font-bold italic leading-relaxed">
                          {submission.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-white rounded-[2rem] border border-gray-50 shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
              <ClipboardList className="h-8 w-8 text-gray-200" />
            </div>
            <div className="space-y-1 px-6">
              <h3 className="text-base font-black italic text-gray-400 uppercase tracking-widest">No Submissions Yet</h3>
              <p className="text-[11px] text-gray-300 font-bold italic">You haven't submitted any assignments yet. Enroll in courses to get started.</p>
            </div>
            <Button 
              className="mt-4 bg-primary text-white rounded-2xl font-black h-11 px-8 text-xs italic tracking-widest shadow-xl shadow-primary/20"
              onClick={() => window.location.href = "/dashboard/student/courses"}
            >
              Browse Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
