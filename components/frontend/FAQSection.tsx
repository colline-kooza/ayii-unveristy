"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-3 border-b border-slate-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-5 text-left focus:outline-none transition-colors hover:text-[#283593] cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-800 group-hover:text-[#283593] transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#F4A800] shrink-0 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="pb-5 text-slate-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQSection() {
  const { data } = useQuery({
    queryKey: ["cms", "homepage", "faqSection"],
    queryFn: async () => {
      const res = await fetch("/api/cms/homepage/faqSection");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (!data) return null;

  return (
    <section className="w-full py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold tracking-tighter sm:text-3xl text-[#283593] mb-4">
            {data.heading || "Got Questions?"}
          </h2>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            {data.subheading || "Everything you need to know about navigating the AYii University platform."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          {data.faqs?.map((faq: any, index: number) => (
            <FAQItem key={faq.id || index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
