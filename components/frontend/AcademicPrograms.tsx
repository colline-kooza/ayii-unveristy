"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  ArrowRight, 
  ChevronRight, 
  GraduationCap, 
  Users, 
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const iconMap: Record<string, any> = {
  Sparkles,
  Users,
  GraduationCap,
};

export default function AcademicPrograms() {
  const { data } = useQuery({
    queryKey: ["cms", "homepage", "academicPrograms"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/academicPrograms");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (!data) return null;

  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-50/50 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50/50 rounded-full blur-3xl -ml-64 -mb-64" />

      <div className="container mx-auto px-6 lg:px-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="mb-6 bg-[#283593]/5 text-[#283593] border-0 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full">
            {data.badge || "Institutional Programs"}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-black mb-5 leading-tight">
            {data.heading?.line1 || "Premier Academic"} <br />
            <span className="text-[#283593]">{data.heading?.line2 || "Excellence"}</span>
          </h2>
          <p className="text-sm lg:text-base text-gray-500 font-medium max-w-2xl mx-auto">
            {data.subheading || "Discover our curated academic pathways designed to equip you with institutional mastery and professional excellence in your chosen field."}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {data.programs?.map((program: any, idx: number) => {
            const Icon = iconMap[program.icon] || Sparkles;
            return (
              <div key={program.id || idx} className="group relative h-[500px]">
                <div className="absolute inset-0 bg-black rounded-[3rem] overflow-hidden">
                  <img 
                    src={program.image}
                    alt={program.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10" />
                </div>
                
                <div className="relative h-full p-10 flex flex-col z-20">
                  <div className="h-14 w-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0ee0f8] group-hover:text-black transition-all duration-500">
                    <Icon className="h-7 w-7 text-white group-hover:text-black" />
                  </div>
                  
                  <Badge className="w-fit mb-4 bg-[#0ee0f8]/20 text-[#0ee0f8] border-0 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1">
                    {program.category}
                  </Badge>
                  
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight">
                    {program.title}
                  </h3>
                  
                  <p className="text-xs text-gray-300 font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-4 group-hover:translate-y-0">
                    {program.description}
                  </p>

                  <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ee0f8]">
                      {data.enrollmentStatus || "Enrollment Open"}
                    </span>
                    <Link href={program.href || "/courses"}>
                      <Button className="h-12 w-12 rounded-2xl p-0 bg-white hover:bg-[#0ee0f8] text-black transition-all shadow-xl shadow-black/20">
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <Link href={data.ctaButton?.href || "/courses"}>
            <Button className="h-16 px-12 bg-black hover:bg-[#283593] text-white rounded-[1.5rem] shadow-2xl shadow-gray-300 transition-all hover:scale-105 active:scale-95 gap-3 text-[12px] font-black uppercase tracking-[0.2em]">
              {data.ctaButton?.text || "Explore Full Catalog"} <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
