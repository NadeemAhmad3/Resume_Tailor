// app/dashboard/dashboard-client.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

import Sidebar from "@/app/components/dashboard/sidebar";

// This component now contains all the client-side logic.
// It accepts `children`, which will be our server-rendered components.
export default function DashboardClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // This effect remains crucial for redirecting the user.
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // This loader logic correctly handles the auth states.
  if (status !== "authenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader className="h-16 w-16 animate-spin text-purple-600" />
      </div>
    );
  }

  // This code will only be reached if the user is authenticated.
  return (
    <div className="flex bg-slate-50 h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8 pb-8"
          >
            {/* The server-rendered components (like AtAGlance) are placed here */}
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}