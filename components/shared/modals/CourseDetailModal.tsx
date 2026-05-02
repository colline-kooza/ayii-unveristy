"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Building, AlertCircle, Loader2 } from "lucide-react";
import { useClaimCourse } from "@/hooks/useCourses";

interface CourseDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  isEnrolled: boolean;
}

export function CourseDetailModal({ open, onOpenChange, course, isEnrolled }: CourseDetailModalProps) {
  const claimCourse = useClaimCourse();

  if (!course) return null;

  const handleEnroll = async () => {
    try {
      await claimCourse.mutateAsync(course.id);
      onOpenChange(false);
    } catch {
      // toast in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-primary/5 p-8 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-[0.2em] italic text-primary uppercase">{course.unitCode}</span>
                <DialogTitle className="text-xl font-black italic tracking-tight">{course.title}</DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-sm font-bold text-gray-500 italic">
              {course.description || "Review course details before claiming ownership of this academic unit."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center justify-center">
              <Users className="h-5 w-5 text-gray-400 mb-2" />
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Current Agents</span>
              <span className="text-lg font-black">{course._count?.enrollments || 0}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center justify-center">
              <Building className="h-5 w-5 text-gray-400 mb-2" />
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">Department</span>
              <span className="text-[11px] font-black italic uppercase tracking-tighter mt-1">{course.department || "General"}</span>
            </div>
          </div>

          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-700 font-bold leading-relaxed">
              Enrolling will claim ownership of this course. You will be responsible for creating assignments, marking student submissions, and managing content.
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
             <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] text-gray-400 hover:bg-gray-50 hover:text-gray-600">
               Cancel Review
             </Button>
             {isEnrolled ? (
                <Button disabled className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-gray-100 text-gray-400 border border-gray-200">
                  Already Owner
                </Button>
             ) : (
                <Button 
                  onClick={handleEnroll}
                  disabled={claimCourse.isPending}
                  className="flex-[1.5] h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-primary hover:bg-primary-600 text-white shadow-xl shadow-primary/20"
                >
                  {claimCourse.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim & Enroll"}
                </Button>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
