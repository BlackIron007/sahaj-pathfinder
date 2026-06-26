"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  TrendingUp, 
  Network, 
  Settings, 
  Fingerprint,
  X,
  Server,
  Activity
} from "lucide-react";

import { usePathname } from "next/navigation";

interface SidebarProps {
  currentTab?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Acquisition Intelligence", href: "/acquisition-intelligence", icon: Search },
    { name: "Offer Workspace", href: "/offer-workspace", icon: Briefcase },
    { name: "Impact Center", href: "/impact-center", icon: TrendingUp },
    { name: "Architecture", href: "#", icon: Network },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200 lg:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Fingerprint className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-bold text-base tracking-tight text-foreground">Sahaj PathFinder</h1>
            <p className="text-[10px] text-secondary uppercase font-semibold tracking-wider">SBI Acquisition Intelligence</p>
          </div>
        </div>
        {onClose && (
          <button className="lg:hidden p-1 text-secondary hover:text-foreground" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          let isActive = false;
          if (item.href === "/") {
            isActive = pathname === "/";
          } else {
            isActive = pathname.startsWith(item.href) && item.href !== "#";
          }
          
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
              onClick={onClose}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-primary" : "text-secondary"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* System Health Indicators */}
      <div className="p-4 border-t border-border bg-soft/30 text-xs text-secondary flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> Database Ingestion</span>
          <span className="text-status-approved-accent font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-approved-accent inline-block"></span>
            CSV Active
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Platform Latency</span>
          <span className="font-mono font-semibold text-foreground">12ms</span>
        </div>
      </div>
    </aside>
  );
}
