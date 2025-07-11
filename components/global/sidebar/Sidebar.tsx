"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { UserNavigation } from "./UserNavigation";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface AppSidebarProps {
  role: string;
  links: {
    title: string;
    items: {
      title: string;
      url: string;
    }[];
  }[];
}

export function AppSidebar({ role, links }: AppSidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  const isActive = (url: string) => {
    const cleanPath = pathname.replace(/\/$/, "");
    const cleanUrl = `/${role}${url}`.replace(/\/$/, "");
    return cleanPath === cleanUrl;
  };

  useEffect(() => {
    async function main() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    main();
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="/" className="flex items-center gap-2 self-center font-medium p-2">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              EMS
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {links.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <a href={`/${role}${item.url}`}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
      {user && (
        <SidebarFooter>
          <UserNavigation
            user={{
              name: user.user_metadata.full_name,
              email: user.email,
              avatar: user.user_metadata.avatar_url,
            }}
          />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
