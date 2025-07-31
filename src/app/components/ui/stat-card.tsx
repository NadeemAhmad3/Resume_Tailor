// components/ui/stat-card.tsx
"use client";
import { motion } from "framer-motion";
import { LucideIcon, FileText, Briefcase, Star, Bot } from "lucide-react";

// ADDED: A map to look up icon components based on the string name.
const iconMap: { [key: string]: LucideIcon } = {
  FileText,
  Briefcase,
  Star,
  Bot,
};

interface StatCardProps {
  // CHANGED: The prop is now `iconName`, a string.
  iconName: string;
  label: string;
  value: string | number;
  color: string;
}

export default function StatCard({
  iconName,
  label,
  value,
  color,
}: StatCardProps) {
  // ADDED: Look up the component from the map.
  const Icon = iconMap[iconName];

  // A fallback in case an invalid name is passed.
  if (!Icon) {
    return null;
  }

  return (
    <motion.div
      whileHover="hover"
      transition={{ type: "spring", stiffness: 300 }}
      className={`group relative p-6 rounded-2xl bg-slate-100/70 backdrop-blur-md border border-slate-200/60 shadow-lg overflow-hidden`}
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        hover: {
          y: -5,
          rotateY: 5,
          rotateX: -5,
          scale: 1.05,
        },
      }}
    >
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${color} opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-10`} />

      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30 blur-md -z-10 transition-opacity duration-500`}
      />
      
      <div className="relative z-10 text-center">
        <motion.div
          variants={{
            hover: {
              scale: 1.1,
              rotate: 360,
            },
          }}
          transition={{ duration: 0.5 }}
          className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} mx-auto shadow-lg`}
        >
          {/* The correct icon component is rendered here */}
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color}`}
            initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }}
            variants={{
              hover: {
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1.2, 0],
                opacity: [0, 0.7, 0],
              },
            }}
            transition={{ delay: i * 0.1, duration: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  );
}