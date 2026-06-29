"use client";

import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/metric-card";
import { OpportunityTable } from "@/components/dashboard/opportunity-table";
import { RouteDistributionChart, EcosystemGrowthChart } from "@/components/dashboard/charts";
import { Timeline } from "@/components/dashboard/timeline";
import {
  fetchDashboardStats,
  fetchRouteDistribution,
  fetchEcosystemGrowth,
  fetchRecentDiscoveries,
} from "@/lib/api/dashboard";
import { fetchOpportunities } from "@/lib/api/opportunities";
import { AlertCircle } from "lucide-react";
import { useDemo } from "@/providers/demo-provider";
import { observe, scrollUntilVisible } from "@/lib/cameraDirector";
import React, { useEffect } from "react";

export default function ExecutiveDashboard() {
  const { isDemoMode, currentScene, triggerTransition, triggerFinalFade } = useDemo();
  // Query 1: Metric stats
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  // Query 2: Route distributions
  const {
    data: routeData,
    isLoading: isRoutesLoading,
    error: routesError,
  } = useQuery({
    queryKey: ["routeDistribution"],
    queryFn: fetchRouteDistribution,
  });

  // Query 3: Ecosystem growth
  const {
    data: ecosystemData,
    isLoading: isEcosystemLoading,
    error: ecosystemError,
  } = useQuery({
    queryKey: ["ecosystemGrowth"],
    queryFn: fetchEcosystemGrowth,
  });

  // Query 4: Recent timeline events
  const {
    data: timelineEvents,
    isLoading: isTimelineLoading,
    error: timelineError,
  } = useQuery({
    queryKey: ["recentDiscoveries"],
    queryFn: fetchRecentDiscoveries,
  });

  // Query 5: Opportunities table
  const {
    data: opportunities,
    isLoading: isOppsLoading,
    error: oppsError,
  } = useQuery({
    queryKey: ["opportunities"],
    queryFn: fetchOpportunities,
  });

  const hasErrors = statsError || routesError || ecosystemError || timelineError || oppsError;
  const isGlobalLoading = isStatsLoading || isRoutesLoading || isEcosystemLoading || isTimelineLoading || isOppsLoading;

  useEffect(() => {
    if (!isDemoMode || currentScene !== 1 || isGlobalLoading) return;
    let active = true;

    const runScene1 = async () => {
      // Start at top — let viewer orient
      window.scrollTo({ top: 0, behavior: "smooth" });
      await observe(1000);
      if (!active) return;

      // Glow KPI row — show we are in an intelligence dashboard
      const kpis = document.querySelector('[data-demo="dashboard-kpis"]') as HTMLElement | null;
      if (kpis) {
        kpis.style.transition = "all 0.5s ease-in-out";
        kpis.style.boxShadow = "0 0 28px rgba(113, 91, 62, 0.18)";
        kpis.style.borderRadius = "8px";
      }
      await observe(1800);
      if (!active) return;
      if (kpis) kpis.style.boxShadow = "none";

      // Scroll to the opportunity table section using DOM element visibility check
      await scrollUntilVisible('[data-demo="opportunity-table"]');
      if (!active) return;

      // Linger on the queue — viewers read it
      await observe(1800);
      if (!active) return;

      triggerTransition("/acquisition-intelligence/OP001", 2);
    };

    runScene1();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode, currentScene, isGlobalLoading]);

  useEffect(() => {
    if (!isDemoMode || currentScene !== 6 || isGlobalLoading) return;
    let active = true;

    const runScene6 = async () => {
      // Return to top of Dashboard — the lasting executive image
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Hold 3–4 seconds at the top of the dashboard with NO scrolling and NO interactions
      await observe(3500);
      if (!active) return;

      // Fade to background colour — clean ending
      triggerFinalFade();
    };

    runScene6();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode, currentScene, isGlobalLoading]);

  if (hasErrors) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <AlertCircle className="h-10 w-10 text-status-blocked-accent" />
        <h2 className="text-base font-bold tracking-tight text-foreground">API Connection Offline</h2>
        <p className="text-xs text-secondary max-w-sm">
          The SBI database gateway did not respond. Check if the backend services are running.
        </p>
      </div>
    );
  }

  if (isGlobalLoading) {
    return (
      <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-pulse font-sans">
        {/* Welcome Header Skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-28 bg-soft rounded"></div>
          <div className="h-8 w-96 bg-soft rounded"></div>
          <div className="h-4 w-[480px] bg-soft rounded"></div>
        </div>
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border h-32 rounded-lg p-5 flex flex-col justify-between">
              <div className="h-3.5 w-24 bg-soft rounded"></div>
              <div className="h-8 w-16 bg-soft rounded"></div>
              <div className="h-4 w-full bg-soft rounded"></div>
            </div>
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border h-80 rounded-lg p-6"></div>
          <div className="bg-card border border-border h-80 rounded-lg p-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 font-sans">
      {/* 3. Welcome Header */}
      <div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono">
          Ecosystem Navigator
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1.5">
          Good Morning, Dev Sharma
        </h1>
        <p className="text-xs text-secondary mt-1 max-w-xl leading-relaxed">
          PathFinder has discovered new MSME acquisition opportunities hidden within your ecosystem.
        </p>
      </div>

      {/* 4. KPI Cards */}
      <div data-demo="dashboard-kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="New Opportunities"
          value={stats?.new_opportunities ?? 0}
          trend="+12% vs last week"
          description="Ecosystem nodes flagged for active outreach review"
        />
        <MetricCard
          title="High Priority"
          value={stats?.high_priority ?? 0}
          description="Ecosystem targets requiring immediate executive intervention"
        />
        <MetricCard
          title="Potential Value"
          value={stats ? `${(stats.potential_value_lakh / 100).toFixed(1)} Cr` : "0 Cr"}
          trend="Avg 82.5 Lakhs / MSME"
          description="Cumulative asset growth potential from active pipelines"
        />
        <MetricCard
          title="Average Conversion"
          value={stats ? `${stats.avg_probability}%` : "0%"}
          description="AI-computed statistical likelihood of converting current prospects"
        />
      </div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routeData && <RouteDistributionChart routeData={routeData} />}
        {ecosystemData && <EcosystemGrowthChart ecosystemData={ecosystemData} />}
      </div>

      {/* Grid: Table & Timeline Section */}
      <div data-demo="opportunity-table" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <OpportunityTable
            opportunities={opportunities ?? []}
          />
        </div>
        <div>
          <Timeline
            events={timelineEvents ?? []}
          />
        </div>
      </div>
    </div>
  );
}
