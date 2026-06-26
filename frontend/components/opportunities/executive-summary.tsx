import React from "react";

interface ExecutiveSummaryProps {
  summaryText: string;
}

export function ExecutiveSummary({ summaryText }: ExecutiveSummaryProps) {
  return (
    <div className="bg-card border-2 border-primary rounded-lg p-8 space-y-4 ring-4 ring-primary/5">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h3 className="text-xs uppercase font-extrabold text-secondary tracking-widest">
          PathFinder Business Impact Summary
        </h3>
        <span className="bg-status-approved-bg text-status-approved-accent text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          AI Generated
        </span>
      </div>
      <p className="text-sm text-foreground font-semibold leading-loose max-w-prose">
        {summaryText}
      </p>
    </div>
  );
}
