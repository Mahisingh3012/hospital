import { NextResponse } from "next/server";
import { createAppointment } from "@/lib/actions/appointment.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const appointmentPayload: CreateAppointmentParams = {
      userId: body.userId,
      patient: body.patient,
      primaryPhysician: body.primaryPhysician,
      schedule: new Date(body.schedule),
      reason: body.reason,
      status: body.status,
      note: body.note,
    };

    const newAppointment = await createAppointment(appointmentPayload);

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}


