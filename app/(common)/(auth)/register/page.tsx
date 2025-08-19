"use client";

import Image from "next/image";
import RegisterForm from "@/components/section/register/RegisterForm";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-row items-stretch justify-center p-0 md:p-0">
      {/* Left: Register Form (40%) */}
      <div className="flex flex-col bg-background shadow-lg p-8 md:p-10 w-full md:w-2/5 max-w-md md:max-w-none rounded-none md:rounded-l-xl justify-between">
        {/* Logo/Link at the top */}
        <div>
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            EMS
          </Link>
        </div>
        {/* Form centered vertically */}
        <div className="flex flex-1 items-center justify-center w-full h-full">
          <div className="w-full px-1 md:px-8">
            <RegisterForm />
          </div>
        </div>
      </div>
      {/* Right: Testimonial (60%) */}
      <div className="hidden md:flex flex-col items-center justify-center w-3/5 bg-black text-white rounded-r-xl shadow-lg p-10">
        <div className="flex flex-col items-start max-w-xl mx-auto">
          <span className="text-6xl opacity-10 leading-none mb-4">“</span>
          <div className="text-2xl font-semibold mb-4">
            Where has <span className="text-primary">@ems</span> been all my
            life?{" "}
            <span role="img" aria-label="heart eyes">
              😍
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {/* Example avatar */}
            <Image
              width={40}
              height={40}
              src="https://i.pravatar.cc/40"
              alt="User avatar"
              className="w-10 h-10 rounded-full bg-muted"
            />
            <span className="opacity-80">@ADSC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
