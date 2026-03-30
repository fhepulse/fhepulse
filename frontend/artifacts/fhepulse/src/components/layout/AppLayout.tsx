import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  role?: 'Creator' | 'Participant' | 'Donor';
}

export function AppLayout({ children, role }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      <Header />

      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        {role && <Sidebar role={role} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(prev => !prev)} />}
        <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
