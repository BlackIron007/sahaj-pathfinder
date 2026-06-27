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
      
      <div className="mt-1 flex-1 flex items-center">
        <span className={`font-bold tracking-tight text-foreground leading-tight ${value.toString().length > 16 ? 'text-[13px]' : 'text-xl'}`}>
          {value}
        </span>
        {subtitle && (
          <span className="text-[10px] text-primary font-mono font-semibold ml-2">
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
