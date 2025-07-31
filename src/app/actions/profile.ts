// app/actions/profile.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import clientPromise from "@/app/lib/mongodb";
import { revalidatePath } from "next/cache";

// Define the shape of the user's profile data
export interface UserProfile {
  name: string;
  title: string;
  bio: string;
}

// Action to get the current user's profile from the 'data' collection
export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null; // No user, no profile
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const dataCollection = db.collection("data");

    const profile = await dataCollection.findOne({ userId: session.user.id });

    if (!profile) {
      return null; // User exists but hasn't saved a profile yet
    }

    // Important: Serialize the data to make it a plain object for the client
    return {
      ...profile,
      _id: profile._id.toString(),
      userId: profile.userId.toString(),
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

// Action to create or update a user's profile (an "upsert" operation)
export async function updateUserProfile(profileData: UserProfile) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "User not authenticated." };
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const dataCollection = db.collection("data");

    // Use updateOne with the 'upsert: true' option.
    // This will create the document if it doesn't exist, or update it if it does.
    await dataCollection.updateOne(
      { userId: session.user.id }, // The filter to find the document
      { $set: { ...profileData, userId: session.user.id } }, // The data to set
      { upsert: true } // The magic option
    );

    // Revalidate the path so the user sees the updated data if they refresh
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { error: "Database operation failed." };
  }
}