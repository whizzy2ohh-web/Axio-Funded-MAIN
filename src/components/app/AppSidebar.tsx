import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, LineChart, History, Trophy, Banknote, Settings, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/landing/Logo";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const items = [
  { url: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { url: "/app/accounts", label: "My Accounts", icon: Wallet },
  { url: "/app/trade", label: "Trade", icon: LineChart },
  { url: "/app/history", label: "History", icon: History },
  { url: "/app/leaderboard", label: "Leaderboard", icon: Trophy },
  { url: "/app/payouts", label: "Payout Request", icon: Banknote },
  { url: "/app/settings", label: "Settings", icon: Settings },
];

export const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  const isActive = (url: string, exact?: boolean) => exact ? pathname === url : pathname.startsWith(url);
  const initials = (user?.user_metadata?.full_name || user?.email || "U").split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {!collapsed ? <Logo dark /> : <Logo withWordmark={false} className="h-8 w-8 mx-auto" />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(it => (
                <SidebarMenuItem key={it.url}>
                  <SidebarMenuButton asChild isActive={isActive(it.url, it.exact)} className="data-[active=true]:bg-gold/15 data-[active=true]:text-gold hover:bg-white/5">
                    <NavLink to={it.url} end={it.exact} className="flex items-center gap-3">
                      <it.icon className="h-4 w-4" />
                      {!collapsed && <span>{it.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={async () => { await signOut(); nav("/"); }} className="hover:bg-white/5">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-gold/40"><AvatarFallback className="bg-gold/15 text-gold font-bold text-xs">{initials}</AvatarFallback></Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-sidebar-foreground truncate">{user?.user_metadata?.full_name || "Trader"}</div>
              <div className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
