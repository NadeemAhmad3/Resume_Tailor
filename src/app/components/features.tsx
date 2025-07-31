// components/features.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Target, Zap, Clock } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Keyword Optimization",
    description: "AI scans job postings and injects high-impact ATS keywords to boost visibility and land more interviews.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Action Verb Suggestions",
    description: "Dynamic language engine replaces weak phrasing with powerful verbs that make achievements pop.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Clock,
    title: "Time-Saving",
    description: "Generate a perfectly tailored resume in under 60 seconds—no more hours of manual tweaking.",
    color: "from-amber-500 to-orange-500",
  },
];

export default function FeaturesSection() {
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
            Powerful Features
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
          {features.map((feature, index) => (
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
                whileHover="hover"
                transition={{ type: "spring", stiffness: 300 }}
                className={`relative text-center p-8 rounded-3xl bg-slate-100/70 backdrop-blur-md border border-slate-200/60 shadow-xl group h-full`}
                style={{ transformStyle: "preserve-3d" }}
                variants={{
                  hover: {
                    rotateY: 5,
                    rotateX: -5,
                    scale: 1.05,
                  },
                }}
              >
                {/* glowing gradient border */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-40 blur-md -z-10 transition-opacity duration-500`}
                />

                {/* icon - PRESERVING ORIGINAL HOVER ANIMATION */}
                <motion.div
                  className={`relative w-24 h-24 mb-6 rounded-full bg-gradient-to-br ${feature.color} shadow-2xl mx-auto flex items-center justify-center`}
                  variants={{
                    hover: { scale: 1.1, rotate: 360 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-12 h-12 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* micro-particles on hover */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`}
                      initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }}
                      variants={{
                        hover: {
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          scale: [0, 1.2, 0],
                          opacity: [0, 0.7, 0],
                        },
                      }}
                      transition={{ delay: i * 0.1, duration: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}