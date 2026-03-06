"use client";

import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 University Avenue", "City, State 12345", "United States"]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (234) 567-8900", "+1 (234) 567-8901", "Mon-Fri 9AM-5PM"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@ayiiuniversity.edu", "admissions@ayiiuniversity.edu", "support@ayiiuniversity.edu"]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 5:00 PM", "Saturday: 10:00 AM - 2:00 PM", "Sunday: Closed"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-black to-gray-800 py-16 text-white lg:py-30 ">
          <div className="container relative z-10 mx-auto px-6 lg:px-12 text-center">
            <Badge className="mb-4 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-4 py-1">
              Get In Touch
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Contact <span className="text-red-400">Us</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm text-gray-300">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                    <info.icon className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="text-sm font-bold text-black mb-2">{info.title}</h3>
                  <div className="space-y-0.5">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-xs text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">
                  Send Us a Message
                </h2>
                <p className="text-sm text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-10 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="h-10 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="resize-none text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm gap-2"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="bg-gray-200 rounded-xl overflow-hidden h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-semibold">Map Integration</p>
                <p className="text-xs text-gray-500">123 University Avenue, City, State 12345</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
