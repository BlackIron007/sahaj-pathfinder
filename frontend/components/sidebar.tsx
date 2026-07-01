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

  const rmItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Acquisition Intelligence", href: "/acquisition-intelligence", icon: Search },
    { name: "Offer Workspace", href: "/offer-workspace", icon: Briefcase },
    { name: "Impact Center", href: "/impact-center", icon: TrendingUp },
    { name: "Settings", href: "#", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href) && href !== "#";
  };

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
      
      <nav className="flex-1 px-4 py-6 flex flex-col gap-6 overflow-y-auto">
        {/* RM Workflow */}
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] uppercase tracking-widest font-semibold text-secondary/60">
            RM Workflow
          </p>
          {rmItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                data-demo={`sidebar-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  active
                    ? "bg-soft text-primary font-semibold border-l-2 border-primary"
                    : "text-secondary hover:bg-soft hover:text-foreground"
                }`}
                onClick={onClose}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-primary" : "text-secondary"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Technical Showcase — Judge View */}
        <div className="space-y-1">
          <div className="px-3 mb-2 flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-secondary/60">
              Technical Showcase
            </p>
            <span className="text-[9px] font-bold bg-primary/10 text-primary border border-primary/30 px-1.5 py-0.5 rounded">
              JUDGE
            </span>
          </div>
          <Link
            href="/architecture"
            data-demo="sidebar-link-architecture"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive("/architecture")
                ? "bg-soft text-primary font-semibold border-l-2 border-primary"
                : "text-secondary hover:bg-soft hover:text-foreground"
            }`}
            onClick={onClose}
          >
            <Network className={`h-4 w-4 flex-shrink-0 ${isActive("/architecture") ? "text-primary" : "text-secondary"}`} />
            Architecture
          </Link>
        </div>
      </nav>

      {/* System Health */}
      <div className="p-4 border-t border-border bg-soft/30 flex flex-col gap-2 font-sans">
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-secondary/60 tracking-wider block">System Versions</span>
          <div className="text-[9.5px] text-secondary/70 font-mono space-y-0.5">
            <div className="flex justify-between">
              <span>Recommendation Engine</span>
              <span>v2.3</span>
            </div>
            <div className="flex justify-between">
              <span>Discovery Engine</span>
              <span>v1.8</span>
            </div>
            <div className="flex justify-between">
              <span>Graph Intelligence</span>
              <span>v1.4</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 pt-1.5 flex items-center justify-between text-[11px] text-secondary">
          <span className="flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> Ingestion Status</span>
          <span className="text-status-approved-accent font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-approved-accent inline-block"></span>
            CSV Active
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-secondary">
          <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Platform Latency</span>
          <span className="font-mono font-semibold text-foreground">12ms</span>
        </div>
      </div>
    </aside>
  );
}
