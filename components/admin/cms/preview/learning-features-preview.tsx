import { FileText, MessageSquare, Brain, Bell } from "lucide-react";

const iconMap: Record<string, any> = {
  FileText,
  MessageSquare,
  Brain,
  Bell,
};

export default function LearningFeaturesPreview({ data }: { data: any }) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-[#283593] mb-2">
          {data.heading || "Heading"}
        </h2>
        <p className="text-[10px] text-slate-500 max-w-xl mx-auto">
          {data.subheading || "Subheading"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.features?.map((feature: any, idx: number) => {
          const Icon = iconMap[feature.icon] || FileText;
          return (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#283593]/10 rounded-lg flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-[#283593]" />
              </div>
              <h3 className="text-[11px] font-bold text-[#283593] mb-1">{feature.title}</h3>
              <p className="text-[9px] text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
