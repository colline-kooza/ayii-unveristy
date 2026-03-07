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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateCourse } from "@/hooks/useCourses";
import { SelectInput } from "@/components/shared/SelectInput";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { BookOpen, AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLecturers } from "@/hooks/useAdminLecturers";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  unitCode: z.string().min(3, "Unit code is required (e.g., CS101)"),
  department: z.string().min(2, "Department is required"),
  description: z.string().optional(),
  outline: z.string().optional(),
  lecturerId: z.string().optional(), // For admin use
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
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
];

export function CreateCourseModal({ open, onOpenChange, isAdmin = false }: CreateCourseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCourse = useCreateCourse();
  const { data: lecturersData } = useLecturers({}, { enabled: isAdmin });

  const lecturerOptions = ((lecturersData as any)?.data || []).map((l: any) => ({
    value: l.id,
    label: l.name,
    description: l.employeeId
  }));

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      unitCode: "",
      department: "",
      description: "",
      outline: "",
      lecturerId: "",
    }
  });

  const onSubmit = async (data: CourseFormValues) => {
    try {
      setIsLoading(true);
      await createCourse.mutateAsync(data);
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-red-600 p-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <BookOpen className="h-4 w-4" />
              </div>
              {isAdmin ? "Launch New Course" : "Create My Course"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="outline">Course Outline</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Course Full Title</Label>
                  <Input 
                    id="title" 
                    {...register("title")} 
                    placeholder="e.g. Introduction to Artificial Intelligence" 
                    className="h-11 border-gray-100 focus:border-red-500 transition-all rounded-xl"
                  />
                  {errors.title && <p className="text-[11px] text-red-500 font-medium">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unitCode" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Unit Code</Label>
                    <Input 
                      id="unitCode" 
                      {...register("unitCode")} 
                      placeholder="e.g. CS302" 
                      className="h-11 border-gray-100 focus:border-red-500 transition-all rounded-xl font-mono text-sm uppercase"
                    />
                    {errors.unitCode && <p className="text-[11px] text-red-500 font-medium">{errors.unitCode.message}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Department</Label>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          label="Department"
                          options={DEPARTMENTS}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select..."
                        />
                      )}
                    />
                    {errors.department && <p className="text-[11px] text-red-500 font-medium">{errors.department.message}</p>}
                  </div>
                </div>

                {isAdmin && (
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Assign Lead Lecturer</Label>
                    <Controller
                      name="lecturerId"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          label="Lecturer"
                          options={lecturerOptions}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          placeholder="Select lecturer..."
                          showDescription
                        />
                      )}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Summary & Objectives</Label>
                  <Textarea 
                    id="description" 
                    {...register("description")} 
                    placeholder="Briefly describe what this course covers..." 
                    className="min-h-[100px] border-gray-100 focus:border-red-500 transition-all rounded-xl resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="outline" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Course Outline (Optional)</Label>
                  <p className="text-xs text-gray-500">Create a detailed course outline with objectives, topics, schedule, and grading criteria</p>
                  <Controller
                    name="outline"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Create your course outline here..."
                        minHeight="400px"
                      />
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center gap-3 pt-6 pb-4 border-t mt-6">
               <Button
                 type="button"
                 variant="ghost"
                 onClick={() => onOpenChange(false)}
                 className="h-11 flex-1 rounded-xl font-semibold transition-all"
               >
                 Cancel
               </Button>
               <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="h-11 flex-[2] bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {isAdmin ? "Launch Course" : "Create Course"}
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
