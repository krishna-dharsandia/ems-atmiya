"use client";

import HackathonForm from "@/components/section/master/hackathons/HackathonForm";

export default function EditHackathonPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto py-8 px-4">
      <HackathonForm id={params.id} />
    </div>
  );
}
