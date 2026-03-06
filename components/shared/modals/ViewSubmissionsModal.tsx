"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmissions, useGradeSubmission } from "@/hooks/useAssignments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getAvatarUrl } from "@/lib/avatarUtils";

interface ViewSubmissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: {
    id: string;
    title: string;
  };
}

export function ViewSubmissionsModal({ open, onOpenChange, assignment }: ViewSubmissionsModalProps) {
  const { data: submissions, isLoading } = useSubmissions(assignment.id);
  const gradeSubmission = useGradeSubmission();
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");

  const filteredSubmissions = (submissions || []).filter((s: any) => 
    s.student.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.student.registrationNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSubmission = submissions?.find((s: any) => s.id === selectedSubmissionId);

  const handleGrade = async () => {
    if (!selectedSubmissionId) return;
    try {
      await gradeSubmission.mutateAsync({
        submissionId: selectedSubmissionId,
        assignmentId: assignment.id,
        grade,
        feedback,
      });
      setSelectedSubmissionId(null);
      setGrade("");
      setFeedback("");
    } catch (error) {
       // Handled by hook
    }
  };

  const handleOpenGrade = (sub: any) => {
    setSelectedSubmissionId(sub.id);
    setGrade(sub.grade || "");
    setFeedback(sub.feedback || "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl h-[600px] flex flex-col">
        <div className="bg-slate-900 p-6 text-white shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span>Assignment Submissions</span>
                <span className="text-xs text-slate-400 font-medium">Viewing results for: {assignment.title}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col bg-white">
          <div className="p-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input 
                placeholder="Search student by name or ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 border-slate-200 focus:border-primary rounded-xl text-sm"
               />
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold px-2 py-0.5">
                  {submissions?.length || 0} Total
               </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
                  <AlertCircle className="h-10 w-10 opacity-20" />
                  <p className="text-sm font-medium">No submissions found.</p>
                </div>
              ) : (
                filteredSubmissions.map((sub: any) => (
                  <div key={sub.id} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-sm transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-slate-50">
                        <AvatarImage src={getAvatarUrl(sub.student.image, sub.student.name, 'student')} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                           {sub.student.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-none mb-1">{sub.student.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {sub.student.registrationNumber || "N/A"} • Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.grade ? (
                         <Badge className="bg-green-50 text-green-600 border-none text-[10px] font-bold h-7 px-3 flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Marks: {sub.grade}/100
                         </Badge>
                      ) : (
                         <Badge className="bg-orange-50 text-orange-600 border-none text-[10px] font-bold h-7 px-3 flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            Pending
                         </Badge>
                      )}
                      <Separator orientation="vertical" className="h-8 mx-1 opacity-20" />
                      <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-9 w-9 p-0 rounded-xl hover:bg-primary/5 text-primary"
                          asChild
                      >
                          <a href={`/api/r2/download?key=${sub.fileKey}`} download>
                             <Download className="h-4 w-4" />
                          </a>
                      </Button>
                      <Button 
                          size="sm" 
                          onClick={() => handleOpenGrade(sub)}
                          className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                      >
                          {sub.grade ? "Update Marks" : "Assign Marks"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Grading Overlay */}
        {selectedSubmissionId && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="bg-slate-900 p-2 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900">Grading {selectedSubmission?.student.name}</h4>
                      <p className="text-xs text-slate-400">Assignment: {assignment.title}</p>
                   </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedSubmissionId(null)} className="rounded-full h-8 w-8 p-0">
                   <AlertCircle className="h-5 w-5 rotate-45" />
                </Button>
             </div>
             <div className="p-8 space-y-6 flex-1">
                <div className="grid gap-2">
                   <Label className="text-xs font-bold uppercase text-slate-400">Marks (out of 100)</Label>
                   <Input 
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 85" 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="h-12 border-slate-200 focus:border-primary rounded-xl"
                   />
                </div>
                <div className="grid gap-2">
                   <Label className="text-xs font-bold uppercase text-slate-400">Review Feedback</Label>
                   <Textarea 
                    placeholder="Write constructive feedback for the student..." 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[160px] border-slate-200 focus:border-primary rounded-2xl resize-none p-4"
                   />
                </div>
             </div>
             <div className="p-6 border-t border-slate-50 pb-6 flex items-center gap-3">
                <Button variant="ghost" onClick={() => setSelectedSubmissionId(null)} className="h-12 flex-1 rounded-2xl font-bold">
                   Cancel
                </Button>
                <Button 
                    onClick={handleGrade} 
                    disabled={!grade || gradeSubmission.isPending}
                    className="h-12 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20"
                >
                   {gradeSubmission.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Check className="h-5 w-5 mr-2" />}
                   Save Grade & Feedback
                </Button>
             </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
