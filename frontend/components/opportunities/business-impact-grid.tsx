import React from "react";
import { ImpactProjection } from "@/lib/api/offers";

interface BusinessImpactGridProps {
  impact: ImpactProjection;
}

export function BusinessImpactGrid({ impact }: BusinessImpactGridProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        PathFinder Business Impact
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {/* KPI 1 */}
        <div className="bg-soft/30 border border-border/40 p-5 rounded-md text-center flex flex-col justify-between h-32">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Conversion Probability</span>
          <div className="text-2xl font-bold text-foreground my-auto">{impact.conversion_probability}%</div>
          <span className="text-[9px] text-secondary/60 block border-t border-border/20 pt-1.5 mt-auto">Calculated AI model confidence</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-soft/30 border border-border/40 p-5 rounded-md text-center flex flex-col justify-between h-32">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Projected Revenue</span>
          <div className="text-2xl font-bold text-foreground my-auto">{impact.projected_revenue_lakh} Lakhs</div>
          <span className="text-[9px] text-secondary/60 block border-t border-border/20 pt-1.5 mt-auto">Estimated LTM fee yield</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-soft/30 border border-border/40 p-5 rounded-md text-center flex flex-col justify-between h-32">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Potential New MSMEs</span>
          <div className="text-2xl font-bold text-foreground my-auto">+{impact.potential_new_msmes} Nodes</div>
          <span className="text-[9px] text-secondary/60 block border-t border-border/20 pt-1.5 mt-auto">Discovered downstream nodes</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-soft/30 border border-border/40 p-5 rounded-md text-center flex flex-col justify-between h-32">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Ecosystem Conversions</span>
          <div className="text-2xl font-bold text-foreground my-auto">{impact.projected_ecosystem_conversions} Targets</div>
          <span className="text-[9px] text-secondary/60 block border-t border-border/20 pt-1.5 mt-auto">Likely next-in-line conversions</span>
        </div>
      </div>
    </div>
  );
}
