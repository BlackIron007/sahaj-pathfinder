import React from "react";
import { LearningMetricsData } from "@/lib/api/impact";

interface LearningMetricsProps {
  metrics: LearningMetricsData;
}

export function LearningMetrics({ metrics }: LearningMetricsProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        PathFinder Platform Learning Metrics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-soft/10 border border-border/20 p-3.5 rounded text-center flex flex-col justify-between h-24">
          <span className="text-[8px] uppercase font-bold text-secondary/80 tracking-wider block">Strategies Evaluated</span>
          <div className="text-sm font-extrabold text-foreground my-auto">{metrics.strategies_evaluated}</div>
          <span className="text-[7.5px] text-secondary/60 block mt-auto leading-none">Discovery cycles run</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-soft/10 border border-border/20 p-3.5 rounded text-center flex flex-col justify-between h-24">
          <span className="text-[8px] uppercase font-bold text-secondary/80 tracking-wider block">Acquisitions</span>
          <div className="text-sm font-extrabold text-foreground my-auto">{metrics.successful_acquisitions}</div>
          <span className="text-[7.5px] text-secondary/60 block mt-auto leading-none">Successful onboardings</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-soft/10 border border-border/20 p-3.5 rounded text-center flex flex-col justify-between h-24">
          <span className="text-[8px] uppercase font-bold text-secondary/80 tracking-wider block">Confidence Gain</span>
          <div className="text-sm font-extrabold text-foreground my-auto">+{metrics.learning_confidence_gain_percent}%</div>
          <span className="text-[7.5px] text-secondary/60 block mt-auto leading-none">Model precision growth</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-soft/10 border border-border/20 p-3.5 rounded text-center flex flex-col justify-between h-24">
          <span className="text-[8px] uppercase font-bold text-secondary/80 tracking-wider block">Avg Decision Time</span>
          <div className="text-sm font-extrabold text-foreground my-auto">{metrics.average_decision_time}</div>
          <span className="text-[7.5px] text-secondary/60 block mt-auto leading-none">API response latency</span>
        </div>

        {/* KPI 5 */}
        <div className="bg-soft/10 border border-border/20 p-3.5 rounded text-center flex flex-col justify-between h-24">
          <span className="text-[8px] uppercase font-bold text-secondary/80 tracking-wider block">Avg Acceptance</span>
          <div className="text-sm font-extrabold text-foreground my-auto">{metrics.average_offer_acceptance}</div>
          <span className="text-[7.5px] text-secondary/60 block mt-auto leading-none">RM approval ratio</span>
        </div>

        {/* KPI 6 */}
        <div className="bg-soft/10 border border-border/20 p-3.5 rounded text-center flex flex-col justify-between h-24">
          <span className="text-[8px] uppercase font-bold text-secondary/80 tracking-wider block">Route Accuracy</span>
          <div className="text-sm font-extrabold text-foreground my-auto">{metrics.route_accuracy}%</div>
          <span className="text-[7.5px] text-secondary/60 block mt-auto leading-none">Precision rate matching</span>
        </div>
      </div>
    </div>
  );
}
