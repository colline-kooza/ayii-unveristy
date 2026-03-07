"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { Cookie, Settings, BarChart, Shield, Globe } from "lucide-react";

export default function CookiesPage() {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.",
      examples: ["Session cookies", "Authentication cookies", "Security cookies"]
    },
    {
      icon: BarChart,
      title: "Analytics Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.",
      examples: ["Google Analytics", "Usage statistics", "Performance monitoring"]
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.",
      examples: ["Language preferences", "Region selection", "User interface customization"]
    },
    {
      icon: Globe,
      title: "Marketing Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.",
      examples: ["Advertising cookies", "Social media cookies", "Targeting cookies"]
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
                Cookie <span className="text-red-400">Policy</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Last updated: March 6, 2026
              </p>
              <p className="text-gray-300 mt-4">
                This Cookie Policy explains how AYii University uses cookies and similar technologies to recognize you when you visit our platform.
              </p>
            </div>
          </div>
        </section>

        {/* What Are Cookies */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl border border-gray-200 mb-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Cookie className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-4">What Are Cookies?</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Cookies set by the website owner (in this case, AYii University) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies."
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookie Types */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-black mb-8">Types of Cookies We Use</h2>
                {cookieTypes.map((type, index) => (
                  <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <type.icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-black mb-3">{type.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{type.description}</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                          <ul className="space-y-1">
                            {type.examples.map((example, idx) => (
                              <li key={idx} className="text-sm text-gray-600">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Managing Cookies */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 mt-12">
                <h2 className="text-2xl font-bold text-black mb-4">How to Manage Cookies</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
                  </p>
                  <p className="font-semibold text-black">Browser Controls:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• Chrome: Settings → Privacy and security → Cookies and other site data</li>
                    <li>• Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                    <li>• Safari: Preferences → Privacy → Cookies and website data</li>
                    <li>• Edge: Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>
              </div>

              {/* Third-Party Cookies */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 mt-6">
                <h2 className="text-2xl font-bold text-black mb-4">Third-Party Cookies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the platform and deliver advertisements on and through the platform.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  These third-party services have their own privacy policies addressing how they use such information. We encourage you to review their privacy policies to understand how they collect and use your information.
                </p>
              </div>

              {/* Updates */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 mt-6">
                <h2 className="text-2xl font-bold text-black mb-4">Updates to This Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 mt-6">
                <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about our use of cookies, please contact us:
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
