import { redirect } from "next/navigation";
import * as Sentry from '@sentry/nextjs'
import { getUser } from "@/lib/actions/patient.actions";

type SuccessRedirectProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Success = async ({ params, searchParams }: SuccessRedirectProps) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
 // const user = await getUser(userId);
  //Sentry.metrics.set("user_view_appointment-success",user.name)
  const userId = id || "";
  const appointmentId =
    (resolvedSearchParams?.appointmentId as string) || `temp-${Date.now()}`;

  const fallbackParams = new URLSearchParams(resolvedSearchParams as any);
  if (userId && !fallbackParams.get("userId")) {
    fallbackParams.set("userId", userId);
  }

  redirect(`/success/${appointmentId}?${fallbackParams.toString()}`);
};

export default Success;
