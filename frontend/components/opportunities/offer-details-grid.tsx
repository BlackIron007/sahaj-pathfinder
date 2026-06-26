import React from "react";

interface OfferDetailsGridProps {
  amount: number;
  rate: number;
  product: string;
  timeline: string;
  collateral: string;
  onboarding: string;
  manager: string;
}

export function OfferDetailsGrid({
  amount,
  rate,
  product,
  timeline,
  collateral,
  onboarding,
  manager,
}: OfferDetailsGridProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        Offer Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial */}
        <div className="bg-soft/20 border border-border/40 p-4 rounded-md space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block border-b border-border/20 pb-1">Financial Parameters</span>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Eligible Amount</span>
              <span className="text-xs font-bold text-foreground block">{amount} Lakhs</span>
            </div>
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Interest Rate</span>
              <span className="text-xs font-bold text-foreground block">{rate}% p.a.</span>
            </div>
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Collateral Requirement</span>
              <span className="text-xs font-semibold text-foreground block">{collateral}</span>
            </div>
          </div>
        </div>

        {/* Operational */}
        <div className="bg-soft/20 border border-border/40 p-4 rounded-md space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block border-b border-border/20 pb-1">Operational Integration</span>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Disbursement Timeline</span>
              <span className="text-xs font-semibold text-foreground block">{timeline}</span>
            </div>
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Digital Onboarding</span>
              <span className="text-xs font-semibold text-foreground block">{onboarding}</span>
            </div>
          </div>
        </div>

        {/* Relationship */}
        <div className="bg-soft/20 border border-border/40 p-4 rounded-md space-y-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block border-b border-border/20 pb-1">Relationship Context</span>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Relationship Manager</span>
              <span className="text-xs font-semibold text-foreground block">{manager}</span>
            </div>
            <div>
              <span className="text-[9px] text-secondary font-semibold uppercase tracking-wider block">Product Structure</span>
              <span className="text-xs font-bold text-foreground block">{product}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
