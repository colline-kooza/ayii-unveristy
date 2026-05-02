"use client";

import { useState } from "react";
import { Search, Book, FileText, Newspaper, BookOpen, GraduationCap, ArrowRight, Download, ExternalLink } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { useBooks, useJournals, usePastPapers } from "@/hooks/useLibrary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function PublicLibraryPage() {
  const [search, setSearch] = useState("");
  const { data: books, isLoading: loadingBooks } = useBooks({ search });
  const { data: journals, isLoading: loadingJournals } = useJournals({ search });
  const { data: pastPapers, isLoading: loadingPapers } = usePastPapers({ search });

  const isLoading = loadingBooks || loadingJournals || loadingPapers;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "350px", paddingTop: "64px" }}>
        <div className="absolute inset-0">
          <img src="/img2.jpeg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#5A0F23]/90 via-[#8B1538]/85 to-[#6B1329]/95" />
        </div>
        <div className="relative w-full text-center px-4 py-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">
            <GraduationCap className="w-3.5 h-3.5" />
            Knowledge Gateway
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-2">
            Digital
            <span className="ml-3 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Library
            </span>
          </h1>
          <p className="text-sm text-white/60 max-w-lg mx-auto mt-2 mb-8 font-medium">
            Access thousands of academic resources, research journals, and past examination papers from anywhere in the world.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white/10 border border-white/25 rounded-2xl backdrop-blur-md overflow-hidden focus-within:border-white/50 focus-within:bg-white/20 transition-all shadow-2xl shadow-black/20 p-1">
              <Search className="ml-4 h-5 w-5 text-white/50 shrink-0" />
              <input
                type="text"
                placeholder="Search across all resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent px-4 py-3.5 text-base text-white placeholder-white/40 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mr-3 text-white/40 hover:text-white/70 text-xs font-bold uppercase transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="books" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <TabsList className="bg-gray-100/50 p-1 rounded-xl border border-gray-200">
              <TabsTrigger value="books" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#8B1538] data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-widest transition-all">
                <Book className="w-3.5 h-3.5 mr-2" /> Books
              </TabsTrigger>
              <TabsTrigger value="journals" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#8B1538] data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-widest transition-all">
                <Newspaper className="w-3.5 h-3.5 mr-2" /> Journals
              </TabsTrigger>
              <TabsTrigger value="papers" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#8B1538] data-[state=active]:shadow-sm text-xs font-bold uppercase tracking-widest transition-all">
                <FileText className="w-3.5 h-3.5 mr-2" /> Past Papers
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <span>Showing institutional resources</span>
              <div className="h-4 w-[1px] bg-gray-200" />
              <span className="text-gray-900">{search ? 'Filtered results' : 'All categories'}</span>
            </div>
          </div>

          {/* Books Content */}
          <TabsContent value="books">
            {loadingBooks ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : books?.data?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.data.map((book: any) => (
                  <div key={book.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Book className="w-12 h-12 text-gray-200" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 backdrop-blur-sm text-[#8B1538] border-none font-bold text-[9px] uppercase tracking-widest shadow-sm">
                          {book.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#8B1538] transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
                        {book.publisher}
                      </p>
                      <a href={book.link} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-gray-50 hover:bg-[#8B1538] text-gray-900 hover:text-white border-none rounded-xl text-xs font-bold transition-all shadow-none h-11">
                          Access Resource <ExternalLink className="w-3.5 h-3.5 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No books found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or check back later.</p>
              </div>
            )}
          </TabsContent>

          {/* Journals Content */}
          <TabsContent value="journals">
            {loadingJournals ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : journals?.data?.length ? (
              <div className="grid gap-6">
                {journals.data.map((journal: any) => (
                  <div key={journal.id} className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-md transition-all">
                    <div className="h-16 w-16 rounded-2xl bg-[#8B1538]/5 flex items-center justify-center shrink-0 border border-[#8B1538]/10">
                      <Newspaper className="w-8 h-8 text-[#8B1538]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-[9px] font-bold uppercase border-gray-200">
                          Journal Article
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#8B1538] transition-colors leading-tight">
                        {journal.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {journal.abstract}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <span className="text-gray-900">Authors: {journal.authors?.join(", ")}</span>
                        {journal.doi && <span>DOI: {journal.doi}</span>}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <a href={`/api/files/${journal.fileKey}`} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto bg-[#8B1538] hover:bg-[#5A0F23] text-white rounded-xl text-xs font-bold h-11 px-8 shadow-lg shadow-[#8B1538]/20">
                          View PDF <ArrowRight className="w-3.5 h-3.5 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <Newspaper className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No journals found</h3>
                <p className="text-sm text-gray-500 mt-1">Our academic journals database is currently being synced.</p>
              </div>
            )}
          </TabsContent>

          {/* Past Papers Content */}
          <TabsContent value="papers">
            {loadingPapers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : pastPapers?.data?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastPapers.data.map((paper: any) => (
                  <div key={paper.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 group-hover:bg-[#8B1538]/5 group-hover:text-[#8B1538] transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <Badge className="bg-rose-50 text-[#8B1538] border-none font-bold text-[10px]">
                        Year {paper.year}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#8B1538] transition-colors">
                      {paper.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                      {paper.courseUnit} • {paper.subject}
                    </p>
                    <a href={`/api/files/${paper.fileKey}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full border-gray-200 hover:border-[#8B1538] hover:bg-rose-50 hover:text-[#8B1538] rounded-xl text-xs font-bold h-11 transition-all">
                        Download Paper <Download className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No past papers found</h3>
                <p className="text-sm text-gray-500 mt-1">Search by unit code or course title to find specific papers.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
