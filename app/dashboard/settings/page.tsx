"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Lock, User, Globe, Shield, CreditCard, Loader2, Camera, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useMe, useUpdateProfile, useChangePassword } from "@/hooks/useAuth";
import { R2ImageUpload } from "@/components/FormInputs/R2ImageUpload";
import { FileCategory } from "@/types/files";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAvatarUrl } from "@/lib/avatarUtils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  image: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SettingsPage() {
  const { data: user, isLoading: loadingUser } = useMe();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  
  const [activeTab, setActiveTab] = useState("account");

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
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

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        bio: user.bio || "",
        image: user.image || "",
      });
    }
  }, [user, profileForm]);

  const onUpdateProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile.mutateAsync(data);
    } catch (err) {
      // toast handled in hook
    }
  };

  const onChangePassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
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

  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen">
      {/* Compact Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-xl font-black tracking-tight text-black flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account Management
          </h1>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Configure identity & global security protocols
          </p>
        </div>
        
        {/* Minimal User Info */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-rose-50 flex items-center justify-center border border-rose-100/50">
            <Image 
              src={getAvatarUrl(user?.image, user?.name || 'User', 'user')} 
              alt={user?.name || "Avatar"} 
              width={32}
              height={32}
              className="h-full w-full object-cover" 
            />
          </div>
          <div className="leading-none">
            <p className="text-[11px] font-black text-black">{user?.name}</p>
            <p className="text-[9px] font-bold text-gray-400 mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Horizontal Top Navigation */}
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-100/50 p-1 rounded-xl h-auto gap-1">
            <TabsTrigger 
              value="account" 
              className="px-6 py-2 rounded-lg text-xs font-black transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Identity & Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="px-6 py-2 rounded-lg text-xs font-black transition-all data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Security Protocols
            </TabsTrigger>
          </TabsList>

          <Button 
            variant="ghost" 
            className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest gap-2"
            onClick={() => toast.info("Audit log access requested")}
          >
            <ShieldCheck className="h-3 w-3" />
            System Logs
          </Button>
        </div>

        <div className="max-w-5xl mx-auto w-full">
          {/* Account Settings */}
          <TabsContent value="account" className="m-0 focus-visible:outline-none animate-in fade-in zoom-in-95">
            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-[#5A0F23] to-[#8B1538] relative">
                <div className="absolute inset-0 bg-white/5 opacity-10"></div>
              </div>
              
              <div className="px-6 lg:px-10 -mt-10 relative z-10 flex flex-col md:flex-row items-end gap-5">
                <div className="p-1.5 bg-white rounded-2xl shadow-xl shadow-primary/5">
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                    <R2ImageUpload
                      value={(watchedImage as string) || ""}
                      onChange={(val) => profileForm.setValue("image", val as string)}
                      category={FileCategory.GALLERY}
                      identifier="user-profile-image"
                      multiple={false}
                    />
                  </div>
                </div>
                <div className="pb-2">
                  <h2 className="text-xl font-black text-black">Personal Identity</h2>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">Core Institutional Data</p>
                </div>
              </div>

              <div className="px-6 lg:px-10 pt-8 pb-10">
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-0.5">Professional Name</Label>
                      <Input 
                        {...profileForm.register("name")} 
                        className="h-11 px-4 rounded-xl bg-gray-50/50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/5 text-xs font-bold transition-all" 
                      />
                      {profileForm.formState.errors.name && <p className="text-[9px] text-red-500 font-bold">{profileForm.formState.errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-0.5">Network Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          {...profileForm.register("email")} 
                          disabled={user?.role === "STUDENT"}
                          className="h-11 pl-11 pr-4 rounded-xl bg-gray-50/50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/5 text-xs font-bold transition-all disabled:opacity-50" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-0.5">Professional Summary</Label>
                    <Textarea 
                      {...profileForm.register("bio")} 
                      className="min-h-[120px] p-4 rounded-xl bg-gray-50/50 border-none shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/5 text-xs font-bold transition-all leading-relaxed resize-none" 
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      Encrypted sync enabled
                    </div>
                    <Button 
                      type="submit" 
                      disabled={updateProfile.isPending}
                      className="bg-primary hover:bg-primary/90 text-white font-black h-11 px-8 rounded-xl shadow-lg shadow-primary/10 text-xs transition-all flex items-center gap-2"
                    >
                      {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      Push Changes
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="m-0 focus-visible:outline-none animate-in fade-in zoom-in-95">
            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white rounded-[1.5rem] overflow-hidden p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#8B1538] shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-black">Security Protocols</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Update institutional credentials</p>
                </div>
              </div>

              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-0.5">Current Auth Token</Label>
                  <Input 
                    type="password" 
                    {...passwordForm.register("currentPassword")} 
                    className="h-11 px-4 rounded-xl bg-gray-50/50 border-none shadow-inner" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-0.5">New Key Phrase</Label>
                    <Input 
                      type="password" 
                      {...passwordForm.register("newPassword")} 
                      className="h-11 px-4 rounded-xl bg-gray-50/50 border-none shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-0.5">Confirm Key</Label>
                    <Input 
                      type="password" 
                      {...passwordForm.register("confirmPassword")} 
                      className="h-11 px-4 rounded-xl bg-gray-50/50 border-none shadow-inner" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={changePassword.isPending}
                    className="bg-black hover:bg-black text-white font-black h-11 px-8 rounded-xl shadow-lg text-xs flex items-center gap-2"
                  >
                    {changePassword.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Encrypt Credentials
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
