// components/dashboard/application-tracker-hub.tsx

// This is now the Server Component Wrapper. It has no "use client" directive.

import { getAppliedCount } from "@/app/actions/stats";
import ApplicationTrackerHubClient from "./application-tracker-hub-client"; // Import the client component

export default async function ApplicationTrackerHub() {
  // 1. Fetch the data securely on the server.
  const appliedCount = await getAppliedCount();

  // 2. Render the CLIENT component and pass the fetched data as a prop.
  return <ApplicationTrackerHubClient appliedCount={appliedCount} />;
}