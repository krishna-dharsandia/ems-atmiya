"use client";

import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export default function Page() {
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumbs([{ label: "Dashboard", href: "/master" }]);
  });

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Master</h1>
    </div>
  );
}
