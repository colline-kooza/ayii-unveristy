import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, BookOpen, Award, Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Students Enrolled", value: "10,000+", icon: Users },
    { label: "Expert Lecturers", value: "500+", icon: GraduationCap },
    { label: "Courses Available", value: "200+", icon: BookOpen },
    { label: "Success Rate", value: "95%", icon: Award },
  ];

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for academic excellence in everything we do, ensuring the highest quality education for our students."
    },
    {
      icon: Eye,
      title: "Innovation",
      description: "We embrace innovative teaching methods and cutting-edge technology to enhance the learning experience."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We uphold the highest standards of integrity, honesty, and ethical conduct in all our academic pursuits."
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster a supportive and inclusive community where every student can thrive and reach their full potential."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-black to-gray-800 py-20 text-white lg:py-20 ">
          <div className="container relative z-10 mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-red-600/20 text-red-400 border-red-500/30 text-xs font-semibold px-4 py-1">
                About Us
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-bold mb-4">
                Empowering Minds, <br />
                <span className="text-red-400">Shaping Futures</span>
              </h1>
              <p className="text-base text-gray-300 leading-relaxed">
                AYii University is committed to providing world-class education that prepares students for success in an ever-changing global landscape.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 mb-3">
                    <stat.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-1">{stat.value}</h3>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Target className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-black mb-3">Our Mission</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  To provide accessible, high-quality education that empowers students with the knowledge, skills, and values needed to excel in their chosen fields and contribute meaningfully to society.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <Eye className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-black mb-3">Our Vision</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  To be a leading institution of higher learning, recognized globally for academic excellence, innovative research, and producing graduates who are leaders and change-makers in their communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-8">
              <Badge className="mb-3 bg-red-100 text-red-700 text-xs font-semibold px-4 py-1">
                Our Values
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-black mb-3">
                What We Stand For
              </h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Our core values guide everything we do and shape the culture of our institution.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center p-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 mb-3">
                    <value.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-base font-bold text-black mb-2">{value.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-linear-to-r from-red-600 to-red-700 text-white">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm text-red-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already transforming their futures with AYii University.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/courses">
                <button className="px-6 py-2.5 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  Browse Courses
                </button>
              </a>
              <a href="/contact">
                <button className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 transition-colors border border-white/20 text-sm">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
