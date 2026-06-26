"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  TrendingUp, 
  Network, 
  Settings, 
  Fingerprint
} from "lucide-react";

interface SidebarProps {
  currentTab?: string;
}

export function Sidebar({ currentTab = "Dashboard" }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Acquisition Intelligence", href: "#", icon: Search },
    { name: "Offer Workspace", href: "#", icon: Briefcase },
    { name: "Impact Center", href: "#", icon: TrendingUp },
    { name: "Architecture", href: "#", icon: Network },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <Fingerprint className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-bold text-base tracking-tight text-foreground">Sahaj PathFinder</h1>
          <p className="text-[10px] text-secondary uppercase font-semibold tracking-wider">SBI Acquisition Intelligence</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentTab === item.name;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-soft text-primary font-semibold border-l-2 border-primary"
                  : "text-secondary hover:bg-soft hover:text-foreground"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-primary" : "text-secondary"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-soft/30 text-xs text-secondary flex flex-col gap-1">
        <div className="flex justify-between">
          <span>Environment</span>
          <span className="font-mono text-[10px] text-foreground font-semibold">SBI-PROD-MVP</span>
        </div>
        <div className="flex justify-between">
          <span>API Services</span>
          <span className="text-status-approved-accent font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-approved-accent inline-block animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
