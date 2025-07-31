// components/how-it-works.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Upload, ClipboardList, Sparkles, ArrowRight } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: Upload,
    title: "Upload Resume",
    description: "Drag & drop your existing resume or import from LinkedIn",
    color: "from-blue-500 to-cyan-500",
    accent: "bg-blue-500/10",
    glow: "shadow-blue-500/30",
  },
  {
    icon: ClipboardList,
    title: "Paste Job Description",
    description: "Simply paste the job posting - our AI analyzes requirements instantly",
    color: "from-purple-500 to-pink-500",
    accent: "bg-purple-500/10",
    glow: "shadow-purple-500/30",
  },
  {
    icon: Sparkles,
    title: "Get AI-Tailored Results",
    description: "Receive a perfectly optimized resume with ATS keywords & formatting",
    color: "from-amber-500 to-orange-500",
    accent: "bg-amber-500/10",
    glow: "shadow-amber-500/30",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={containerRef} className="relative py-16 px-6 overflow-hidden bg-slate-50">
      {/* animated morphing blobs */}
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], rotate: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2
            className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            How It Works
          </motion.h2>
          <motion.div
            className="mt-2 mx-auto h-1 w-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ scaleX: 0, originX: 0.5 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* animated wavy connector */}
          <svg className="absolute inset-0 w-full h-full hidden lg:block" style={{ zIndex: 0 }}>
            <motion.path
              d="M 16.66% 50% Q 33.33% 30% 50% 50% T 83.33% 50%"
              strokeDasharray="4 4"
              strokeWidth="2"
              className="stroke-gray-300"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              {/* 3D tilt card */}
              <motion.div
                whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative text-center p-8 rounded-3xl bg-slate-100/70 backdrop-blur-md border border-slate-200/60 shadow-xl group`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* glowing gradient border */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-40 blur-md -z-10 transition-opacity duration-500`}
                />

                {/* icon */}
                <motion.div
                  className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} shadow-2xl flex items-center justify-center`}
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {/* OLD-STYLE step badge, nudged slightly left */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                  className={`absolute -top-3 -right-4 -translate-x-1.5 w-12 h-12 rounded-full bg-gradient-to-br ${step.color}
                              text-white font-bold flex items-center justify-center text-lg shadow-lg`}
                >
                  {index + 1}
                </motion.div>

                {/* micro-particles on hover */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`}
                      initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }}
                      whileHover={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        scale: [0, 1.2, 0],
                        opacity: [0, 0.7, 0],
                      }}
                      transition={{ delay: i * 0.1, duration: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* mobile connector */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex justify-center mt-6 lg:hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.6 }}
                >
                  <ArrowRight className="w-7 h-7 text-gray-400 rotate-90" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}