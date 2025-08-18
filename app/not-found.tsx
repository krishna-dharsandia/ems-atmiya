"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <section className="">
      <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        <div className="wf-ull lg:w-1/2">
          <p className="text-sm font-medium">404 error</p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Page not found</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Sorry, the page you are looking for doesn't exist.Here are some helpful links:</p>

          <div className="flex items-center mt-6 gap-x-3">
            <Button className="flex items-center justify-center" variant={"outline"} onClick={() => router.back()}>
              <ArrowLeftIcon />

              <span>Go back</span>
            </Button>
            <Button onClick={() => router.push("/")}>
              Take me home
            </Button>
          </div>
        </div>

        <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
          <Image className="w-full max-w-lg lg:mx-auto" src="/images/components/illustration.svg" alt="" width={500} height={500} />
        </div>
      </div>
    </section>
  );
}
