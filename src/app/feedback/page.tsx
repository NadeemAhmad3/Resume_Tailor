"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ThumbsUp, Star, AlertCircle } from "lucide-react";

// Represents the structure of the feedback data
interface FeedbackData {
  type: string;
  rating: number;
  message: string;
  userId?: string;
}

// A separate, styled component for the success popup
const SuccessPopup = () => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Backdrop with the same blur effect from your theme */}
    <div className="absolute inset-0 w-full h-full bg-slate-900/40 backdrop-blur-sm" />

    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 } }}
      exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.3 } }}
      className="relative flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-8 shadow-2xl border border-slate-200 w-full max-w-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360, transition: { type: "spring", stiffness: 200, delay: 0.3 } }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg"
      >
        <ThumbsUp className="w-8 h-8 text-white" />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
      <p className="text-gray-600 text-center">Your feedback helps us improve.</p>
    </motion.div>
  </motion.div>
);


export default function FeedbackPage() {
  const { data: session } = useSession();
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-hide the popup after a delay
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setFormError("Please select a rating before submitting.");
      return;
    }
    if (isSubmitting || !message) return;

    setIsSubmitting(true);
    setFormError(null);

    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating,
      message,
      userId: session?.user?.id,
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFeedbackType("suggestion");
        setRating(0);
        setMessage("");
      } else {
        setFormError("Sorry, an error occurred. Please try again.");
      }
    } catch (error) {
      setFormError("An error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full h-full overflow-y-auto bg-slate-50 p-6 lg:p-12">
      {/* Animated Blob Background - Consistent with your theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 h-96 w-96 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-96 w-96 bg-pink-200/30 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", delay: 5 }}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
            Share Your{" "}
            {/* 1. CORRECTED: Gradient now matches your primary theme */}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Feedback
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">Help us improve the Resume Tailor experience.</p>
        </motion.div>

        {/* 2. CORRECTED: Card width increased to max-w-5xl */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="max-w-5xl mx-auto p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/60"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Feedback Type */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback Type</h3>
              <div className="flex gap-4">
                {["suggestion", "bug", "praise"].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => setFeedbackType(type)}
                    className="relative px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {feedbackType === type ? (
                      <motion.div
                        layoutId="feedback-type-bg"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 hover:bg-slate-200/70 rounded-xl border border-slate-300/70" />
                    )}
                    <span className={`relative capitalize ${feedbackType === type ? 'text-white' : 'text-gray-700'}`}>{type}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Rating - Stars are now a reasonable size */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Rating</h3>
              <div className="flex justify-center items-center gap-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={() => { setRating(i + 1); setFormError(null); }}
                    className="cursor-pointer"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors duration-200 ${
                        i < rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300 hover:text-amber-300"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-2 mt-3 text-red-500 font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{formError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Message</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full h-36 p-4 rounded-xl bg-slate-100/80 border border-slate-300/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all resize-none shadow-inner"
                required
              />
            </div>

            {/* Submit Button - Styled like your Hero button */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Send Feedback"}
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      
      {/* Success Popup Area */}
      <AnimatePresence>
        {isSubmitted && <SuccessPopup />}
      </AnimatePresence>
    </section>
  );
}