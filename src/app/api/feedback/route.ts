import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb"; // KEPT YOUR ORIGINAL, WORKING IMPORT PATH

// Defines the expected structure of the incoming request body
// UPDATED: Added optional userId
interface FeedbackRequestBody {
  type: string;
  rating: number;
  message: string;
  userId?: string; // ADDED: To accept the user's ID
}

export async function POST(request: Request) {
  try {
    // UPDATED: Destructure the new userId property from the JSON body
    const { type, rating, message, userId }: FeedbackRequestBody = await request.json();

    // Basic validation
    if (!type || !rating || !message) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(); // Use your default database configured in the URI

    // UPDATED: Add the userId to the object being saved to the database
    const feedback = {
      userId, // ADDED: Include the user's ID in the document
      type,
      rating,
      message,
      createdAt: new Date(),
    };

    // Insert the new feedback document into a "feedback" collection
    const result = await db.collection("feedback").insertOne(feedback);

    return NextResponse.json(
      { message: "Feedback submitted successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}