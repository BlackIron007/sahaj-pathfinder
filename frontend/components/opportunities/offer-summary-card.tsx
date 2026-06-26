import React from "react";

interface OfferSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description: string;
}

export function OfferSummaryCard({ title, value, subtitle, description }: OfferSummaryCardProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-lg flex flex-col h-32 hover:border-primary/50 transition-colors">
      <div className="text-[10px] uppercase font-bold text-secondary tracking-wider">
        {title}
      </div>
      
      <div className="mt-2 flex-1 flex items-baseline gap-2">
        <span className="text-xl font-bold tracking-tight text-foreground leading-none">
          {value}
        </span>
        {subtitle && (
          <span className="text-[10px] text-primary font-mono font-semibold self-center">
            {subtitle}
          </span>
        )}
      </div>

      <div className="mt-auto border-t border-border/40 pt-2 text-[10px] text-secondary font-medium leading-normal">
        {description}
      </div>
    </div>
  );
}
