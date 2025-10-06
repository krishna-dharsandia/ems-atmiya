"use client";

import { useSetAtom } from "jotai";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ChartArea } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/global/heading/Heading";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminOverview() {
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const { user } = useAuth(); // Use auth context instead of direct calls

  useEffect(() => {
    setCurrentBreadcrumbs([{ label: "Dashboard", href: "/admin" }]);
  }, [setCurrentBreadcrumbs]);

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <Heading
          title={`Welcome Back - ${user?.user_metadata.full_name
            ? user?.user_metadata.full_name
            : "Admin"
            }`}
          description="Platform-wide insights and analytics for the entire system."
        />
        <Button className="mb-4">
          <ChartArea className="mr-2 h-4 w-4" /> More Insights
        </Button>
      </div>

      <Separator className="mb-8" />
    </div>
  );
}
