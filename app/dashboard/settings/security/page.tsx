"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  KeyRound, 
  CheckCircle2,
  ShieldAlert,
  Fingerprint
} from "lucide-react";
import { useMe, useChangePassword } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SecurityPage() {
  const { data: user, isLoading: loadingUser } = useMe();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loadingUser) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 lg:p-10">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-gray-50 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-black text-black tracking-tight italic uppercase">Security Hardening</h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5">
                Credential Rotation & Access Protocols
              </p>
            </div>
          </div>
          <Badge className="bg-green-50 text-green-600 border-none font-black px-4 py-1.5 rounded-full text-[9px] tracking-widest">
            ENCRYPTION: AES-256 ACTIVE
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Side: Status & Tips */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="border-none shadow-none bg-primary text-white rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <CardHeader className="relative z-10 pb-2">
                  <div className="p-2 bg-white/10 rounded-xl w-fit mb-4">
                    <Fingerprint className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Identity Status</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Last Auth Method</p>
                      <p className="text-sm font-bold tracking-tight">Email & Password Protocol</p>
                   </div>
                   <div className="pt-4 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Access Point</span>
                   </div>
                </CardContent>
             </Card>

             <Card className="border-gray-50 bg-gray-50/30 rounded-[2rem] shadow-none">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-gray-500">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Safety Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                     Rotate your password every 90 days. Avoid sequences (123), recurring characters, or personal identifiers like birthdays.
                   </p>
                   <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="h-1 w-4 bg-green-500 rounded-full" />
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Strength Indicator</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full w-4/5 bg-green-500" />
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>

          {/* Right Side: Change Form */}
          <div className="lg:col-span-8">
            <Card className="border-none bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/40 p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <KeyRound className="h-32 w-32" />
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <div className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Current Password Verification</Label>
                    <div className="relative">
                      <Input
                        type="password"
                        {...register("currentPassword")}
                        className="h-14 px-6 rounded-2xl bg-gray-50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/10 text-sm font-bold transition-all"
                        placeholder="••••••••••••"
                      />
                      <Lock className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
                    </div>
                    {errors.currentPassword && <p className="text-[10px] text-red-500 font-black mt-1 uppercase italic ml-1">! {errors.currentPassword.message}</p>}
                  </div>

                  {/* New Password Sector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">New Credential</Label>
                      <Input
                        type="password"
                        {...register("newPassword")}
                        className="h-14 px-6 rounded-2xl bg-gray-50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/10 text-sm font-bold transition-all"
                        placeholder="••••••••••••"
                      />
                      {errors.newPassword && <p className="text-[10px] text-red-500 font-black mt-1 uppercase italic ml-1 leading-tight">! {errors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Re-Verify New Credential</Label>
                      <Input
                        type="password"
                        {...register("confirmPassword")}
                        className="h-14 px-6 rounded-2xl bg-gray-50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/10 text-sm font-bold transition-all"
                        placeholder="••••••••••••"
                      />
                      {errors.confirmPassword && <p className="text-[10px] text-red-500 font-black mt-1 uppercase italic ml-1">! {errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between border-t border-gray-50 gap-6">
                   <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      Two-Factor Sync Protocol: Standard
                   </div>

                   <Button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="h-14 px-10 bg-black hover:bg-black text-white font-black rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden group w-full sm:w-auto"
                   >
                    {changePassword.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-primary group-hover:scale-125 transition-transform" />
                        Rotate Credentials
                      </>
                    )}
                   </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
