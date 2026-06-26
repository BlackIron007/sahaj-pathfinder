import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, SearchCode, TrendingUp, HelpCircle } from "lucide-react";

interface SignalCardProps {
  title: string;
  severity: "Approved" | "Blocked" | "Warning" | "Critical" | "High" | "Medium" | "Low";
  evidence: string;
  explanation: string;
  confidence: number;
}

export function SignalCard({ title, severity, evidence, explanation, confidence }: SignalCardProps) {
  // Determine icon based on title or keywords
  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes("stress") || t.includes("delay")) return <Activity className="h-4.5 w-4.5 text-primary" />;
    if (t.includes("relationship") || t.includes("anchor")) return <TrendingUp className="h-4.5 w-4.5 text-primary" />;
    if (t.includes("digital") || t.includes("ready") || t.includes("gst")) return <SearchCode className="h-4.5 w-4.5 text-primary" />;
    return <HelpCircle className="h-4.5 w-4.5 text-primary" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h4 className="text-xs font-bold text-foreground tracking-tight">{title}</h4>
          </div>
          <Badge variant={severity}>{severity}</Badge>
        </div>
        
        <p className="text-xs text-foreground font-medium leading-relaxed">
          {explanation}
        </p>
        
        <div className="bg-soft/40 border border-border/40 rounded p-2.5 text-[10px] text-secondary leading-normal">
          <span className="font-semibold text-foreground block mb-0.5">Evidence:</span>
          {evidence}
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-border/30 space-y-1.5">
        <div className="flex justify-between items-center text-[10px] text-secondary font-medium">
          <span>Signal Confidence</span>
          <span className="font-mono text-foreground font-semibold">
            {confidence}%
          </span>
        </div>
        {/* Miniature progress bar */}
        <div className="w-full bg-soft rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
