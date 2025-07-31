// components/dashboard/at-a-glance.tsx

// This remains a Server Component to fetch data.
import StatCard from "../ui/stat-card";
import { getUserStats } from "@/app/actions/stats";

export default async function AtAGlance() {
  const stats = await getUserStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        // CHANGED: We now pass the icon's name as a simple string.
        iconName="FileText"
        label="Total Resumes Created"
        value={stats.resume_created ?? 0}
        color="from-blue-500 to-cyan-500"
      />
      <StatCard
        // CHANGED: Pass the name, not the component.
        iconName="Briefcase"
        label="Applications Tailored"
        value={stats.application_tailored ?? 0}
        color="from-purple-500 to-pink-500"
      />
      <StatCard
        // CHANGED: Pass the name, not the component.
        iconName="Star"
        label="Applications Tracked"
        value={stats.application_tracked ?? 0}
        color="from-amber-500 to-orange-500"
      />
      <StatCard
        // CHANGED: Pass the name, not the component.
        iconName="Bot"
        label="AI Credits Remaining"
        value={stats.ai_credits ?? 0}
        color="from-green-500 to-lime-500"
      />
    </div>
  );
}