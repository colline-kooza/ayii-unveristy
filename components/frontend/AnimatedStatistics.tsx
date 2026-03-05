"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
}

const CountUp = ({ value, label, suffix = "+" }: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const displayValue = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="text-center p-8">
      <div className="text-2xl md:text-3xl font-extrabold text-[#283593] mb-2 flex items-center justify-center">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
};

export default function AnimatedStatistics() {
  return (
    <section className="w-full bg-[#F5F7FA] py-7">
      <div className="container px-4 md:px-12 lg:px-24">
        <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <CountUp value={3000} label="Students" />
          <CountUp value={500} label="Resources" />
          <CountUp value={200} label="Questions Answered" />
        </div>
      </div>
    </section>
  );
}
