"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from 'next/cache';

const ANALYSIS_CREDIT_COST = 40;

// Define a type for our stats for better code safety
export interface UserStats {
  _id: ObjectId;
  userId: string;
  resume_created: number;
  application_tailored: number;
  application_tracked: number;
  ai_credits: number;
}

// This is your original, unchanged function.
// --- THIS IS THE ONLY FUNCTION THAT WILL BE MODIFIED ---
export async function getUserStats(): Promise<Partial<UserStats>> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.warn("No user session found. Cannot fetch stats.");
    return {}; 
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Query 1: Get the main stats document (Unchanged)
    const statsCollection = db.collection<UserStats>("stats");
    const stats = await statsCollection.findOne({ userId: session.user.id });

    // --- ADDED LOGIC ---
    // Query 2: Get the *actual* count of tracked applications from the correct collection.
    // We use countDocuments for maximum efficiency.
    const applicationTrackerCollection = db.collection("application_tracker");
    const trackedApplicationsCount = await applicationTrackerCollection.countDocuments({ userId: session.user.id });
    // --- END OF ADDED LOGIC ---

    if (!stats) {
      console.warn(`No stats found for user: ${session.user.id}`);
      // Return default stats but with the CORRECT tracked application count
      return {
        resume_created: 0,
        application_tailored: 0,
        application_tracked: trackedApplicationsCount, // Use the real count
        ai_credits: 0,
      };
    }

    // --- MODIFIED RETURN ---
    // Return the stats object, but explicitly OVERWRITE the application_tracked value
    // with our new, accurate count.
    return {
        ...stats,
        _id: stats._id.toString(),
        application_tracked: trackedApplicationsCount, // Use the real count
    };

  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return {
      resume_created: 0,
      application_tailored: 0,
      application_tracked: 0, // Return 0 on error
      ai_credits: 240, 
    };
  }
}

// This is your existing function, unchanged.
export async function incrementResumeCreated() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("Attempted to increment count for an unauthenticated user.");
    return { error: "User not authenticated." };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const statsCollection = db.collection("stats");

    const result = await statsCollection.updateOne(
      { userId: session.user.id },
      { $inc: { resume_created: 1 } }
    );

    if (result.matchedCount === 0) {
      console.warn(`Could not find stats document for user ${session.user.id} to increment.`);
      return { error: "Stats document not found." };
    }
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to increment resume_created count:", error);
    return { error: "Database operation failed." };
  }
}

// --- UPDATED FUNCTION ---
// The function now accepts the job details to be saved.
export async function processSuccessfulAnalysis(jobTitle: string, jobDescription: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "User not authenticated." };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const statsCollection = db.collection("stats");
    
    // Step 1: Perform the atomic update on the stats collection (unchanged)
    const result = await statsCollection.updateOne(
      { 
        userId: session.user.id,
        ai_credits: { $gte: ANALYSIS_CREDIT_COST } 
      },
      { 
        $inc: { 
          application_tailored: 1,
          ai_credits: -ANALYSIS_CREDIT_COST
        } 
      }
    );

    if (result.matchedCount === 0) {
      console.warn(`Could not process analysis for user ${session.user.id}: not enough credits or user not found.`);
      return { error: "Credit deduction failed on server." };
    }

    // --- ADDED SECTION ---
    // Step 2: On success, insert the job details into the new collection.
    const applicationTrackerCollection = db.collection("application_tracker");
    await applicationTrackerCollection.insertOne({
      userId: session.user.id,
      jobTitle,
      jobDescription,
      status: 'Analyzed', // You can set a default status
      createdAt: new Date(),
    });
    // --- END OF ADDED SECTION ---

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to process successful analysis:", error);
    return { error: "Database operation failed." };
  }
}
// Add this new function to the end of your existing app/actions/stats.ts file.
// It fetches all applications for the current user and sorts them by most recent.

export async function getTrackedApplications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // If there's no user, return an empty array.
    return [];
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const applicationTrackerCollection = db.collection("application_tracker");

    const applications = await applicationTrackerCollection
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    // Important: We must serialize the data before sending it to the client.
    // This converts the complex BSON types (like ObjectId and Date) to simple strings.
    return applications.map(app => ({
      ...app,
      _id: app._id.toString(),
      userId: app.userId.toString(),
      createdAt: app.createdAt.toISOString(),
    }));

  } catch (error) {
    console.error("Failed to fetch tracked applications:", error);
    return []; // Return an empty array on error.
  }
}

// Add this new function to the end of your existing app/actions/stats.ts file.

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "User not authenticated." };
  }

  // A list of valid statuses to prevent arbitrary data injection.
  const validStatuses = ["Analyzed", "Applied", "Interviewing", "Offer", "Rejected"];
  if (!validStatuses.includes(newStatus)) {
    return { error: "Invalid status provided." };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const applicationTrackerCollection = db.collection("application_tracker");

    // Update the document only if it matches the application ID AND the logged-in user's ID.
    // This is a crucial security step.
    const result = await applicationTrackerCollection.updateOne(
      { _id: new ObjectId(applicationId), userId: session.user.id },
      { $set: { status: newStatus } }
    );

    if (result.matchedCount === 0) {
      return { error: "Application not found or permission denied." };
    }

    // Revalidate the tracker path so the cache is cleared.
    revalidatePath("/tracker");
    return { success: true };
  } catch (error) {
    console.error("Failed to update application status:", error);
    return { error: "Database operation failed." };
  }
}

// Add this new function to the end of your existing app/actions/stats.ts file.
// It is highly efficient as it only counts documents, it doesn't retrieve them.

export async function getAppliedCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return 0; // Return 0 if no user is logged in
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const applicationTrackerCollection = db.collection("application_tracker");

    // Use countDocuments for a very fast query.
    const count = await applicationTrackerCollection.countDocuments({ 
      userId: session.user.id,
      status: "Applied" // CORRECTED: Only count applications with the "Applied" status
    });

    return count;

  } catch (error) {
    console.error("Failed to fetch applied count:", error);
    return 0; // Return 0 on any database error
  }
}