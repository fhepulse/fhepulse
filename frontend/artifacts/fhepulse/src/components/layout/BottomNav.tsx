import { Link, useLocation } from "wouter";
import { Home, PieChart, PlusSquare, Heart, LayoutDashboard, Target, Coins, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const getNavItems = () => {
    if (location.startsWith("/creator")) {
      return [
        { label: "Dashboard", href: "/creator", icon: LayoutDashboard },
        { label: "Polls", href: "/creator/polls", icon: PieChart },
        { label: "Create", href: "/creator", icon: PlusSquare },
        { label: "Quests", href: "/creator/quests", icon: Target },
        { label: "Home", href: "/", icon: Home },
      ];
    }
    if (location.startsWith("/participant")) {
      return [
        { label: "Dashboard", href: "/participant", icon: LayoutDashboard },
        { label: "Quests", href: "/participant/quests", icon: Target },
        { label: "Points", href: "/participant/points", icon: Coins },
        { label: "Rewards", href: "/participant/rewards", icon: TrendingUp },
        { label: "Home", href: "/", icon: Home },
      ];
    }
    if (location.startsWith("/donor")) {
      return [
        { label: "Dashboard", href: "/donor", icon: LayoutDashboard },
        { label: "Explore", href: "/donor/explore", icon: PieChart },
        { label: "Funded", href: "/donor/funded", icon: Heart },
        { label: "Trending", href: "/donor/trending", icon: TrendingUp },
        { label: "Home", href: "/", icon: Home },
      ];
    }
    // Default: landing page nav
    return [
      { label: "Home", href: "/", icon: Home },
      { label: "Polls", href: "#", icon: PieChart },
      { label: "Creator", href: "/creator", icon: PlusSquare },
      { label: "Earn", href: "/participant", icon: Coins },
      { label: "Donor", href: "/donor", icon: Heart },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/10 pb-safe md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
