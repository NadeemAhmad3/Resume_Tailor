// app/components/analysis/FinalResumeBuilder.tsx
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, ClipboardCheck, CheckCircle } from 'lucide-react';

interface FinalResumeBuilderProps {
    acceptedSuggestions: string[];
}

// Re-using the established hover variants for consistency
const cardHoverVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.01,
    y: -4,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

const animatedGlowVariants = {
    initial: { opacity: 0 },
    hover: {
        opacity: 1,
        transition: { duration: 0.5, ease: "circOut" }
    }
};

const backgroundAnimation = {
    initial: {},
    hover: {
        backgroundPosition: ["0% 50%", "150% 50%", "0% 50%"],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "linear",
        }
    }
};

export default function FinalResumeBuilder({ acceptedSuggestions }: FinalResumeBuilderProps) {
    const [copied, setCopied] = useState(false);

    if (acceptedSuggestions.length === 0) {
        return null; // Don't show anything if no suggestions are accepted yet
    }
    
    const handleCopy = () => {
        const textToCopy = acceptedSuggestions.map(s => `• ${s}`).join('\n');
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16"
        >
            {/* Themed and animated header */}
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Your Polished Resume Points
                </h2>
                <motion.div
                    className="mt-2 mx-auto h-1 w-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, originX: 0.5 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
                />
            </div>

            {/* Main container with shimmering hover effect */}
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={cardHoverVariants}
              className="relative rounded-2xl shadow-xl"
            >
              <motion.div 
                  variants={animatedGlowVariants}
                  className="absolute -inset-1 rounded-2xl -z-10"
              >
                  <motion.div 
                      variants={backgroundAnimation}
                      className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] blur-xl rounded-2xl"
                  />
              </motion.div>
                
              <div className="relative p-6 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl">
                  <button
                      onClick={handleCopy}
                      className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-600 rounded-lg transition-all duration-300"
                  >
                      {/* Filled icons for consistency */}
                      {copied ? 
                        <ClipboardCheck size={20} className="text-green-500" fill="currentColor" /> : 
                        <Clipboard size={20} className="text-slate-500" fill="currentColor" />
                      }
                  </button>

                  <ul className="space-y-4 pr-10">
                      {acceptedSuggestions.map((suggestion, index) => (
                          <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.15 }}
                              className="flex items-start gap-3"
                          >
                              {/* Filled icon */}
                              <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} fill="currentColor" />
                              <p className="flex-1 text-slate-700 leading-relaxed">{suggestion}</p>
                          </motion.li>
                      ))}
                  </ul>
              </div>
            </motion.div>
        </motion.div>
    );
}