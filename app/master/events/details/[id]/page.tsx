"use client";

import { Heading } from "@/components/global/heading/Heading";
import { EventFeedbackTable } from "@/components/section/master/events/details/feedbacks/EventFeedback";
import { EventRegistrationTable } from "@/components/section/master/events/details/registrations/EventRegistration";
import { Separator } from "@/components/ui/separator";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { use, useEffect } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const setCurrentBreadcrumb = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumb([
      { label: "Dashboard", href: "/master" },
      { label: "Events", href: "/master/events" },
      { label: "Event Details", href: `/master/events/details/${id}` },
    ]);
  });

  if (!id) {
    return <div>Error: Event ID is required for editing.</div>;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Event Details`} description="Manage Event Details" />
      </div>

      <Separator />

      <EventRegistrationTable id={id} />

      <EventFeedbackTable id={id} />
    </>
  );
}
