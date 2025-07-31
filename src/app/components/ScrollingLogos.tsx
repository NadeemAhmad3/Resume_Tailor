// components/ScrollingLogos.tsx
"use client";
import { motion } from "framer-motion";
import { Zap, Layers, Briefcase, FileText } from "lucide-react";

// Define a unique key for the gradient used in the icons
const gradientId = "logo-strip-gradient";

const stripItems = [
  { icon: Briefcase, text: "Industry-Specific Keywords" },
  { icon: Zap, text: "AI-Powered Optimization" },
  { icon: Layers, text: "Multiple Resume Versions" },
  { icon: FileText, text: "ATS-Friendly Templates" },
  { icon: Briefcase, text: "Tailored for Job Descriptions" },
  { icon: Zap, text: "Instant Feedback & Scoring" },
  { icon: Layers, text: "Perfect for Career Changers" },
  { icon: FileText, text: "Export to PDF & DOCX" },
];

// Animation variants for the seamless scroll
const stripVariants = {
  animate: {
    x: ["0%", "-50%"], // Animate from the start to the beginning of the duplicated content
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 35, // A comfortable, elegant scroll speed
        ease: "linear",
      },
    },
  },
};

export default function ScrollingLogos() {
  // The array is duplicated to create the seamless looping effect
  const duplicatedItems = [...stripItems, ...stripItems];

  return (
    // Section with a new background color and less vertical padding for a tighter look
    <section className="w-full bg-slate-100 py-4 overflow-hidden">
      {/* 
        This relative container uses a CSS mask to create the fade-out effect 
        on the left and right edges, making the loop look seamless.
      */}
      <div className="relative" style={{
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}>
        {/* This SVG block defines the gradient used for the icons, it won't be visible */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* This is the motion component that scrolls. 'variants' must be applied here. */}
       <motion.div
  className="flex gap-10 items-center"
  animate={{ x: ["0%", "-50%"] }}
  transition={{
    x: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 35,
      ease: "linear",
    },
  }}
>
  {duplicatedItems.map((item, index) => (
    <div key={index} className="flex items-center flex-shrink-0">
      <item.icon
        className="w-6 h-6 mr-3"
        style={{ fill: `url(#${gradientId})`, strokeWidth: 0 }}
        aria-hidden="true"
      />
      <span className="text-md font-semibold text-gray-700 whitespace-nowrap">
        {item.text}
      </span>
    </div>
  ))}
</motion.div>
      </div>
    </section>
  );
}