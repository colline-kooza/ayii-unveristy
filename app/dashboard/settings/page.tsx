"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Shield, 
  CreditCard, 
  Loader2, 
  Camera, 
  Mail, 
  ShieldCheck, 
  Image as ImageIcon, 
  CloudUpload,
  ArrowLeft,
  RefreshCw,
  Sun,
  X,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { useMe, useUpdateProfile, useChangePassword } from "@/hooks/useAuth";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAvatarUrl } from "@/lib/avatarUtils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  image: z.string().optional(),
});

export default function SettingsPage() {
  const { data: user, isLoading: loadingUser } = useMe();
  const updateProfile = useUpdateProfile();
  
  const [activeTab, setActiveTab] = useState("account");

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      bio: "",
      image: "",
    },
  });

  const watchedImage = useWatch({
    control: profileForm.control,
    name: "image",
  });

  const watchedBio = useWatch({
    control: profileForm.control,
    name: "bio",
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(" ") || ["", ""];
      profileForm.reset({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        department: user.department || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }
  }, [user, profileForm]);

  const onUpdateProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      await updateProfile.mutateAsync({
        name: fullName,
        email: data.email,
        department: data.department,
        bio: data.bio,
        image: data.image,
      });
    } catch (err) {
      // toast handled in hook
    }
  };

  if (loadingUser) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50/30">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const initials = `${profileForm.getValues("firstName")?.[0] || ""}${profileForm.getValues("lastName")?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col">
      {/* Header Bar */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-base font-black text-black tracking-tight">Profile & Security</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">
              Refined configuration and identity management
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
            <RefreshCw className="h-4 w-4 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
            <Sun className="h-4 w-4 text-gray-400" />
          </Button>
          <div className="h-8 w-[1px] bg-gray-100 mx-1" />
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl relative">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white" />
          </Button>
          <div className="ml-2 flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
             <div className="h-6 w-6 rounded-lg overflow-hidden bg-rose-50 border border-rose-100 flex items-center justify-center">
                <Image 
                  src={getAvatarUrl(user?.image, user?.name || 'User', 'user')} 
                  alt="User" width={24} height={24} className="object-cover" 
                />
             </div>
             <span className="text-[10px] font-black uppercase tracking-tight">{user?.name?.split(' ')[0]}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            
            {/* Left Strategic Column */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Profile Narrative Card */}
              <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white rounded-[2rem] overflow-hidden group">
                <div className="h-24 bg-gradient-to-br from-[#5A0F23] via-[#8B1538] to-black relative">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
                <CardContent className="px-8 pb-10">
                  <div className="relative -mt-12 mb-6 inline-block">
                    <div className="p-1 bgColor-white rounded-3xl shadow-xl shadow-gray-900/10">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-50 border-2 border-white relative group/avatar">
                        <R2ImageUpload
                          value={watchedImage || ""}
                          onChange={(val) => profileForm.setValue("image", val as string)}
                          category={FileCategory.PROFILE}
                          identifier="user-identity-image"
                          variant="avatar"
                          multiple={false}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-black text-black leading-tight italic">{user?.name}</h2>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{user?.role}</p>
                    </div>
                    
                    <div className="pt-4 space-y-3">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-bold">{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500 font-bold">
                        <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-[11px]">System Verified ✅</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Hardening Card */}
              <Card className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[2rem] p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-black flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-xl"><Lock className="h-4 w-4 text-primary" /></div>
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col gap-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Primary Authentication</label>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-gray-700">{user?.email}</span>
                       <Badge variant="outline" className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md border-gray-200">Locked</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Link href="/dashboard/settings/security">
                      <Button variant="outline" type="button" className="w-full h-12 rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-xs font-black uppercase tracking-widest flex items-center gap-2 group shadow-sm transition-all hover:shadow-md">
                        < RefreshCw className="h-3.5 w-3.5 text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
                        Change Credentials
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Tactical Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Identity Matrix Card */}
              <Card className="border-none shadow-2xl shadow-gray-200/40 bg-white rounded-[2.5rem] p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-black text-black italic uppercase tracking-tight">Identity Profile</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                       <div className="h-1 w-4 bg-primary rounded-full" /> Personal Data Layer
                    </p>
                  </div>
                  <Badge className="bg-primary/5 text-primary border-none font-black px-4 py-1.5 rounded-full text-[9px] tracking-widest">
                    SYNC STATUS: LIVE
                  </Badge>
                </div>

                <div className="space-y-8">
                  {/* Name Sector */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Legal First Name</Label>
                      <Input 
                        {...profileForm.register("firstName")}
                        className="h-14 px-5 rounded-2xl bg-gray-50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/10 text-sm font-bold transition-all"
                        placeholder="John"
                      />
                      {profileForm.formState.errors.firstName && <p className="text-[10px] text-red-500 font-black mt-1 uppercase italic">! {profileForm.formState.errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Legal Last Name</Label>
                      <Input 
                        {...profileForm.register("lastName")}
                        className="h-14 px-5 rounded-2xl bg-gray-50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/10 text-sm font-bold transition-all"
                        placeholder="Doe"
                      />
                      {profileForm.formState.errors.lastName && <p className="text-[10px] text-red-500 font-black mt-1 uppercase italic">! {profileForm.formState.errors.lastName.message}</p>}
                    </div>
                  </div>

                  {/* Narrative Sector */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Professional Bio</Label>
                    <Textarea 
                      {...profileForm.register("bio")}
                      className="min-h-[160px] p-6 rounded-[2rem] bg-gray-50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/10 text-sm font-bold leading-relaxed resize-none transition-all"
                      placeholder="Share your journey, expertise and vision..."
                    />
                    <div className="flex justify-between items-center px-2">
                       <p className="text-[9px] text-gray-400 font-bold uppercase">Markdown supported for formatting</p>
                       <p className={cn("text-[9px] font-black uppercase", (watchedBio?.length || 0) > 400 ? "text-red-500" : "text-gray-400")}>
                          {watchedBio?.length || 0} / 500
                       </p>
                    </div>
                  </div>

                  <div className="pt-10 flex items-center justify-between border-t border-gray-50">
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                               <Shield className="h-2 w-2 text-gray-400" />
                            </div>
                          ))}
                       </div>
                       End-to-end Encrypted Save
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={updateProfile.isPending}
                      className="h-14 px-12 bg-black hover:bg-black text-white font-black rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden group"
                    >
                      {updateProfile.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-primary group-hover:scale-125 transition-transform" />
                          Commit Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Utility Info */}
              <div className="px-10 py-6 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center gap-6">
                 <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/10 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-[11px] font-black text-black uppercase tracking-tight">Identity Persistence Policy</h4>
                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase opacity-70">
                       By updating your profile, you agree to reflect these details across all institutional records and certification layers.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
