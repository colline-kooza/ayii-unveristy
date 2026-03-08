export default function HowItWorksPreview({ data }: { data: any }) {
  return (
    <div className="bg-[#F5F7FA] p-6 rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-xl font-extrabold text-[#283593] mb-2">
          {data.heading || "Heading"}
        </h2>
        <p className="text-[10px] text-slate-500 max-w-xl mx-auto">
          {data.subheading || "Subheading"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {data.steps?.map((step: any, idx: number) => (
          <div key={idx} className="text-center">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-red-50 flex items-center justify-center mb-3 shadow-lg mx-auto">
              <span className="text-xl font-bold text-[#283593]">{step.number}</span>
            </div>
            <h3 className="text-[11px] font-extrabold text-[#283593] mb-1">{step.title}</h3>
            <p className="text-[9px] text-slate-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
