"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  User, 
  BookOpen, 
  FileText, 
  ShieldCheck,
  Loader2,
  Upload,
  AlertCircle,
  Sparkles,
  Search,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const personalSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid institutional email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const academicSchema = z.object({
  previousSchool: z.string().min(3, "Institution name is required"),
  highestQualification: z.string().min(2, "Qualification description is required"),
  resultsSummary: z.string().min(10, "Please provide a more detailed summary"),
});

const documentSchema = z.object({
  academicDocs: z.array(z.string()).min(1, "At least one academic artifact is required"),
});

const steps = [
  { title: "Personal", icon: User, description: "Contact information" },
  { title: "Academic", icon: BookOpen, description: "Educational history" },
  { title: "Documents", icon: FileText, description: "Academic proof" },
  { title: "Verification", icon: ShieldCheck, description: "Review & Submit" }
];

export default function ApplicationFormPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    previousSchool: "",
    highestQualification: "",
    resultsSummary: "",
    academicDocs: [] as string[]
  });

  useEffect(() => {
    fetch(`/api/courses/public`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((c: any) => c.id === courseId);
        if (found) setCourse(found);
      });
  }, [courseId]);

  const validateStep = (stepIdx: number) => {
    try {
      if (stepIdx === 0) personalSchema.parse(formData);
      if (stepIdx === 1) academicSchema.parse(formData);
      if (stepIdx === 2) documentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((e: z.ZodIssue) => {
          if (e.path[0]) newErrors[e.path[0] as string] = e.message;
        });
        setErrors(newErrors);
        toast.error("Validation failed. Please review your entries.");
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(curr => curr + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          ...formData,
          academicRecords: {
            school: formData.previousSchool,
            qualification: formData.highestQualification,
            summary: formData.resultsSummary
          }
        })
      });

      if (!res.ok) throw new Error("Synchronization failed");

      toast.success("Institutional Enrollment Synchronized");
      router.push("/courses");
    } catch (error) {
      toast.error("Process Interrupted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <Header />
      
      <main className="pb-32">
        {/* Dynamic Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 pt-32 pb-48 text-white">
          <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-1.5 backdrop-blur-xl">
                Institutional Admissions Portal 2026/27
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                Initiate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/80 animate-gradient-x">Academic Ascent</span>
              </h1>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2.5 rounded-2xl">
                   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                   <p className="text-[12px] font-black uppercase tracking-widest text-gray-300">
                     Synchronizing For: <span className="text-white">{course?.title || "Academic Unit Selection"}</span>
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-6 lg:px-12 -mt-24 relative z-20 max-w-5xl">
          {/* Glassmorphism Stepper */}
          <div className="bg-white/70 backdrop-blur-3xl border border-white/40 shadow-2xl shadow-gray-200/50 rounded-[2.5rem] p-8 mb-12">
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-100 -z-10" />
              <motion.div 
                className="absolute top-5 left-8 h-[2px] bg-primary -z-10 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                animate={{ width: `calc(${currentStep * 33.33}% - 0px)` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
              
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-3 group relative">
                  <motion.div 
                    onClick={() => idx < currentStep && setCurrentStep(idx)}
                    className={cn(
                      "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 z-20 cursor-pointer overflow-hidden relative",
                      idx <= currentStep ? "border-primary text-white shadow-xl" : "bg-white text-gray-300 border-gray-100"
                    )}
                    animate={{
                      backgroundColor: idx === currentStep ? "#000" : (idx < currentStep ? "#10b981" : "#fff"),
                      scale: idx === currentStep ? 1.15 : 1,
                      borderColor: idx <= currentStep ? "transparent" : "#f3f4f6"
                    }}
                  >
                    {idx < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-4 w-4" />}
                  </motion.div>
                  <div className="text-center">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
                      idx === currentStep ? "text-gray-900" : "text-gray-400"
                    )}>
                      {step.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] bg-white rounded-[3rem] overflow-hidden">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                  className="p-10 lg:p-16"
                >
                  {currentStep === 0 && (
                    <div className="space-y-12">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Identity Synthesis</h2>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Digital Registry Protocol</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">Full Identity Name</Label>
                          <Input 
                            className={cn(
                              "h-14 px-6 border-gray-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 rounded-2xl text-[13px] font-medium transition-all bg-gray-50/30",
                              errors.fullName && "border-red-500 bg-red-50/30"
                            )}
                            placeholder="Primary Candidate Identifier..."
                            value={formData.fullName}
                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                          />
                          {errors.fullName && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.fullName}</p>}
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">Communication Path (Email)</Label>
                          <Input 
                            className={cn(
                              "h-14 px-6 border-gray-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 rounded-2xl text-[13px] font-medium transition-all bg-gray-50/30",
                              errors.email && "border-red-500 bg-red-50/30"
                            )}
                            placeholder="Institutional Correspondence Address..."
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                          />
                          {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.email}</p>}
                        </div>
                        <div className="space-y-3 md:col-span-2">
                          <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">Telecommunication Uplink (Phone)</Label>
                          <Input 
                            className={cn(
                              "h-14 px-6 border-gray-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 rounded-2xl text-[13px] font-medium transition-all bg-gray-50/30",
                              errors.phone && "border-red-500 bg-red-50/30"
                            )}
                            placeholder="International Access Code + Number..."
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                          {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-12">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Academic Base</h2>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Heritage Qualification Verification</p>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">Preceding Academic Center</Label>
                          <Input 
                            className={cn(
                              "h-14 px-6 border-gray-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 rounded-2xl text-[13px] font-medium transition-all bg-gray-50/30",
                              errors.previousSchool && "border-red-500 bg-red-50/30"
                            )}
                            placeholder="Search Secondary Institution Directory..."
                            value={formData.previousSchool}
                            onChange={e => setFormData({...formData, previousSchool: e.target.value})}
                          />
                          {errors.previousSchool && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.previousSchool}</p>}
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">Apex Certification Level</Label>
                          <Input 
                            className={cn(
                              "h-14 px-6 border-gray-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 rounded-2xl text-[13px] font-medium transition-all bg-gray-50/30",
                              errors.highestQualification && "border-red-500 bg-red-50/30"
                            )}
                            placeholder="e.g. KCSE / Cambridge International..."
                            value={formData.highestQualification}
                            onChange={e => setFormData({...formData, highestQualification: e.target.value})}
                          />
                          {errors.highestQualification && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.highestQualification}</p>}
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">Performance Performance Metrics</Label>
                          <Textarea 
                            className={cn(
                              "min-h-[160px] border-gray-100 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 rounded-3xl text-[13px] font-medium transition-all p-6 resize-none bg-gray-50/30",
                              errors.resultsSummary && "border-red-500 bg-red-50/30"
                            )}
                            placeholder="Detailed breakdown of academic assets and accomplishments..."
                            value={formData.resultsSummary}
                            onChange={e => setFormData({...formData, resultsSummary: e.target.value})}
                          />
                          {errors.resultsSummary && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-1">{errors.resultsSummary}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-12">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Institutional Artifacts</h2>
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Document Shield Synchronization</p>
                        </div>
                      </div>

                      <div className="space-y-10">
                         <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex items-start gap-6 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-5">
                             <Sparkles className="h-24 w-24 text-primary" />
                           </div>
                           <AlertCircle className="h-6 w-6 text-primary mt-1 shrink-0" />
                           <div>
                             <p className="text-[13px] text-primary font-black uppercase tracking-widest mb-2">High-Fidelity Requirement</p>
                             <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-lg">
                               Please synchronize high-resolution captures of identification and academic qualifications. Supported: PDF / JPEG / PNG (Limit: 10MB per object).
                             </p>
                           </div>
                         </div>
                         
                         <div className="grid gap-6">
                            <Label className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em] text-center mb-4">Uplink Artifacts To Institutional Cloud</Label>
                            <R2ImageUpload 
                              value={""}
                              onChange={(url, file: any) => {
                                if (file?.key) {
                                  setFormData(prev => ({...prev, academicDocs: [...prev.academicDocs, file.key]}));
                                }
                              }}
                              identifier={`admission-${courseId}-${Date.now()}`}
                              category={FileCategory.DOCUMENT}
                              variant="default"
                            />
                            
                            {errors.academicDocs && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{errors.academicDocs}</p>}

                            {formData.academicDocs.length > 0 && (
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                                {formData.academicDocs.map((doc, i) => (
                                  <motion.div 
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={i} 
                                    className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-gray-100/20 group"
                                  >
                                    <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center">
                                      <Check className="h-4 w-4 text-green-500" />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-500 uppercase">Asset_{i+1}</span>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                         </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-12 text-center">
                      <div className="relative inline-block">
                         <motion.div 
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           className="mx-auto h-24 w-24 rounded-[2rem] bg-gray-900 flex items-center justify-center mb-8 shadow-2xl shadow-gray-400/40"
                         >
                           <ShieldCheck className="h-10 w-10 text-white" />
                         </motion.div>
                         <motion.div 
                           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                           transition={{ repeat: Infinity, duration: 2 }}
                           className="absolute inset-0 bg-primary/20 rounded-[2rem] -z-10"
                         />
                      </div>
                      
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter">Final Synthesis Audit</h2>
                        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest max-w-md mx-auto">
                          Perform a rigorous audit of your parameters before institutional synchronization.
                        </p>
                      </div>
                      
                      <div className="grid gap-6 max-w-xl mx-auto text-left p-10 bg-gray-50/50 rounded-[2.5rem] border border-gray-100">
                        <div className="flex justify-between items-center group cursor-default">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Digital Identity</span>
                          <span className="text-[13px] font-black text-gray-900 uppercase">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-default">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Communication Route</span>
                          <span className="text-[13px] font-black text-gray-900">{formData.email}</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-default">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Institutional Choice</span>
                          <span className="text-[13px] font-black text-primary uppercase">{course?.title}</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-default">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Artifact Integrity</span>
                          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-[10px] font-black uppercase px-4 py-1 rounded-lg">
                            {formData.academicDocs.length} Assets Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-20 pt-12 border-t border-gray-50">
                    <Button 
                      variant="ghost" 
                      onClick={handleBack}
                      disabled={currentStep === 0 || loading}
                      className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 gap-3 h-14 px-10 rounded-2xl transition-all hover:bg-gray-50"
                    >
                      <ArrowLeft className="h-4 w-4" /> Previous Protocol
                    </Button>
                    
                    {currentStep < steps.length - 1 ? (
                      <Button 
                        onClick={handleNext}
                        className="bg-gray-900 hover:bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] gap-3 h-14 px-12 rounded-2xl shadow-xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 group"
                      >
                        Advance Component <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button 
                        disabled={loading}
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-primary/90 text-white text-[11px] font-black uppercase tracking-[0.3em] gap-4 h-14 px-16 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-95"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                        Finalize Synchronization
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
