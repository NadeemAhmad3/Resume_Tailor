// components/faq.tsx
"use client";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { Shield, Cpu, FileText, RefreshCw, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is my data private?",
    a: "Absolutely. Your resume and job descriptions are processed in-memory only and are never stored on our servers. All data is encrypted in transit and automatically purged after each session.",
    icon: Shield,
    color: "from-blue-500 to-cyan-500",
  },
  {
    q: "What AI technology do you use?",
    a: "We leverage cutting-edge GPT-4 and proprietary NLP models trained specifically on hiring data. This enables precise keyword matching, semantic understanding of job requirements, and natural language optimization.",
    icon: Cpu,
    color: "from-purple-500 to-pink-500",
  },
  {
    q: "Will it pass ATS systems?",
    a: "Yes. Our AI is trained on real ATS parsing algorithms and ensures your resume includes relevant keywords, proper formatting, and optimal structure for maximum compatibility.",
    icon: HelpCircle,
    color: "from-amber-500 to-orange-500",
  },
  {
    q: "Which file formats are supported?",
    a: "We support PDF, DOCX, and plain text formats. Your tailored resume can be exported as PDF, DOCX, or copied directly to clipboard with formatting preserved.",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
  },
  {
    q: "How often can I use it?",
    a: "Unlimited! Generate as many tailored versions as you need. Our system learns from each interaction to provide increasingly personalized suggestions.",
    icon: RefreshCw,
    color: "from-indigo-500 to-purple-500",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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

      <motion.div style={{ opacity }} className="relative z-10 max-w-4xl mx-auto">
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
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            className="mt-2 mx-auto h-1 w-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ scaleX: 0, originX: 0.5 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
          />
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="overflow-hidden rounded-2xl bg-slate-100/70 backdrop-blur-md border border-slate-200/60 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="relative p-5 cursor-pointer flex items-center gap-4"
                >
                  <motion.div
                    className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${faq.color} shadow-md flex items-center justify-center`}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <h3 className="flex-1 text-lg font-bold text-gray-900 pr-8">{faq.q}</h3>
                  
                  {/* --- CORRECTED: Size reduced to w-5 h-5 --- */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 right-5 w-5 h-5"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-500" />
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-500" />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-gray-600 leading-relaxed ml-16">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}