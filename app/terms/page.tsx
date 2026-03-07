"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
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
                Terms of <span className="text-red-400">Service</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Last updated: March 6, 2026
              </p>
              <p className="text-gray-300 mt-4">
                Please read these Terms of Service carefully before using our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black">1. Acceptance of Terms</h2>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using AYii University's platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our platform.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black">2. User Accounts</h2>
                  </div>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.</p>
                  <p>You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Scale className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black">3. Intellectual Property</h2>
                  </div>
                </div>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>The platform and its original content, features, and functionality are owned by AYii University and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                  <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of our content without our express written permission.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black">4. Prohibited Uses</h2>
                  </div>
                </div>
                <div className="space-y-3 text-gray-600">
                  <p className="font-semibold">You may not use our platform:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>• To submit false or misleading information</li>
                    <li>• To upload or transmit viruses or any other type of malicious code</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black">5. Termination</h2>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the platform will immediately cease.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">6. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  In no event shall AYii University, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">7. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which AYii University operates, without regard to its conflict of law provisions.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">8. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• By email: legal@ayiiuniversity.edu</li>
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
