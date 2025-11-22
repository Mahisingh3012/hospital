import React from 'react'
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ButtonProps {
    isLoading: boolean;
    className?: string;
    children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={
        className ??
        "w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition"
      }
    >
      {isLoading ? "Loading..." : children}
    </Button>
  );
};

export default SubmitButton;
