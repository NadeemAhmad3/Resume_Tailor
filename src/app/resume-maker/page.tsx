"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Brush, Eraser, FileText } from "lucide-react";

import ResumeForm from "@/app/components/resume-maker/ResumeForm";
import ResumePreview from "@/app/components/resume-maker/ResumePreview";
import { ResumeData, initialData, blankData } from "@/app/lib/resume-data";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { incrementResumeCreated } from "@/app/actions/stats"; // <-- Import the new server action

export type ThemeName = "NadeemAhmad" | "MaxJohnson";

export default function ResumeMakerPage() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTheme, setActiveTheme] = useState<ThemeName>("NadeemAhmad");

  // CHANGED: The function is now async to allow for the server action call.
  const handleDownloadPdf = async () => {
    const resumeElement = document.getElementById("resume-preview-content");
    if (!resumeElement) return;
  
    // Create a clone with PDF-safe styling
    const clone = resumeElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = '794px'; // A4 width in pixels
    clone.style.backgroundColor = 'white';
    clone.style.minHeight = '1123px'; // A4 height in pixels (297mm)
    document.body.appendChild(clone);
  
    // Convert all colors to PDF-safe formats
    const elements = clone.querySelectorAll('*');
    elements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      
      // Fix background colors
      const bgColor = computedStyle.backgroundColor;
      if (bgColor.includes('gradient') || bgColor.includes('lab')) {
        (el as HTMLElement).style.backgroundColor = 'white';
      }
      
      // Fix text colors
      const textColor = computedStyle.color;
      if (textColor.includes('lab')) {
        (el as HTMLElement).style.color = 'rgb(31, 41, 55)';
      }
      
      // Fix border colors
      const borderColor = computedStyle.borderColor;
      if (borderColor.includes('lab')) {
        (el as HTMLElement).style.borderColor = 'rgb(209, 213, 219)';
      }
    });
  
    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        scrollY: 0,
        windowHeight: clone.scrollHeight,
      });
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      
      const ratio = pdfWidth / imgProps.width;
      const imgWidth = pdfWidth;
      const imgHeight = imgProps.height * ratio;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
      const remainingHeight = imgHeight - pdfHeight;
      if (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -pdfHeight, imgWidth, imgHeight);
      }
  
      pdf.save(`${(data.personal.name || "resume").replace(/ /g, "-")}.pdf`);
  
      // --- START: ADDED SECTION ---
      // After the PDF is successfully saved, call the server action.
      // We don't need to wait for it to complete ("fire and forget").
      incrementResumeCreated().catch(err => {
        // Optional: Log if the server action call itself fails
        console.error("Failed to call incrementResumeCreated:", err);
      });
      // --- END: ADDED SECTION ---
  
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Ensure the clone is always removed
      document.body.removeChild(clone);
    }
  };


  const handleClearForm = () => {
    setData(blankData);
  }

  return (
    <div className="w-full h-full bg-slate-50">
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full h-full p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col min-h-0"
        >
          <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-6 flex-grow overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <FileText className="text-white w-7 h-7" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Resume Editor
                    </h1>
                </div>
                <motion.button 
                    onClick={handleClearForm}
                    whileHover={{ scale: 1.05, y: -2, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 bg-white border border-red-200 hover:bg-red-50 hover:border-red-400 rounded-lg shadow-sm transition-all"
                >
                    <Eraser size={16} className="transition-transform group-hover:rotate-[-15deg]"/>
                    Start New
                </motion.button>
            </div>
            <ResumeForm data={data} setData={setData} activeTheme={activeTheme} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="h-full flex flex-col gap-6"
        >
            <div className="flex-shrink-0 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Brush className="w-6 h-6 text-purple-600"/>
                        <h2 className="text-xl font-bold text-gray-800">Select Theme</h2>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-slate-200 rounded-lg">
                        <button onClick={() => setActiveTheme("NadeemAhmad")} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeTheme === 'NadeemAhmad' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600 hover:bg-slate-300/50'}`}>Modern</button>
                        <button onClick={() => setActiveTheme("MaxJohnson")} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeTheme === 'MaxJohnson' ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600 hover:bg-slate-300/50'}`}>Creative</button>
                    </div>
                </div>
            </div>

            <div className="flex-grow w-full overflow-y-auto custom-scrollbar rounded-lg bg-slate-200/50 border border-slate-300/50 p-4">
                <ResumePreview data={data} theme={activeTheme} />
            </div>

            <motion.button
                onClick={handleDownloadPdf}
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 10px 20px rgba(93, 49, 215, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
                <FileDown />
                Download as PDF
            </motion.button>
        </motion.div>
      </main>
    </div>
  );
}