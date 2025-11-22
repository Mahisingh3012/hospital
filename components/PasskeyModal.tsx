'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import { encryptKey } from '@/lib/utils';
import {useEffect} from 'react';
import { decryptKey } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const encryptedKey = typeof window !== 'undefined' ? localStorage.getItem('accessKey') : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (path)
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
  }, [encryptedKey]);

  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();;

      if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          const encryptedKey = encryptKey(passkey);
          localStorage.setItem('accessKey',encryptedKey);
          setOpen(false);
  }else {
    setError('Invalid passkey. Please try again.')
  }
  }
const closeModal = () => {
  setOpen(false);
  router.push('/')
}

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
  
  <AlertDialogContent className='dhad-alert-dialog'>
    <AlertDialogHeader>
      <AlertDialogTitle className='flex items-start justify-between'>
        Admin Access Verification
        <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
        </AlertDialogTitle>
      <AlertDialogDescription>
      To access the admin page, please enter the passkey.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <div>
    <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
  <InputOTPGroup className='shad-otp'>
    <InputOTPSlot index={0} className="shad-otp-slot"/>
    <InputOTPSlot index={1} className="shad-otp-slot"/>
    <InputOTPSlot index={2} className="shad-otp-slot"/>
    <InputOTPSlot index={3} className="shad-otp-slot"/>
    <InputOTPSlot index={4} className="shad-otp-slot"/>
    <InputOTPSlot index={5} className="shad-otp-slot"/>
  </InputOTPGroup>
</InputOTP>

{error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
    </div>


    <AlertDialogFooter>
   
      <AlertDialogAction onClick={(e) => validatePasskey(e)}
        className="shad-primary-btn w-full"
        >
        Enter Admin Passkey
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default PasskeyModal
