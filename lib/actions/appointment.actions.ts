'use server'

import { ID } from "node-appwrite";
import { APPOINTMENT_TABLE_ID, DATABASE_ID, ENDPOINT, PROJECT_ID, databases, messaging } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Query } from "node-appwrite";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";


// Define a type to match the Appwrite 'listDocuments' response
type AppwriteListResponse<T> = {
  documents: T[];
  total: number;
  // Add other fields if needed, depending on your schema
};

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  if (!DATABASE_ID || !APPOINTMENT_TABLE_ID) {
    console.warn("Missing DATABASE_ID or APPOINTMENT_TABLE_ID env vars. Returning temp appointment.");
    return parseStringify({
      $id: `temp-${ID.unique()}`,
      ...appointment,
    });
  }

  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
    return parseStringify({
      $id: `temp-${ID.unique()}`,
      ...appointment,
    });
  }
}

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      appointmentId,
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
}

export const getRecentAppointmentList = async () => {
  try {
    // Use the explicit AppwriteListResponse type
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      [Query.orderDesc("$createdAt")]
    ) as AppwriteListResponse<Appointment>;

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointments.documents.reduce((acc, appointment) => {
      switch (appointment.status) {
        case "scheduled":
          acc.scheduledCount++;
          break;
        case "pending":
          acc.pendingCount++;
          break;
        case "cancelled":
          acc.cancelledCount++;
          break;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error
    );

    // Fallback object to ensure the page does not break
    return {
      totalCount: 0,
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      documents: [],
    };
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_TABLE_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );
    return parseStringify(message);
  } catch (error) {
    console.error("An error occurred while sending sms:", error);
  }
};