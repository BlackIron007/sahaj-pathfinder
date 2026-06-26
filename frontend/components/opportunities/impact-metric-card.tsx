import React from "react";
import { TrendingUp } from "lucide-react";

interface ImpactMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: string;
}

export function ImpactMetricCard({ title, value, description, trend }: ImpactMetricCardProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-lg flex flex-col h-32 hover:border-primary/50 transition-colors">
      <div className="text-[10px] uppercase font-bold text-secondary tracking-wider">
        {title}
      </div>
      
      <div className="mt-2 flex-1 flex items-baseline gap-2">
        <span className="text-xl font-bold tracking-tight text-foreground leading-none">
          {value}
        </span>
        {trend && (
          <span className="text-[10px] text-status-approved-accent font-semibold flex items-center gap-0.5 self-center font-mono">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>

      <div className="mt-auto border-t border-border/40 pt-2 text-[10px] text-secondary font-medium leading-normal">
        {description}
      </div>
    </div>
  );
}
