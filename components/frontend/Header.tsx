"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Updates", href: "/updates" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-[#5A0F23]/97 via-[#8B1538]/97 to-[#6B1329]/97 backdrop-blur-md shadow-xl border-b border-white/10"
          : "bg-gradient-to-r from-[#5A0F23]/80 via-[#8B1538]/80 to-[#6B1329]/80 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/ayii-logo.png" alt="AYii University" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav — flat links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/75 hover:text-white hover:bg-white/8"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 h-8 px-3 text-xs font-medium"
              asChild
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-[#C41E3A] to-[#E63946] hover:from-[#E63946] hover:to-[#FF6B7A] text-white h-8 px-4 text-xs font-bold rounded-lg shadow-lg shadow-[#C41E3A]/25 transition-all"
              asChild
            >
              <Link href="/courses">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/10">
            <div className="flex flex-col gap-0.5 pb-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:text-white hover:bg-white/8"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white bg-transparent hover:bg-white/10 h-9 text-sm"
                asChild
              >
                <Link href="/auth/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-[#C41E3A] to-[#E63946] text-white h-9 text-sm font-bold"
                asChild
              >
                <Link href="/courses" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
