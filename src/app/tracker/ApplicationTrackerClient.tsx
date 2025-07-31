"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ChevronDown, ClipboardList, Briefcase, Check, X, FileText, BadgeDollarSign, Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/stats"; // 1. Import the new action

// --- Define types and helpers ---
type TrackedApplication = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  status: string;
  createdAt: string;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const STATUS_OPTIONS = [
  { value: "Analyzed", label: "Analyzed", icon: FileText, color: "text-blue-600" },
  { value: "Applied", label: "Applied", icon: Check, color: "text-indigo-600" },
  { value: "Interviewing", label: "Interviewing", icon: Briefcase, color: "text-purple-600" },
  { value: "Offer", label: "Offer", icon: BadgeDollarSign, color: "text-green-600" },
  { value: "Rejected", label: "Rejected", icon: X, color: "text-red-600" },
];

const statusStyles: { [key: string]: string } = {
  Analyzed: "bg-blue-100 text-blue-800 border-blue-200",
  Applied: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Interviewing: "bg-purple-100 text-purple-800 border-purple-200",
  Offer: "bg-green-100 text-green-800 border-green-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

// --- 2. NEW COMPONENT: Interactive Status Dropdown ---
const StatusDropdown = ({
  appId,
  currentStatus,
  onStatusChange,
}: {
  appId: string;
  currentStatus: string;
  onStatusChange: (appId: string, newStatus: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) return setIsOpen(false);

    setIsUpdating(true);
    const result = await updateApplicationStatus(appId, newStatus);
    if (result.success) {
      onStatusChange(appId, newStatus);
    } else {
      // Optional: Show an error toast if the update fails
      console.error(result.error);
    }
    setIsUpdating(false);
    setIsOpen(false);
  };

  const CurrentIcon = STATUS_OPTIONS.find(opt => opt.value === currentStatus)?.icon || FileText;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`flex items-center justify-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border transition-colors duration-200 w-32 ${statusStyles[currentStatus] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
      >
        {isUpdating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <CurrentIcon className="w-3 h-3" />
            <span>{currentStatus}</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200/80 z-10"
          >
            <ul className="p-2">
              {STATUS_OPTIONS.map(option => (
                <li key={option.value}>
                  <button
                    onClick={() => handleUpdate(option.value)}
                    className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-slate-200/60 rounded-lg"
                  >
                    <option.icon className={`w-4 h-4 ${option.color}`} />
                    <span>{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. UPDATED COMPONENT: The card now uses the new dropdown ---
const ApplicationCard = ({ app, onStatusChange }: { app: TrackedApplication, onStatusChange: (appId: string, newStatus: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg"
    >
      <div className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6 text-white"/>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">{app.jobTitle}</h3>
                <p className="text-sm text-gray-500">Tracked on: {formatDate(app.createdAt)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
            <StatusDropdown appId={app._id} currentStatus={app.status} onStatusChange={onStatusChange} />
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
            </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-slate-200">
              <h4 className="font-semibold text-gray-700 mb-2">Job Description</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-slate-100 p-4 rounded-lg">
                {app.jobDescription}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- 4. UPDATED COMPONENT: The main component now handles state updates ---
export default function ApplicationTrackerClient({
  initialApplications,
}: {
  initialApplications: TrackedApplication[];
}) {
  const [applications, setApplications] = useState(initialApplications);

  const handleStatusUpdate = (appId: string, newStatus: string) => {
    // Optimistic UI update: Update the state immediately for a fast user experience.
    setApplications(currentApps =>
      currentApps.map(app =>
        app._id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Application Tracker</h1>
            <p className="text-gray-500">{applications.length} Jobs Tracked</p>
          </div>
        </div>
      </div>

      {applications.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {applications.map((app) => (
            <ApplicationCard key={app._id} app={app} onStatusChange={handleStatusUpdate} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white/50 border-2 border-dashed border-slate-300 rounded-2xl">
          <ClipboardList className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">No Applications Tracked Yet</h2>
          <p className="text-gray-500 mt-2">
            When you analyze a job, it will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}