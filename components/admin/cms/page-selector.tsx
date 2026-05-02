"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Info, Mail, GraduationCap, FileText, HelpCircle } from "lucide-react";

const PAGES = [
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "about", label: "About", icon: Info },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "admissions", label: "Admissions", icon: GraduationCap },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "help", label: "Help", icon: FileText },
];

// Re-export for use in admin content page

export function PageSelector() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {PAGES.map((page) => {
        const href = `/dashboard/admin/content/${page.id}`;
        const isActive = pathname.startsWith(href);
        const Icon = page.icon;

        return (
          <Link
            key={page.id}
            href={href}
            className={cn(
              "group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all hover:shadow-lg",
              isActive
                ? "border-teal bg-teal/5 shadow-md"
                : "border-border bg-card hover:border-teal/50"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all",
                isActive
                  ? "bg-teal text-white"
                  : "bg-secondary text-muted-foreground group-hover:bg-teal/10 group-hover:text-teal"
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span
              className={cn(
                "text-sm font-semibold transition-colors",
                isActive ? "text-teal" : "text-foreground group-hover:text-teal"
              )}
            >
              {page.label}
            </span>
            {isActive && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-teal rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
