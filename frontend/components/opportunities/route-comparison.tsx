"use client";

import React, { useState } from "react";
import { RouteAnalysisItem } from "@/lib/api/opportunities";
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";

interface RouteComparisonProps {
  analysis: RouteAnalysisItem[];
}

export function RouteComparison({ analysis }: RouteComparisonProps) {
  const [expandedRoute, setExpandedRoute] = useState<string | null>(
    analysis.find(a => a.selected)?.route || null
  );

  const toggleRoute = (route: string) => {
    setExpandedRoute(expandedRoute === route ? null : route);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">PathFinder Route Evaluation</h3>
        <p className="text-[10px] text-secondary mt-1">Select any route option below to inspect pros, cons, and explainable decision parameters.</p>
      </div>

      <div className="divide-y divide-border/60">
        {analysis.map((item) => {
          const isSelected = item.selected;
          const isExpanded = expandedRoute === item.route;

          return (
            <div key={item.route} className="transition-colors hover:bg-soft/10">
              {/* Row Header */}
              <button
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                onClick={() => toggleRoute(item.route)}
              >
                <div className="flex-1 space-y-1.5 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{item.route}</span>
                    {isSelected && (
                      <span className="bg-status-approved-bg text-status-approved-accent text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Recommended by PathFinder
                      </span>
                    )}
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="flex items-center justify-between gap-4 w-[95%]">
                    <div className="flex-1 bg-soft rounded-full h-2 relative overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-primary' : 'bg-secondary/40'}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-foreground min-w-[32px] text-right">{item.score}%</span>
                  </div>
                </div>

                <div className="text-secondary hover:text-foreground">
                  {isExpanded ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 bg-soft/20 border-t border-border/30 space-y-4 text-xs">
                  {/* Decision rationale explanation */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Decision Logic</span>
                    <p className="text-foreground leading-relaxed">
                      {isSelected ? item.why_won : item.why_lost}
                    </p>
                  </div>

                  {/* pros/cons lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-status-approved-accent tracking-wider flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" /> Advantages
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-secondary text-[11px] leading-relaxed">
                        {item.pros.map((p, idx) => <li key={idx}>{p}</li>)}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-status-blocked-accent tracking-wider flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Disadvantages
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-secondary text-[11px] leading-relaxed">
                        {item.cons.map((c, idx) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Supporting evidence */}
                  <div className="border-t border-border/40 pt-3 text-[10px] text-secondary">
                    <span className="font-semibold text-foreground">Underwriting Evidence:</span> {item.evidence}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
