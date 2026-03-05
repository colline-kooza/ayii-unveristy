"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStartLecture } from "@/hooks/useLiveLectures";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { SelectInput } from "@/components/shared/SelectInput";
import { Video, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const lectureSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  meetingUrl: z.string().url("Invalid meeting URL").optional().or(z.literal("")),
});

type LectureFormValues = z.infer<typeof lectureSchema>;

interface LiveLectureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LiveLectureModal({ open, onOpenChange }: LiveLectureModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const startLecture = useStartLecture();
  const { data: myCourses } = useMyCoursesLecturer();

  const courseOptions = (myCourses || []).map((c: any) => ({
    value: c.id,
    label: c.title,
    description: c.unitCode
  }));

  const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm<LectureFormValues>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      courseId: "",
      meetingUrl: "",
    }
  });

  const onSubmit = async (data: LectureFormValues) => {
    try {
      setIsLoading(true);
      // If no meeting URL provided, we could generate a mock one or a Jitsi/Zoom one
      const finalUrl = data.meetingUrl || `https://meet.elearning.edu/${Math.random().toString(36).substring(7)}`;
      
      await startLecture.mutateAsync({
        courseId: data.courseId,
        meetingUrl: finalUrl
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  const generateAutoUrl = () => {
    const randomId = Math.random().toString(36).substring(7);
    setValue("meetingUrl", `https://meet.elearning.edu/${randomId}`);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) reset();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Video className="h-5 w-5 text-blue-400" />
              </div>
              Start Live Session
            </DialogTitle>
          </DialogHeader>
          <p className="text-white/60 text-xs mt-2 font-medium">
            Broadcast to all enrolled students instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white space-y-6">
          <div className="space-y-5">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Select Course</Label>
              <Controller
                name="courseId"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Course"
                    options={courseOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Choose course to go live..."
                    showDescription
                  />
                )}
              />
              {errors.courseId && <p className="text-[11px] text-red-500 font-medium">{errors.courseId.message}</p>}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="meetingUrl" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Session URL</Label>
                <button 
                  type="button" 
                  onClick={generateAutoUrl}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Auto-generate
                </button>
              </div>
              <Controller
                name="meetingUrl"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                     <Input 
                      {...field}
                      placeholder="e.g. https://zoom.us/j/..." 
                      className="h-11 border-gray-100 focus:border-blue-500 transition-all rounded-xl text-sm"
                    />
                  </div>
                )}
              />
              {errors.meetingUrl && <p className="text-[11px] text-red-500 font-medium">{errors.meetingUrl.message}</p>}
              <p className="text-[10px] text-gray-400 italic">Leave empty to use institutional platform.</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                  Starting this session will send a real-time notification to all enrolled students.
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Setting up broadcast...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                Go Live Now
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
