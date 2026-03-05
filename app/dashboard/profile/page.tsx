"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, Calendar, User as UserIcon, Camera, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 lg:p-8 space-y-6 bg-[#fcfdfe] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
            <span>Identity Hub</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">Public Profile</span>
          </nav>
          <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">Personal Presence</h1>
          <p className="text-[11px] text-gray-500 mt-1 font-bold">
            Institutional digital identity visible to the university community.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-6 rounded-xl border-gray-100 text-gray-500 font-black text-[10px] hover:bg-white hover:border-blue-200 transition-all uppercase tracking-widest shadow-sm">
            View Public
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black h-10 px-6 rounded-xl shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] uppercase tracking-widest text-[10px]">
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
        {/* Left Column: Avatar & Contact */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl shadow-gray-200/30 bg-white rounded-[1.5rem] overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-blue-700 to-indigo-800 relative">
               <div className="absolute inset-0 bg-white/5 opacity-10"></div>
            </div>
            <CardContent className="px-6 pb-8">
              <div className="-mt-12 relative z-10 flex flex-col items-center">
                <div className="p-1.5 bg-white rounded-2xl shadow-xl shadow-blue-500/5">
                  <Avatar className="h-24 w-24 rounded-xl border-none">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-50 text-blue-600 text-2xl font-black">AD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Admin User</h2>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">System Architecture Lead</p>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                {[
                  { icon: Mail, label: 'Email', value: 'admin@ayii.edu' },
                  { icon: MapPin, label: 'Zone', value: 'Main Campus, Wing A' },
                  { icon: Calendar, label: 'Joined', value: 'March 2024' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-transparent group hover:bg-white hover:border-gray-100 transition-all">
                    <item.icon className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-600" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">{item.label}</p>
                      <p className="text-xs font-bold text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col items-center gap-3">
                 <Badge className="bg-green-500/10 text-green-600 border-none font-black px-4 py-1.5 rounded-full text-[9px] tracking-widest uppercase">
                    Verified Administrator
                 </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details & Activity */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-none shadow-xl shadow-gray-200/30 bg-white rounded-[1.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4 border-none">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Account Insights</span>
              <CardTitle className="text-xl font-black text-gray-900 tracking-tight">Active Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 rounded-[1.25rem] bg-indigo-50/40 border border-indigo-100/50 space-y-3 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                     <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 tracking-tight">Encryption Layers</p>
                    <p className="text-[11px] text-gray-500 font-bold mt-1 leading-relaxed">System-wide 2FA enabled with biometric logic active.</p>
                  </div>
               </div>
               <div className="p-6 rounded-[1.25rem] bg-blue-50/40 border border-blue-100/50 space-y-3 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                     <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 tracking-tight">Privilege Level</p>
                    <p className="text-[11px] text-gray-500 font-bold mt-1 leading-relaxed">Authorized for root-level infrastructure and security audits.</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/30 bg-white rounded-[1.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-2 border-none flex flex-row items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Security Traffic</span>
                <CardTitle className="text-lg font-black text-gray-900 tracking-tight">Active Sessions</CardTitle>
              </div>
              <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600">
                View Logs
              </Button>
            </CardHeader>
            <CardContent className="p-0">
               {[
                 { device: 'Desktop (Chrome)', loc: 'Lagos, NG', active: true, time: 'CURRENT_SECURE' },
                 { device: 'Mobile App (iOS)', loc: 'Lagos, NG', active: false, time: '2 HOURS AGO' },
               ].map((session, i) => (
                 <div key={i} className="flex items-center justify-between p-5 px-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-all", session.active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-gray-100 text-gray-400")}>
                          <UserIcon className="h-4 w-4" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{session.device}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{session.loc}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className={cn("text-[8px] font-black tracking-[0.2em] px-3 py-1 rounded-full uppercase", 
                          session.active ? "bg-green-500/10 text-green-600" : "bg-gray-100 text-gray-400")}>
                          {session.time}
                       </div>
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
