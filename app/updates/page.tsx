"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Newspaper, Search, Tag, ChevronDown } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { useSchoolUpdates } from "@/hooks/useSchoolUpdates";

const CATEGORY_STYLES: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-700",
  Events: "bg-purple-100 text-purple-700",
  Sports: "bg-green-100 text-green-700",
  Announcement: "bg-orange-100 text-orange-700",
  General: "bg-gray-100 text-gray-700",
};

export default function UpdatesPage() {
  const { data, isLoading } = useSchoolUpdates(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const updates = data?.data ?? [];
  const allCategories = Array.from(
    new Set(updates.map((u) => u.category).filter(Boolean) as string[])
  );

  const filtered = updates.filter((u) => {
    const matchesSearch =
      !search ||
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      (u.excerpt?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesCategory = !activeCategory || u.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "320px", paddingTop: "64px" }}>
        <div className="absolute inset-0">
          <img src="/img2.jpeg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A0F23]/88 via-[#8B1538]/82 to-[#6B1329]/92" />
        </div>
        <div className="relative w-full text-center px-4 py-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold mb-3 uppercase tracking-widest">
            <Newspaper className="w-3 h-3" />
            School Updates
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Latest News &amp;
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Announcements
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 mb-5">
            Stay up to date with the latest happenings and announcements from AYii University.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center bg-white/10 border border-white/25 rounded-xl backdrop-blur-sm overflow-hidden focus-within:border-white/50 focus-within:bg-white/15 transition-all shadow-lg shadow-black/20">
              <Search className="ml-4 h-4 w-4 text-white/50 shrink-0" />
              <input
                type="text"
                placeholder="Search updates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-white/40 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mr-3 text-white/40 hover:text-white/70 text-xs font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filter only */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-7">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                !activeCategory ? "bg-[#8B1538] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeCategory === cat ? "bg-[#8B1538] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Newspaper className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No updates found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || activeCategory ? "Try adjusting your search" : "Check back soon for updates"}
            </p>
          </div>
        ) : (
          <>
            {/* Top 2 featured cards */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {featured.map((update) => (
                  <article
                    key={update.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setExpanded(expanded === update.id ? null : update.id)}
                  >
                    {update.imageUrl && (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={update.imageUrl}
                          alt={update.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex gap-1.5 flex-wrap">
                          {update.category && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[update.category] || "bg-gray-100 text-gray-600"}`}>
                              {update.category}
                            </span>
                          )}
                        </div>
                        {update.publishedAt && (
                          <span className="text-[10px] text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(update.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                      <h2 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#8B1538] transition-colors">
                        {update.title}
                      </h2>
                      {update.excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{update.excerpt}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#8B1538]">
                        {expanded === update.id ? "Show less" : "Read more"}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded === update.id ? "rotate-180" : ""}`} />
                      </div>
                      {expanded === update.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div
                            className="prose prose-xs max-w-none text-gray-600 text-xs leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: update.content }}
                          />
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Compact list */}
            {rest.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">More Updates</p>
                {rest.map((update) => (
                  <article
                    key={update.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setExpanded(expanded === update.id ? null : update.id)}
                  >
                    <div className="flex items-start gap-3 p-4">
                      {update.imageUrl && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={update.imageUrl}
                            alt={update.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {update.category && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[update.category] || "bg-gray-100 text-gray-600"}`}>
                              {update.category}
                            </span>
                          )}
                          {update.publishedAt && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <Calendar className="w-2.5 h-2.5" />
                              {format(new Date(update.publishedAt), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#8B1538] transition-colors leading-snug">
                          {update.title}
                        </h3>
                        {update.excerpt && (
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{update.excerpt}</p>
                        )}
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 mt-1 transition-transform ${expanded === update.id ? "rotate-180" : ""}`} />
                    </div>
                    {expanded === update.id && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                        <div
                          className="prose prose-xs max-w-none text-gray-600 text-xs leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: update.content }}
                        />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
