"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#5A0F23] via-[#8B1538] to-[#6B1329] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <img 
                src="/ayii-logo.png" 
                alt="AYii University" 
                className="h-30 w-auto"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering students with quality education and innovative learning experiences. Join us in shaping the future of education.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-[#FFB3BA] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFB3BA] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFB3BA] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#FFB3BA] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/admissions" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/student/courses" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/lecturer/my-courses" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Lecturer Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/library" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Digital Library
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#FFB3BA] mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 University Avenue<br />
                  City, State 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#FFB3BA] shrink-0" />
                <span className="text-gray-300 text-sm">
                  +1 (234) 567-8900
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#FFB3BA] shrink-0" />
                <span className="text-gray-300 text-sm">
                  info@ayiiuniversity.edu
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {currentYear} AYii University. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-[#FFB3BA] transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
