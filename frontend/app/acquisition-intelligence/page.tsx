"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOpportunities } from "@/lib/api/opportunities";
import { OpportunityTable } from "@/components/dashboard/opportunity-table";
import { AlertCircle } from "lucide-react";
import { useDemo } from "@/providers/demo-provider";
import { observe, scrollUntilVisible, ensureReachedPageBottom } from "@/lib/cameraDirector";
import { executiveConfig } from "@/lib/executiveConfig";
import { hoverAndClick } from "@/lib/cursorController";

export default function AcquisitionIntelligenceIndex() {
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ["opportunitiesList"],
    queryFn: fetchOpportunities,
  });

  const { isDemoMode, currentScene, isExecutiveMode } = useDemo();

  useEffect(() => {
    if (!isDemoMode || currentScene !== 2 || isLoading) return;
    let active = true;

    const runScene2Queue = async () => {
      // 1. Arrive — let viewer orient
      window.scrollTo({ top: 0, behavior: "smooth" });
      const pauseTime = isExecutiveMode ? executiveConfig.narrationDwellTime : 1000;
      await observe(pauseTime);
      if (!active) return;

      // 2. Scroll down until the opportunities table is centered
      await scrollUntilVisible('[data-demo="opportunity-table"]');
      const holdTime = isExecutiveMode ? 3000 : 1200;
      await observe(holdTime);
      if (!active) return;

      // 3. Determine first row action button dynamically and click it (no hardcoding)
      const firstBtnSelector = '[data-demo="opportunity-table"] tbody tr:first-child a[href^="/acquisition-intelligence/"]';
      
      if (isExecutiveMode) {
        // Human cursor interaction
        await ensureReachedPageBottom();
        await hoverAndClick(firstBtnSelector);
      } else {
        // Standard quick click
        const btn = document.querySelector(firstBtnSelector) as HTMLAnchorElement | null;
        if (btn) btn.click();
      }
    };

    runScene2Queue();
    return () => { active = false; };
  }, [isDemoMode, currentScene, isLoading, isExecutiveMode]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <AlertCircle className="h-10 w-10 text-status-blocked-accent" />
        <h2 className="text-base font-bold text-foreground">API Connection Offline</h2>
        <p className="text-xs text-secondary max-w-sm">
          Failed to fetch acquisition opportunities from the PathFinder gateway.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      <div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono">
          SBI CRM Integration
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1.5">
          Acquisition Intelligence Registry
        </h1>
        <p className="text-xs text-secondary mt-1 max-w-xl leading-relaxed">
          Manage, verify, and discount MSME targets surfaced by the PathFinder discovery models.
        </p>
      </div>

      <div data-demo="opportunity-table">
        <OpportunityTable opportunities={opportunities ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
