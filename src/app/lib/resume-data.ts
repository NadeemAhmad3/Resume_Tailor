// /lib/resume-data.ts
import { v4 as uuidv4 } from 'uuid';

// --- INTERFACES ---
export interface PersonalData {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  remote: boolean;
  profilePicture: string | null;
  profile: string;
}

export interface EducationData {
  id: string;
  degree: string;
  school: string;
  start: string;
  end: string;
  location: string;
}

export interface ProjectData {
    id: string;
    name: string;
    platform: string;
    description: string;
    start: string;
    end: string;
}

// NEW: Interface for certificates
export interface CertificateData {
    id: string;
    name: string;
    issuer: string;
    date: string;
}

export interface Skill {
    id:string;
    name: string;
}

export interface ResumeData {
  personal: PersonalData;
  education: EducationData[];
  projects: ProjectData[];
  certificates: CertificateData[]; // ADDED: Certificates array
  skills: {
      languages: Skill[];
      fullstack: Skill[];
      database: Skill[];
      architecture: Skill[];
      webscraping: Skill[];
  };
  interests: string;
}


// --- BLANK & INITIAL DATA ---
export const blankData: ResumeData = {
    personal: { name: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "", remote: false, profilePicture: null, profile: "" },
    education: [],
    projects: [],
    certificates: [], // ADDED
    skills: { languages: [], fullstack: [], database: [], architecture: [], webscraping: [] },
    interests: "",
}


export const initialData: ResumeData = {
  personal: {
    name: "Nadeem Ahmad",
    jobTitle: "Web Developer",
    email: "onedaysuccussfull@gmail.com",
    phone: "03117133585",
    location: "Chiniot, Punjab, Pakistan",
    linkedin: "www.linkedin.com/in/nadeem-ahmad-53abb4323",
    remote: true,
    profilePicture: null,
    profile: "Experienced Web Developer specializing in the MERN stack and modern web technologies. Passionate about building intuitive, high-performance applications and solving complex problems with clean, efficient code.",
  },
  education: [
    { id: "edu1", degree: "Software Engineering in", school: "FAST NUCES", start: "Aug '22", end: "Present", location: "Faisalabad" },
    { id: "edu2", degree: "Pre Engineering in", school: "NJA", start: "Aug '20", end: "May '22", location: "Chiniot" },
  ],
  projects: [
    { id: "proj1", name: "EduConnect Pakistan", platform: "MERN Stack Tutoring Platform", description: "Developed a full-stack tutoring platform using MERN stack. Built core features for students, tutors, and admins, including role-based authentication and RESTful APIs.", start: "Apr '25", end: "Apr '25" },
    { id: "proj2", name: "Course Registration System", platform: "Conflict-Free Academic Scheduling", description: "Designed and built a modern course registration system to prevent schedule conflicts and registration errors, featuring live seat availability and a prerequisite checker.", start: "Mar '25", end: "Mar '25" }
  ],
  // ADDED: Sample certificate data
  certificates: [
    { id: "cert1", name: "Responsive Web Design", issuer: "freeCodeCamp", date: "Jan 2024" },
    { id: "cert2", name: "APIs and Microservices", issuer: "freeCodeCamp", date: "Mar 2024" },
  ],
  skills: {
    languages: [{id: "sk1", name: "Java"}, {id: "sk2", name: "Python"}, {id: "sk3", name: "JavaScript (ES6+)"}],
    fullstack: [{id: "sk4", name: "MERN Stack"}, {id: "sk5", name: "RESTful API Design"}, {id: "sk6", name: "OAuth 2.0"}],
    database: [{id: "sk7", name: "MongoDB"}, {id: "sk8", name: "MySQL"}, {id: "sk9", name: "Normalization"}],
    architecture: [{id: "sk10", name: "SOLID Principles"}],
    webscraping: [{id: "sk11", name: "BeautifulSoup"}],
  },
  interests: "Autonomous Trading Agent (FYP – In Progress): Designing an intelligent agent capable of analyzing market data and executing trades using algorithmic strategies.",
};