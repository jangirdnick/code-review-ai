import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/modules/dashboard/components/app-sidebar";

export default function DashboardLayout(
    {children}: {children: React.ReactNode}
) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="h-16 flex items-center gap-2 shrink-0 px-4 border-b border-zinc-700">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mx-2 h-4"/>
          <h1 className="text-xl text-foreground font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-hidden">
         {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
