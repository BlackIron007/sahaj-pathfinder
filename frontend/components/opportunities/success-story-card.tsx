import React from "react";
import { ArrowDown, Search, Award, FileText, CheckCircle } from "lucide-react";

export function SuccessStoryCard() {
  const steps = [
    { title: "Discovery", desc: "Precision Chemicals flagged", icon: <Search className="h-3.5 w-3.5" /> },
    { title: "Route Selected", desc: "Transaction Route", icon: <FileText className="h-3.5 w-3.5" /> },
    { title: "Offer Approved", desc: "YONO integration pre-approval", icon: <Award className="h-3.5 w-3.5" /> },
    { title: "Customer Onboarded", desc: "SBI account activated", icon: <CheckCircle className="h-3.5 w-3.5 text-status-approved-accent" /> },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 mb-4">
          PathFinder Success Story
        </h3>
        
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-foreground leading-none">Precision Chemicals Pvt Ltd</h4>
          <span className="text-[9px] text-secondary/70 font-mono tracking-wide uppercase">Specialty Chemical Synthesis</span>
        </div>

        {/* Visual Story Flow */}
        <div className="space-y-3 my-4 bg-soft/20 p-4 border border-border/40 rounded-lg">
          {steps.map((s, idx) => (
            <React.Fragment key={idx}>
              <div className="flex gap-3 items-center">
                <div className="w-7 h-7 rounded-full bg-card border border-border/80 flex items-center justify-center text-primary shrink-0">
                  {s.icon}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-foreground block leading-tight">{s.title}</span>
                  <span className="text-[9px] text-secondary block">{s.desc}</span>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="pl-3.5 -my-2.5">
                  <ArrowDown className="h-3.5 w-3.5 text-primary/40" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-4 text-xs">
        <div>
          <span className="text-[9px] text-secondary uppercase font-bold tracking-wider block">Loan Book</span>
          <span className="font-extrabold text-foreground text-sm">₹2.4 Cr</span>
        </div>
        <div>
          <span className="text-[9px] text-secondary uppercase font-bold tracking-wider block">Conversion</span>
          <span className="font-extrabold text-foreground text-sm font-mono">92%</span>
        </div>
        <div>
          <span className="text-[9px] text-secondary uppercase font-bold tracking-wider block">Suppliers Found</span>
          <span className="font-extrabold text-foreground text-sm">5 Discovered</span>
        </div>
        <div>
          <span className="text-[9px] text-secondary uppercase font-bold tracking-wider block">Cross Sell Value</span>
          <span className="font-extrabold text-foreground text-sm">₹4.8 Cr</span>
        </div>
      </div>
    </div>
  );
}
