// app/page.tsx

import LoginPage from "./login/page";

export default function Home() {
  // This will now render the login page as the root of your application.
  // The route "/" will show the login/signup form.
  return <LoginPage />;
}