// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import HeroSection from '../components/HeroSection';
import ScrollingLogos from "../components/ScrollingLogos";
import HowItWorks from "../components/how-it-works";
import FeaturesSection from '../components/features';
import Faq from "../components/faq";
import Footer from '../components/footer';
import JobInputSection from '../components/JobInputSection';

export default function Home() {
  const { data: session, status } = useSession();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // This effect logs the user ID to the console when the session is authenticated.
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User successfully navigated to ATS page. User ID:", session.user.id);
    }
  }, [status, session]);

  // This function receives the file from HeroSection and triggers the scroll.
  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setTimeout(() => {
        const jobInputSection = document.getElementById("job-input-section");
        jobInputSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <main>
      {/* This component passes the selected file up via the onFileSelect function. */}
      <HeroSection onFileSelect={handleFileSelect} />

      {/* 
        UPDATED LOGIC:
        - We now check for `uploadedFile` AND `status === "authenticated"` before rendering.
        - This ensures `session.user.id` is available to be passed as a prop.
      */}
      {uploadedFile && status === "authenticated" && (
        <div id="job-input-section">
            <JobInputSection 
              resumeFile={uploadedFile} 
              userId={session.user.id} 
            />
        </div>
      )}
       
       {/* These components remain unchanged. */}
       <ScrollingLogos />
       <HowItWorks />
       <FeaturesSection />
       <Faq />
       <Footer />
    </main>
  )
}