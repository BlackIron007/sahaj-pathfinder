"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight, ShieldAlert, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fetchImpactSummary,
  fetchImpactRoutes,
  fetchImpactNetwork,
  fetchImpactInsights,
  fetchImpactLearning
} from "@/lib/api/impact";

// Components
import { ImpactMetricCard } from "@/components/opportunities/impact-metric-card";
import { RouteLeaderboard } from "@/components/opportunities/route-leaderboard";
import { NetworkExpansionGraph } from "@/components/opportunities/network-expansion-graph";
import { SuccessStoryCard } from "@/components/opportunities/success-story-card";
import { InsightCard } from "@/components/opportunities/insight-card";
import { LearningTimeline } from "@/components/opportunities/learning-timeline";
import { LearningMetrics } from "@/components/opportunities/learning-metrics";
import { ExecutiveSummary } from "@/components/opportunities/executive-summary";

export default function ImpactCenterPage() {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(true);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(true);

  // Queries
  const { data: summary, isLoading: isSummaryLoading, error: summaryError } = useQuery({
    queryKey: ["impactSummary"],
    queryFn: fetchImpactSummary,
  });

  const { data: routes, isLoading: isRoutesLoading } = useQuery({
    queryKey: ["impactRoutes"],
    queryFn: fetchImpactRoutes,
  });

  const { data: network, isLoading: isNetworkLoading } = useQuery({
    queryKey: ["impactNetwork"],
    queryFn: fetchImpactNetwork,
  });

  const { data: insights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ["impactInsights"],
    queryFn: fetchImpactInsights,
  });

  const { data: learning, isLoading: isLearningLoading } = useQuery({
    queryKey: ["impactLearning"],
    queryFn: fetchImpactLearning,
  });

  const isLoading = isSummaryLoading || isRoutesLoading || isNetworkLoading || isInsightsLoading || isLearningLoading;

  if (summaryError || (!isLoading && !summary)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <ShieldAlert className="h-10 w-10 text-status-blocked-accent" />
        <h2 className="text-base font-bold text-foreground">Impact Center Gateway Offline</h2>
        <p className="text-xs text-secondary max-w-sm">
          Failed to fetch executive business impact outcomes. Check sample datasets connection status.
        </p>
      </div>
    );
  }

  if (isLoading || !summary) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse font-sans">
        <div className="h-4 w-48 bg-soft rounded"></div>
        <div className="h-10 w-96 bg-soft rounded"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-soft rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-soft rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] text-secondary font-medium tracking-wider uppercase border-b border-border/40 pb-3">
        <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3 text-secondary/60" />
        <span className="text-foreground">Impact Center</span>
      </div>

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 pt-2">
        <div className="space-y-2">
          <h1 className="text-sm font-bold text-secondary uppercase tracking-widest leading-none">
            Ecosystem Analytics
          </h1>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground mt-2 leading-none">
            PathFinder Impact Center
          </h2>
          <p className="text-xs text-secondary leading-relaxed">
            Track acquisition outcomes, ecosystem expansion, and agent performance parameters.
          </p>
        </div>

        <div className="md:pt-4">
          <Badge variant="Pending Review">Reporting Period: Last 30 Days</Badge>
        </div>
      </div>

      {/* Top KPI row of 6 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <ImpactMetricCard 
          title="Strategies Executed" 
          value={summary.strategies_executed} 
          description="Total pre-approved workflows generated" 
        />
        <ImpactMetricCard 
          title="Successful Acquisitions" 
          value={summary.successful_acquisitions} 
          description="MSMEs fully onboarded into sbi networks" 
        />
        <ImpactMetricCard 
          title="Avg Conversion" 
          value={`${summary.avg_conversion_rate}%`} 
          description="Baseline strategy success accuracy" 
        />
        <ImpactMetricCard 
          title="Projected Loan Book" 
          value={`₹${summary.projected_loan_book_cr} Cr`} 
          description="Cumulative asset volume from onboardings" 
        />
        <ImpactMetricCard 
          title="New Ecosystem Nodes" 
          value={summary.new_ecosystem_nodes} 
          description="Secondary supplier chains discovered" 
        />
        <ImpactMetricCard 
          title="Confidence Growth" 
          value={`+${summary.confidence_gain_percent}%`} 
          description="AI prediction model precision variance" 
        />
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side Col (65% representation) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Route Performance (Collapsible) */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">Route Performance</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isLeaderboardOpen ? "rotate-180" : ""}`} />
            </button>
            {isLeaderboardOpen && routes && (
              <div className="p-1">
                <RouteLeaderboard routes={routes} />
              </div>
            )}
          </div>

          {/* Section 2: Ecosystem Expansion Relationship Mapping (Collapsible) */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsNetworkOpen(!isNetworkOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">Ecosystem Expansion</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isNetworkOpen ? "rotate-180" : ""}`} />
            </button>
            {isNetworkOpen && network && (
              <div className="p-1">
                <NetworkExpansionGraph data={network} />
              </div>
            )}
          </div>

          {/* Section 4: Agent Intelligence Insights (Collapsible) */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsInsightsOpen(!isInsightsOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">Agent Intelligence Insights</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isInsightsOpen ? "rotate-180" : ""}`} />
            </button>
            {isInsightsOpen && insights && (
              <div className="p-1">
                <InsightCard insights={insights} />
              </div>
            )}
          </div>

        </div>

        {/* Right Side Column (35% representation) */}
        <div className="space-y-6">
          
          {/* Section 3: Success Story */}
          <SuccessStoryCard />

          {/* Section 7: Executive Summary */}
          {summary && <ExecutiveSummary summaryText={summary.summary} />}

        </div>

      </div>

      {/* Section 5: Model Learning Loop & Metrics (Collapsible) */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <button 
          onClick={() => setIsLearningOpen(!isLearningOpen)}
          className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
        >
          <span className="text-xs uppercase font-bold text-secondary tracking-widest">PathFinder Continuous Learning Pipeline</span>
          <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isLearningOpen ? "rotate-180" : ""}`} />
        </button>
        {isLearningOpen && learning && (
          <div className="p-6 space-y-6">
            <LearningTimeline steps={learning.learning_timeline} />
            <LearningMetrics metrics={learning.metrics} />
          </div>
        )}
      </div>

    </div>
  );
}
