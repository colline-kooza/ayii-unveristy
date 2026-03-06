"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateStudent } from "@/hooks/useAdminStudents";
import { useCourses } from "@/hooks/useCourses";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { SelectInput } from "@/components/shared/SelectInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, Camera, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const studentSchema = z.object({
  image: z.string().min(1, "A profile photo is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  registrationNumber: z.string().optional(),
  department: z.string().min(2, "Department is required"),
  program: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface CreateStudentModalProps {
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

const PROGRAMS = [
  { value: "Bachelor of Science", label: "Bachelor of Science" },
  { value: "Bachelor of Arts", label: "Bachelor of Arts" },
  { value: "Bachelor of Commerce", label: "Bachelor of Commerce" },
  { value: "Bachelor of Engineering", label: "Bachelor of Engineering" },
  { value: "Diploma", label: "Diploma" },
  { value: "Certificate", label: "Certificate" },
];

const STEPS = [
  { id: 1, title: "Photo", icon: Camera },
  { id: 2, title: "Identity", icon: User },
  { id: 3, title: "Academic", icon: ShieldCheck },
  { id: 4, title: "Account", icon: ShieldCheck },
];

export function CreateStudentModal({ open, onOpenChange }: CreateStudentModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const createStudent = useCreateStudent();
  const { data: coursesData } = useCourses({ limit: 100 });

  const courseOptions = (coursesData?.data || []).map((c: any) => ({
    value: c.id,
    label: `${c.unitCode} - ${c.title}`,
    description: c.department,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      image: "",
      courseIds: [],
      name: "",
      email: "",
      department: "",
    },
  });

  const imageValue = watch("image");

  const nextStep = async () => {
    const fieldsToValidate: Record<number, (keyof StudentFormValues)[]> = {
      1: ["image"],
      2: ["name", "email"],
      3: ["department"],
    };

    const fields = fieldsToValidate[step] || [];
    if (fields.length > 0) {
      const isStepValid = await trigger(fields);
      if (!isStepValid) return;
    }

    setStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsLoading(true);
      await createStudent.mutateAsync(data);
      reset();
      setStep(1);
      onOpenChange(false);
    } catch {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="bg-primary p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              Create New Student
            </DialogTitle>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((s) => (
              <div key={s.id} className="flex-1 flex flex-col gap-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    step >= s.id ? "bg-white" : "bg-white/30"
                  )}
                />
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", step >= s.id ? "text-white" : "text-white/40")}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-rose-100 mt-1">
            Step {step} of {STEPS.length}: {STEPS[step - 1].title}
          </p>
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
                className="space-y-5"
              >
                {/* STEP 1: Profile Photo */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1 pb-2">
                      <div className="inline-flex items-center gap-2 bg-rose-50 text-[#8B1538] text-xs font-bold px-3 py-1.5 rounded-full">
                        <Camera className="h-3.5 w-3.5" />
                        Step 1 — Profile Photo
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload a clear photo. This is{" "}
                        <span className="text-red-500 font-semibold">required</span> to create the account.
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
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-xs font-semibold text-gray-700">Full Legal Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="John Alexander Doe"
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
                        placeholder="j.doe@university.edu"
                        className="h-11"
                      />
                      {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 3: Academic */}
                {step === 3 && (
                  <div className="space-y-4">
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          label="Department"
                          options={DEPARTMENTS}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Choose department..."
                        />
                      )}
                    />
                    {errors.department && (
                      <p className="text-xs text-red-600 font-medium">{errors.department.message}</p>
                    )}

                    <Controller
                      name="program"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          label="Academic Program (Optional)"
                          options={PROGRAMS}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                          placeholder="Choose program..."
                        />
                      )}
                    />

                    {courseOptions.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-gray-700">Initial Course Enrollment</Label>
                        <p className="text-xs text-gray-500">Select a course to enroll the student in immediately.</p>
                        <Controller
                          name="courseIds"
                          control={control}
                          render={({ field }) => (
                            <SelectInput
                              label="Course Unit"
                              options={courseOptions}
                              value={field.value?.[0] || ""}
                              onValueChange={(val) => field.onChange([val])}
                              placeholder="Find course units..."
                              showDescription
                            />
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: Account Summary */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold text-gray-700 text-center">Student Identity</Label>
                      <div className="h-16 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 flex flex-col items-center justify-center space-y-1">
                        <span className="text-lg font-bold text-blue-600 tracking-wider font-mono">
                          AYII / {new Date().getFullYear()} / ••••
                        </span>
                        <p className="text-xs text-blue-600 font-medium">Auto-Generated Registration Number</p>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        The unique identification will be assigned upon account creation.
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-orange-600 shrink-0" />
                        <div>
                          <h4 className="text-xs font-semibold text-orange-900">Security Note</h4>
                          <p className="text-xs text-orange-700 mt-1">
                            A temporary password will be automatically generated and sent to the student's email.
                            They will be required to change it upon their first login.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 pb-4 border-t">
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
                  className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center group"
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
                    "Create Student Account"
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
