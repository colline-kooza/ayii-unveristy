"use client";

import { useState } from "react";
import { X, ZoomIn, Images, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { useGalleryImages } from "@/hooks/useGallery";

const CATEGORIES = ["All", "Campus", "Events", "Students", "Sports", "Academics", "Graduation", "Other"];

export default function GalleryPage() {
  const { data, isLoading } = useGalleryImages();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const allImages = data?.data ?? [];

  const filtered = allImages.filter((img) => {
    const matchesCategory = activeCategory === "All" || img.category === activeCategory;
    const matchesSearch = !search || img.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null);
  const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % filtered.length : null);

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const usedCategories = CATEGORIES.filter(
    (cat) => cat === "All" || allImages.some((img) => img.category === cat)
  );

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
            <Images className="w-3 h-3" />
            Photo Gallery
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Life at
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              AYii University
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1 mb-5">
            Browse memories, events, and moments that define the spirit of our community.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <div className="flex items-center bg-white/10 border border-white/25 rounded-xl backdrop-blur-sm overflow-hidden focus-within:border-white/50 focus-within:bg-white/15 transition-all shadow-lg shadow-black/20">
              <Search className="ml-4 h-4 w-4 text-white/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search photos..."
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
        {usedCategories.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-7">
            {usedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#8B1538] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`bg-gray-100 animate-pulse rounded-xl break-inside-avoid mb-3 ${[1,4,7,10].includes(i) ? "h-52" : "h-36"}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Images className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No photos found</p>
            <p className="text-xs text-gray-400 mt-1">
              {search || activeCategory !== "All" ? "Try changing your filter" : "The gallery is being updated"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5 text-xs text-gray-400">
              <span className="font-semibold text-gray-700 text-sm">{filtered.length}</span>
              <span>photos</span>
              {activeCategory !== "All" && <><span>·</span><span>{activeCategory}</span></>}
            </div>

            {/* Masonry Grid */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
              {filtered.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative break-inside-avoid mb-3 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2.5 bg-white/20 rounded-full backdrop-blur-sm">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[11px] font-semibold truncate">{image.title}</p>
                      {image.category && (
                        <p className="text-white/55 text-[9px] mt-0.5">{image.category}</p>
                      )}
                    </div>
                    {image.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-1.5 py-0.5 bg-amber-500/90 text-white rounded-full text-[9px] font-bold">Featured</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {filtered.length > 1 && (
            <button
              className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.imageUrl}
              alt={currentImage.title}
              className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-3 text-center">
              <p className="text-white font-semibold text-sm">{currentImage.title}</p>
              {currentImage.description && (
                <p className="text-white/55 text-xs mt-1 max-w-lg">{currentImage.description}</p>
              )}
              {currentImage.category && (
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/10 text-white/60 rounded-full text-[10px] font-medium">
                  {currentImage.category}
                </span>
              )}
            </div>
            <p className="mt-2 text-white/25 text-[10px]">
              {lightboxIndex + 1} / {filtered.length}
            </p>
          </div>

          {filtered.length > 1 && (
            <button
              className="absolute right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
