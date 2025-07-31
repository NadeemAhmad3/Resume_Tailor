"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Loader2, CheckCircle, User, Briefcase, MessageSquare } from "lucide-react"; // I added User, Briefcase, etc. to match my previous correct version that you liked.
import { UserProfile, updateUserProfile } from "@/app/actions/profile";

// Define the props, allowing the initial profile to be null
interface SettingsClientProps {
  initialProfile: (UserProfile & { _id: string; userId: string }) | null;
}

export default function SettingsClient({ initialProfile }: SettingsClientProps) {
  // State for each form field, initialized with existing data or empty strings
  const [name, setName] = useState(initialProfile?.name || "");
  const [title, setTitle] = useState(initialProfile?.title || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");

  // State to manage the save button's appearance and behavior
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const profileData: UserProfile = { name, title, bio };
    const result = await updateUserProfile(profileData);

    if (result.success) {
      setSaveSuccess(true);
      // Hide the success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } else {
      // Optional: Handle error with a toast or message
      console.error(result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* --- ADDED: Background Glow Blobs (Consistent with your theme) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 h-96 w-96 bg-blue-200/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 100, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-96 w-96 bg-pink-200/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", delay: 5 }}
        />
      </div>

      {/* Header - Unchanged, exactly as you had it */}
      <div className="relative z-10 flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-xl">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500">Manage your personal information.</p>
        </div>
      </div>

      {/* Form Card - Unchanged, exactly as you had it */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-4xl p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/60"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* Inputs with labels are unchanged */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100/80 border border-slate-300/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all shadow-inner"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
              Professional Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Senior Software Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100/80 border border-slate-300/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all shadow-inner"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-bold text-gray-700 mb-2">
              Short Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="A brief summary about your professional background..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100/80 border border-slate-300/70 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all resize-none shadow-inner"
            />
          </div>

          {/* --- CORRECTED: Button is now full width --- */}
          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={isSaving || saveSuccess}
              whileHover={{ scale: 1.02, y: -2, boxShadow: '0 10px 20px rgba(93, 49, 215, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                saveSuccess
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}