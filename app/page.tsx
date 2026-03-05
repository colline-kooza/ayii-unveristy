import Hero from "@/components/frontend/Hero";
import AnimatedStatistics from "@/components/frontend/AnimatedStatistics";
import LearningFeatures from "@/components/frontend/LearningFeatures";
import AcademicPrograms from "@/components/frontend/AcademicPrograms";
import HowItWorks from "@/components/frontend/HowItWorks";
import FAQSection from "@/components/frontend/FAQSection";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";

export default async function Home() {
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
