"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Users, BookOpenCheck } from "lucide-react";
import ChatUI from "./ChatUI";

export default function Hero() {
  const { data } = useQuery({
    queryKey: ["cms", "homepage", "hero"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/hero");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (!data) return null;

  const iconMap: Record<number, any> = {
    0: Users,
    1: GraduationCap,
    2: BookOpenCheck,
  };

  return (
    <div className="relative min-h-screen flex items-center pt-24 md:pt-10 lg:pt-2 overflow-hidden bg-gradient-to-br from-[#5A0F23] via-[#8B1538] to-[#6b1329fe]">
      {/* Background with Gradient and Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full opacity-40">
          <img
            src={data.backgroundImage || "/img2.jpeg"}
            alt="University Background"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#5A0F23] via-transparent to-transparent"></div>
        {/* Animated Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-[#C41E3A]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 -ml-20 -mb-20 w-[600px] h-[600px] bg-[#E63946]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
        {/* Left Side: Text Content */}
        <div className="max-w-2xl transform animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-bold leading-none mb-6 hover:bg-white/10 transition-all cursor-default w-fit">
            <span className="bg-gradient-to-r from-[#C41E3A] to-[#E63946] text-white px-2 py-0.5 rounded-full uppercase font-extrabold text-[9px]">
              {data.badge?.label || "NEW"}
            </span>
            <span className="font-semibold tracking-wide">
              {data.badge?.text || "🎓 AYii University: Academic Hub"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 lg:mb-5 leading-tight tracking-tight">
            {data.heading?.line1 || "AYii University"} <br />
            <span className="bg-gradient-to-r from-[#FF6B7A] via-[#FFB3BA] to-[#FF8A95] bg-clip-text text-transparent">
              {data.heading?.line2 || "Learning Hub"}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-rose-100/80 mb-6 lg:mb-8 leading-relaxed font-medium max-w-xl">
            {data.subheading || "Find past papers, lecture notes, videos — and get your questions answered by peers and lecturers at AYii University."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href={data.buttons?.primary?.href || "/courses"} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#C41E3A] to-[#E63946] hover:from-[#E63946] hover:to-[#FF6B7A] text-white px-10 py-7 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-[#C41E3A]/30 transition-all hover:scale-[1.05] active:scale-95 gap-3"
              >
                {data.buttons?.primary?.text || "ENROLL NOW"} <GraduationCap className="w-5 h-5" />
              </Button>
            </Link>
            <Link href={data.buttons?.secondary?.href || "/dashboard"} className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-black h-[64px] px-10 rounded-2xl transition-all text-[11px] uppercase tracking-widest"
              >
                {data.buttons?.secondary?.text || "Launch LMS"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Trust Strip / Stats */}
          <div className="mt-8 lg:mt-12">
            <div className="flex flex-wrap items-center gap-6 sm:gap-x-10 gap-y-4">
              {data.stats?.map((stat: any, idx: number) => {
                const Icon = iconMap[idx] || Users;
                return (
                  <div key={stat.id || idx} className="flex items-center gap-2 group">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
                      <Icon className="w-4 h-4 text-[#FF6B7A]" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white leading-none">
                        {stat.value}
                      </div>
                      <div className="text-xs text-rose-100/50 uppercase font-bold tracking-widest mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Chat UI */}
        <div className="flex justify-center xl:justify-end relative animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative w-full max-w-md xl:max-w-lg">
            <ChatUI />

            {/* Scroll Indicator */}
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 opacity-20 group">
              <span className="text-[11px] text-white uppercase tracking-[0.5em] font-black rotate-90 whitespace-nowrap origin-center translate-x-4">
                Explore Hub
              </span>
              <div className="w-px h-24 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-[#C41E3A]/20 rounded-full blur-2xl" />
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-[#E63946]/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
