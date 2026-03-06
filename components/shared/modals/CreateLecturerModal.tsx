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
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { User, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const lecturerSchema = z.object({
  image: z.string().min(1, "A profile photo is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
  faculty: z.string().min(2, "Faculty is required"),
  specialization: z.string().optional(),
  employeeId: z.string().optional(),
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

const FACULTIES = [
  { value: "Faculty of Engineering", label: "Faculty of Engineering" },
  { value: "Faculty of Science", label: "Faculty of Science" },
  { value: "Faculty of Arts", label: "Faculty of Arts" },
  { value: "Faculty of Business", label: "Faculty of Business" },
];

const STEPS = [
  { id: 1, label: "Photo" },
  { id: 2, label: "Identity" },
  { id: 3, label: "Academic" },
];

export function CreateLecturerModal({ open, onOpenChange }: CreateLecturerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const createLecturer = useCreateLecturer();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    trigger,
    watch,
    setValue,
  } = useForm<LecturerFormValues>({
    resolver: zodResolver(lecturerSchema),
    defaultValues: {
      image: "",
      faculty: "",
      name: "",
      email: "",
      department: "",
    },
  });

  const imageValue = watch("image");

  const onSubmit = async (data: LecturerFormValues) => {
    try {
      setIsLoading(true);
      await createLecturer.mutateAsync(data);
      reset();
      setStep(1);
      onOpenChange(false);
    } catch {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate: Record<number, (keyof LecturerFormValues)[]> = {
      1: ["image"],
      2: ["name", "email"],
    };

    const isValid = await trigger(fieldsToValidate[step]);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          setStep(1);
          reset();
        }
        onOpenChange(val);
      }}
    >
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#8B1538] to-[#6B1329] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <User className="h-5 w-5 text-white" />
              </div>
              Create Academic Profile
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-red-50 mt-2 opacity-90">
            Digitize faculty records and provision system access for new staff members.
          </p>

          {/* Step Indicator */}
          <div className="mt-4 flex items-center justify-between gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex-1 flex flex-col gap-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    step >= s.id ? "bg-white" : "bg-white/30"
                  )}
                />
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", step >= s.id ? "text-white" : "text-white/40")}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-100 mt-1">Step {step} of {STEPS.length}</p>
        </div>

        <ScrollArea className="max-h-[80vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white min-h-[350px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* STEP 1: Profile Photo */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1 pb-2">
                      <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
                        <Camera className="h-3.5 w-3.5" />
                        Step 1 — Profile Photo
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload a clear photo. This is <span className="text-red-500 font-semibold">required</span> to create the account.
                      </p>
                    </div>

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

                    {errors.image && (
                      <p className="text-xs text-red-600 font-semibold text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3">
                        ⚠ {errors.image.message}
                      </p>
                    )}

                    {imageValue && (
                      <p className="text-xs text-green-600 font-semibold text-center">
                        ✓ Photo uploaded successfully
                      </p>
                    )}
                  </div>
                )}

                {/* STEP 2: Identity */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-xs font-semibold text-gray-700">Full Legal Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Dr. Jane Smith"
                        className="h-11"
                      />
                      {errors.name && <p className="text-xs text-red-600 font-medium">{errors.name.message}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-gray-700">University Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="j.smith@university.edu"
                        className="h-11"
                      />
                      {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 3: Academic Info */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="grid gap-2">
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

                    <div className="grid gap-2">
                      <Controller
                        name="faculty"
                        control={control}
                        render={({ field }) => (
                          <SelectInput
                            label="Faculty"
                            options={FACULTIES}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select faculty..."
                          />
                        )}
                      />
                      {errors.faculty && <p className="text-xs text-red-600 font-medium">{errors.faculty.message}</p>}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-10 pt-6 pb-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                className={cn("h-11 px-6 font-semibold", step === 1 ? "invisible" : "flex")}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {step < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="h-11 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center group"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 px-10 bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2 h-4 w-4 border-2 border-white/20 border-t-white rounded-full"
                      />
                      Creating...
                    </>
                  ) : (
                    "Create Lecturer Account"
                  )}
                </Button>
              )}
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
