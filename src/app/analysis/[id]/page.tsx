// File Path: app/analysis/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { Loader, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Import your new and existing components
import SuggestionCard from "@/app/components/analysis/SuggestionCard";
import FinalResumeBuilder from "@/app/components/analysis/FinalResumeBuilder";
import ScoreDisplay from "@/app/components/analysis/ScoreDisplay";

interface AnalysisData {
  score: number;
  summary: string;
  skillAnalysis: {
    skillsToEmphasize: string[];
    potentialGaps: string[];
  };
  bulletPointSuggestions: BulletPointSuggestion[];
}

interface BulletPointSuggestion {
  id: string;
  original: string;
  suggestion: string;
}

// Card animation variants for a consistent and enhanced hover effect
const cardHoverVariants = {
  initial: { 
    scale: 1, 
    y: 0 
  },
  hover: {
    scale: 1.02,
    y: -6,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// Variants for the static glowing borders
const staticGlowVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 0.8,
    transition: { duration: 0.4, ease: "easeInOut" }
  }
}

// Variants for the new ANIMATED glowing border
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

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [remainingSuggestions, setRemainingSuggestions] = useState<BulletPointSuggestion[]>([]);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analysis/${id}`);
        if (!response.ok) throw new Error("Failed to fetch analysis data.");
        
        const result: AnalysisData = await response.json();
        setData(result);
        setRemainingSuggestions(result.bulletPointSuggestions);

      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  
  const handleAccept = (suggestion: BulletPointSuggestion) => {
    setAcceptedSuggestions(prev => [...prev, suggestion.suggestion]);
    setRemainingSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };


  if (loading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-slate-50">
        <Loader className="h-16 w-16 animate-spin text-purple-600" />
        <p className="mt-4 text-lg text-gray-600">Performing AI analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 text-center p-8">Error: {error || "Analysis data could not be loaded."}</div>;
  }
  
  return (
    <main className="relative min-h-screen bg-slate-50 p-6 md:p-12 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute top-0 left-0 h-96 w-96 bg-blue-200/30 rounded-full blur-3xl"
              animate={{
                  x: [0, typeof window !== 'undefined' ? window.innerWidth - 384 : 0, 0],
                  y: [0, typeof window !== 'undefined' ? window.innerHeight - 384 : 0, 0],
                  scale: [1, 1.2, 1],
              }}
              transition={{
                  duration: 30,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-96 w-96 bg-pink-200/30 rounded-full blur-3xl"
              animate={{
                  x: [0, typeof window !== 'undefined' ? -(window.innerWidth - 384) : 0, 0],
                  y: [0, typeof window !== 'undefined' ? -(window.innerHeight - 384) : 0, 0],
                  scale: [1, 1.1, 1],
              }}
              transition={{
                  duration: 25,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: 5,
              }}
            />
        </div>

      <div className="relative z-10 max-w-6xl mx-auto pb-24">
        {/* --- Header --- */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Resume Analysis
          </h1>
          <motion.div
            className="mt-2 mx-auto h-1 w-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ scaleX: 0, originX: 0.5 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
          />
        </motion.div>
        
        {/* --- Score & Summary Section --- */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
                <ScoreDisplay score={data.score} />
            </motion.div>
            
            <motion.div
                initial="initial"
                whileHover="hover"
                variants={cardHoverVariants}
                className="relative lg:col-span-2"
            >
                {/* The new animated glowing border */}
                <motion.div 
                    variants={animatedGlowVariants}
                    className="absolute -inset-1 rounded-2xl -z-10"
                >
                    <motion.div 
                        variants={backgroundAnimation}
                        className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_200%] blur-lg rounded-2xl"
                    />
                </motion.div>
                
                {/* The card content with slightly increased opacity and blur */}
                <div className="p-6 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg h-full">
                    <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Sparkles className="text-purple-500" />
                        AI Summary
                    </h2>
                    <p className="text-slate-600 leading-relaxed">{data.summary}</p>
                </div>
            </motion.div>
        </div>

        {/* --- Skill Gap Analysis --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                    initial="initial"
                    whileHover="hover"
                    variants={cardHoverVariants}
                    className="relative"
                >
                    <motion.div 
                        variants={staticGlowVariants}
                        className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl blur-lg opacity-0 -z-10"
                    />
                    <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg h-full">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-slate-800"><CheckCircle className="text-green-500" /> Skills to Emphasize</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skillAnalysis.skillsToEmphasize.map(skill => (
                                <motion.span 
                                    key={skill} 
                                    className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer"
                                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "#dcfce7" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial="initial"
                    whileHover="hover"
                    variants={cardHoverVariants}
                    className="relative"
                >
                    <motion.div 
                        variants={staticGlowVariants}
                        className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-purple-400 rounded-2xl blur-lg opacity-0 -z-10"
                    />
                    <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg h-full">
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-slate-800"><AlertTriangle className="text-red-500" /> Potential Gaps</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skillAnalysis.potentialGaps.map(skill => (
                                <motion.span 
                                    key={skill} 
                                    className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer"
                                    whileHover={{ scale: 1.05, y: -2, backgroundColor: "#fee2e2" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>

        {/* --- Bullet Point Suggestions --- */}
        <div className="mt-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-10"
            >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Actionable Suggestions
                </h2>
                <motion.div
                    className="mt-2 mx-auto h-1 w-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ scaleX: 0, originX: 0.5 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
                />
            </motion.div>
            <div className="space-y-6">
                {remainingSuggestions.map((suggestion, index) => (
                    <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <SuggestionCard 
                            original={suggestion.original}
                            suggestion={suggestion.suggestion}
                            onAccept={() => handleAccept(suggestion)}
                        />
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- Final Resume Builder --- */}
        <FinalResumeBuilder acceptedSuggestions={acceptedSuggestions} />

      </div>
    </main>
  );
}