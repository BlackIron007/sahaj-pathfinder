"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOpportunities } from "@/lib/api/opportunities";
import { OpportunityTable } from "@/components/dashboard/opportunity-table";
import { AlertCircle } from "lucide-react";

export default function AcquisitionIntelligenceIndex() {
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ["opportunitiesList"],
    queryFn: fetchOpportunities,
  });

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

      <OpportunityTable opportunities={opportunities ?? []} isLoading={isLoading} />
    </div>
  );
}
