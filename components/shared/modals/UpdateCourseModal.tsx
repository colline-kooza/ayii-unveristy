"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCourse } from "@/hooks/useCourses";
import { SelectInput } from "@/components/shared/SelectInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Code, Building, FileText, Check, Loader2 } from "lucide-react";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  department: z.string().min(1, "Department is required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface Course {
  id: string;
  title: string;
  description?: string;
  unitCode: string;
  department: string;
}

interface UpdateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

const DEPARTMENTS = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Business Administration", label: "Business Administration" },
  { value: "Engineering", label: "Engineering" },
  { value: "Medicine", label: "Medicine" },
  { value: "Law", label: "Law" },
  { value: "Education", label: "Education" },
  { value: "Arts & Humanities", label: "Arts & Humanities" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
];

export function UpdateCourseModal({
  open,
  onOpenChange,
  course,
}: UpdateCourseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateCourse = useUpdateCourse(course?.id || "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        description: course.description || "",
        department: course.department,
      });
    }
  }, [course, reset]);

  const onSubmit = async (data: CourseFormValues) => {
    if (!course) return;
    try {
      setIsLoading(true);
      await updateCourse.mutateAsync(data);
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B1329] p-6 text-white">
            <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    Update Course Details
                </DialogTitle>
                <p className="text-red-50 mt-2 text-sm">
                    Editing course: <span className="font-semibold text-white">{course.title}</span>
                </p>
            </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Unit Code Display (Read-only) */}
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Code className="h-5 w-5 text-red-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-900 uppercase tracking-wide">Unit Code</p>
                  <code className="text-sm font-bold text-red-700">{course.unitCode}</code>
                </div>
              </div>
              <p className="text-xs text-red-600 mt-2">Unit codes cannot be modified after creation</p>
            </div>

            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="h-3 w-3 text-red-500" /> Course Title
              </Label>
              <Input 
                id="title" 
                {...register("title")} 
                placeholder="e.g. Advanced Machine Learning" 
                className="h-11" 
              />
              {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title.message}</p>}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Department"
                    options={DEPARTMENTS}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select department..."
                  />
                )}
              />
              {errors.department && <p className="text-xs text-red-600 font-medium">{errors.department.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="h-3 w-3 text-red-500" /> Course Description
              </Label>
              <Textarea 
                id="description" 
                {...register("description")} 
                placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
                className="min-h-[120px] resize-none"
              />
              {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 pb-4 border-t gap-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="h-11 px-6 font-semibold"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-11 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Save Changes</span>
                    <Check className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
