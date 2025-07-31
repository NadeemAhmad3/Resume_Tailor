// /next-auth.d.ts  (This file should be in the root of your project)

import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type to include the 'id' property.
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique ID from the database */
      id: string;
    } & DefaultSession["user"]; // ...and the default properties (name, email, image)
  }
}