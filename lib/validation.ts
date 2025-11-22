import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone)),
});

export const PatientFormValidation = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().refine((p) => /^\+\d{10,15}$/.test(p)),
  birthDate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(5).max(500),
  occupation: z.string().min(2).max(500),
  emergencyContactName: z.string().min(2).max(50),
  emergencyContactNumber: z
    .string()
    .refine((p) => /^\+\d{10,15}$/.test(p)),
  primaryPhysician: z.string().min(2),
  insuranceProvider: z.string().min(2).max(50),
  insurancePolicyNumber: z.string().min(2).max(50),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z.boolean().refine((v) => v === true, {
    message: "You must consent to treatment",
  }),
  disclosureConsent: z.boolean().refine((v) => v === true, {
    message: "You must consent to disclosure",
  }),
  privacyConsent: z.boolean().refine((v) => v === true, {
    message: "You must consent to privacy",
  }),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2),
  schedule: z.coerce.date(),
  reason: z.string().min(2).max(500),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * ❗ FIXED VERSION
 * Cancel should ONLY validate cancellationReason.
 */
export const CancelAppointmentSchema = z.object({
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

/**
 * Return correct schema depending on mode
 */
export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema; // FIXED
    case "schedule":
    default:
      return ScheduleAppointmentSchema;
  }
}
