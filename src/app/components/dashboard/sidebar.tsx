// components/dashboard/sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Zap,
  CheckSquare,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
  { name: "ATS Feature Page", href: "/home", icon: Zap, color: "from-amber-500 to-orange-500" },
  { name: "Resume/CV Maker", href: "/resume-maker", icon: CheckSquare, color: "from-indigo-500 to-purple-500" },
  { name: "Application Tracker", href: "/tracker", icon: BarChart3, color: "from-purple-500 to-pink-500" },
  { name: "Feedback", href: "/feedback", icon: MessageSquare, color: "from-teal-500 to-lime-400" },
  { name: "Account Settings", href: "/settings", icon: Settings, color: "from-gray-500 to-gray-600" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-screen bg-slate-100/80 backdrop-blur-md border-r border-slate-200/60 p-6 flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900 tracking-tight">
            Resume
          </span>
          <span
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Tailor
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} isActive={pathname.startsWith(item.href)} />
          ))}
        </ul>
      </nav>

      {/* Footer / User Profile section */}
      <div className="mt-8">
        <div className="w-full h-px bg-slate-300/70 my-4" />
        <a href="#" className="group flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-slate-200/70 transition-colors duration-300">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 group-hover:bg-red-100 transition-colors duration-300">
            <LogOut className="w-6 h-6 text-gray-500 group-hover:text-red-500 transition-colors duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">Log Out</span>
            <span className="text-sm text-gray-500">End your session</span>
          </div>
        </a>
      </div>
    </aside>
  );
}

const NavItem = ({ item, isActive }: {
  item: { name: string, href: string, icon: LucideIcon, color: string },
  isActive: boolean
}) => {
  const { name, href, icon: Icon, color } = item;
  return (
    <li>
      <Link href={href} passHref>
        <motion.div
          className="group relative flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300"
          initial="initial"
          animate={isActive ? "active" : "initial"}
          whileHover="hover" // Always show hover state
        >
          {/* Background Pill - Shows for active and hover states */}
          <motion.div
            layoutId="active-sidebar-background"
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-purple-200/80 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isActive ? 1 : 0,
              backgroundColor: isActive ? "rgba(99, 102, 241, 0.1)" : "rgba(0, 0, 0, 0)"
            }}
            whileHover={{ opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Gradient Icon */}
          <motion.div
            variants={{
              initial: { rotate: 0, scale: 1 },
              hover: { rotate: 5, scale: 1.1 },
              active: { rotate: 0, scale: 1 },
            }}
            className={`relative flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          {/* Text */}
          <motion.span
            variants={{
              initial: { color: "#6b7280" },
              hover: { color: "#1f2937" },
              active: { color: "#1f2937" },
            }}
            className="text-lg font-bold"
          >
            {name}
          </motion.span>
        </motion.div>
      </Link>
    </li>
  );
};