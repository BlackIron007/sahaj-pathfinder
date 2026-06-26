import React from "react";
import { LearningStep } from "@/lib/api/impact";

interface LearningTimelineProps {
  steps: LearningStep[];
}

export function LearningTimeline({ steps }: LearningTimelineProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="border-b border-border pb-3 flex flex-col gap-1">
        <span className="text-[10px] font-bold text-primary tracking-wider uppercase">Continuous Agent Learning Cycle</span>
        <h3 className="text-xs uppercase font-extrabold text-secondary tracking-widest">
          PathFinder Model Learning Loop
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 px-4 bg-soft/20 border border-border/40 rounded-lg">
        {steps.map((s, idx) => {
          const isCompleted = s.status === "Completed";
          const isCurrent = s.status === "Current";
          
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  isCurrent 
                    ? "bg-primary border-primary text-card ring-4 ring-primary/10" 
                    : (isCompleted ? "bg-status-approved-bg border-status-approved-accent text-status-approved-accent" : "bg-card border-border text-secondary")
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block transition-colors ${
                    isCurrent ? "text-primary" : (isCompleted ? "text-foreground" : "text-secondary")
                  }`}>
                    {s.step}
                  </span>
                  <span className="text-[8px] text-secondary/70 font-semibold block leading-tight">{s.description}</span>
                </div>
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
      <p className="text-[10px] text-secondary leading-relaxed pt-2 border-t border-border/20">
        Every completed acquisition updates PathFinder&apos;s routing confidence, ecosystem understanding, and future recommendation quality.
      </p>
    </div>
  );
}
