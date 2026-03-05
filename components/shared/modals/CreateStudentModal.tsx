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
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { SelectInput } from "@/components/shared/SelectInput";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, BookOpen, ShieldCheck, Camera, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  registrationNumber: z.string().optional(), // Now optional
  department: z.string().min(2, "Department is required"),
  program: z.string().optional(),
  image: z.string().optional(),
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
  { id: 1, title: "Identity", icon: User },
  { id: 2, title: "Academic", icon: BookOpen },
  { id: 3, title: "Account", icon: ShieldCheck },
  { id: 4, title: "Media", icon: Camera },
];

export function CreateStudentModal({ open, onOpenChange }: CreateStudentModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const createStudent = useCreateStudent();
  const { data: coursesData } = useCourses({ limit: 100 });

  const courseOptions = (coursesData?.data || []).map((c: any) => ({
    value: c.id,
    label: `${c.unitCode} - ${c.title}`,
    description: c.department
  }));

  const { register, handleSubmit, control, formState: { errors, isValid }, reset, trigger, watch } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
    defaultValues: {
      image: "",
      courseIds: [],
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof StudentFormValues)[] = [];
    if (step === 1) fieldsToValidate = ["name", "email"];
    if (step === 2) fieldsToValidate = ["department"];
    if (step === 3) fieldsToValidate = ["registrationNumber"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setIsLoading(true);
      await createStudent.mutateAsync(data);
      reset();
      setStep(1);
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  const image = watch("image");

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) {
        setStep(1);
        reset();
      }
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              Create New Student
            </DialogTitle>
          </DialogHeader>
          
          {/* Progress Bar */}
          <div className="mt-8 flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20 -translate-y-1/2" />
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-white -translate-y-1/2"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: isCurrent ? 1.1 : 1,
                      backgroundColor: isActive ? "#ffffff" : "#3b82f6",
                      color: isActive ? "#2563eb" : "#ffffff",
                      borderColor: isActive ? "#ffffff" : "#60a5fa"
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors shadow-lg",
                      isActive ? "bg-white" : "bg-blue-500 border-blue-400"
                    )}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </motion.div>
                  <span className={cn(
                    "mt-2 text-[10px] font-bold uppercase tracking-wider",
                    isActive ? "text-white" : "text-blue-300"
                  )}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white min-h-[350px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-400 tracking-wider">Full Legal Name</Label>
                    <Input 
                      id="name" 
                      {...register("name")} 
                      placeholder="John Alexander Doe" 
                      className="h-11 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all rounded-xl"
                    />
                    {errors.name && <p className="text-[11px] text-red-500 font-medium px-1 underline decoration-red-200">{errors.name.message}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-400 tracking-wider">University Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register("email")} 
                      placeholder="j.doe@university.edu" 
                      className="h-11 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 transition-all rounded-xl"
                    />
                    {errors.email && <p className="text-[11px] text-red-500 font-medium px-1 underline decoration-red-200">{errors.email.message}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
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
                  {errors.department && <p className="text-[11px] text-red-500 font-medium">{errors.department.message}</p>}

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

                  {/* Optional: Multiple Courses Selection */}
                  <div className="space-y-2">
                     <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Initial Course Enrollment</Label>
                     <p className="text-[10px] text-gray-500 mb-2 italic">Select courses the student will be enrolled in immediately.</p>
                     {/* For brevity, let's use a standard Select or our SelectInput. 
                         Since our SelectInput is single-select, for now we keep it simple or implement multi-select if needed.
                         Let's just show one major course selection for now using SelectInput */}
                     <Controller
                        name="courseIds"
                        control={control}
                        render={({ field }) => (
                          <SelectInput
                            label="Major Course Units"
                            options={courseOptions}
                            value={field.value?.[0] || ""}
                            onValueChange={(val) => field.onChange([val])}
                            placeholder="Find course units..."
                            showDescription
                          />
                        )}
                      />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider text-center">Student Identity</Label>
                    <div className="h-16 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/30 flex flex-col items-center justify-center space-y-1">
                      <span className="text-xl font-black text-blue-600 tracking-widest font-mono">AYII / {new Date().getFullYear()} / ••••</span>
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">Registration Number (Auto-Generated)</p>
                    </div>
                    <p className="text-[10px] text-gray-400 px-1 text-center italic">The unique identification will be assigned upon account finalization.</p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <div className="flex gap-3">
                      <ShieldCheck className="h-5 w-5 text-orange-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-orange-900">Security Note</h4>
                        <p className="text-[10px] text-orange-700 mt-1 leading-relaxed">
                          A temporary password will be automatically generated and sent to the student's email.
                          They will be required to change it upon their first login.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Profile Representation</Label>
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <R2ImageUpload
                          identifier="student-avatar"
                          label="Upload Image"
                          description="Transparent background preferred. Max 2MB."
                          value={field.value || ""}
                          onChange={(url) => field.onChange(url)}
                          variant="compact"
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-50">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              className={cn(
                "h-11 px-6 rounded-xl font-semibold transition-all",
                step === 1 ? "invisible" : "flex"
              )}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center group"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-11 px-10 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-white/20 border-t-white rounded-full"
                    />
                    Finalizing...
                  </>
                ) : "Create Student Account"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
