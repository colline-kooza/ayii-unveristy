import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpenCheck, ArrowRight } from "lucide-react";

export default function HeroPreview({ data }: { data: any }) {
  return (
    <div className="relative min-h-[400px] flex items-center overflow-hidden bg-gradient-to-br from-[#5A0F23] via-[#8B1538] to-[#6b1329fe] p-6 rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full opacity-40">
          <img
            src={data.backgroundImage || "/img2.jpeg"}
            alt="Background"
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A0F23] via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[9px] font-bold mb-4">
          <span className="bg-gradient-to-r from-[#C41E3A] to-[#E63946] text-white px-1.5 py-0.5 rounded-full uppercase font-extrabold text-[8px]">
            {data.badge?.label || "NEW"}
          </span>
          <span className="font-semibold tracking-wide">{data.badge?.text || "Badge Text"}</span>
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-3 leading-tight">
          {data.heading?.line1 || "Heading Line 1"} <br />
          <span className="bg-gradient-to-r from-[#FF6B7A] via-[#FFB3BA] to-[#FF8A95] bg-clip-text text-transparent">
            {data.heading?.line2 || "Heading Line 2"}
          </span>
        </h1>

        <p className="text-[10px] text-rose-100/80 mb-4 leading-relaxed font-medium max-w-lg">
          {data.subheading || "Subheading text goes here"}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#C41E3A] to-[#E63946] text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-wider"
          >
            {data.buttons?.primary?.text || "PRIMARY"} <GraduationCap className="w-3 h-3 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-2 border-white/20 bg-white/5 text-white font-black px-4 py-2 rounded-xl text-[9px] uppercase tracking-wider"
          >
            {data.buttons?.secondary?.text || "SECONDARY"} <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {data.stats?.map((stat: any, idx: number) => (
            <div key={idx} className="flex items-center gap-1.5 group">
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                {idx === 0 && <Users className="w-3 h-3 text-[#FF6B7A]" />}
                {idx === 1 && <GraduationCap className="w-3 h-3 text-[#FF6B7A]" />}
                {idx === 2 && <BookOpenCheck className="w-3 h-3 text-[#FF6B7A]" />}
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-none">{stat.value}</div>
                <div className="text-[8px] text-rose-100/50 uppercase font-bold tracking-widest mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
