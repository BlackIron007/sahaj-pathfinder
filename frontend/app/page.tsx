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

export default function ExecutiveDashboard() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
