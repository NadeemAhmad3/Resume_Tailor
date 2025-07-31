// components/dashboard/quick-actions.tsx
"use client";
import { motion } from "framer-motion";
import { Plus, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  href: string;
  color: string;
}

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ActionButton
        icon={Plus}
        title="Tailor Resume for a Job"
        href="/ats-checker"
        color="from-blue-500 to-cyan-500"
      />
      <ActionButton
        icon={Plus}
        title="Create New Resume/CV"
        href="/resume-maker"
        color="from-purple-500 to-pink-500"
      />
      <ActionButton
        icon={User}
        title="Manage My Profile"
        href="/profile"
        color="from-green-500 to-lime-500"
      />
    </div>
  );
}

// --- DEFINITIVE CORRECTION ---
// This version correctly inverts the entire card's visual state as requested.
function ActionButton({ icon: Icon, title, href, color }: ActionButtonProps) {
  // Variants to control the swap of background, blob, and text color
  const cardVariants = {
    initial: {
      '--gradient-bg-opacity': 1,
      '--white-bg-opacity': 0,
      '--blob-opacity': 0,
      '--title-color': '#FFFFFF'
    },
    hover: {
      '--gradient-bg-opacity': 0,
      '--white-bg-opacity': 1,
      '--blob-opacity': 0.2,
      '--title-color': '#1f2937' // dark gray
    },
  };

  return (
    <Link href={href} passHref>
      <motion.div
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="group relative flex items-center gap-5 p-5 rounded-2xl h-full cursor-pointer overflow-hidden shadow-lg"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* --- Layer 1: The Glassy White Background (Visible on Hover) --- */}
        <motion.div
          className="absolute inset-0 bg-slate-100/70 backdrop-blur-md border border-slate-200/60"
          style={{ opacity: 'var(--white-bg-opacity)' }}
        />
        
        {/* --- Layer 2: The Full Gradient Background (Visible by Default) --- */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${color}`}
          style={{ opacity: 'var(--gradient-bg-opacity)' }}
        />

        {/* --- The Decorative Blob (Visible on Hover) --- */}
        <motion.div
          className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${color} blur-xl`}
          style={{ opacity: 'var(--blob-opacity)' }}
        />
        
        {/* --- The Glowing Border (Visible on Hover) --- */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} blur-md -z-10`}
          variants={{ initial: { opacity: 0 }, hover: { opacity: 0.3 } }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex items-center gap-5">
          <motion.div
            variants={{ hover: { scale: 1.1, rotate: 360 } }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>

          <motion.h3
            className="text-lg font-bold"
            style={{ color: 'var(--title-color)' }}
          >
            {title}
          </motion.h3>
        </div>

        {/* Particles (Appear on Hover) */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`}
              initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }}
              variants={{ hover: { x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [0, 1.2, 0], opacity: [0, 0.7, 0] } }}
              transition={{ delay: i * 0.1, duration: 0.9 }}
            />
          ))}
        </div>
      </motion.div>
    </Link>
  );
}