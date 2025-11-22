import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

type SuccessPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const SuccessPage = async ({ params, searchParams }: SuccessPageProps) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const appointmentId = id || "";
  const userId = (resolvedSearchParams?.userId as string) || "";

  const fallbackDoctor = (resolvedSearchParams?.fallbackDoctor as string) || "";
  const fallbackSchedule =
    (resolvedSearchParams?.fallbackSchedule as string) || "";
  const fallbackReason = (resolvedSearchParams?.fallbackReason as string) || "";
  const fallbackNote = (resolvedSearchParams?.fallbackNote as string) || "";

  if (!appointmentId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">No appointment ID provided.</p>
          <Button asChild className="shad-primary-btn">
            <Link href={userId ? `/patients/${userId}/new-appointment` : "/"}>
              Book a new appointment
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const shouldFetch = !appointmentId.startsWith("temp-");
  let appointment = null;

  if (shouldFetch) {
    appointment = await getAppointment(appointmentId);
  }

  if (!appointment && (fallbackDoctor || fallbackSchedule)) {
    appointment = {
      primaryPhysician: fallbackDoctor || "Pending assignment",
      schedule: fallbackSchedule || new Date().toISOString(),
      reason: fallbackReason || "Not provided",
      note: fallbackNote || "",
    } as any;
  }

  if (!appointment) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">No appointment found.</p>
          <p className="text-sm text-gray-400">ID: {appointmentId}</p>
          <Button asChild className="shad-primary-btn">
            <Link href={userId ? `/patients/${userId}/new-appointment` : "/"}>
              Book a new appointment
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const doctor = Doctors.find(
    (doc) => doc.name === appointment?.primaryPhysician
  );

  return (
    <div className="flex h-screen items-center justify-center px-[5%]">
      <div className="success-img flex flex-col items-center text-center">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit mb-6"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p className="mb-4">We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details space-y-3">
          <p>Requested appointment details:</p>

          <div className="flex items-center gap-3 justify-center">
            <Image
              src={doctor?.image ?? "/assets/icons/doctor.svg"}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name ?? "Pending"}</p>
          </div>

          <div className="flex gap-2 justify-center">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(appointment.schedule).dateTime}</p>
          </div>

          {appointment?.reason && (
            <p className="mt-4 text-sm text-gray-200">
              <span className="font-semibold">Reason:</span>{" "}
              {appointment.reason}
            </p>
          )}

          {!!appointment?.note && (
            <p className="text-sm text-gray-200">
              <span className="font-semibold">Notes:</span> {appointment.note}
            </p>
          )}
        </section>

        <Button variant="outline" className="shad-primary-btn mt-6" asChild>
          <Link
            href={userId ? `/patients/${userId}/new-appointment` : "/"}
          >
            New Appointment
          </Link>
        </Button>

        <p className="copyright mt-6">© 2025 CarePluse</p>
      </div>
    </div>
  );
};

export default SuccessPage;
