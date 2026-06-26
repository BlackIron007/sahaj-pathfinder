import React from "react";
import { EcosystemDetail } from "@/lib/api/opportunities";
import { Network, Building2 } from "lucide-react";

interface EcosystemGraphProps {
  ecosystem: EcosystemDetail;
}

export function EcosystemGraph({ ecosystem }: EcosystemGraphProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between h-full">
      <div className="space-y-6">
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 flex items-center gap-2">
          <Network className="h-4.5 w-4.5 text-primary" /> Ecosystem Network context
        </h3>

        {/* Visual Graph Mock layout */}
        <div className="bg-soft/20 border border-border/40 rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 w-full justify-center">
            {/* Anchor Node */}
            <div className="w-20 h-20 bg-card border border-border rounded-full flex flex-col items-center justify-center text-center shadow-xs p-1">
              <span className="text-[8px] uppercase font-bold text-secondary">Anchor Corp</span>
              <span className="text-[9px] font-semibold text-foreground leading-tight mt-0.5">Tier-1 Anchor</span>
            </div>
            
            <div className="h-[2px] w-8 bg-secondary/30 relative flex items-center justify-center">
              <span className="absolute text-[8px] text-secondary font-mono -top-3">1st</span>
            </div>

            {/* Target MSME Node */}
            <div className="w-24 h-24 bg-soft border-2 border-primary/70 rounded-full flex flex-col items-center justify-center text-center shadow-sm ring-4 ring-primary/5 p-1">
              <span className="text-[8px] uppercase font-bold text-primary">Target Node</span>
              <span className="text-[9px] font-extrabold text-foreground leading-tight mt-0.5">Current MSME</span>
              <span className="text-[8px] font-mono text-secondary mt-1">Score: {ecosystem.potential_future_msmes_count > 0 ? "91%" : "N/A"}</span>
            </div>

            <div className="h-[2px] w-8 bg-secondary/30 relative flex items-center justify-center">
              <span className="absolute text-[8px] text-secondary font-mono -top-3">2nd</span>
            </div>

            {/* Downstream Suppliers Node */}
            <div className="w-20 h-20 bg-card border border-border/80 border-dashed rounded-full flex flex-col items-center justify-center text-center p-1">
              <span className="text-[8px] uppercase font-bold text-secondary/60">Yield</span>
              <span className="text-[9px] font-medium text-secondary leading-tight mt-0.5">{ecosystem.potential_future_msmes_count} Suppliers</span>
            </div>
          </div>
          <span className="text-[9px] text-secondary font-mono">1st Degree Anchor Trade Backing</span>
        </div>

        {/* Key expansion statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-soft/30 border border-border/30 rounded p-3 text-center">
            <span className="text-[9px] uppercase font-bold text-secondary">Sub-Suppliers</span>
            <div className="text-lg font-bold text-foreground mt-1">+{ecosystem.potential_future_msmes_count} Discovered</div>
          </div>
          <div className="bg-soft/30 border border-border/30 rounded p-3 text-center">
            <span className="text-[9px] uppercase font-bold text-secondary">Potential Cross-Sell Value</span>
            <div className="text-lg font-bold text-foreground mt-1">{(ecosystem.estimated_ecosystem_value_lakh / 100).toFixed(1)} Cr</div>
          </div>
        </div>

        {/* List of second-degree prospects */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] uppercase font-bold text-secondary tracking-wider">Second-Degree opportunities</h4>
          <div className="divide-y divide-border/40">
            {ecosystem.second_degree_opportunities.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <div>
                    <span className="font-semibold text-foreground block">{item.company_name}</span>
                    <span className="text-[9px] text-secondary">{item.relationship}</span>
                  </div>
                </div>
                <span className="font-mono text-secondary font-medium">{item.value_lakh} Lakhs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
