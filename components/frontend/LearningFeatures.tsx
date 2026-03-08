"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Brain, MessageSquare, Bell } from "lucide-react";

const iconMap: Record<string, any> = {
  FileText,
  MessageSquare,
  Brain,
  Bell,
};

export default function LearningFeatures() {
  const { data } = useQuery({
    queryKey: ["cms", "homepage", "learningFeatures"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/learningFeatures");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (!data) return null;

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-16 bg-white text-[#283593]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#283593] mb-4">
            {data.heading || "Everything you need to succeed"}
          </h2>
          <p className="text-base text-slate-500 max-w-[800px] mx-auto font-medium">
            {data.subheading || "AYii University provides a centralized hub for all your academic needs."}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.features?.map((feature: any, index: number) => {
            const Icon = iconMap[feature.icon] || FileText;
            return (
              <Card
                key={feature.id || index}
                className="group flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl p-2"
              >
                <CardContent className="pt-8 text-center flex flex-col items-center">
                  <div className="bg-rose-50 text-[#8B1538] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#283593] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
