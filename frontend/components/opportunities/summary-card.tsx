import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  highlight?: boolean;
}

export function SummaryCard({ title, value, highlight = false }: SummaryCardProps) {
  return (
    <div className={`border rounded-lg p-5 flex flex-col justify-between h-28 hover:border-primary/50 transition-colors ${
      highlight ? "bg-soft border-primary/30" : "bg-card border-border"
    }`}>
      <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">{title}</span>
      <div className="text-xl font-bold text-foreground mt-2">{value}</div>
    </div>
  );
}
