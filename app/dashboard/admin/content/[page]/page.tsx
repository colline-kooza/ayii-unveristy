"use client";

import { use } from "react";
import { Layers, MousePointer2 } from "lucide-react";
import { SectionTabs } from "@/components/admin/cms/section-tabs";

export default function ContentPageRoot({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      <SectionTabs page={page} />
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/20">
        <div className="max-w-md text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-teal/10 text-teal rounded-full flex items-center justify-center mb-6">
            <Layers className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-navy capitalize">
            {page.replace(/_/g, " ")} Content
          </h1>
          <p className="text-muted-foreground text-sm">
            Select a specific section from the top bar above to begin editing its content.
          </p>
          <div className="pt-8 flex flex-col items-center gap-2 text-sm font-medium text-teal">
            <MousePointer2 className="w-5 h-5 animate-bounce" />
            <span>Choose a section above to start</span>
          </div>
        </div>
      </div>
    </div>
  );
}
