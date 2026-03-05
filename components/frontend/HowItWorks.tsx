import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Register",
      description:
        "Create your account with  AYii University and course details to get personalized content.",
    },
    {
      number: "02",
      title: "Browse",
      description:
        "Find resources, join discussions, and take quizzes specifically for your course units.",
    },
    {
      number: "03",
      title: "Learn",
      description:
        "Download materials, get answers from lecturers, and ace your exams with confidence.",
    },
  ];

  return (
    <section className="relative w-full px-4 md:px-12 lg:px-24 py-24 bg-[#F5F7FA]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tighter sm:text-3xl text-[#283593] mb-4">
            Get started in 3 simple steps
          </h2>
          <p className="text-lg text-slate-500 max-w-[800px] mx-auto font-medium">
            Join the community and start improving your grades today.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-blue-200" />

          <div className="grid gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-blue-50 flex items-center justify-center mb-6 shadow-xl group-hover:border-[#F4A800] transition-colors z-10">
                  <span className="text-3xl font-bold text-[#283593]">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#283593] mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
