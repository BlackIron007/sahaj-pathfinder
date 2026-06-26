import React from "react";

interface DeploymentTimelineProps {
  currentStep: number; // 1 to 5
  projectedProb: number;
  projectedRev: number;
  potentialNewNodes: number;
  ecosystemExpansion: number;
  onLaunchJourney: () => void;
  onSaveDraft: () => void;
  isActionLoading?: boolean;
}

export function DeploymentTimeline({
  currentStep,
  projectedProb,
  projectedRev,
  potentialNewNodes,
  ecosystemExpansion,
  onLaunchJourney,
  onSaveDraft,
  isActionLoading,
}: DeploymentTimelineProps) {
  const steps = [
    { num: 1, name: "Approve Strategy" },
    { num: 2, name: "Send Offer" },
    { num: 3, name: "Digital Onboarding" },
    { num: 4, name: "YONO Activation" },
    { num: 5, name: "New SBI Relation" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        Deploy Acquisition Strategy
      </h3>

      {/* Visual Journey Timeline */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-4 bg-soft/20 border border-border/40 rounded-lg">
        {steps.map((s, idx) => {
          const isCompleted = s.num < currentStep;
          const isCurrent = s.num === currentStep;
          const isActive = s.num <= currentStep;
          
          return (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  isCurrent 
                    ? "bg-primary border-primary text-card ring-4 ring-primary/10" 
                    : (isCompleted ? "bg-status-approved-bg border-status-approved-accent text-status-approved-accent" : "bg-card border-border text-secondary")
                }`}>
                  {s.num}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  isCurrent ? "text-primary" : (isActive ? "text-foreground" : "text-secondary")
                }`}>
                  {s.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`hidden md:block h-[2px] flex-1 transition-colors ${
                  isCompleted ? "bg-status-approved-accent" : (isCurrent ? "bg-primary" : "bg-border/60")
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Grid Expansion KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border/40 pt-6">
        <div className="text-center space-y-1">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Projected Conversion</span>
          <span className="text-lg font-bold text-foreground block">{projectedProb}%</span>
        </div>
        <div className="text-center space-y-1">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Projected Revenue</span>
          <span className="text-lg font-bold text-foreground block">{projectedRev} Lakhs</span>
        </div>
        <div className="text-center space-y-1">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Potential New MSMEs</span>
          <span className="text-lg font-bold text-foreground block">+{potentialNewNodes} Nodes</span>
        </div>
        <div className="text-center space-y-1">
          <span className="text-[9px] uppercase font-bold text-secondary tracking-wider block">Ecosystem Expansion</span>
          <span className="text-lg font-bold text-foreground block">+{ecosystemExpansion} Suppliers</span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-border/40">
        <button 
          onClick={onSaveDraft}
          disabled={isActionLoading}
          className="w-full sm:w-auto px-5 py-2 text-xs font-bold uppercase tracking-wider rounded border border-border bg-card text-foreground hover:bg-soft transition-colors text-center"
        >
          Save Draft
        </button>
        <button 
          onClick={onLaunchJourney}
          disabled={isActionLoading}
          className="w-full sm:w-auto px-5 py-2 text-xs font-bold uppercase tracking-wider rounded bg-primary text-card hover:bg-primary-dim transition-colors text-center"
        >
          Launch Customer Journey
        </button>
      </div>
    </div>
  );
}
