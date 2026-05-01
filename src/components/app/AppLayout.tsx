import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export const AppLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full surface-dark">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center gap-3 border-b border-sidebar-border bg-[hsl(0_0%_4%)] px-4 sticky top-0 z-30">
          <SidebarTrigger className="text-white/80 hover:text-gold" />
          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-success/15 text-success px-3 py-1 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Markets Open
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 bg-[hsl(0_0%_4%)] text-white">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);
