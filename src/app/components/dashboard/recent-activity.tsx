// components/dashboard/recent-activity.tsx
"use client";
import { motion } from "framer-motion";
import { ArrowRight, History, FileText } from "lucide-react";

const recentActivities = [
  { title: "Senior Frontend Developer", company: "Vercel", color: "from-blue-500 to-cyan-500" },
  { title: "Product Designer", company: "GitHub", color: "from-purple-500 to-pink-500" },
  { title: "Full-Stack Engineer", company: "Stripe", color: "from-indigo-500 to-purple-500" },
];

export default function RecentActivity() {
  const cardColor = "from-amber-500 to-orange-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative text-center p-6 rounded-3xl bg-white shadow-2xl h-full overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
      variants={{ hover: { y: -5, scale: 1.03, rotateY: 2, rotateX: -2 } }}
    >
      {/* --- CORRECTED: Increased default opacity for more presence --- */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${cardColor} opacity-30 blur-xl transition-opacity group-hover:opacity-10`} />
      <motion.div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${cardColor} opacity-0 group-hover:opacity-30 blur-md -z-10`} />

      {/* --- CORRECTED: Added 360-degree rotation to main icon --- */}
      <motion.div
        variants={{ hover: { scale: 1.1, rotate: 360 } }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`relative w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${cardColor} shadow-lg mx-auto flex items-center justify-center`}
      >
        <History className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recently Tailored</h3>

      <div className="flex flex-col space-y-2 text-left">
        {recentActivities.map((activity) => (
          <div key={activity.title} className="group/item flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/70 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${activity.color} rounded-lg shadow-sm`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.company}</p>
              </div>
            </div>
            <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 cursor-pointer overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-r ${activity.color} opacity-0 group-hover/item:opacity-100 transition-opacity duration-300`} />
              <ArrowRight className="relative w-4 h-4 text-gray-600 group-hover/item:text-white transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className={`absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cardColor}`} initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }} variants={{ hover: { x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [0, 1.2, 0], opacity: [0, 0.7, 0] } }} transition={{ delay: i * 0.1, duration: 0.9 }}/>
        ))}
      </div>
    </motion.div>
  );
}