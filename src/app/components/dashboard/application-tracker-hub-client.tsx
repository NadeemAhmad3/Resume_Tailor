"use client"; // This component MUST be a client component for animations.

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

// This component accepts the fetched count as a simple prop.
export default function ApplicationTrackerHubClient({ appliedCount }: { appliedCount: number }) {
  const color = "from-green-500 to-lime-500";
  const textColor = "text-green-700";

  // Your entire original JSX and animation code is preserved here.
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative text-center p-8 rounded-3xl bg-slate-100/70 backdrop-blur-md border border-slate-200/60 shadow-xl h-full cursor-pointer overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
      variants={{ hover: { y: -5, scale: 1.03, rotateY: 2, rotateX: -2 } }}
    >
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-30 blur-xl transition-opacity group-hover:opacity-10`} />
      <motion.div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30 blur-md -z-10`} />

      <motion.div
        variants={{ hover: { scale: 1.1, rotate: 360 } }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`relative w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${color} shadow-lg mx-auto flex items-center justify-center`}
      >
        <BarChart3 className="w-10 h-10 text-white" />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900">Application Tracker</h3>
      <p className="mt-3 text-lg text-gray-600">
        You have <span className="font-bold text-gray-800">{appliedCount}</span> applications in the
        {/* --- THE FIX IS HERE: Added a non-breaking space for guaranteed separation --- */}
         <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}>Applied</span> stage.
      </p>

      <Link href="/tracker" passHref>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`group/btn relative mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm shadow-lg rounded-full font-semibold ${textColor} overflow-hidden`}
        >
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${color}`}
            initial={{ x: "-100%" }}
            variants={{ hover: { x: 0 } }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          />
          <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-white">Go to Tracker</span>
          <ArrowRight className="relative z-10 w-5 h-5 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:text-white" />
        </motion.div>
      </Link>

      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`} initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }} variants={{ hover: { x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [0, 1.2, 0], opacity: [0, 0.7, 0] } }} transition={{ delay: i * 0.1, duration: 0.9 }}/>
        ))}
      </div>
    </motion.div>
  );
}