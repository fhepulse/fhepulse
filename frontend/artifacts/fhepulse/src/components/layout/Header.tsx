import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectWalletButton } from "@/components/web3/ConnectWalletButton";
import { NetworkBadge } from "@/components/web3/NetworkBadge";

export function Header() {
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Analytics", href: "/analytics" },
    { label: "Creator", href: "/creator" },
    { label: "Participant", href: "/participant" },
    { label: "Donor", href: "/donor" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl hidden md:block">
      <div className="flex h-16 items-center px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FhePulse</span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="h-4 w-px bg-white/10 mx-2" />
          <Link href="/token-stats" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all">Token Stats</Link>
          <Link href="/analytics" className="px-4 py-2 rounded-lg text-sm font-medium text-primary hover:text-primary/80 transition-all font-semibold">Analytics</Link>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <Link href="/settings" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-all">Settings</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
            <Settings className="w-4 h-4" />
          </Button>
          <NetworkBadge />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
