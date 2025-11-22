import { NextRequest, NextResponse } from "next/server";
import * as sdk from "node-appwrite";
import { ID, Query } from "node-appwrite";

// Server-only environment variables
const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;
const PROJECT_ID = process.env.PROJECT_ID;
const API_KEY = process.env.API_KEY;

// Initialize Appwrite client with API key (server-only)
// This function creates a fresh client instance for each request
const getAppwriteUsersClient = () => {
  // Validate environment variables
  if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
    const missing = [];
    if (!ENDPOINT) missing.push("NEXT_PUBLIC_ENDPOINT");
    if (!PROJECT_ID) missing.push("PROJECT_ID");
    if (!API_KEY) missing.push("API_KEY");
    
    throw new Error(
      `Missing required Appwrite env variables: ${missing.join(", ")}`
    );
  }

  // Create a new client instance for each request
  const client = new sdk.Client();
  
  // Set endpoint, project, and API key
  // API key must have 'users.write' scope in Appwrite console
  client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);
  
  return new sdk.Users(client);
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, email, and phone are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Initialize Appwrite Users API with API key
    // This will throw if env variables are missing
    const users = getAppwriteUsersClient();

    // Create user using Appwrite Users API
    try {
      const newUser = await users.create(
        ID.unique(),
        email,
        phone,
        undefined, // password (not needed for user creation via API key)
        name
      );

      return NextResponse.json(
        {
          success: true,
          user: {
            $id: newUser.$id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Handle duplicate user (409 conflict)
      if (error?.code === 409) {
        try {
          // Try to find existing user by email
          const existingUsers = await users.list([
            Query.equal("email", [email]),
          ]);

          if (existingUsers?.users && existingUsers.users.length > 0) {
            const existingUser = existingUsers.users[0];
            return NextResponse.json(
              {
                success: true,
                user: {
                  $id: existingUser.$id,
                  name: existingUser.name,
                  email: existingUser.email,
                  phone: existingUser.phone,
                },
              },
              { status: 200 }
            );
          }
        } catch (listError: any) {
          console.error("Error retrieving existing user:", listError);
          // If we can't find the user, return the original 409 error
          return NextResponse.json(
            {
              error: "User already exists but could not be retrieved",
              code: 409,
            },
            { status: 409 }
          );
        }
      }

      // Log the full error for debugging
      console.error("Appwrite API Error:", {
        message: error?.message,
        code: error?.code,
        type: error?.type,
        response: error?.response,
      });

      // Handle authorization errors specifically
      if (error?.code === 401 || error?.code === 403) {
        return NextResponse.json(
          {
            error: "API Key authentication failed. Please check your API key has 'users.write' scope in Appwrite console.",
            code: error?.code,
            details: "Ensure your API key in .env has the 'users.write' scope enabled",
          },
          { status: 401 }
        );
      }

      // Re-throw other errors to be caught by outer catch
      throw error;
    }
  } catch (error: any) {
    // Handle configuration errors
    if (error?.message?.includes("Missing required Appwrite env variables")) {
      return NextResponse.json(
        {
          error: "Server configuration error: Missing Appwrite credentials",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.error("Error creating user via API route:", {
      message: error?.message,
      code: error?.code,
      type: error?.type,
      stack: error?.stack,
    });

    // Return user-friendly error message
    return NextResponse.json(
      {
        error: error?.message || "Failed to create user",
        code: error?.code,
      },
      { status: error?.code && error.code >= 400 && error.code < 600 ? error.code : 500 }
    );
  }
}

