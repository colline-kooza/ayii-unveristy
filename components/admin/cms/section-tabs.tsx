"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const PAGE_SECTIONS: Record<string, { id: string; label: string }[]> = {
  homepage: [
    { id: "hero", label: "Hero" },
    { id: "animatedStatistics", label: "Statistics" },
    { id: "learningFeatures", label: "Features" },
    { id: "academicPrograms", label: "Programs" },
    { id: "howItWorks", label: "How It Works" },
    { id: "faqSection", label: "FAQ" },
  ],
  about: [
    { id: "hero", label: "Hero" },
    { id: "mission", label: "Mission" },
    { id: "team", label: "Team" },
  ],
  contact: [
    { id: "hero", label: "Hero" },
    { id: "contactForm", label: "Contact Form" },
    { id: "locations", label: "Locations" },
  ],
  admissions: [
    { id: "hero", label: "Hero" },
    { id: "requirements", label: "Requirements" },
    { id: "process", label: "Process" },
  ],
};

interface SectionTabsProps {
  page: string;
  activeSection?: string;
}

export function SectionTabs({ page, activeSection }: SectionTabsProps) {
  const pathname = usePathname();

  const sections = PAGE_SECTIONS[page] || [];

  return (
    <div className="shrink-0 h-12 border-b border-border bg-card flex items-center px-4 overflow-x-auto">
      <div className="flex items-center gap-1">
        {sections.map((section) => {
          const href = `/dashboard/admin/content/${page}/${section.id}`;
          const isActive = activeSection === section.id || pathname === href;

          return (
            <Link
              key={section.id}
              href={href}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                isActive
                  ? "bg-teal text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {section.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
