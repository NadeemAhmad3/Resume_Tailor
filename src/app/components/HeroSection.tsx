// components/hero.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Upload, Zap, Layers } from "lucide-react";

const heroPhrases = [
  "Tailored for the job you want",
  "Optimized for ATS systems",
  "Crafted by AI, perfected by you",
];

// 1. DEFINE PROPS: The component will now accept a function from its parent.
interface HeroSectionProps {
  onFileSelect: (file: File) => void;
}

// 2. ACCEPT PROPS: The component's function signature is updated to accept props.
export default function HeroSection({ onFileSelect }: HeroSectionProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  // 3. REMOVED STATE: The local state for the uploaded file is no longer needed here.
  // const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mouse position for spotlight effect (No changes)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Rotating phrase (No changes)
  useEffect(() => {
    const t = setInterval(() => {
      setPhraseIndex((p) => (p + 1) % heroPhrases.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // 4. UPDATED HANDLER: Instead of setting local state, this function now calls the prop
  // to pass the selected file up to the parent component.
  const handleFile = (file: File) => {
    onFileSelect(file);
  };

  // For the interactive card tilt effect (No changes)
  const cardRef = useRef<HTMLDivElement>(null);
  const cardX = useSpring(0, { stiffness: 300, damping: 30 });
  const cardY = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(cardY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(cardX, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  return (
    <section className="relative w-full h-screen overflow-hidden bg-slate-50">
      {/* All styling and animation elements are unchanged */}
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-lg transition duration-300"
        style={{
          background: `radial-gradient(600px at ${mouseX.get()}px ${mouseY.get()}px, rgba(167, 139, 250, 0.15), transparent 80%)`,
        }}
      />
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

      {/* Content (No changes to layout or text) */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Resume
              </span>{" "}
              Into Opportunities
            </h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="mt-5 text-xl text-gray-600"
              >
                {heroPhrases[phraseIndex]}
              </motion.p>
            </AnimatePresence>

            <motion.div
              className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Upload Resume
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-gray-300 rounded-2xl font-semibold text-gray-700 hover:border-purple-400 hover:text-purple-600 transition"
              >
                Try Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Interactive Card */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className={`relative w-full max-w-md p-8 bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 transition-all duration-300 ${
                isDragging ? "scale-105 shadow-purple-300/40" : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                e.dataTransfer.files[0] &&
                  handleFile(e.dataTransfer.files[0]);
              }}
            >
              <div className="text-center space-y-5" style={{ transform: "translateZ(20px)" }}>
                <motion.div
                  className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ transform: "translateZ(40px)" }}
                >
                  <Upload className="w-14 h-14 text-purple-600" />
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Drop your resume here
                  </h3>
                  <p className="text-gray-600 mt-1">
                    or{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-purple-600 underline"
                    >
                      browse
                    </button>
                  </p>
                </div>

                {/* 5. REMOVED JSX: The upload confirmation message is gone from here.
                    The parent page will handle the user feedback by showing the new section. */}
              </div>

              {/* Animated corner accents (No changes) */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translateZ(50px)" }}
              >
                <Zap className="w-8 h-8 text-purple-400" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translateZ(50px)" }}
              >
                <Layers className="w-8 h-8 text-blue-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Subtle wave animation at bottom (No changes) */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="url(#gradient)"
            fillOpacity="0.3"
            d="M0,160 C320,300,420,300,740,160 C1060,20,1160,20,1440,160 L1440,320 L0,320 Z"
            animate={{
              d: [
                "M0,160 C320,300,420,300,740,160 C1060,20,1160,20,1440,160 L1440,320 L0,320 Z",
                "M0,180 C320,260,420,260,740,180 C1060,100,1160,100,1440,180 L1440,320 L0,320 Z",
                "M0,160 C320,300,420,300,740,160 C1060,20,1160,20,1440,160 L1440,320 L0,320 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}