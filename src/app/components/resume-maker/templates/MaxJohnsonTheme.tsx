import { ResumeData } from '@/app/lib/resume-data';

export default function MaxJohnsonTheme({ data }: { data: ResumeData }) {
    return (
        <div className="flex min-h-[297mm] text-sm" id="resume-preview-content">
            {/* Left Sidebar - Using explicit RGB colors for PDF compatibility */}
            <aside className="w-1/3 bg-[rgb(31,41,55)] text-white p-8 flex flex-col">
                <div className="text-center mb-10">
                    <div className="w-32 h-32 rounded-full bg-[rgb(55,65,81)] mx-auto mb-4 border-4 border-[rgb(75,85,99)] overflow-hidden">
                        {data.personal.profilePicture ? (
                            <img 
                                src={data.personal.profilePicture} 
                                alt={data.personal.name} 
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous" // Important for PDF generation
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[rgb(55,65,81)] text-gray-400 text-xs">
                                No Image
                            </div>
                        )}
                    </div>
                </div>

                <SectionSide title="Contact">
                    <ContactItem label="Address" value={data.personal.location} />
                    <ContactItem label="Phone" value={data.personal.phone} />
                    <ContactItem label="Email" value={data.personal.email} lastItem />
                </SectionSide>

                <SectionSide title="Skills">
                    <SkillList skills={data.skills.languages} />
                    <SkillList skills={data.skills.fullstack} />
                    <SkillList skills={data.skills.database} />
                </SectionSide>
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-10 bg-white">
                <header className="mb-6">
                    <h1 className="text-4xl font-extrabold text-[rgb(31,41,55)] uppercase tracking-tight">
                        {data.personal.name}
                    </h1>
                    <h2 className="text-xl font-light text-[rgb(126,34,206)] mt-1">
                        {data.personal.jobTitle}
                    </h2>
                </header>

                <SectionMain title="Profile">
                    <p className="text-sm leading-relaxed text-[rgb(75,85,99)]">
                        {data.personal.profile}
                    </p>
                </SectionMain>

                <SectionMain title="Projects">
                    {data.projects.map(proj => (
                        <ProjectItem key={proj.id} project={proj} />
                    ))}
                </SectionMain>

                <SectionMain title="Education">
                    {data.education.map(edu => (
                        <EducationItem key={edu.id} education={edu} />
                    ))}
                </SectionMain>
            </main>
        </div>
    );
}

// Reusable Components
const SectionSide = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
        <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 border-[rgb(167,139,250)] pb-1 mb-3">
            {title}
        </h3>
        {children}
    </div>
);

const SectionMain = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mt-6">
        <h3 className="text-xl font-bold text-[rgb(31,41,55)] pb-2 mb-3 border-b-4 border-[rgb(229,231,235)]">
            {title}
        </h3>
        {children}
    </div>
);

const ContactItem = ({ label, value, lastItem = false }: { label: string; value: string; lastItem?: boolean }) => (
    <div className={lastItem ? '' : 'mb-3'}>
        <p className="font-bold">{label}</p>
        <p className="text-sm font-light break-words">{value}</p>
    </div>
);

const SkillList = ({ skills }: { skills: { id: string; name: string }[] }) => (
    <ul className="space-y-2 text-sm font-light">
        {skills.map(skill => (
            <li key={skill.id} className="flex items-center">
                <span className="w-2 h-2 bg-[rgb(167,139,250)] rounded-full mr-2"></span>
                {skill.name}
            </li>
        ))}
    </ul>
);

const ProjectItem = ({ project }: { project: ResumeData['projects'][0] }) => (
    <div className="mb-5">
        <h3 className="text-base font-bold text-[rgb(31,41,55)]">{project.name}</h3>
        <p className="text-xs font-semibold text-[rgb(126,34,206)] mb-1">
            {project.platform} | {project.start} - {project.end}
        </p>
        <p className="text-sm leading-relaxed text-[rgb(75,85,99)]">
            {project.description}
        </p>
    </div>
);

const EducationItem = ({ education }: { education: ResumeData['education'][0] }) => (
    <div className="mb-4">
        <h3 className="text-base font-bold text-[rgb(31,41,55)]">{education.degree}</h3>
        <p className="text-xs font-semibold text-[rgb(126,34,206)]">
            {education.school} - {education.location}
        </p>
        <p className="text-xs text-[rgb(156,163,175)]">
            {education.start} - {education.end}
        </p>
    </div>
);