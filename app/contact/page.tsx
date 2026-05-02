"use client";

import { useState } from "react";
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const contactInfo = [
  { icon: MapPin,  title: "Visit Us",      details: ["123 University Avenue", "City, State 12345"] },
  { icon: Phone,   title: "Call Us",       details: ["+1 (234) 567-8900", "Mon–Fri 9AM–5PM"] },
  { icon: Mail,    title: "Email Us",      details: ["info@ayiiuniversity.edu", "admissions@ayiiuniversity.edu"] },
  { icon: Clock,   title: "Office Hours",  details: ["Mon–Fri: 9:00 AM – 5:00 PM", "Sat: 10:00 AM – 2:00 PM"] },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

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
            <MessageSquare className="w-3 h-3" />
            Get In Touch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight mb-1">
            Contact
            <span className="ml-2 bg-gradient-to-r from-[#FF6B7A] to-[#FFB3BA] bg-clip-text text-transparent">
              Our Team
            </span>
          </h1>
          <p className="text-xs text-white/55 max-w-sm mx-auto mt-1">
            Have questions? Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <main>
        {/* Info Cards */}
        <section className="py-8 bg-gray-50 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((info, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="h-8 w-8 rounded-lg bg-[#8B1538]/10 flex items-center justify-center mb-2.5">
                    <info.icon className="h-4 w-4 text-[#8B1538]" />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1.5">{info.title}</h3>
                  {info.details.map((d, j) => (
                    <p key={j} className="text-[11px] text-gray-500 leading-relaxed">{d}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-10 bg-white">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-7">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Send Us a Message</h2>
              <p className="text-xs text-gray-500">Our team will get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#8B1538]/40 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#8B1538]/40 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#8B1538]/40 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Message</label>
                <textarea
                  placeholder="Tell us more about your inquiry..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#8B1538]/40 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-[#8B1538] to-[#C41E3A] hover:from-[#C41E3A] hover:to-[#E63946] text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#8B1538]/20 disabled:opacity-60"
              >
                {loading ? "Sending..." : <><Send className="h-4 w-4" />Send Message</>}
              </button>
            </form>
          </div>
        </section>

        {/* Map placeholder */}
        <section className="py-8 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-200 rounded-xl overflow-hidden h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-500">123 University Avenue, City, State 12345</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
