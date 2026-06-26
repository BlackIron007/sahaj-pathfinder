import React from "react";
import { CheckCircle } from "lucide-react";

interface StrategyCardProps {
  primaryObjective: string;
  selectedProduct: string;
  recommendedRoute: string;
  aiConfidence: number;
  reasoningChips: string[];
  expectedOutcome: string;
}

export function StrategyCard({
  primaryObjective,
  selectedProduct,
  recommendedRoute,
  aiConfidence,
  reasoningChips,
  expectedOutcome,
}: StrategyCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="border-b border-border pb-3 flex justify-between items-center">
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">
          PathFinder Recommended Strategy
        </h3>
        <span className="bg-status-approved-bg text-status-approved-accent text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          AI Confidence {aiConfidence}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block">Primary Objective</span>
          <span className="text-sm font-bold text-foreground block mt-1">{primaryObjective}</span>
        </div>
        <div className="bg-soft/30 border border-border/40 p-3 rounded-md">
          <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Selected Product</span>
          <span className="text-xs font-extrabold text-primary uppercase block mt-1">{selectedProduct}</span>
          <span className="text-[9px] text-secondary/70 font-mono block mt-0.5">Route: {recommendedRoute}</span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/40">
        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
          PathFinder Strategic Reasoning
        </span>
        <div className="flex flex-wrap gap-2">
          {reasoningChips.map((chip, index) => (
            <div key={index} className="flex items-center gap-1.5 bg-status-approved-bg/60 border border-status-approved-accent/15 px-3 py-1.5 rounded-full text-[10px] text-status-approved-accent font-bold uppercase tracking-wider">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 pt-4 border-t border-border/40">
        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
          Expected Business Outcome
        </span>
        <p className="text-xs text-foreground leading-relaxed font-semibold">
          {expectedOutcome}
        </p>
      </div>
    </div>
  );
}
