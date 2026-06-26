"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  ChevronRight,
  FileCheck,
  UserPlus
} from "lucide-react";
import { 
  fetchOpportunityDetail, 
  fetchOpportunitySignals, 
  fetchOpportunityRouteAnalysis, 
  fetchOpportunityEcosystem, 
  fetchOpportunityTimeline 
} from "@/lib/api/opportunities";
import { SignalCard } from "@/components/opportunities/signal-card";
import { RouteComparison } from "@/components/opportunities/route-comparison";
import { EcosystemGraph } from "@/components/opportunities/ecosystem-graph";
import { Timeline } from "@/components/dashboard/timeline";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Hydrate all workspace parameters in parallel via React Query
  const { data: detail, isLoading: isDetailLoading, error: detailError } = useQuery({
    queryKey: ["opportunityDetail", id],
    queryFn: () => fetchOpportunityDetail(id),
  });

  const { data: signals, isLoading: isSignalsLoading } = useQuery({
    queryKey: ["opportunitySignals", id],
    queryFn: () => fetchOpportunitySignals(id),
  });

  const { data: routeAnalysis, isLoading: isRouteLoading } = useQuery({
    queryKey: ["opportunityRouteAnalysis", id],
    queryFn: () => fetchOpportunityRouteAnalysis(id),
  });

  const { data: ecosystem, isLoading: isEcosystemLoading } = useQuery({
    queryKey: ["opportunityEcosystem", id],
    queryFn: () => fetchOpportunityEcosystem(id),
  });

  const { data: timeline, isLoading: isTimelineLoading } = useQuery({
    queryKey: ["opportunityTimeline", id],
    queryFn: () => fetchOpportunityTimeline(id),
  });

  const isLoading = isDetailLoading || isSignalsLoading || isRouteLoading || isEcosystemLoading || isTimelineLoading;

  if (detailError || (!isLoading && !detail)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <h2 className="text-base font-bold text-foreground">Opportunity Not Found</h2>
        <p className="text-xs text-secondary max-w-sm">
          The requested opportunity ID does not exist or API gateways are offline.
        </p>
        <button 
          onClick={() => router.push("/acquisition-intelligence")}
          className="px-4 py-2 text-xs font-semibold rounded bg-primary text-card hover:bg-primary-dim transition-colors"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  if (isLoading || !detail) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse font-sans">
        <div className="h-4 w-48 bg-soft rounded"></div>
        <div className="h-10 w-96 bg-soft rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-32 bg-soft rounded-lg"></div>
            <div className="h-64 bg-soft rounded-lg"></div>
          </div>
          <div className="h-96 bg-soft rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Selected route highlight
  const selectedRouteItem = routeAnalysis?.find(r => r.selected);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* High-contrast breadcrumb navigation panel */}
      <div className="flex items-center gap-2 text-[10px] text-secondary font-medium tracking-wider uppercase border-b border-border/40 pb-3">
        <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3 text-secondary/60" />
        <Link href="/acquisition-intelligence" className="hover:text-primary transition-colors">Acquisition Intelligence</Link>
        <ChevronRight className="h-3 w-3 text-secondary/60" />
        <span className="text-foreground">{detail?.company_name || ""}</span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/acquisition-intelligence")}
              className="p-1 hover:bg-soft rounded text-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {detail.company_name}
            </h1>
            <span className="bg-soft border border-border/80 text-foreground font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
              Score: {detail.opportunity_score}%
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-secondary pl-8">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {detail.location}</span>
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {detail.industry}</span>
          </div>
        </div>

        {/* Top CTA Row */}
        <div className="flex items-center gap-2 pl-8 md:pl-0">
          <button 
            onClick={() => router.push(`/offer-workspace/${id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded bg-primary text-card hover:bg-primary-dim transition-colors"
          >
            <FileCheck className="h-3.5 w-3.5" /> Generate Offer Proposal
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border border-border bg-card text-foreground hover:bg-soft transition-colors">
            <UserPlus className="h-3.5 w-3.5" /> Assign Team Member
          </button>
        </div>
      </div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left/Middle Column (Intelligence Details) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Entity Profile Metrics Categorized */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 mb-4">
              Entity Profile Metrics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Box */}
              <div className="bg-soft/20 border border-border/40 rounded p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">Business Context</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-secondary block text-[10px]">Annual Turnover</span>
                    <span className="font-semibold text-foreground">{detail.annual_turnover_cr} Cr</span>
                  </div>
                  <div>
                    <span className="text-secondary block text-[10px]">Banking Status</span>
                    <span className="font-semibold text-foreground">{detail.current_banking_status === "Yes" ? "SBI Customer" : "New Acquisition"}</span>
                  </div>
                </div>
              </div>

              {/* Compliance Box */}
              <div className="bg-soft/20 border border-border/40 rounded p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">Compliance & Registry</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-secondary block text-[10px]">GST Validation</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-status-approved-accent" /> {detail.gst_registered}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary block text-[10px]">Udyam Registration</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-status-approved-accent" /> {detail.udyam_registered}
                    </span>
                  </div>
                </div>
              </div>

              {/* Relationship Box */}
              <div className="bg-soft/20 border border-border/40 rounded p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">Partnership Channels</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-secondary block text-[10px]">Identified CA Advisor</span>
                    <span className="font-semibold text-foreground truncate block">{detail.associated_advisor}</span>
                  </div>
                  <div>
                    <span className="text-secondary block text-[10px]">Corporate Anchor</span>
                    <span className="font-semibold text-foreground truncate block">{detail.identified_anchor}</span>
                  </div>
                </div>
              </div>

              {/* Network Box */}
              <div className="bg-soft/20 border border-border/40 rounded p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">Network Parameters</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-secondary block text-[10px]">Ecosystem Size</span>
                    <span className="font-semibold text-foreground">{detail.network_size} Nodes</span>
                  </div>
                  <div>
                    <span className="text-secondary block text-[10px]">Relationship Age</span>
                    <span className="font-semibold text-foreground">{detail.relationship_age}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Route Comparison Widget */}
          {routeAnalysis && <RouteComparison analysis={routeAnalysis} />}

          {/* Structured Decision Rationale split into 3 cards */}
          {selectedRouteItem && (
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-2">
                Recommended Action Rationale
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pros Card */}
                <div className="bg-card border border-border rounded-lg p-5 space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-status-approved-accent tracking-wider">
                    Target Advantages
                  </h4>
                  <ul className="space-y-1.5 text-xs text-secondary list-disc pl-4">
                    {selectedRouteItem.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>

                {/* Cons Card */}
                <div className="bg-card border border-border rounded-lg p-5 space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-status-blocked-accent tracking-wider">
                    Identified Bottlenecks
                  </h4>
                  <ul className="space-y-1.5 text-xs text-secondary list-disc pl-4">
                    {selectedRouteItem.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>

                {/* Underwriting Evidence Card */}
                <div className="bg-card border border-border rounded-lg p-5 space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-primary tracking-wider">
                    Underwriting Evidence
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    {selectedRouteItem.evidence}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Visual Reasoning Flow Pipeline */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
              Discovery Reasoning Path
            </h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-soft/20 border border-border/40 rounded-lg text-xs">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-secondary block">1. Discovery Anchor</span>
                <span className="font-bold text-foreground">{detail.identified_anchor}</span>
              </div>
              <span className="hidden sm:inline text-primary font-mono font-bold">────►</span>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-secondary block">2. Intermediary CA</span>
                <span className="font-bold text-foreground">{detail.associated_advisor}</span>
              </div>
              <span className="hidden sm:inline text-primary font-mono font-bold">────►</span>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-secondary block">3. Target Candidate</span>
                <span className="font-bold text-foreground">{detail.company_name}</span>
              </div>
            </div>
          </div>

          {/* Active Pipeline Signals */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-2">
              Detected Ingestion Signals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {signals?.map((signal) => (
                <SignalCard key={signal.signal_id} {...signal} />
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (Topology & Timeline) */}
        <div className="space-y-6">
          
          {/* Ecosystem Graph Visual Block */}
          {ecosystem && <EcosystemGraph ecosystem={ecosystem} />}

          {/* Timeline Tracking */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 mb-4">
              Discovery Hypothesis Timeline
            </h3>
            {timeline && <Timeline events={timeline.map((t, idx) => ({
              id: `evt-${idx}`,
              type: t.status === "Completed" ? "supplier_discovered" : "network_growth",
              title: t.step,
              description: t.status === "Completed" ? "Verified via ledger integration" : (t.status === "Current" ? "Pending validation" : "Future path"),
              date: t.date || "Scheduled"
            }))} />}
          </div>

        </div>

      </div>
    </div>
  );
}
