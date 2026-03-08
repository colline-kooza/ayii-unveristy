import { ChevronDown } from "lucide-react";

export default function FAQSectionPreview({ data }: { data: any }) {
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

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        {data.faqs?.map((faq: any, idx: number) => (
          <div key={idx} className="mb-2 pb-2 border-b border-slate-200 last:border-b-0">
            <div className="flex justify-between items-center py-2">
              <span className="font-semibold text-[10px] text-gray-800 pr-2">{faq.question}</span>
              <ChevronDown className="w-4 h-4 text-[#F4A800] flex-shrink-0" />
            </div>
            <p className="text-[9px] text-slate-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
