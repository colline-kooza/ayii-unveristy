"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User, Tag, BookOpen } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { useBlogPost } from "@/hooks/useBlog";
import { Loader2 } from "lucide-react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: post, isLoading, error } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B1538]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1538] text-white rounded-lg text-sm font-semibold hover:bg-[#5A0F23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-[#5A0F23]/30" />
        </div>
      )}

      <div className={`mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ${post.coverImage ? "-mt-20 relative z-10" : "pt-32"}`}>
        {/* Back Link */}
        <div className={`mb-8 ${post.coverImage ? "pt-0" : ""}`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1538] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#8B1538]/10 text-[#8B1538] rounded-full text-xs font-bold uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 pb-8 border-b border-gray-100 mb-10">
              {post.authorName && (
                <span className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#8B1538] to-[#C41E3A] rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">{post.authorName}</span>
                </span>
              )}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                </span>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#8B1538]/30 pl-5 italic">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#8B1538] prose-strong:text-gray-900 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 mb-16 p-8 bg-gradient-to-br from-[#5A0F23] to-[#8B1538] rounded-2xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
          <p className="text-white/70 text-sm mb-5">Explore more articles and news from AYii University</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#8B1538] rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Posts
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
