"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateLecturer } from "@/hooks/useAdminLecturers";
import { SelectInput } from "@/components/shared/SelectInput";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { User, Mail, Building, Briefcase, Camera, ShieldCheck } from "lucide-react";

const lecturerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
  specialization: z.string().optional(),
  employeeId: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type LecturerFormValues = z.infer<typeof lecturerSchema>;

interface CreateLecturerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateLecturerModal({ open, onOpenChange }: CreateLecturerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createLecturer = useCreateLecturer();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<LecturerFormValues>({
    resolver: zodResolver(lecturerSchema),
    defaultValues: {
      avatarUrl: "",
    }
  });

  const onSubmit = async (data: LecturerFormValues) => {
    try {
      setIsLoading(true);
      await createLecturer.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
        <div className="bg-blue-600 p-6 text-white text-center">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center justify-center gap-2">
                    <User className="h-5 w-5" />
                    New Lecturer Profile
                </DialogTitle>
            </DialogHeader>
            <p className="text-xs text-blue-100 mt-2 opacity-80">Registration will generate system access credentials automatically.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-white">
          <div className="flex justify-center mb-2">
             <Controller
                name="avatarUrl"
                control={control}
                render={({ field }) => (
                  <R2ImageUpload
                    identifier="lecturer-avatar"
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    variant="compact"
                    className="w-1/2"
                    label="Profile Picture"
                  />
                )}
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Full Name
                </Label>
                <Input id="name" {...register("name")} placeholder="Dr. Jane Smith" className="h-10 border-gray-100 rounded-lg focus:ring-4 focus:ring-blue-50/50" />
                {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3 w-3" /> Email Address
                </Label>
                <Input id="email" type="email" {...register("email")} placeholder="jane@ayii.edu" className="h-10 border-gray-100 rounded-lg focus:ring-4 focus:ring-blue-50/50" />
                {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
            </div>
          </div>

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
                  className="h-10"
                />
              )}
            />
            {errors.department && <p className="text-[10px] text-red-500 font-medium">{errors.department.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
                <Label htmlFor="specialization" className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" /> Specialization
                </Label>
                <Input id="specialization" {...register("specialization")} placeholder="Machine Learning" className="h-10 border-gray-100 rounded-lg" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" /> Employee ID
                </Label>
                <Input id="employeeId" {...register("employeeId")} placeholder="EMP2026001" className="h-10 border-gray-100 rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-50">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-10 px-6 rounded-lg text-gray-500 font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="h-10 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-100">
              {isLoading ? "Provisioning..." : "Create Lecturer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
