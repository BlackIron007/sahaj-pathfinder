"use client";

import { Bell, Search, ShieldCheck, Menu } from "lucide-react";

interface TopNavProps {
  onToggleMenu: () => void;
}

export function TopNav({ onToggleMenu }: TopNavProps) {
  return (
    <header className="h-16 border-b border-border bg-card/85 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 w-full">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button 
          className="lg:hidden p-1 text-secondary hover:text-foreground" 
          onClick={onToggleMenu}
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="relative w-64 md:w-96 hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-secondary" />
          <input
            type="text"
            placeholder="Search MSME name, industry, or recommended route..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all font-sans"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-status-approved-bg/60 rounded text-[11px] text-status-approved-accent border border-status-approved-accent/15">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="font-medium">RM Authorized</span>
        </div>

        <button className="relative text-secondary hover:text-foreground transition-colors p-1">
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-status-blocked-accent rounded-full"></span>
        </button>

        <div className="h-5 w-px bg-border"></div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-foreground">Dev Sharma</span>
            <span className="text-[10px] text-secondary">SBI Relationship Manager</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-soft border border-border flex items-center justify-center text-primary font-bold text-xs">
            DS
          </div>
        </div>
      </div>
    </header>
  );
}
