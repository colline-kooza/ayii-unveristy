"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSubmitAssignment } from "@/hooks/useAssignments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { Upload, Check, Loader2, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const submissionSchema = z.object({
  fileUrl: z.string().min(1, "Please upload your work before submitting"),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface SubmitAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: {
    id: string;
    title: string;
    courseTitle?: string;
    dueDate?: string;
  };
}

export function SubmitAssignmentModal({ open, onOpenChange, assignment }: SubmitAssignmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const submitAssignment = useSubmitAssignment();

  // Check if deadline has passed
  const isDeadlinePassed = assignment.dueDate ? new Date() > new Date(assignment.dueDate) : false;

  const { handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      fileUrl: "",
    }
  });

  const fileUrl = watch("fileUrl");

  const onSubmit = async (data: SubmissionFormValues) => {
    if (isDeadlinePassed) return;
    try {
      setIsLoading(true);
      await submitAssignment.mutateAsync({
        assignmentId: assignment.id,
        fileKey: data.fileUrl,
      });
      reset();
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <div className={cn(
          "p-6 text-white text-center transition-colors",
          isDeadlinePassed ? "bg-red-600" : "bg-red-600"
        )}>
          <DialogHeader className="items-center">
            <div className="bg-white/20 p-3 rounded-2xl mb-3 w-fit mx-auto">
              {isDeadlinePassed ? <AlertCircle className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
            </div>
            <DialogTitle className="text-xl font-bold">
              {isDeadlinePassed ? "Submission Closed" : "Submit Your Work"}
            </DialogTitle>
            <p className={cn("text-sm mt-1", isDeadlinePassed ? "text-red-100" : "text-red-100")}>
              {assignment.title}
            </p>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white space-y-6">
            {isDeadlinePassed ? (
              <div className="bg-red-50 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
                 <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-red-800 leading-relaxed font-bold">
                    The deadline for this assignment was {new Date(assignment.dueDate!).toLocaleString()}. 
                    Submissions are no longer accepted for this task.
                 </p>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
                 <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                 <p className="text-xs text-red-800 leading-relaxed font-medium">
                    Ensure your file is in PDF or Word format and does not exceed 10MB. 
                    You can resubmit before the deadline to overwrite your previous submission.
                 </p>
              </div>
            )}

            <div className={cn("grid gap-4", isDeadlinePassed && "opacity-50 pointer-events-none")}>
              <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Upload Assignment File</Label>
              <Controller
                name="fileUrl"
                control={control}
                render={({ field }) => (
                  <R2ImageUpload
                    value={field.value || ""}
                    onChange={(url) => {
                      const urlValue = Array.isArray(url) ? url[0] || "" : url;
                      setValue("fileUrl", urlValue, { shouldValidate: true });
                    }}
                    identifier={`submission-${assignment.id}`}
                    category={FileCategory.SUBMISSION}
                    variant="default"
                    acceptedTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                )}
              />
              {fileUrl && (
                <p className="text-[11px] text-green-600 font-bold text-center">✓ File uploaded — ready to submit</p>
              )}
              {errors.fileUrl && <p className="text-[11px] text-red-500 font-bold text-center">{errors.fileUrl.message}</p>}
            </div>

            <div className="flex flex-col gap-3 pt-4 pb-4">
               <Button 
                  type="submit" 
                  disabled={isLoading || isDeadlinePassed} 
                  className="h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      {isDeadlinePassed ? "Submission Closed" : "Complete Submission"}
                    </>
                  )}
                </Button>
                <Button
                 type="button"
                 variant="ghost"
                 onClick={() => onOpenChange(false)}
                 className="h-10 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-all"
               >
                 Cancel
               </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
