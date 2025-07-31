// File Path: app/api/analysis/[id]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const idFromUrl = pathSegments[pathSegments.length - 1];

    // --- DEBUGGING STEP 1 ---
    // Let's print the ID we are getting from the URL to the server terminal.
    console.log(`[API] Received request for ID: ${idFromUrl}`);

    if (!ObjectId.isValid(idFromUrl)) {
        console.error(`[API] The ID "${idFromUrl}" is not a valid ObjectId format.`);
        return NextResponse.json({ error: 'Invalid ID format from URL' }, { status: 400 });
    }

    const client = await clientPromise;
    
    // --- FINAL, CRITICAL ACTION ---
    // You MUST replace this string with your actual database name.
    const db = client.db("ResumeTailor");
    
    // --- DEBUGGING STEP 2 ---
    // Let's print the database and collection names we are querying.
    console.log(`[API] Connecting to DB: "${db.databaseName}", Collection: "analyses"`);
    
    const query = { _id: new ObjectId(idFromUrl) };

    // --- DEBUGGING STEP 3 ---
    // Let's print the exact query we are sending to MongoDB.
    console.log(`[API] Executing query:`, JSON.stringify(query));

    const analysis = await db.collection('analyses').findOne(query);

    // --- DEBUGGING STEP 4 ---
    // Let's see what the database returned. Was it the document or null?
    if (!analysis) {
      console.error(`[API] FAILED: Document with ID "${idFromUrl}" not found in database "${db.databaseName}". The query returned null.`);
      return NextResponse.json({ error: 'Analysis data not found in database.' }, { status: 404 });
    }
    
    console.log(`[API] SUCCESS: Found document for ID "${idFromUrl}".`);
    return NextResponse.json(analysis);

  } catch (e) {
    console.error("[API] FATAL ERROR in catch block:", e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}