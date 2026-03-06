"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStudent } from "@/hooks/useAdminStudents";
import { User, Mail, Building2, GraduationCap, Loader2, Check, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCategory } from "@/types/files";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
  program: z.string().optional(),
  image: z.string().min(1, "A profile photo is required"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface UpdateStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: any; // The student object to edit
}

export function UpdateStudentModal({ open, onOpenChange, student }: UpdateStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateStudent = useUpdateStudent();

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      program: "",
      image: "",
    }
  });

  const image = watch("image");

  useEffect(() => {
    if (student) {
      reset({
        name: student.name || "",
        email: student.email || "",
        department: student.department || "",
        program: student.program || "",
        image: student.image || "",
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsLoading(true);
      await updateStudent.mutateAsync({
        id: student.id,
        ...data
      });
      onOpenChange(false);
    } catch (error) {
      // Handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-red-600 p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <UserCircle className="h-24 w-24" />
           </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Edit Student Profile
            </DialogTitle>
            <p className="text-red-100 text-sm mt-1">Update global profile and institutional records</p>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white space-y-6">
            <div className="flex justify-center -mt-16 relative z-20">
              <div className="flex flex-col items-center gap-2">
                <SimpleImageUpload
                  value={image || ""}
                  onChange={(url) => setValue("image", url as string)}
                  variant="avatar"
                />
                {errors.image && <p className="text-[11px] text-red-500 font-medium">{errors.image.message}</p>}
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">Update Photo</span>
              </div>
            </div>

            <div className="space-y-5">
               {/* Read-only ID Section */}
               <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Institutional Identity</span>
                     <span className="text-lg font-black text-red-600 font-mono tracking-tighter">{student?.registrationNumber}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100/50 flex items-center justify-center">
                     <Check className="h-5 w-5 text-red-600" />
                  </div>
               </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Full Legal Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="name" 
                    {...register("name")} 
                    className="pl-10 h-11 border-gray-100 focus:border-red-500 transition-all rounded-xl"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      {...register("email")} 
                      className="pl-10 h-11 border-gray-100 focus:border-red-500 transition-all rounded-xl text-sm"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Faculty/Dept</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      id="department" 
                      {...register("department")} 
                      className="pl-10 h-11 border-gray-100 focus:border-red-500 transition-all rounded-xl text-sm"
                    />
                  </div>
                  {errors.department && <p className="text-[11px] text-red-500 font-medium">{errors.department.message}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="program" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Academic Program</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="program" 
                    {...register("program")} 
                    placeholder="e.g. BSc. Computer Science"
                    className="pl-10 h-11 border-gray-100 focus:border-red-500 transition-all rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 pb-4">
               <Button
                 type="button"
                 variant="ghost"
                 onClick={() => onOpenChange(false)}
                 className="h-11 flex-1 rounded-xl font-semibold transition-all hover:bg-gray-50"
               >
                 Discard
               </Button>
               <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="h-11 flex-[2] bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Update Profile
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
