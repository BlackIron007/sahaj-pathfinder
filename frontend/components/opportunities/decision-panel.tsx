import React from "react";
import { Check } from "lucide-react";

interface DecisionPanelProps {
  status: string;
  onApprove: () => void;
  onRequestChanges: () => void;
  onAssignBranch: () => void;
  onEscalate: () => void;
  isActionLoading?: boolean;
}

export function DecisionPanel({
  status,
  onApprove,
  onRequestChanges,
  onAssignBranch,
  onEscalate,
  isActionLoading,
}: DecisionPanelProps) {
  const whyWins = [
    "No collateral required",
    "Consent-driven digital onboarding",
    "Existing verified anchor relationship backing",
    "Pre-approved 48-hour disbursement timeline",
    "High baseline probability of RM conversion"
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Why This Offer Wins */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
          PathFinder Why This Offer Wins
        </h3>
        <div className="space-y-2">
          {whyWins.map((win, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-foreground font-semibold">
              <Check className="h-4 w-4 text-status-approved-accent bg-status-approved-bg p-0.5 rounded-full shrink-0" />
              <span>{win}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RM Decision Actions */}
      <div className="space-y-4 pt-6 border-t border-border/40">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">
            PathFinder Decision Panel
          </h3>
          <span className="text-[10px] uppercase font-bold text-secondary tracking-wider font-mono">
            Status: {status}
          </span>
        </div>

        <div className="space-y-4">
          {/* Primary Filled Bronze Button */}
          <div className="space-y-1">
            <button 
              onClick={onApprove}
              disabled={isActionLoading || status === "Approved"}
              className="w-full py-2 text-xs font-bold uppercase tracking-wider rounded bg-primary text-card hover:bg-primary-dim transition-colors disabled:opacity-50"
            >
              Approve Strategy
            </button>
            <span className="text-[8px] text-secondary font-medium block">
              Immediately launches the customer acquisition outreach and YONO onboarding setup.
            </span>
          </div>

          {/* Outline Action Buttons and helper descriptions */}
          <div className="space-y-3 border-t border-border/20 pt-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 space-y-1">
                <button 
                  onClick={onRequestChanges}
                  disabled={isActionLoading}
                  className="w-full py-1.5 text-[9px] font-bold uppercase tracking-wider border border-border rounded bg-card text-foreground hover:bg-soft transition-colors text-center"
                >
                  Request Changes
                </button>
                <span className="text-[8px] text-secondary/80 font-medium block text-center sm:text-left">
                  Mark draft for revision.
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <button 
                  onClick={onAssignBranch}
                  disabled={isActionLoading}
                  className="w-full py-1.5 text-[9px] font-bold uppercase tracking-wider border border-border rounded bg-card text-foreground hover:bg-soft transition-colors text-center"
                >
                  Assign Branch Manager
                </button>
                <span className="text-[8px] text-secondary/80 font-medium block text-center sm:text-left">
                  Route review to branch manager.
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <button 
                  onClick={onEscalate}
                  disabled={isActionLoading}
                  className="w-full py-1.5 text-[9px] font-bold uppercase tracking-wider border border-border rounded bg-card text-foreground hover:bg-soft transition-colors text-center"
                >
                  Escalate
                </button>
                <span className="text-[8px] text-secondary/80 font-medium block text-center sm:text-left">
                  Escalate to Risk Head.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
