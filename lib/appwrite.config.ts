import * as sdk from "node-appwrite";

// Correct variable names
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

const DATABASE_ID = process.env.DATABASE_ID;
const PATIENT_TABLE_ID = process.env.PATIENT_TABLE_ID;
const DOCTOR_TABLE_ID = process.env.DOCTOR_TABLE_ID;
const APPOINTMENT_TABLE_ID = process.env.APPOINTMENT_TABLE_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID;

export {
  ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_TABLE_ID,
  DOCTOR_TABLE_ID,
  APPOINTMENT_TABLE_ID,
  BUCKET_ID,
};

// Required variable check
if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  const missing = [];
  if (!ENDPOINT) missing.push("NEXT_PUBLIC_APPWRITE_ENDPOINT");
  if (!PROJECT_ID) missing.push("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
  if (!API_KEY) missing.push("APPWRITE_API_KEY");

  throw new Error(
    `Missing required Appwrite env variables: ${missing.join(", ")}`
  );
}
console.log("PROJECT ID LOADED:", PROJECT_ID);

// Initialize Appwrite client with API key (server-only)
const client = new sdk.Client();

client
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
