import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/global/sidebar/Sidebar";
import { masterSidebarLinks } from "@/components/section/master/sidebar/links";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { BreadcrumbsItems } from "@/components/global/breadcrumbs/BreadcrumbsItems";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar role="master" links={masterSidebarLinks} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky p-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbsItems />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <PlusCircle size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-30 rounded-lg" side="bottom" align="end" sideOffset={4}>
              <DropdownMenuItem>Events</DropdownMenuItem>
              <DropdownMenuItem>Students</DropdownMenuItem>
              <DropdownMenuItem>Admins</DropdownMenuItem>
              <DropdownMenuItem>Masters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
