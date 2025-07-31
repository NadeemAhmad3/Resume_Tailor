// /components/resume-maker/ResumeForm.tsx
"use client";

import { ResumeData, Skill, CertificateData } from "@/app/lib/resume-data";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, UploadCloud, ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { ThemeName } from "@/app/resume-maker/page";

interface Props {
  data: ResumeData;
  setData: Dispatch<SetStateAction<ResumeData>>;
  activeTheme: ThemeName;
}

export default function ResumeForm({ data, setData, activeTheme }: Props) {
    const [openSections, setOpenSections] = useState({
        personal: true,
        education: true,
        projects: true,
        certificates: true,
        skills: true,
        interests: true,
    });

    const [skillInputs, setSkillInputs] = useState({
        languages: "", fullstack: "", database: "", architecture: "", webscraping: ""
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;
        setData(prev => ({...prev, personal: { ...prev.personal, [name]: isCheckbox ? checked : value }}));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => { setData(prev => ({ ...prev, personal: { ...prev.personal, profilePicture: event.target?.result as string }}));};
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const addItem = <T,>(field: keyof ResumeData, newItem: T) => { setData(prev => ({ ...prev, [field]: [...(prev[field] as T[]), newItem] })); };
    const removeItem = <T extends { id: string }>(field: keyof ResumeData, id: string) => { setData(prev => ({...prev, [field]: (prev[field] as T[]).filter(item => item.id !== id) })); };
    const updateItem = <T extends { id: string }>(field: keyof ResumeData, id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [field]: (prev[field] as T[]).map(item => item.id === id ? { ...item, [name]: value } : item) }));
    };

    const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setSkillInputs(prev => ({ ...prev, [name]: value }));};
    const addSkill = (category: keyof ResumeData['skills']) => {
        const skillName = skillInputs[category].trim();
        if (skillName) {
            setData(prev => ({ ...prev, skills: { ...prev.skills, [category]: [...prev.skills[category], { id: uuidv4(), name: skillName }] }}));
            setSkillInputs(prev => ({ ...prev, [category]: ""}));
        }
    };
    const removeSkill = (category: keyof ResumeData['skills'], id: string) => { setData(prev => ({ ...prev, skills: { ...prev.skills, [category]: prev.skills[category].filter(s => s.id !== id) } }));};

    return (
        <div className="space-y-4">
            {/* --- Personal Details Section --- */}
            <Section title="Personal Details" isOpen={openSections.personal} onToggle={() => toggleSection('personal')}>
                {activeTheme === 'MaxJohnson' && (
                     <div className="col-span-full mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {data.personal.profilePicture ? (
                                    <img src={data.personal.profilePicture} alt="Preview" className="mx-auto h-24 w-24 rounded-full object-cover"/>
                                ) : (
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="name" label="Full Name" value={data.personal.name} onChange={handlePersonalChange} />
                    <Input name="jobTitle" label="Job Title (e.g. Web Developer)" value={data.personal.jobTitle} onChange={handlePersonalChange} />
                    <Input name="email" label="Email" value={data.personal.email} onChange={handlePersonalChange} />
                    <Input name="phone" label="Phone" value={data.personal.phone} onChange={handlePersonalChange} />
                    <Input name="location" label="Location" value={data.personal.location} onChange={handlePersonalChange} />
                    <Input name="linkedin" label="LinkedIn URL" value={data.personal.linkedin} onChange={handlePersonalChange} />
                     <div className="md:col-span-2">
                        <TextArea name="profile" label="Profile Summary" value={data.personal.profile} onChange={handlePersonalChange} />
                    </div>
                </div>
            </Section>

            {/* --- Education Section --- */}
            <Section title="Education" isOpen={openSections.education} onToggle={() => toggleSection('education')}>
                <AnimatePresence>
                    {data.education.map((edu) => (
                        <motion.div key={edu.id} layout exit={{ opacity: 0, x: -50 }} className="p-4 border rounded-lg mb-4 relative bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="degree" label="Degree / Certificate" value={edu.degree} onChange={(e) => updateItem('education', edu.id, e)} />
                                <Input name="school" label="School / University" value={edu.school} onChange={(e) => updateItem('education', edu.id, e)} />
                                <Input name="start" label="Start Date" value={edu.start} onChange={(e) => updateItem('education', edu.id, e)} />
                                <Input name="end" label="End Date" value={edu.end} onChange={(e) => updateItem('education', edu.id, e)} />
                                <Input name="location" label="Location" value={edu.location} onChange={(e) => updateItem('education', edu.id, e)} />
                            </div>
                            <RemoveButton onClick={() => removeItem('education', edu.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
                <AddButton onClick={() => addItem('education', { id: uuidv4(), degree: "", school: "", start: "", end: "", location: "" })} text="Add Education"/>
            </Section>

            {/* --- Projects Section --- */}
            <Section title="Projects" isOpen={openSections.projects} onToggle={() => toggleSection('projects')}>
                 <AnimatePresence>
                    {data.projects.map((project) => (
                        <motion.div key={project.id} layout exit={{ opacity: 0, x: -50 }} className="p-4 border rounded-lg mb-4 relative bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="name" label="Project Name" value={project.name} onChange={(e) => updateItem('projects', project.id, e)} />
                                <Input name="platform" label="Type / Platform" value={project.platform} onChange={(e) => updateItem('projects', project.id, e)} />
                                <Input name="start" label="Start Date" value={project.start} onChange={(e) => updateItem('projects', project.id, e)} />
                                <Input name="end" label="End Date" value={project.end} onChange={(e) => updateItem('projects', project.id, e)} />
                                <div className="md:col-span-2">
                                    <TextArea name="description" label="Description" value={project.description} onChange={(e) => updateItem('projects', project.id, e)} />
                                </div>
                            </div>
                             <RemoveButton onClick={() => removeItem('projects', project.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
                <AddButton onClick={() => addItem('projects', { id: uuidv4(), name: "", platform: "", description: "", start: "", end: "" })} text="Add Project" />
            </Section>

            {/* --- Certificates Section --- */}
            <Section title="Certificates" isOpen={openSections.certificates} onToggle={() => toggleSection('certificates')}>
                <AnimatePresence>
                    {data.certificates.map((cert) => (
                        <motion.div key={cert.id} layout exit={{ opacity: 0, x: -50 }} className="p-4 border rounded-lg mb-4 relative bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="name" label="Certificate Name" value={cert.name} onChange={(e) => updateItem('certificates', cert.id, e)} />
                                <Input name="issuer" label="Issuing Organization" value={cert.issuer} onChange={(e) => updateItem('certificates', cert.id, e)} />
                                <Input name="date" label="Date Issued" value={cert.date} onChange={(e) => updateItem('certificates', cert.id, e)} placeholder="e.g., Jan 2024" />
                            </div>
                            <RemoveButton onClick={() => removeItem('certificates', cert.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
                <AddButton onClick={() => addItem('certificates', { id: uuidv4(), name: "", issuer: "", date: ""})} text="Add Certificate"/>
            </Section>

            {/* --- Skills Section (UPDATED) --- */}
            <Section title="Skills" isOpen={openSections.skills} onToggle={() => toggleSection('skills')}>
                {/* This wrapper ensures each skill group is on a new line */}
                <div className="flex flex-col gap-y-4">
                    <SkillInputGroup
                        label="Programming Languages"
                        name="languages"
                        value={skillInputs.languages}
                        skills={data.skills.languages}
                        onChange={handleSkillInputChange}
                        onAdd={() => addSkill('languages')}
                        onRemove={(id) => removeSkill('languages', id)}
                    />
                    <SkillInputGroup
                        label="Full-Stack & Web Development"
                        name="fullstack"
                        value={skillInputs.fullstack}
                        skills={data.skills.fullstack}
                        onChange={handleSkillInputChange}
                        onAdd={() => addSkill('fullstack')}
                        onRemove={(id) => removeSkill('fullstack', id)}
                    />
                    <SkillInputGroup
                        label="Database Technologies"
                        name="database"
                        value={skillInputs.database}
                        skills={data.skills.database}
                        onChange={handleSkillInputChange}
                        onAdd={() => addSkill('database')}
                        onRemove={(id) => removeSkill('database', id)}
                    />
                     <SkillInputGroup
                        label="Software Architecture"
                        name="architecture"
                        value={skillInputs.architecture}
                        skills={data.skills.architecture}
                        onChange={handleSkillInputChange}
                        onAdd={() => addSkill('architecture')}
                        onRemove={(id) => removeSkill('architecture', id)}
                    />
                     <SkillInputGroup
                        label="Web Scraping & Automation"
                        name="webscraping"
                        value={skillInputs.webscraping}
                        skills={data.skills.webscraping}
                        onChange={handleSkillInputChange}
                        onAdd={() => addSkill('webscraping')}
                        onRemove={(id) => removeSkill('webscraping', id)}
                    />
                </div>
            </Section>

            {/* --- Interests Section --- */}
            <Section title="Interests" isOpen={openSections.interests} onToggle={() => toggleSection('interests')}>
                <TextArea name="interests" label="Your Interests" value={data.interests} onChange={(e) => setData(prev => ({...prev, interests: e.target.value}))}/>
            </Section>
        </div>
    );
}


// --- Reusable Form Components (No changes needed below) ---
const Section = ({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="w-full bg-slate-100/70 rounded-lg p-4 border border-slate-200/80">
        <button onClick={onToggle} className="w-full flex justify-between items-center text-left text-xl font-bold text-gray-800 pb-2 mb-2">
            <span>{title}</span>
            <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
                <ChevronDown />
            </motion.div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => ( <div> <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label> <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white sm:text-sm" /> </div> );
const TextArea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => ( <div> <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label> <textarea {...props} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white sm:text-sm" /> </div> );
const AddButton = ({ onClick, text }: { onClick: () => void, text: string }) => ( <button onClick={onClick} className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors mt-2"> <Plus size={16} /> {text} </button> );
const RemoveButton = ({ onClick }: { onClick: () => void }) => ( <button onClick={onClick} className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"> <Trash2 size={18} /> </button> );

const SkillInputGroup = ({ label, name, value, skills, onChange, onAdd, onRemove }: { label: string, name: string, value: string, skills: Skill[], onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onAdd: () => void, onRemove: (id: string) => void }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex gap-2">
            <input name={name} value={value} onChange={onChange} onKeyDown={(e) => {if(e.key === 'Enter'){ e.preventDefault(); onAdd();}}} className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white sm:text-sm" placeholder="Type a skill and press Enter"/>
            <button type="button" onClick={onAdd} className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors flex-shrink-0">Add</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 min-h-[28px]">
             <AnimatePresence>
                {skills.map(skill => (
                    <motion.span
                        key={skill.id}
                        layout
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="flex items-center gap-1.5 bg-slate-200 text-slate-800 text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-full"
                    >
                        {skill.name}
                        <button onClick={() => onRemove(skill.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={12}/></button>
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    </div>
);