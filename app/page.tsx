"use client";

import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/frontend/Hero";
import AnimatedStatistics from "@/components/frontend/AnimatedStatistics";
import LearningFeatures from "@/components/frontend/LearningFeatures";
import AcademicPrograms from "@/components/frontend/AcademicPrograms";
import HowItWorks from "@/components/frontend/HowItWorks";
import FAQSection from "@/components/frontend/FAQSection";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

export default function Home() {
  // Preload all homepage sections
  const { isLoading: heroLoading } = useQuery({
    queryKey: ["cms", "homepage", "hero"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/hero");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { isLoading: statsLoading } = useQuery({
    queryKey: ["cms", "homepage", "animatedStatistics"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/animatedStatistics");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { isLoading: featuresLoading } = useQuery({
    queryKey: ["cms", "homepage", "learningFeatures"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/learningFeatures");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { isLoading: programsLoading } = useQuery({
    queryKey: ["cms", "homepage", "academicPrograms"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/academicPrograms");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { isLoading: howItWorksLoading } = useQuery({
    queryKey: ["cms", "homepage", "howItWorks"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/howItWorks");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { isLoading: faqLoading } = useQuery({
    queryKey: ["cms", "homepage", "faqSection"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/faqSection");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const isLoading = heroLoading || statsLoading || featuresLoading || programsLoading || howItWorksLoading || faqLoading;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
        <div className="relative flex items-center justify-center w-10 h-10">
          {/* Outer ring */}
          <span
            className="absolute inline-block w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
            style={{ animationDuration: "0.75s" }}
          />
          {/* Inner dot */}
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-0">
        <Hero />
        <AnimatedStatistics />
        <LearningFeatures />
        <AcademicPrograms />
        <HowItWorks />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
