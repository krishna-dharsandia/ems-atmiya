import { atom } from "jotai";

type SidebarBreadcrumbs = {
  label: string;
  href: string;
};

export const sidebarBreadcrumbs = atom<SidebarBreadcrumbs[]>([]);
