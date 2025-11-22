"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"

import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import Image from "next/image"
import { Doctors } from "@/constants"
import { Appointment } from "@/types/appwrite.types";
import AppointmentModal from "../AppointmentModal"




// Place this OUTSIDE your columns array, ideally at the top of your file/component
const patientNames: Record<string, string> = {
  "6921473b0028fbf5a180": "Riya",
  "6921475d000e49542122": "Manya",
  "6921f684001a3cf5b1bb":"Mahi"
};

export const columns: ColumnDef<Appointment>[] = [
    {
        header:'ID',
        cell:({row}) => <p className="text-14-medium">{row.index+1}</p>
    }, 
    {
      accessorKey: "patient",
      header: "Patient",
      cell: ({ row }) => {
        const appointment = row.original;
        // if appointment.patient is a string
        const patientId = typeof appointment.patient === "string"
          ? appointment.patient
          // if appointment.patient is { $id: ... }
          : appointment.patient?.$id;
    
        const patientName = patientNames[patientId] || "Unknown";
        return <p className="text-14-medium">{patientName}</p>;
      }
    },
    
    
  {
    accessorKey: "status",
    header: "Status",
    cell:({row}) => (
      <div className="min-w-[115px">
        <StatusBadge status={row.original.status}/>
      </div>
    )
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell:({row}) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row :{original:data}}) => {
   

 
      return (
        <div className="flex gap-1">
          <AppointmentModal 
          type="schedule"
          patientId = {data.patient.$id}
          userId={data.userId}
          appointment={data}
        
          />
           <AppointmentModal 
          type="cancel"
          patientId = {data.patient.$id}
          userId={data.userId}
          appointment={data}
        />
        </div> 
      );
    },
  },
];