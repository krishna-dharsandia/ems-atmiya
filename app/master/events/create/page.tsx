"use client";

import EventForm from "@/components/section/master/events/EventForm";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export default function Page() {
  const setCurrentBreadcrumb = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumb([
      { label: "Dashboard", href: "/master" },
      { label: "Events", href: "/master/events" },
      { label: "Create Event", href: "/master/events/create" },
    ]);
  });

  return <EventForm />;
}
