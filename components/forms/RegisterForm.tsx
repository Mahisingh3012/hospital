"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormFieldType } from "@/components/forms/PatientForm"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Doctors, GenderOptions, PatientFormDefaultValues, IdentificationTypes } from "@/constants"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { SelectItem } from "@/components/ui/select"
import { FileUploader } from "../FileUploader"
import { PatientFormValidation } from "@/lib/validation"
import { registerPatient } from "@/lib/actions/patient.actions"



type PatientFormValues = z.infer<typeof PatientFormValidation>

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientFormValidation) as Resolver<PatientFormValues>,
    defaultValues: PatientFormDefaultValues as PatientFormValues,
  })

  const onSubmit: SubmitHandler<PatientFormValues> = async (values) => {
    setIsLoading(true);

    let formData: FormData | undefined;
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData: RegisterUserParams = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      const newPatient = await registerPatient(patientData);

      if (newPatient) {
        const fallbackParams = new URLSearchParams({
          fallbackName: values.name,
          fallbackEmail: values.email,
          fallbackPhone: values.phone,
          fallbackPhysician: values.primaryPhysician || "",
          fallbackInsurance: values.insuranceProvider || "",
          fallbackPolicy: values.insurancePolicyNumber || "",
          fallbackEmergencyName: values.emergencyContactName || "",
          fallbackEmergencyPhone: values.emergencyContactNumber || "",
          fallbackBirthDate: values.birthDate
            ? new Date(values.birthDate).toISOString()
            : "",
        });

        for (const key of Array.from(fallbackParams.keys())) {
          const paramValue = fallbackParams.get(key);
          if (!paramValue) {
            fallbackParams.delete(key);
          }
        }

        const queryString = fallbackParams.toString();
        const targetPath = queryString
          ? `/patients/${user.$id}/new-appointment?${queryString}`
          : `/patients/${user.$id}/new-appointment`;

        router.push(targetPath);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome👋</h1>
          <p className="text-cyan-50">Let us know more about yourself</p>
        </section>
       
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
         <h2 className="sub-header">Personal Information</h2>
         </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />


    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="Johndoe@ms.go"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        {/* ✅ FIXED: Added iconSrc + iconAlt so spacing matches */}
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
          iconSrc="/assets/icons/phone.svg"
          iconAlt="phone"
        />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="birthDate"
          label="Date of birth"
        
        />

        {/* ✅ FIXED: Added iconSrc + iconAlt so spacing matches */}
        <CustomFormField
          fieldType={FormFieldType.SKELETON} 
          control={form.control}
          name="gender"
          label="Gender"
          renderSkeleton={(field) => (
            <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}>
                    {GenderOptions.map((option) => (
                        <div key={option}
                        className="radio-group">
                        <RadioGroupItem value={option} 
                        id={option}/>
                        <Label htmlFor={option}
                        className="cursor-pointer">
                            {option}
                        </Label>
                        </div>
                    ))}
                </RadioGroup>
            </FormControl>
  )}
        />
    </div>

  


    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Address"
          placeholder="14th Street, New York"
          
        />

<CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="occupation"
          label="Occupation"
          placeholder="Software Engineer"
       
        />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="emergencyContactName"
          label="Emergency contact name"
          placeholder="guardian's name"
         
        />

        {/* ✅ FIXED: Added iconSrc + iconAlt so spacing matches */}
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="emergencyContactNumber"
          label="Emergency contact number"
          placeholder="(555) 123-4567"
         
        />
    </div>

      <section className="space-y-6">
            <div className="mb-9 space-y-1">
         <h2 className="sub-header">Medical Information</h2>
         </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary physician"
          placeholder="Select a physician"
         
        >
  {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}

        </CustomFormField>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="insuranceProvider"
          label="Insurance provider"
          placeholder="BlueCross BlueShield"
          
        />

<CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="insurancePolicyNumber"
          label="Insurance policy number"
          placeholder="ABC123456789"
       
        /> 
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="allergies"
          label="Allergies (if any)"
          placeholder="Peanuts, Penicillin"
          
        />

<CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="currentMedication"
          label="Current medication (if any)"
          placeholder="Ibuprofen 200mg, Paracetamol 500mg"
       
        /> 
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
    <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="familyMedicalHistory"
          label="Family medical history"
          placeholder="Mother had brain cancer, Father had heart disease"
          
        />

<CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="pastMedicalHistory"
          label="Past medical history"
          placeholder="Appendectomy, Tonsillectomy"
       
        /> 
    </div>

    
    <section className="space-y-6">
            <div className="mb-9 space-y-1">
         <h2 className="sub-header">Identification and Verification</h2>
         </div>
        

            
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification type"
          placeholder="Select an identification type"
         
        >
    {IdentificationTypes.map((type) => (
              <SelectItem key={type } value={type}>
                {type}
              </SelectItem>
            ))}

</CustomFormField>

<CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
         <h2 className="sub-header">Consent and Privacy</h2>
         </div>

              <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>


      <SubmitButton isLoading = {isLoading}>Get started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm;
