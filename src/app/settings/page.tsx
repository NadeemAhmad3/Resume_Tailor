// app/settings/page.tsx

import DashboardClient from "@/app/components/dashboard/dashboard-client";
import { getUserProfile } from "@/app/actions/profile";
import SettingsClient from "./SettingsClient";

// This is the main Server Component for the /settings route.
export default async function SettingsPage() {
  // 1. Fetch the user's existing profile data on the server.
  const profile = await getUserProfile();

  // 2. Render the page, wrapping it in the DashboardClient for the sidebar
  //    and passing the fetched profile to the interactive client component.
  return (
    <DashboardClient>
      <SettingsClient initialProfile={profile} />
    </DashboardClient>
  );
}