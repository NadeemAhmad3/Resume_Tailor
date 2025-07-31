import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { createTransport } from "nodemailer";
import clientPromise from "@/app/lib/mongodb";

/**
 * Creates the HTML email body. All styles are inline for compatibility.
 */
function html({ url }: { url: string }) {
  const brandColor = "#7e22ce";

  return `
<body style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 20px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto; max-width: 600px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
          <tr>
            <td align="center" style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
              <h1 style="font-size: 24px; font-weight: 600; color: #111827; margin: 0;">ResumeTailor</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-top: 0;">Your secure sign-in link</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Welcome! Please click the button below to sign in to your ResumeTailor dashboard.
              </p>
              <a href="${url}" target="_blank" style="display: inline-block; font-size: 16px; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 500; background-color: ${brandColor}; margin: 20px 0;">
                Sign In to Your Account
              </a>
              <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                This link is valid for 24 hours. If you did not request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
         
          <tr>
            <td align="center" style="padding: 20px; border-top: 1px solid #e5e7eb; background-color: #f8fafc;">
              <p style="font-size: 14px; color: #6b7280; margin: 0;">
                © ${new Date().getFullYear()} ResumeTailor | Built by Nadeem Ahmad
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`;
}

/**
 * Creates the plain text email body as a fallback.
 */
function text({ url }: { url:string }) {
  return `
Sign in to ResumeTailor
-----------------------
Click this link to sign in: ${url}
(This link is valid for 24 hours)

Built by Nadeem Ahmad
  `;
}

// Ensure all required env vars are present at build time
const requiredEnvVars = [
  "EMAIL_SERVER_HOST",
  "EMAIL_SERVER_PORT",
  "EMAIL_SERVER_USER",
  "EMAIL_SERVER_PASSWORD",
  "EMAIL_FROM",
  "NEXTAUTH_SECRET",
];
const missing = requiredEnvVars.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Missing env variables: ${missing.join(", ")}`);
}

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,

      async sendVerificationRequest({ identifier: email, url, provider }) {
        // Create a nodemailer transport from the EmailProvider config
        const transport = createTransport(provider.server);

        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Your Sign-In Link for ResumeTailor`,
          text: text({ url }),
          html: html({ url }),
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify-request",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  
  // --- START: MODIFIED SECTION ---
  // The createUser event is triggered when a new user signs up.
  // It connects to the database and creates a new 'stats' document
  // linked to the new user's unique ID.
  events: {
    async createUser({ user }) {
      const client = await clientPromise;
      const db = client.db();
      
      // The `user.id` is the unique identifier from the `users` collection.
      // We use it to create a unique link to this user's stats.
      await db.collection("stats").insertOne({
        userId: user.id, // This ensures a unique link for each user's stats.
        resume_created: 0,
        application_tailored: 0,
        application_tracked: 0,
        ai_credits: 240, // Set initial AI credits to 240 as requested.
      });
    },
  },
  // --- END: MODIFIED SECTION ---
  
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        // Assign the user's ID from the database user object to the session object
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };