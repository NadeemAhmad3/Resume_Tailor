// app/components/analysis/SuggestionCard.tsx
"use client";

import { motion } from 'framer-motion';
import { Check, UserSquare, Sparkles } from 'lucide-react';
import DiffHighlight from './DiffHighlight';

interface SuggestionCardProps {
  original: string;
  suggestion: string;
  onAccept: () => void;
}

// Variants for the card's overall lift-and-scale hover effect
const cardHoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -6,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// Variants to control the visibility of the shimmering glow
const animatedGlowVariants = {
    initial: { opacity: 0 },
    hover: {
        opacity: 0.3, // Reduced opacity for lighter effect
        transition: { duration: 0.5, ease: "circOut" }
    }
};

// Variants that control the movement of the background gradient
const backgroundAnimation = {
    initial: {},
    hover: {
        backgroundPosition: ["0% 50%", "200% 50%", "0% 50%"],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "linear",
        }
    }
};

export default function SuggestionCard({ original, suggestion, onAccept }: SuggestionCardProps) {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardHoverVariants}
      className="relative rounded-2xl shadow-xl"
    >
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT "Original" COLUMN - Updated with lighter colors */}
          <motion.div
            className="p-6 border-b md:border-b-0 md:border-r border-slate-200/60 relative overflow-hidden"
            variants={backgroundAnimation} 
          >
            {/* Updated with lighter gradient colors */}
            <motion.div 
                variants={animatedGlowVariants}
                className="absolute -inset-1 -z-10"
            >
                <div className="w-full h-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 bg-[length:200%_200%] blur-xl" />
            </motion.div>
            
            {/* Content for the left column */}
            <div>
              <h4 className="font-bold text-pink-500 text-sm mb-3 flex items-center gap-2">
                <UserSquare size={18} className="text-purple-400" fill="currentColor" />
                YOUR VERSION
              </h4>
              <p className="text-slate-600 leading-relaxed">{original}</p>
            </div>
          </motion.div>

          {/* RIGHT "Suggestion" COLUMN */}
          <div className="p-6">
            <h4 className="font-bold text-blue-500 text-sm mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-400" fill="currentColor" />
              AI-POWERED SUGGESTION
            </h4>
            <p className="text-slate-800">
              <DiffHighlight originalText={original} suggestedText={suggestion} />
            </p>
          </div>
        </div>
        
        {/* ACTION BAR */}
        <div className="bg-slate-50/20 p-3 flex justify-end items-center">
            <motion.button
              onClick={onAccept}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Check size={18} />
              Accept & Upgrade
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
}