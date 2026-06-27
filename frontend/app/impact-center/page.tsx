"use client";

import React, { useState, useEffect } from "react";
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
  const [isGovernanceOpen, setIsGovernanceOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [selectedRegistryModel, setSelectedRegistryModel] = useState<string | null>(null);
  const [animatedStepIdx, setAnimatedStepIdx] = useState(-1);

  useEffect(() => {
    if (isGovernanceOpen) {
      setAnimatedStepIdx(0);
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        if (idx < 11) {
          setAnimatedStepIdx(idx);
        } else {
          clearInterval(interval);
        }
      }, 150);
      return () => clearInterval(interval);
    } else {
      setAnimatedStepIdx(-1);
    }
  }, [isGovernanceOpen]);

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

      {/* Top KPI row of 7 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <ImpactMetricCard 
          title="Strategies" 
          value={summary.strategies_executed} 
          description="Pre-approved workflows" 
        />
        <ImpactMetricCard 
          title="Acquisitions" 
          value={summary.successful_acquisitions} 
          description="Fully acquired MSMEs" 
        />
        <ImpactMetricCard 
          title="Avg Conversion" 
          value={`${summary.avg_conversion_rate}%`} 
          description="Baseline success rate" 
        />
        <ImpactMetricCard 
          title="Projected Loans" 
          value={`₹${summary.projected_loan_book_cr} Cr`} 
          description="Asset volume yield" 
        />
        <ImpactMetricCard 
          title="New Nodes" 
          value={summary.new_ecosystem_nodes} 
          description="Discovered suppliers" 
        />
        <ImpactMetricCard 
          title="Confidence Gain" 
          value={`+${summary.confidence_gain_percent}%`} 
          description="Precision delta" 
        />
        <div className="bg-card border border-border rounded-lg p-3.5 flex flex-col justify-between hover:border-primary/50 transition-colors h-32 opacity-85">
          <div>
            <span className="text-[9px] uppercase font-bold text-secondary/70 tracking-wider block">Governance</span>
            <div className="text-xs font-bold text-secondary font-mono mt-0.5">v2.3 (Active)</div>
          </div>
          <div className="text-[8.5px] text-secondary/80 space-y-0.5 leading-relaxed font-mono">
            <div>Shadow: <span className="text-foreground">v2.4</span></div>
            <div>Rollback: <span className="text-status-approved-accent font-semibold">Ready</span></div>
            <div>Approval: <span className="text-status-approved-accent font-semibold">Governed</span></div>
          </div>
        </div>
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

      {/* Section 6: AI Governance & Continuous Learning (Collapsible, final section) */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <button 
          onClick={() => setIsGovernanceOpen(!isGovernanceOpen)}
          className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
        >
          <span className="text-xs uppercase font-bold text-secondary tracking-widest flex items-center gap-2">
            AI Governance &amp; Continuous Learning
          </span>
          <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isGovernanceOpen ? "rotate-180" : ""}`} />
        </button>
        {isGovernanceOpen && (
          <div className="p-6 space-y-8 animate-in fade-in duration-200">
            
            {/* A. Learning Loop horizontal visual timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                A. Continuous Model Learning Loop
              </h3>
              <p className="text-[11px] text-secondary leading-relaxed max-w-2xl">
                How recommendation feedback flows from production back into training, updates candidate weights, passes human governance validation, and deploys as updated models.
              </p>
              
              <div className="flex flex-wrap gap-2.5 items-center bg-soft/10 p-4 border border-border/40 rounded-lg text-[10px] uppercase font-bold">
                {[
                  "Recommendation",
                  "RM Decision",
                  "Customer Response",
                  "Loan Outcome",
                  "Feedback",
                  "Candidate Model",
                  "Offline Validation",
                  "Shadow Deployment",
                  "Governance Review",
                  "Production",
                  "Rollback Ready"
                ].map((step, idx, arr) => {
                  const isActive = idx <= animatedStepIdx;
                  return (
                    <React.Fragment key={idx}>
                      <div className={`px-2.5 py-1.5 border rounded text-center font-mono transition-all duration-200 ${
                        isActive 
                          ? "bg-primary border-primary text-card font-semibold scale-105 shadow-sm" 
                          : "bg-card border-border text-secondary"
                      }`}>
                        {step}
                      </div>
                      {idx < arr.length - 1 && (
                        <span className={`font-mono select-none transition-colors duration-200 ${
                          isActive ? "text-primary font-bold" : "text-border"
                        }`}>▶</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* B. Learning Metrics */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                B. Production Learning Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-[11px]">
                {[
                  { label: "Model Version", value: "v2.3 (Active)", sub: "Deterministic" },
                  { label: "Training Samples", value: "18,240", sub: "Discovered cases" },
                  { label: "RM Acceptance Rate", value: "86%", sub: "14% overrides" },
                  { label: "False Positive Rate", value: "4.3%", sub: "Target deviation" },
                  { label: "Recommendation Accuracy", value: "91%", sub: "Underwriting success" },
                  { label: "Confidence Drift", value: "+0.8%", sub: "Dynamic adjustment" },
                  { label: "Shadow Model", value: "v2.4 Running", sub: "Silent validation" },
                  { label: "Production Status", value: "Approved", sub: "Governed pipeline" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-soft/10 border border-border/40 p-2.5 rounded text-center">
                    <span className="text-[8.5px] uppercase font-bold text-secondary/80 block mb-0.5">{item.label}</span>
                    <span className="font-mono font-bold text-foreground block text-[11.5px]">{item.value}</span>
                    <span className="text-[8px] text-secondary/70 mt-0.5 block">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* C. Governed Model Registry (collapsed by default) */}
            <div className="space-y-3 border-t border-border/40 pt-6">
              <div 
                onClick={() => setIsRegistryOpen(!isRegistryOpen)}
                className="flex items-center justify-between cursor-pointer group bg-soft/10 p-3.5 border border-border/40 rounded-lg hover:border-primary/50 transition-colors"
              >
                <div>
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                    C. Governed Model Registry
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-secondary mt-1 font-mono">
                    <div>Production: <span className="font-semibold text-foreground">v2.3</span></div>
                    <div>Shadow: <span className="font-semibold text-foreground">v2.4</span></div>
                    <div>Rollback: <span className="font-semibold text-status-approved-accent">Ready</span></div>
                    <div>Tracked: <span className="font-semibold text-foreground">4 Models</span></div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary group-hover:text-primary-focus transition-colors">
                  {isRegistryOpen ? "Hide Registry" : "View Registry"}
                </div>
              </div>
              
              {isRegistryOpen && (
                <div className="overflow-x-auto pt-2 animate-in slide-in-from-top-2 duration-150">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-soft/40 border-b border-border text-secondary font-semibold uppercase tracking-wider text-[10px]">
                        <th className="p-3">Model</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">RM Approval</th>
                        <th className="p-3">Accuracy</th>
                        <th className="p-3">Deployment Date</th>
                        <th className="p-3 text-right">Rollback Available</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {[
                        { model: "v2.1", status: "Retired", approval: "Approved by SBI SME Board", accuracy: "87%", date: "2026-02-15", rollback: "No", reason: "Decommissioned after v2.2 promotion.", snapshot: "sprint_1_v2", metrics: "Precision: 88%, Recall: 86%" },
                        { model: "v2.2", status: "Retired", approval: "Approved by Risk Head", accuracy: "89%", date: "2026-04-10", rollback: "Yes", reason: "Maintained as hot-standby rollback candidate.", snapshot: "sprint_2_v2", metrics: "Precision: 90%, Recall: 88%" },
                        { model: "v2.3", status: "Current Production", approval: "Approved by SBI Governance Board", accuracy: "91%", date: "2026-06-01", rollback: "Yes (v2.2 Hot Rollback)", reason: "Currently serving live RM requests.", snapshot: "sprint_4_v1", metrics: "Precision: 92%, Recall: 90%" },
                        { model: "v2.4", status: "Shadow Evaluation", approval: "Pending Approval", accuracy: "93%", date: "2026-06-25 (Shadow Run)", rollback: "N/A", reason: "Running silently alongside production.", snapshot: "sprint_4_v2", metrics: "Precision: 94%, Recall: 92%" },
                      ].map((m) => {
                        const isSelected = selectedRegistryModel === m.model;
                        return (
                          <React.Fragment key={m.model}>
                            <tr 
                              onClick={() => setSelectedRegistryModel(isSelected ? null : m.model)}
                              className="hover:bg-soft/20 cursor-pointer transition-colors"
                            >
                              <td className="p-3 font-semibold text-primary font-mono">{m.model}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  m.status === "Current Production" ? "bg-status-approved-bg text-status-approved-accent" :
                                  m.status === "Shadow Evaluation" ? "bg-status-warning-bg text-status-warning-accent" : "bg-soft text-secondary"
                                }`}>
                                  {m.status}
                                </span>
                              </td>
                              <td className="p-3 text-secondary">{m.approval}</td>
                              <td className="p-3 font-mono text-foreground font-semibold">{m.accuracy}</td>
                              <td className="p-3 font-mono text-secondary">{m.date}</td>
                              <td className="p-3 text-right font-mono text-secondary">{m.rollback}</td>
                            </tr>
                            
                            {isSelected && (
                              <tr>
                                <td colSpan={6} className="bg-soft/20 p-4 border-y border-border/30 text-xs text-secondary leading-relaxed">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                                    <div>
                                      <span className="font-bold text-foreground block">Dataset Snapshot:</span>
                                      <code className="bg-card px-1.5 py-0.5 rounded border border-border/40 font-mono text-[10.5px]">{m.snapshot}</code>
                                    </div>
                                    <div>
                                      <span className="font-bold text-foreground block">Validation Metrics:</span>
                                      <code className="bg-card px-1.5 py-0.5 rounded border border-border/40 font-mono text-[10.5px]">{m.metrics}</code>
                                    </div>
                                    <div>
                                      <span className="font-bold text-foreground block">Deployment Reason:</span>
                                      {m.reason}
                                    </div>
                                    <div>
                                      <span className="font-bold text-foreground block">Approval Note:</span>
                                      Registered in MLflow board. Human approval validation checks completed.
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* D. Training Labels & Feedback Weighting */}
            <div className="space-y-3 border-t border-border/40 pt-6">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                D. Training Labels &amp; Feedback Weighting
              </h3>
              <p className="text-[11.5px] text-secondary leading-relaxed max-w-2xl">
                Manual corrections, outcomes, and business results are converted into labels with specific weights to guide candidate model proposal optimization.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {[
                  { event: "RM accepted recommendation", weight: "+1.0x", impact: "Strengthens routing heuristics for similar profiles" },
                  { event: "Customer rejected offer", weight: "-0.5x", impact: "Decreases route probability score baseline" },
                  { event: "Manual route override", weight: "-1.5x", impact: "Pushes adjustments to correct mismatched routes" },
                  { event: "Loan defaulted", weight: "-3.0x", impact: "Severe penalty to route confidence factors" },
                  { event: "Cross-sell succeeded", weight: "+0.8x", impact: "Increases secondary product conversion factors" },
                  { event: "Relationship expanded", weight: "+1.2x", impact: "Improves overall model conversion weight scoring" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-soft/20 border border-border/40 p-3.5 rounded space-y-1.5">
                    <div className="flex justify-between items-center font-bold text-foreground">
                      <span>{item.event}</span>
                      <span className="font-mono text-primary">{item.weight}</span>
                    </div>
                    <p className="text-[10px] text-secondary leading-relaxed">{item.impact}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
