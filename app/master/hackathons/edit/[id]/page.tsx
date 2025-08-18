"use client";

import HackathonForm from "@/components/section/master/hackathons/HackathonForm";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="container mx-auto py-8 px-4">
      <HackathonForm id={id} />
    </div>
  );
}
