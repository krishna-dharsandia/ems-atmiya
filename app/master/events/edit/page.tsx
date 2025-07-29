"use client";

import EventForm from "@/components/section/master/events/EventForm";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const setCurrentBreadcrumb = useSetAtom(sidebarBreadcrumbs);
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  useEffect(() => {
    setCurrentBreadcrumb([
      { label: "Dashboard", href: "/master" },
      { label: "Events", href: "/master/events" },
      { label: "Edit Event", href: "/master/events/edit" },
    ]);
  });

  console.log("Editing event with ID:", eventId);

  if (!eventId) {
    return <div>Error: Event ID is required for editing.</div>;
  }

  return <EventForm id={eventId} />;
}
