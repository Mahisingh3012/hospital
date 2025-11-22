import { redirect } from "next/navigation";

type SuccessRedirectProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const AppointmentSuccess = async ({
  params,
  searchParams,
}: SuccessRedirectProps) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const userId = id || "";
  const appointmentId =
    (resolvedSearchParams?.appointmentId as string) || `temp-${Date.now()}`;

  const query = new URLSearchParams(resolvedSearchParams as any);
  if (userId && !query.get("userId")) {
    query.set("userId", userId);
  }

  redirect(`/success/${appointmentId}?${query.toString()}`);
};

export default AppointmentSuccess;

