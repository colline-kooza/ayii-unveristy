"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, UserCheck, Database, Bell } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support. This includes your name, email address, profile information, and academic records."
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to process your enrollments, to communicate with you, and to personalize your learning experience."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You can also object to processing, request data portability, and withdraw consent where applicable."
    },
    {
      icon: Bell,
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-black to-gray-800 py-20 text-white lg:py-24">
          <div className="container relative z-10 mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-5 py-1.5">
                Legal
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Privacy <span className="text-red-400">Policy</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Last updated: March 6, 2026
              </p>
              <p className="text-gray-300 mt-4">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-12">
              {sections.map((section, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                      <section.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-4">{section.title}</h2>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Sections */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">Third-Party Services</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">Children&apos;s Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">Changes to This Privacy Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• By email: privacy@ayiiuniversity.edu</li>
                  <li>• By phone: +1 (234) 567-8900</li>
                  <li>• By mail: 123 University Avenue, City, State 12345</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
