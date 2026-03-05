import { Card, CardContent } from "@/components/ui/card";
import { FileText, Brain, MessageSquare, Bell } from "lucide-react";

export default function LearningFeatures() {
  const features = [
    {
      icon: FileText,
      title: "Resources",
      description:
        "Access past papers, lecture notes, and videos tailored for your specific course units.",
      color: "bg-blue-50 text-[#283593]",
    },
    {
      icon: MessageSquare,
      title: "Q&A Forum",
      description:
        "Ask questions and get verified answers from your peers and lecturers across departments.",
      color: "bg-orange-50 text-[#F4A800]",
    },
    {
      icon: Brain,
      title: "Quizzes",
      description:
        "Test your knowledge with unit-specific quizzes designed by lecturers to help you prepare.",
      color: "bg-blue-50 text-[#283593]",
    },
    {
      icon: Bell,
      title: "Announcements",
      description:
        "Stay updated with important campus events, course changes, and university news.",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section className="w-full px-4 md:px-12 lg:px-24 py-16 bg-white text-[#283593]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#283593] mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-base text-slate-500 max-w-[800px] mx-auto font-medium">
            AYii University provides a centralized hub for all your academic needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group flex flex-col h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-3xl p-2"
            >
              <CardContent className="pt-8 text-center flex flex-col items-center">
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#283593] mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
