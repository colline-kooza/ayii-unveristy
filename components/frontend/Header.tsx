"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Library", href: "/library" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#283593]/95 backdrop-blur-md shadow-lg border-b border-white/10">
      <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-20">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#0ee0f8] p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-[#283593]" />
            </div>
            <span className="text-xl font-bold text-white">
              AYii University
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/90 hover:text-[#0ee0f8] font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/courses">
              <Button variant="ghost" className="text-white/90 font-black uppercase tracking-widest text-[10px] hover:text-[#0ee0f8] hover:bg-white/10 px-6">
                Courses
              </Button>
            </Link>
            <Link href="/courses">
              <Button className="bg-[#0ee0f8] hover:bg-white text-[#283593] font-black uppercase tracking-widest text-[10px] px-8 h-10 rounded-xl shadow-lg shadow-[#0ee0f8]/20 transition-all">
                Enroll Now
              </Button>
            </Link>
            <div className="h-8 w-px bg-white/20 mx-2" />
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/90 hover:text-[#0ee0f8] font-medium transition-colors px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Link href="/auth/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#0ee0f8] hover:bg-white text-[#283593]">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
