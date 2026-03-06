"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAssignment, useUpdateAssignment } from "@/hooks/useAssignments";
import { useMyCoursesLecturer } from "@/hooks/useCourses";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { ClipboardList, Calendar, Check, Loader2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  instructions: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  fileKey: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface CreateAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  assignment?: {
    id: string;
    title: string;
    instructions?: string;
    dueDate: string | Date;
    fileKey?: string;
    fileUrl?: string; // Add this to support existing file URLs
  };
}

export function CreateAssignmentModal({ open, onOpenChange, courseId, assignment }: CreateAssignmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState(courseId);
  const [fileUrl, setFileUrl] = useState<string>("");
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  const { data: myCourses } = useMyCoursesLecturer();

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      instructions: "",
      dueDate: "",
      fileKey: "",
    }
  });

  useEffect(() => {
    if (open) {
      if (assignment) {
        const dateStr = assignment.dueDate instanceof Date 
          ? assignment.dueDate.toISOString().slice(0, 16)
          : new Date(assignment.dueDate).toISOString().slice(0, 16);
        
        // Construct file URL from fileKey if available
        const bucketId = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_ID || process.env.NEXT_PUBLIC_R2_BUCKET_ID;
        const customDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN || process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN;
        
        let constructedUrl = "";
        if (assignment.fileKey) {
          if (customDomain) {
            const domain = customDomain.endsWith("/") ? customDomain.slice(0, -1) : customDomain;
            constructedUrl = `${domain}/${assignment.fileKey}`;
          } else if (bucketId) {
            constructedUrl = `https://pub-${bucketId}.r2.dev/${assignment.fileKey}`;
          }
        }
        
        setFileUrl(constructedUrl || assignment.fileUrl || "");
          
        reset({
          title: assignment.title,
          instructions: assignment.instructions || "",
          dueDate: dateStr,
          fileKey: assignment.fileKey || "",
        });
      } else {
        setFileUrl("");
        reset({
          title: "",
          instructions: "",
          dueDate: "",
          fileKey: "",
        });
        setActiveCourseId(courseId);
      }
    }
  }, [assignment, reset, open, courseId]);

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      setIsLoading(true);
      if (assignment) {
        await updateAssignment.mutateAsync({
          courseId: activeCourseId || courseId,
          assignmentId: assignment.id,
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
        });
      } else {
        await createAssignment.mutateAsync({
          courseId: activeCourseId || courseId,
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
        });
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) reset();
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <DialogHeader className="relative">
            <DialogTitle className="text-2xl font-black italic flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
                {assignment ? <Sparkles className="h-6 w-6" /> : <ClipboardList className="h-6 w-6" />}
              </div>
              {assignment ? "Refine Assignment" : "Establish Assignment"}
            </DialogTitle>
            <p className="text-primary-100/80 text-[11px] font-bold uppercase tracking-widest mt-2 px-1">
              Synchronize Academic Objectives
            </p>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white space-y-6">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Assignment Title</Label>
                <Input 
                  id="title" 
                  {...register("title")} 
                  placeholder="e.g. Quantum Electrodynamics Research" 
                  className="h-12 border-gray-100 focus:border-primary transition-all rounded-xl text-[13px] font-bold italic"
                />
                {errors.title && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1">{errors.title.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="courseSelect" className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Target Academic Course</Label>
                <select 
                  id="courseSelect"
                  value={activeCourseId || courseId}
                  onChange={(e) => setActiveCourseId(e.target.value)}
                  className="h-12 px-4 border border-gray-100 focus:border-primary transition-all rounded-xl text-[13px] font-bold italic w-full text-black outline-none"
                >
                  {myCourses?.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.unitCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate" className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Due Date & Time</Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="dueDate" 
                    type="datetime-local"
                    {...register("dueDate")} 
                    className="h-12 pl-11 border-gray-100 focus:border-primary transition-all rounded-xl text-[13px] font-bold italic"
                  />
                </div>
                {errors.dueDate && <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter px-1">{errors.dueDate.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Resource / Instruction File (Optional)</Label>
                <Controller
                  name="fileKey"
                  control={control}
                  render={({ field }) => (
                    <R2ImageUpload
                      value={fileUrl}
                      onChange={(url, file: any) => {
                         if (file) {
                            // File uploaded - set the key and URL
                            field.onChange(file.key);
                            setFileUrl(Array.isArray(url) ? url[0] : url);
                         } else if (url === "" || !url || (Array.isArray(url) && url.length === 0)) {
                            // File deleted - clear everything
                            field.onChange("");
                            setFileUrl("");
                         }
                      }}
                      identifier={`assignment-${courseId}-${assignment?.id || 'new'}`}
                      category={FileCategory.DOCUMENT}
                      variant="compact"
                      acceptedTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      existingFileKey={assignment?.fileKey}
                    />
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructions" className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Detailed Instructions</Label>
                <Textarea 
                  id="instructions" 
                  {...register("instructions")} 
                  placeholder="Initialize academic protocols and criteria..." 
                  className="min-h-[140px] border-gray-100 focus:border-primary transition-all rounded-xl resize-none text-[13px] font-bold italic p-4 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 pb-4">
               <Button
                 type="button"
                 variant="ghost"
                 onClick={() => onOpenChange(false)}
                 className="h-11 rounded-xl font-semibold transition-all"
               >
                 Cancel
               </Button>
               <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="h-12 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl font-black italic tracking-widest shadow-xl shadow-primary/20 transition-all flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SYNCING...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {assignment ? "SYNCHRONIZE CHANGES" : "ESTABLISH TASK"}
                    </>
                  )}
                </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
