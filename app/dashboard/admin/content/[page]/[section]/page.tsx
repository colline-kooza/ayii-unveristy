"use client";

import { use, useState, useEffect } from "react";
import { useCmsSection, useUpdateSection } from "@/hooks/useCmsContent";
import { SectionForm } from "@/components/admin/cms/section-form";
import { SectionPreview } from "@/components/admin/cms/section-preview";
import { SectionTabs } from "@/components/admin/cms/section-tabs";
import { Loader2, Save, Layers, Monitor, Code } from "lucide-react";
import Link from "next/link";

export default function ContentEditorPage({
  params,
}: {
  params: Promise<{ page: string; section: string }>;
}) {
  const { page, section } = use(params);
  const { data: serverData, isLoading, error } = useCmsSection(page, section);
  const { mutate: updateSection, isPending: isSaving } = useUpdateSection();
  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "json">("preview");

  // Sync server data to local form state on load
  useEffect(() => {
    if (serverData && !formData) {
      // Use a small delay to avoid "cascading renders" warning from React Compiler
      const timer = setTimeout(() => setFormData(serverData), 0);
      return () => clearTimeout(timer);
    }
  }, [serverData, formData]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(serverData);

  const handleSave = () => {
    if (!formData) return;
    updateSection({ page, section, patch: formData });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
          <p className="text-sm">Loading section content...</p>
        </div>
      </div>
    );
  }

  if (error || !serverData) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 text-center p-8">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <Layers className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Section Not Found</h2>
          <p className="text-muted-foreground mt-1 max-w-sm">
            The section &quot;{section}&quot; on page &quot;{page}&quot; could not be loaded or does not exist.
          </p>
        </div>
        <Link
          href="/dashboard/admin/content"
          className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded text-sm font-medium hover:bg-secondary/80"
        >
          Return to Content Setup
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Horizontal Navigation */}
      <SectionTabs page={page} activeSection={section} />

      {/* Header */}
      <header className="shrink-0 h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm uppercase">
            <Layers className="w-4 h-4 text-teal" />
            <span className="font-semibold text-foreground tracking-wide">
              {section.replace(/([A-Z])/g, " $1").trim()} Content
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium">
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white px-4 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </header>

      {/* Editor Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form Schema Editor */}
        <div className="w-[40%] flex flex-col border-r border-border bg-card/50">
          <div className="shrink-0 p-3 border-b border-border bg-card flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal" />
              Content Editor
            </h3>
            <span className="text-[10px] text-muted-foreground font-medium uppercase min-w-[60px] text-right">
              Edit Mode
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {formData ? (
              <SectionForm data={formData} onChange={setFormData} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}
            <div className="h-8" /> {/* bottom padding */}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <div className="shrink-0 p-2 border-b border-border bg-card flex items-center justify-between px-3">
            <div className="flex items-center gap-1 bg-secondary rounded p-1">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  activeTab === "preview"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Preview (Mock)
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  activeTab === "json"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Code className="w-3.5 h-3.5" /> JSON Structure
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "json" ? (
              <pre className="p-4 bg-navy text-green-400 rounded-lg overflow-x-auto text-xs font-mono shadow-inner h-full">
                {JSON.stringify(formData, null, 2)}
              </pre>
            ) : (
              <div className="bg-background rounded-lg border border-border/50 shadow-sm h-full flex flex-col overflow-hidden relative">
                <div className="w-full h-8 bg-secondary/40 border-b border-border flex items-center gap-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-4 text-[10px] text-muted-foreground font-mono flex-1 text-center truncate pr-8">
                    {page} / {section}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto bg-muted/10 relative custom-scrollbar">
                  <div className="min-h-full w-full">
                    <SectionPreview page={page} section={section} data={formData} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
