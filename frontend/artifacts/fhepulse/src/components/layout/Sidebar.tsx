import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  Coins,
  Target,
  Home,
  Users,
  HeartHandshake,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp
} from "lucide-react";

interface SidebarProps {
  role: 'Creator' | 'Participant' | 'Donor';
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ role, collapsed, onToggleCollapse }: SidebarProps) {
  const [location] = useLocation();

  const getRoleLinks = () => {
    switch(role) {
      case 'Creator':
        return [
          { label: "Dashboard", href: "/creator", icon: LayoutDashboard },
          { label: "Manage Polls", href: "/creator/polls", icon: ListChecks },
          { label: "Questionnaires", href: "/creator/questionnaires", icon: FileText },
          { label: "Distributions", href: "/creator/distributions", icon: Coins },
          { label: "Quests", href: "/creator/quests", icon: Target },
        ];
      case 'Participant':
        return [
          { label: "Dashboard", href: "/participant", icon: LayoutDashboard },
          { label: "Quests", href: "/participant/quests", icon: Target },
          { label: "My Points", href: "/participant/points", icon: Coins },
          { label: "Membership", href: "/participant/membership", icon: Award },
          { label: "Rewards History", href: "/participant/rewards", icon: ListChecks },
        ];
      case 'Donor':
        return [
          { label: "Dashboard", href: "/donor", icon: LayoutDashboard },
          { label: "Explore Polls", href: "/donor/explore", icon: Target },
          { label: "Funded Polls", href: "/donor/funded", icon: HeartHandshake },
          { label: "Funding History", href: "/donor/history", icon: Coins },
          { label: "Trending", href: "/donor/trending", icon: TrendingUp },
        ];
    }
  };

  const getSwitchLinks = () => {
    const links = [{ label: "Home", href: "/", icon: Home }];
    if (role !== 'Creator') links.push({ label: "Creator Dashboard", href: "/creator", icon: ListChecks });
    if (role !== 'Participant') links.push({ label: "Participant View", href: "/participant", icon: Users });
    if (role !== 'Donor') links.push({ label: "Donor Dashboard", href: "/donor", icon: HeartHandshake });
    return links;
  };

  const roleLinks = getRoleLinks();
  const switchLinks = getSwitchLinks();

  return (
    <aside className={cn(
      "border-r border-white/5 bg-sidebar hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8">
          {!collapsed && (
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 px-3">{role.toUpperCase()}</p>
          )}
          <nav className="space-y-1">
            {roleLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg text-sm font-medium transition-all group",
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground"
                  )}
                >
                  <link.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground")} />
                  {!collapsed && link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mb-8">
          {!collapsed && (
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 px-3">SWITCH TO</p>
          )}
          <nav className="space-y-1">
            {switchLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={collapsed ? link.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group",
                  collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                )}
              >
                <link.icon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-sidebar-foreground" />
                {!collapsed && link.label}
              </Link>
            ))}
          </nav>
        </div>

        {!collapsed && (
          <div>
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 px-3">QUICK ACTIONS</p>
            <nav className="space-y-1">
              <Link href="/token-stats" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group">
                <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
                Token Stats
              </Link>
              <Link href="/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group">
                <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
                Analytics
              </Link>
              <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group">
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
                Settings
              </Link>
            </nav>
          </div>
        )}
        {collapsed && (
          <div>
            <nav className="space-y-1">
              <Link href="/token-stats" title="Token Stats" className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group">
                <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
              </Link>
              <Link href="/analytics" title="Analytics" className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group">
                <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
              </Link>
              <Link href="/settings" title="Settings" className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-sidebar-foreground transition-all group">
                <Settings className="w-4 h-4 text-muted-foreground group-hover:text-sidebar-foreground" />
              </Link>
            </nav>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors p-2 w-full",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && "Collapse Sidebar"}
        </button>
      </div>
    </aside>
  );
}
