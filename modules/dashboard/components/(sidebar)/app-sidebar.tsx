"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { ChevronDown, CreditCard, Github, Layers, LayoutDashboard, LucideIcon, MessageSquareCode, Settings, User2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useState } from 'react'
import SignoutButton from './signout-button';
import ThemeSwitch from '@/components/ui/switch';

export default function AppSidebar() {

  // const [mounted, setMounted] = useState(false);
  const pathname = usePathname()


  const navigationItems: { title: string; url: string; icon: LucideIcon }[] = [
  { title: "Dashboard",        url: "/dashboard",              icon: LayoutDashboard },
  { title: "Repository",       url: "/dashboard/repository",   icon: Layers },
  { title: "Reviewa",          url: "/dashboard/reviewa",      icon: MessageSquareCode },
  { title: "Subscription",     url: "/dashboard/subscription", icon: CreditCard },
  { title: "Settings",         url: "/dashboard/settings",      icon: Settings },
  ];

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/dashboard")
  }

  const {data: session} = useSession()

  return (
    <Sidebar >
      <SidebarHeader className='h-16 flex items-center justify-center gap-2 shrink-0 px-2 border-b border-zinc-700'>
        <Button variant={"secondary"} className='w-full bg-sidebar-accent justify-between!'>

          <div className='flex items-center gap-2'>
          <Github className='w-5 h-5 fill-black border-black bg-zinc-200 rounded-full' />
          {session?.user.name}
          </div>

          <div className='flex items-center gap-2'>
            <Badge variant={"outline"} className='text-xs rounded-sm'>Free</Badge>
            <ChevronDown className='w-5 h-5' />
          </div>
        </Button>
      </SidebarHeader>

      <SidebarContent className='px-3 py-6 flex flex-col gap-1'>
        <SidebarMenu>
          {navigationItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={`h-11 px-4 rounded-lg ${isActive(item.url) && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"}`}>
                <Link href={item.url}>
                  <item.icon className='w-5 h-5' />
                  <span className='text-sm font-semibold'>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className='border-t px-3 py-4'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                size={"lg"}
                className='h-12 px-4 data-[state=open]:bg-sidebar-accent 
                data-[state=open]:text-sidebar-accent-foreground'>
                  <Avatar className='w-10 h-10 rounded-full shrink-0'> 
                    <AvatarImage src={session?.user.image || ""}/>
                    <AvatarFallback className=' rounded-lg'>{session?.user.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-relaxed min-w-0'>
                    <span className='truncate text-sm font-semibold'>{session?.user.name}</span>
                    <span className='truncate text-sm font-semibold text-sidebar-accent-foreground/50'>{session?.user.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-72 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl shadow-black/20 dark:shadow-black/40 backdrop-blur-sm"
                align="end"
                side="right"
                sideOffset={12}
              >
                <DropdownMenuLabel className="p-3 font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-border/60" />

                <div className='w-full'>
                  <ThemeSwitch/>
                </div>
                
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-accent/70 transition-colors">
                      <User2 className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-border/60" />

                <SignoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
