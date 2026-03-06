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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateLecturer } from "@/hooks/useAdminLecturers";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { SelectInput } from "@/components/shared/SelectInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Building, Briefcase, ShieldCheck, Camera, Check, X, Loader2, Edit } from "lucide-react";
import { Lecturer } from "@/types/admin";

const lecturerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  specialization: z.string().optional(),
  employeeId: z.string().optional(),
  image: z.string().optional(),
});

type LecturerFormValues = z.infer<typeof lecturerSchema>;

interface UpdateLecturerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lecturer: Lecturer | null;
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

export function UpdateLecturerModal({
  open,
  onOpenChange,
  lecturer,
}: UpdateLecturerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateLecturer = useUpdateLecturer();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<LecturerFormValues>({
    resolver: zodResolver(lecturerSchema),
  });

  useEffect(() => {
    if (lecturer) {
      reset({
        name: lecturer.name,
        email: lecturer.email,
        department: lecturer.department,
        specialization: lecturer.specialization || "",
        employeeId: lecturer.employeeId || "",
        image: lecturer.image || "",
      });
    }
  }, [lecturer, reset]);

  const onSubmit = async (data: LecturerFormValues) => {
    if (!lecturer) return;
    try {
      setIsLoading(true);
      await updateLecturer.mutateAsync({ id: lecturer.id, ...data });
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  if (!lecturer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B1329] p-6 text-white">
            <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    Update Academic Profile
                </DialogTitle>
                <p className="text-red-50 mt-2 text-sm">
                    Modifying profile for <span className="font-semibold text-white">{lecturer.name}</span>
                </p>
            </DialogHeader>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <SimpleImageUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    variant="avatar"
                  />
                )}
              />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Photo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-3 w-3 text-red-500" /> Full Name
                </Label>
                <Input 
                  id="name" 
                  {...register("name")} 
                  placeholder="e.g. Dr. Jane M. Smith" 
                  className="h-11" 
                />
                {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-red-500" /> Professional Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email")} 
                  placeholder="jane.smith@ayii.edu" 
                  className="h-11" 
                />
                {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    label="Academic Department"
                    options={DEPARTMENTS}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select primary faculty..."
                  />
                )}
              />
              {errors.department && <p className="text-xs text-red-600 font-medium">{errors.department.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-3 w-3 text-red-500" /> Expertise Area
                </Label>
                <Input 
                  id="specialization" 
                  {...register("specialization")} 
                  placeholder="Machine Learning" 
                  className="h-11" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-red-500" /> Employee ID
                </Label>
                <Input 
                  id="employeeId" 
                  {...register("employeeId")} 
                  placeholder="EMP-2026-L42" 
                  className="h-11 font-mono text-sm" 
                />
              </div>
            </div>

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
