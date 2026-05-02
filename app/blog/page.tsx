"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Tag, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { useBlogPosts } from "@/hooks/useBlog";

export default function BlogPage() {
  const { data, isLoading } = useBlogPosts(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const posts = data?.data ?? [];
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  const filtered = posts.filter((post) => {
    const matchesSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesTag = !activeTag || post.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "320px", paddingTop: "64px" }}>
        <div className="absolute inset-0">
          <img src="/img2.jpeg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A0F23]/88 via-[#8B1538]/82 to-[#6B1329]/92" />
        </div>
        <div className="relative w-full text-center px-4 py-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold mb-3 uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            AYii University Blog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            News &amp; Insights
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              From Campus Life
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 mb-5">
            Academic news, research highlights, and stories from the AYii University community.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center bg-white/10 border border-white/25 rounded-xl backdrop-blur-sm overflow-hidden focus-within:border-white/50 focus-within:bg-white/15 transition-all shadow-lg shadow-black/20">
              <Search className="ml-4 h-4 w-4 text-white/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search articles..."
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
        {/* Tag filter only */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-7">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                !activeTag ? "bg-[#8B1538] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  activeTag === tag ? "bg-[#8B1538] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-56 bg-gray-100 animate-pulse rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No posts found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || activeTag ? "Try adjusting your search" : "Check back soon for new content"}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block mb-8">
                <div className="relative rounded-xl overflow-hidden bg-gray-900 h-64 sm:h-72">
                  {featured.coverImage && (
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-[#C41E3A]/80 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 bg-white/10 text-white/80 rounded-full text-[10px] font-bold">Featured</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight group-hover:text-[#FFB3BA] transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-xs text-white/60 mb-3 max-w-xl line-clamp-2">{featured.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      {featured.authorName && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />{featured.authorName}
                        </span>
                      )}
                      {featured.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(featured.publishedAt), "MMM d, yyyy")}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-1 text-[#FFB3BA] font-semibold">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                      <div className="h-40 overflow-hidden bg-gray-100">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5A0F23]/10 to-[#8B1538]/5">
                            <BookOpen className="w-8 h-8 text-[#8B1538]/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-[9px] font-bold uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug group-hover:text-[#8B1538] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
                          {post.authorName && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />{post.authorName}
                            </span>
                          )}
                          {post.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(post.publishedAt), "MMM d, yyyy")}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
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
