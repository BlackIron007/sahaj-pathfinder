import React from "react";
import { ArrowDown } from "lucide-react";
import { NetworkExpansionData } from "@/lib/api/impact";

interface NetworkExpansionGraphProps {
  data: NetworkExpansionData;
}

export function NetworkExpansionGraph({ data }: NetworkExpansionGraphProps) {
  const steps = [
    { label: "Existing Customer", desc: "SBI Core Customer Ledger base node" },
    { label: "Newly Acquired MSME", desc: "First-tier acquired trade partner" },
    { label: "Supplier Network", desc: "Direct suppliers mapped on-consent" },
    { label: "Second Degree Suppliers", desc: "Secondary downstream sellers" },
    { label: "Future Opportunities", desc: "PathFinder targets queue pipeline" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        PathFinder Network Effects Visualization
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Side: Graph flow */}
        <div className="lg:col-span-2 space-y-4 bg-soft/20 p-6 border border-border/20 rounded-lg flex flex-col justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-4 bg-card border border-border/40 p-4 rounded shadow-xs">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-card shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-foreground block uppercase tracking-wider">{step.label}</span>
                  <span className="text-[9px] text-secondary block mt-0.5">{step.desc}</span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex justify-center -my-2">
                  <ArrowDown className="h-4 w-4 text-primary/60" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right Side Metrics (Aligned with stages height) */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-soft/30 border border-border/30 p-4 rounded-md text-center flex flex-col justify-between h-[100px]">
            <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Potential MSMEs Discovered</span>
            <div className="text-xl font-bold text-foreground my-auto">+{data.potential_msmes_discovered}</div>
            <span className="text-[8px] text-secondary/60 block mt-auto leading-none">Mapped downstream supplier count</span>
          </div>
          <div className="bg-soft/30 border border-border/30 p-4 rounded-md text-center flex flex-col justify-between h-[100px]">
            <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Estimated Ecosystem Value</span>
            <div className="text-xl font-bold text-foreground my-auto">₹{data.estimated_ecosystem_value_cr} Cr</div>
            <span className="text-[8px] text-secondary/60 block mt-auto leading-none">Projected total asset value</span>
          </div>
          <div className="bg-soft/30 border border-border/30 p-4 rounded-md text-center flex flex-col justify-between h-[100px]">
            <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Network Growth Rate</span>
            <div className="text-xl font-bold text-foreground my-auto">+{data.network_growth_percent}%</div>
            <span className="text-[8px] text-secondary/60 block mt-auto leading-none">Percentage expansion post-consent</span>
          </div>
          <div className="bg-soft/30 border border-border/30 p-4 rounded-md text-center flex flex-col justify-between h-[100px]">
            <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Downstream Opportunities</span>
            <div className="text-xl font-bold text-foreground my-auto">+{data.new_downstream_opportunities} Nodes</div>
            <span className="text-[8px] text-secondary/60 block mt-auto leading-none">Pre-flagged targets discovered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
