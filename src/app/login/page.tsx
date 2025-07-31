"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle, Loader } from "lucide-react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------
   CONSTANTS
-------------------------------------------------- */
const backgroundImageUrl =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

/* -------------------------------------------------
   MAIN PAGE
-------------------------------------------------- */
export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <Loader className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 font-sans">
        <div className="flex h-full w-full max-w-7xl flex-col overflow-hidden lg:flex-row">
          {/* ------------- LEFT PANEL ------------- */}
          <div className="relative hidden w-1/2 items-center justify-center lg:flex">
            <Image
              src={backgroundImageUrl}
              alt="Abstract purple-pink background"
              fill
              className="object-cover"
              priority
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="relative z-10 rounded-3xl bg-gradient-to-br from-black/40 via-black/30 to-transparent p-12 text-center text-white shadow-2xl backdrop-blur-xl"
            >
              <h1 className="mb-4 text-5xl font-extrabold tracking-tight drop-shadow-[0_0_6px_#e879f9]">
                Welcome Back
              </h1>
              <p className="max-w-sm text-lg text-gray-200 [text-shadow:0_0_4px_#c084fc]">
                Sign in to access your personalized dashboard.
              </p>
            </motion.div>
          </div>

          {/* ------------- RIGHT PANEL (FIXED) ------------- */}
          <div className="relative flex w-full items-center justify-center bg-slate-100 p-8 lg:w-1/2">
            {mounted && (
              <motion.div
                className="pointer-events-none absolute h-72 w-72 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-3xl"
                animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <div className="relative z-10 w-full max-w-md">
              <MagicLinkForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* -------------------------------------------------
   MAGIC LINK FORM
-------------------------------------------------- */
const MagicLinkForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await signIn("email", { email, redirect: false, callbackUrl: "/dashboard" });
      if (res && res.error) {
        setError("Login failed. Please check the email and try again.");
        return;
      }
      setIsSubmitted(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-3xl font-bold text-gray-800">Check your inbox!</h2>
        {/* CORRECTED: The apostrophe is fixed using ' */}
        <p className="mt-2 text-gray-600">
  We&apos;ve sent a magic link to <strong>{email}</strong>. Click the link to sign in.
</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } }}
      className="w-full max-w-md"
    >
      <h2 className="mb-4 text-center text-4xl font-bold text-gray-800">Sign In with Email</h2>
      <p className="mb-8 text-center text-gray-600">
        Enter your email below for a password-free sign-in.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Mail className="h-5 w-5 text-purple-600" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 bg-white/70 py-3 pl-12 pr-4 text-gray-800 shadow-sm placeholder:text-gray-500 focus:border-transparent focus:ring-2 focus:ring-purple-500/80 focus:outline-none"
          />
        </div>
        <ActionButton disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader className="h-6 w-6 animate-spin" />
          ) : (
            <span className="flex items-center justify-center">
              Send Magic Link <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          )}
        </ActionButton>
        {error && <p className="pt-2 text-center text-sm text-red-600">{error}</p>}
      </form>
    </motion.div>
  );
};

/* -------------------------------------------------
   REUSABLE ANIMATED BUTTON (Your original, correct code)
-------------------------------------------------- */
interface ActionButtonProps {
  children: ReactNode;
  disabled?: boolean;
}

const ActionButton = ({ children, disabled = false }: ActionButtonProps) => (
  <motion.button
    type="submit"
    disabled={disabled}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={!disabled ? { backgroundPosition: "400% center", transition: { duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" } } : {}}
    transition={{
      opacity: { duration: 0.4 },
      y: { type: "spring", stiffness: 100 },
    }}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    style={{
      backgroundPosition: "0% center",
      backgroundSize: "400% auto",
    }}
    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 py-3 font-semibold text-white shadow-lg transition-shadow disabled:cursor-not-allowed disabled:opacity-60"
  >
    {children}
  </motion.button>
);