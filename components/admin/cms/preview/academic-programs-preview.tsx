import { ArrowRight, Sparkles, Users, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, any> = {
  Sparkles,
  Users,
  GraduationCap,
};

export default function AcademicProgramsPreview({ data }: { data: any }) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="text-center mb-8">
        <Badge className="mb-3 bg-[#283593]/5 text-[#283593] border-0 text-[9px] font-black uppercase tracking-wider px-4 py-1 rounded-full">
          {data.badge || "Institutional Programs"}
        </Badge>
        <h2 className="text-xl font-black text-black mb-2">
          {data.heading?.line1 || "Premier Academic"} <br />
          <span className="text-[#283593]">{data.heading?.line2 || "Excellence"}</span>
        </h2>
        <p className="text-[10px] text-gray-500 max-w-xl mx-auto">
          {data.subheading}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {data.programs?.map((program: any, idx: number) => {
          const Icon = iconMap[program.icon] || Sparkles;
          return (
            <div key={idx} className="relative h-[200px] rounded-2xl overflow-hidden bg-black">
              <img 
                src={program.image}
                alt={program.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              
              <div className="relative h-full p-4 flex flex-col">
                <div className="h-8 w-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                
                <Badge className="w-fit mb-2 bg-[#0ee0f8]/20 text-[#0ee0f8] border-0 text-[8px] font-black uppercase tracking-wider px-2 py-0.5">
                  {program.category}
                </Badge>
                
                <h3 className="text-[11px] font-black text-white mb-1 leading-tight">
                  {program.title}
                </h3>
                
                <p className="text-[8px] text-gray-300 leading-relaxed line-clamp-2">
                  {program.description}
                </p>

                <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[7px] font-black uppercase tracking-wider text-[#0ee0f8]">
                    {data.enrollmentStatus}
                  </span>
                  <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-black" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-wider">
          {data.ctaButton?.text || "Explore Full Catalog"}
        </div>
      </div>
    </div>
  );
}
