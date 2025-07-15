"use client";

import { useAtomValue } from "jotai";
import React from "react";

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { sidebarBreadcrumbs } from "@/store/sidebar";

export function BreadcrumbsItems() {
  const currentBreadcrumbs = useAtomValue(sidebarBreadcrumbs);

  return (
    <>
      {currentBreadcrumbs.map((breadcrumb, idx) => (
        <React.Fragment key={idx}>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
        </React.Fragment>
      ))}
    </>
  );
}
