// File Path: app/components/analysis/ScoreDisplay.tsx
"use client";

import { motion } from "framer-motion";

interface ScoreDisplayProps {
  score: number;
}

// Card animation variants for a consistent hover effect
const cardHoverVariants = {
  initial: { 
    scale: 1, 
    y: 0 
  },
  hover: {
    scale: 1.03, // Slightly more pop for this central component
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

const glowVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 0.8,
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color and gradient based on score
  const getScoreTheme = () => {
    if (score >= 85) {
      return {
        color: "#22c55e", // green-500
        gradient: "from-green-400 to-blue-400"
      };
    }
    if (score >= 60) {
      return {
        color: "#f59e0b", // amber-500
        gradient: "from-amber-400 to-orange-400"
      };
    }
    return {
      color: "#ef4444", // red-500
      gradient: "from-red-400 to-purple-400"
    };
  };

  const { color: scoreColor, gradient: scoreGradient } = getScoreTheme();

  return (
    <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardHoverVariants}
        className="relative h-full"
    >
        {/* The dynamic glowing border */}
        <motion.div 
            variants={glowVariants}
            className={`absolute -inset-0.5 bg-gradient-to-r ${scoreGradient} rounded-2xl blur-lg opacity-0 -z-10`}
        />

        {/* The actual card content */}
        <div className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg h-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Compatibility Score</h2>
            <div className="relative h-40 w-40">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb" // slate-200
                    strokeWidth="10"
                    fill="transparent"
                    />
                    {/* Progress circle */}
                    <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={scoreColor}
                    strokeWidth="10"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                    className="text-4xl font-bold"
                    style={{ color: scoreColor }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    >
                    {score}
                    </motion.span>
                    <span className="text-sm font-medium text-slate-500">out of 100</span>
                </div>
            </div>
            <p className="text-center text-slate-600 mt-4 text-sm">
                This score reflects the match between your resume and the job description.
            </p>
        </div>
    </motion.div>
  );
};