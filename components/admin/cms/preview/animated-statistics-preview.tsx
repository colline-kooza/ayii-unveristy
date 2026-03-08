export default function AnimatedStatisticsPreview({ data }: { data: any }) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="grid grid-cols-3 gap-4">
        {data.stats?.map((stat: any, idx: number) => (
          <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-extrabold text-[#283593] mb-1">
              {stat.value}
              {stat.suffix}
            </div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
