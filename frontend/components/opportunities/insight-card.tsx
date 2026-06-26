import React from "react";
import { Sparkles, TrendingUp, Eye, Compass, Activity, ShieldCheck, HelpCircle } from "lucide-react";
import { InsightItem } from "@/lib/api/impact";

interface InsightCardProps {
  insights: InsightItem[];
}

export function InsightCard({ insights }: InsightCardProps) {
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("route") || t.includes("conversion")) return <TrendingUp className="h-4.5 w-4.5 text-primary shrink-0" />;
    if (t.includes("discovery") || t.includes("signals")) return <Eye className="h-4.5 w-4.5 text-primary shrink-0" />;
    if (t.includes("portfolio") || t.includes("value") || t.includes("multiplier")) return <Compass className="h-4.5 w-4.5 text-primary shrink-0" />;
    if (t.includes("operational") || t.includes("onboarding") || t.includes("efficiency")) return <Activity className="h-4.5 w-4.5 text-primary shrink-0" />;
    if (t.includes("risk") || t.includes("compliance")) return <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />;
    return <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 flex items-center gap-2">
        <Sparkles className="h-4.5 w-4.5 text-primary" /> PathFinder Agent Intelligence Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((ins) => (
          <div key={ins.id} className="bg-soft/20 border border-border/40 p-5 rounded-md flex flex-col justify-between hover:border-primary/50 transition-colors h-36">
            <div className="flex items-center gap-2 border-b border-border/10 pb-2">
              {getIcon(ins.title)}
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                {ins.title}
              </span>
            </div>
            <p className="text-xs text-foreground leading-relaxed font-semibold mt-3 flex-1">
              {ins.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
