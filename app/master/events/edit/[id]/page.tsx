"use client";

import EventForm from "@/components/section/master/events/EventForm";
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
      { label: "Edit Event", href: "/master/events/edit" },
    ]);
  });

  if (!id) {
    return <div>Error: Event ID is required for editing.</div>;
  }

  return <EventForm id={id} />;
}
