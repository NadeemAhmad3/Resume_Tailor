// app/tracker/page.tsx

import { getTrackedApplications } from "@/app/actions/stats";
import ApplicationTrackerClient from "./ApplicationTrackerClient";
import DashboardClient from "@/app/components/dashboard/dashboard-client";

// This is the main Server Component for the /tracker route.
// It's wrapped in your DashboardClient to get the sidebar and main layout.
export default async function TrackerPage() {
  // 1. Fetch the data securely on the server.
  const applications = await getTrackedApplications();

  // 2. Pass the data to the client component for rendering.
  return (
    <DashboardClient>
      <ApplicationTrackerClient initialApplications={applications} />
    </DashboardClient>
  );
}