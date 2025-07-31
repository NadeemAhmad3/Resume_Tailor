"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Briefcase, BookText, Zap, Loader, CheckCircle, AlignLeft, BarChart, AlertCircle } from "lucide-react";

// --- Import the necessary server actions (Unchanged) ---
import { getUserStats, processSuccessfulAnalysis } from "@/app/actions/stats";

// --- Your custom popup component (Unchanged) ---
const NoCreditsPopup = () => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="absolute inset-0 w-full h-full bg-slate-900/40 backdrop-blur-sm" />
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 } }}
      exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.3 } }}
      className="relative flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-8 shadow-2xl border border-slate-200 w-full max-w-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { type: "spring", stiffness: 200, delay: 0.3 } }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center shadow-lg"
      >
        <AlertCircle className="w-8 h-8 text-white" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800">Insufficient Credits</h2>
      <p className="text-gray-600 text-center">You need at least 40 credits to run an analysis.</p>
    </motion.div>
  </motion.div>
);

interface JobInputSectionProps {
  resumeFile: File;
  userId: string;
}

const ANALYSIS_CREDIT_COST = 40;

export default function JobInputSection({ resumeFile, userId }: JobInputSectionProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNoCreditsPopup, setShowNoCreditsPopup] = useState(false);
  const router = useRouter();

  // Your effect to auto-hide the popup (Unchanged)
  useEffect(() => {
    if (showNoCreditsPopup) {
      const timer = setTimeout(() => {
        setShowNoCreditsPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNoCreditsPopup]);

  // --- Code for 3D card tilt effect (Unchanged) ---
  const cardRef = useRef<HTMLDivElement>(null);
  const cardX = useSpring(0, { stiffness: 300, damping: 30 });
  const cardY = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(cardY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    cardX.set(x);
    cardY.set(y);
  };

  const handleCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  // --- Core submission logic (Updated) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) {
      alert("Please fill out both the job title and description.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Step A: Check credits on the client before doing anything else.
      const stats = await getUserStats();
      if ((stats.ai_credits ?? 0) < ANALYSIS_CREDIT_COST) {
        setShowNoCreditsPopup(true); // Trigger the custom popup
        setIsLoading(false);
        return; // Stop the process
      }

      // Step B: If credits are sufficient, continue with the existing logic.
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobTitle", jobTitle);
      formData.append("jobDescription", jobDescription);
      formData.append("userId", userId);

      console.log("Submitting form data for user ID:", userId);

      const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit for analysis. Please try again.");
      }
      
      const result = await response.json();
      const analysisId = result.analysisId;

      if (!analysisId) {
        throw new Error("Server response did not include an analysis ID.");
      }

      // --- THE ONLY CHANGE IS ON THIS LINE ---
      // Step C: On webhook success, call the server action, passing the job details.
      await processSuccessfulAnalysis(jobTitle, jobDescription);
      
      router.push(`/analysis/${analysisId}`);

    } catch (err: unknown) {
     const errorMsg = err instanceof Error ? err.message : "An unknown error occurred. Please try again.";
     setError(errorMsg);
     setIsLoading(false); 
    }
  };

  return (
    <>
      {/* This handles the rendering of the popup (Unchanged) */}
      <AnimatePresence>
        {showNoCreditsPopup && <NoCreditsPopup />}
      </AnimatePresence>

      {/* --- The entire JSX structure below is identical to your original code --- */}
      <section className="relative py-24 px-6 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 h-96 w-96 bg-blue-200/30 rounded-full blur-3xl"
            animate={{
              x: ["-20%", "100%", "-20%"],
              y: ["-20%", "70%", "-20%"],
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
              x: ["120%", "-50%", "120%"],
              y: ["100%", "-20%", "100%"],
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

        <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              One Final Step
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-lg">
              You have uploaded your resume. Now, provide the job details to unlock a detailed, AI-powered analysis of how you measure up.
            </p>
            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg flex items-center justify-center">
                        <BarChart className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">In-Depth Analysis</h3>
                        <p className="text-sm text-gray-600">Get a compatibility score and actionable feedback.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Keyword Matching</h3>
                        <p className="text-sm text-gray-600">Discover if you have the right keywords for ATS.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg flex items-center justify-center">
                        <AlignLeft className="w-6 h-6 text-white"/>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Content Suggestions</h3>
                        <p className="text-sm text-gray-600">Receive tips to improve your resume impact.</p>
                    </div>
                </div>
            </div>
          </motion.div>

          <motion.div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
          >
            <div
              className="p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-2xl"
              style={{ transform: "translateZ(20px)" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Briefcase className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-purple-600 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Job Title (e.g., Senior Frontend Developer)"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white/70 py-3 pl-12 pr-4 text-gray-800 shadow-sm focus:border-transparent focus:ring-2 focus:ring-purple-500/80 focus:outline-none transition-shadow"
                    required
                  />
                </div>

                <div className="relative">
                  <BookText className="absolute top-5 left-4 h-5 w-5 text-purple-600 pointer-events-none" />
                  <textarea
                    placeholder="Paste the job description here..."
                    rows={8}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white/70 py-4 pl-12 pr-4 text-gray-800 shadow-sm focus:border-transparent focus:ring-2 focus:ring-purple-500/80 focus:outline-none transition-shadow"
                    required
                  />
                </div>

                {error && (
                    <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 transition-transform group-hover:animate-ping" />
                      Analyze My Match
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}