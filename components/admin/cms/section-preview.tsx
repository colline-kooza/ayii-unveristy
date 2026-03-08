"use client";

import { FileText } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import preview components
const HeroPreview = dynamic(() => import("./preview/hero-preview"), { ssr: false });
const AnimatedStatisticsPreview = dynamic(() => import("./preview/animated-statistics-preview"), { ssr: false });
const LearningFeaturesPreview = dynamic(() => import("./preview/learning-features-preview"), { ssr: false });
const AcademicProgramsPreview = dynamic(() => import("./preview/academic-programs-preview"), { ssr: false });
const HowItWorksPreview = dynamic(() => import("./preview/how-it-works-preview"), { ssr: false });
const FAQSectionPreview = dynamic(() => import("./preview/faq-section-preview"), { ssr: false });

interface SectionPreviewProps {
  page: string;
  section: string;
  data: any;
}

export function SectionPreview({ page, section, data }: SectionPreviewProps) {
  if (!data) return null;

  // Homepage sections
  if (page === "homepage") {
    switch (section) {
      case "hero":
        return <HeroPreview data={data} />;
      case "animatedStatistics":
        return <AnimatedStatisticsPreview data={data} />;
      case "learningFeatures":
        return <LearningFeaturesPreview data={data} />;
      case "academicPrograms":
        return <AcademicProgramsPreview data={data} />;
      case "howItWorks":
        return <HowItWorksPreview data={data} />;
      case "faqSection":
        return <FAQSectionPreview data={data} />;
      default:
        return <DefaultPreview page={page} section={section} data={data} />;
    }
  }

  return <DefaultPreview page={page} section={section} data={data} />;
}

function DefaultPreview({ page, section, data }: { page: string; section: string; data: any }) {
  return (
    <div className="p-6 text-center border-2 border-dashed border-border rounded-xl bg-muted/5">
      <div className="max-w-md mx-auto space-y-2">
        <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-5 h-5 text-muted-foreground/50" />
        </div>
        <p className="text-[11px] font-semibold text-foreground">
          Preview for &quot;{section}&quot; on &quot;{page}&quot;
        </p>
        <p className="text-[9px] text-muted-foreground italic">
          Viewing raw data structure. Save changes to update the live site.
        </p>
        <pre className="mt-3 text-[9px] text-left p-2 bg-secondary/50 rounded overflow-x-auto max-h-[120px] custom-scrollbar">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
