import React from "react";
import { RoutePerformanceItem } from "@/lib/api/impact";

interface RouteLeaderboardProps {
  routes: RoutePerformanceItem[];
}

export function RouteLeaderboard({ routes }: RouteLeaderboardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        PathFinder Route Performance Leaderboard
      </h3>

      <div className="space-y-6">
        {routes.map((r, idx) => {
          const isTop = idx === 0;
          return (
            <div key={idx} className="space-y-3 border-b border-border/20 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${isTop ? "text-primary" : "text-foreground"}`}>{r.route}</span>
                  {isTop && (
                    <span className="bg-status-approved-bg text-status-approved-accent text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Top Performer
                    </span>
                  )}
                </div>
                <div className="flex gap-4 text-[10px] font-mono text-secondary">
                  <span>{r.wins} acquisitions</span>
                  <span className="font-semibold text-foreground">₹{r.revenue_cr} Cr book</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-soft rounded-full h-3.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${isTop ? 'bg-primary' : 'bg-secondary/40'}`}
                    style={{ width: `${r.conversion_rate}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold font-mono text-foreground min-w-[40px] text-right">
                  {r.conversion_rate}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
