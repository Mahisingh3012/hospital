import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StatCard from '@/components/StatCard';
import {DataTable} from '@/components/table/DataTable';
import {columns} from '@/components/table/columns';

import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';



const Admin = async() => {
  
  const appointments = await getRecentAppointmentList(); 

  return (
    <div className="w-full bg-[#0B0F1A] min-h-screen py-10"> 
      {/* Outer blue-ish background */}

      {/* Inner Black Container */}
      <div className="mx-auto max-w-7xl bg-[#0D1117] rounded-2xl border border-gray-800 shadow-lg px-[5%] py-8">

        {/* TOP HEADER */}
        <header className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="Logo"
              className="h-8 w-fit"
            />
          </Link>

          {/* Right side text */}
          <p className="text-lg font-semibold text-gray-300">
            Admin Dashboard
          </p>
        </header>

   
      </div>
     <main className="admin-main mt-10 mx-auto max-w-7xl px-[5%]">
  <section className="w-full space-y-4">
    <h1 className="header">Welcome 👋</h1>
    <p className="text-dark-700">
      Start the day with managing new appointments
    </p>
  </section>

  <section className='dmin-stat grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
    <StatCard
    type = "appointments"
    count={appointments.scheduledCount}
    label="Scheduled appointments"
    icon="/assets/icons/appointments.svg"
    />

<StatCard
    type = "pending"
    count={appointments.pendingCount}
    label="Pending appointments"
    icon="/assets/icons/pending.svg"
    />

<StatCard
    type = "cancelled"
    count={appointments.cancelledCount}
    label="Cancelled appointments"
    icon="/assets/icons/cancelled.svg"
    />
  </section>
  

  <DataTable columns = {columns} data={appointments.documents} />

</main>

    </div>
  );
};

export default Admin;
