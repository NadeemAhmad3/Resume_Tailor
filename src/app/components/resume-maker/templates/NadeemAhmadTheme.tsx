// /components/resume-maker/templates/NadeemAhmadTheme.tsx
import { ResumeData, Skill } from '@/app/lib/resume-data'; // Corrected import path
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';

export default function NadeemAhmadTheme({ data }: { data: ResumeData }) {
    return (
        <div className="p-8 font-sans text-gray-800 bg-white text-[10pt] leading-normal">
            <header className="text-center mb-6">
                <h1 className="text-5xl font-bold">{data.personal.name || "Your Name"}</h1>
                {/* UPDATED: Added Job Title */}
                <p className="text-xl font-light mt-1">{data.personal.jobTitle || "Your Title"}</p>
                <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm mt-3 text-gray-600">
                    <span className="flex items-center gap-1.5"><Phone size={14} />{data.personal.phone}</span>
                    <span className="flex items-center gap-1.5"><Mail size={14} />{data.personal.email}</span>
                    <span className="flex items-center gap-1.5"><Linkedin size={14} />{data.personal.linkedin}</span>
                    <span className="flex items-center gap-1.5"><Globe size={14} />{data.personal.location} {data.personal.remote && '• Open to Remote'}</span>
                </div>
            </header>

            <Section title="EDUCATION">
                 {data.education.map(edu => (
                    <div key={edu.id} className="flex justify-between items-start mb-2">
                       <div>
                            <span className="font-bold">{edu.degree}</span>, {edu.school}
                       </div>
                       <div className="text-right flex-shrink-0 ml-4">
                           <p className="font-semibold">{edu.start} – {edu.end}</p>
                           <p className="text-sm text-gray-500">{edu.location}</p>
                       </div>
                    </div>
                 ))}
            </Section>

            <Section title="PROJECTS">
                {data.projects.map(proj => (
                    <div key={proj.id} className="mb-4 break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-lg font-bold">{proj.name} – <span className="font-medium text-base">{proj.platform}</span></h3>
                            <p className="text-sm font-semibold flex-shrink-0 ml-4">{proj.start} – {proj.end}</p>
                        </div>
                        <p className="text-sm leading-relaxed">{proj.description}</p>
                    </div>
                ))}
            </Section>

            {/* NEW: Added Certificates section */}
            {data.certificates && data.certificates.length > 0 && (
                <Section title="CERTIFICATES">
                    {data.certificates.map(cert => (
                        <div key={cert.id} className="mb-2">
                             <p>
                                <span className="font-bold">{cert.name}</span> - <span className="italic">{cert.issuer}</span>
                                <span className="float-right font-semibold">{cert.date}</span>
                            </p>
                        </div>
                    ))}
                </Section>
            )}

            <Section title="SKILLS">
                {/* UPDATED: Pass the correct data to SkillLine */}
                <SkillLine title="Programming Languages" skills={data.skills.languages} />
                <SkillLine title="Full-Stack & Web" skills={data.skills.fullstack} />
                <SkillLine title="Database Technologies" skills={data.skills.database} />
                <SkillLine title="Software Architecture" skills={data.skills.architecture} />
                <SkillLine title="Web Scraping" skills={data.skills.webscraping} />
            </Section>

            {data.interests && (
                <Section title="INTERESTS">
                    <p className="text-sm leading-relaxed">{data.interests}</p>
                </Section>
            )}
        </div>
    );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
        <h2 className="text-xs font-extrabold text-gray-900 tracking-widest uppercase border-b-2 border-gray-800 pb-1 mb-2">{title}</h2>
        {children}
    </div>
);

// UPDATED: This component now correctly handles the Skill[] object array
const SkillLine = ({ title, skills }: { title: string, skills: Skill[] }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="flex items-start text-sm mb-1">
            <p className="font-bold w-1/4 flex-shrink-0">{title}</p>
            {/* FIX: map over the array of objects to get the name, then join */}
            <p className="w-3/4">{skills.map(s => s.name).join(' • ')}</p>
        </div>
    )
};