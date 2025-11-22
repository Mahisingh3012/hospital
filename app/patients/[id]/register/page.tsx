import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import * as Sentry from '@sentry/nextjs'

const Register = async ({ params: { id } }: SearchParamProps) => {
  const user = await getUser(id);

 // Sentry.metrics.set("user_view_register",user.name);
  // Create a fallback user object if getUser returns null
  // This ensures the form always renders
  const userData: User = user || {
    $id: id || 'temp-user',
    name: '',
    email: '',
    phone: '',
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
    <section className="remove-scrollbar container overflow-y-auto">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10 min-h-full">
        <Image
          src="/assets/icons/logo-full.svg"
          height = {1000}
          width = {1000}
          alt="patient"
          className="mb-12 h-10 w-fit"
        />

        <RegisterForm user={userData} />

        <div className="text-14-regular mt-20 flex justify-between">
           <p className="justify-items-end text-blue-300 xl:text-left">© 2025 CarePulse</p>
      <Link href="/?admn=true" className="text-green-500">
      </Link>
        </div>
                </div>
    </section>

    <Image src="/assets/images/register-img.png"
    height = {1000}
    width={1000}
    alt="patient"
    className="side-img max-w-[35%]"
    />
  </div>
  )
}

export default Register
