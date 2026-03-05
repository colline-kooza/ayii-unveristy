"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowRight, 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Star,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const programs = [
  {
    title: "Computer Science & AI",
    category: "Faculty of Technology",
    desc: "Master the digital frontier with advanced paradigms in artificial intelligence and systems engineering.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Strategic Business Management",
    category: "School of Business",
    desc: "Develop executive-level leadership skills and strategic foresight in global market dynamics.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Advanced Civil Engineering",
    category: "Faculty of Engineering",
    desc: "Architect the physical world with sustainable engineering practices and structural innovation.",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop"
  }
];

export default function AcademicPrograms() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -ml-64 -mb-64" />

      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="mb-6 bg-[#283593]/5 text-[#283593] border-0 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full">
            Institutional Programs
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-gray-900 mb-5 leading-tight">
            Premier Academic <br />
            <span className="text-[#283593]">Excellence</span>
          </h2>
          <p className="text-sm lg:text-base text-gray-500 font-medium max-w-2xl mx-auto">
            Discover our curated academic pathways designed to equip you with institutional mastery and professional excellence in your chosen field.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {programs.map((program, idx) => (
            <div key={idx} className="group relative h-[500px]">
               <div className="absolute inset-0 bg-gray-900 rounded-[3rem] overflow-hidden">
                 <img 
                   src={program.image}
                   alt={program.title}
                   className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10" />
               </div>
               
               <div className="relative h-full p-10 flex flex-col z-20">
                  <div className="h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0ee0f8] group-hover:text-black transition-all duration-500">
                    <program.icon className="h-7 w-7 text-white group-hover:text-black" />
                  </div>
                  
                  <Badge className="w-fit mb-4 bg-[#0ee0f8]/20 text-[#0ee0f8] border-0 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1">
                    {program.category}
                  </Badge>
                  
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight">
                    {program.title}
                  </h3>
                  
                  <p className="text-xs text-gray-300 font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-4 group-hover:translate-y-0">
                    {program.desc}
                  </p>

                  <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ee0f8]">Enrollment Open</span>
                     <Link href="/courses">
                        <Button className="h-12 w-12 rounded-2xl p-0 bg-white hover:bg-[#0ee0f8] text-black transition-all shadow-xl shadow-black/20">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
           <Link href="/courses">
              <Button className="h-16 px-12 bg-gray-900 hover:bg-[#283593] text-white rounded-[1.5rem] shadow-2xl shadow-gray-300 transition-all hover:scale-105 active:scale-95 gap-3 text-[12px] font-black uppercase tracking-[0.2em]">
                 Explore Full Catalog <ChevronRight className="h-5 w-5" />
              </Button>
           </Link>
        </div>
      </div>
    </section>
  );
}
