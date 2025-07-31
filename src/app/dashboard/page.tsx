// app/dashboard/page.tsx

// This is now a Server Component (no "use client").
// It is responsible for composing the page and fetching data.

import DashboardClient from "@/app/components/dashboard/dashboard-client"; // Import the client wrapper

// Import the data-dependent components. These are also Server Components.
import AtAGlance from "@/app/components/dashboard/at-a-glance";
import RecentActivity from "@/app/components/dashboard/recent-activity";
import ApplicationTrackerHub from "@/app/components/dashboard/application-tracker-hub";

export default function DashboardPage() {
  // This page renders on the server.
  // It wraps all our content components inside the DashboardClient.
  // AtAGlance will fetch its data on the server, and the resulting HTML
  // will be passed as a 'child' to DashboardClient.
  return (
    <DashboardClient>
      {/* These components are now children of the client wrapper */}
      <AtAGlance />
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentActivity />
        <ApplicationTrackerHub />
      </div>
    </DashboardClient>
  );
}