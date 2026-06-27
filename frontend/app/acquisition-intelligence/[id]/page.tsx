"use client";

import React, { useState } from "react";
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
  UserPlus,
  X,
  Database,
  HelpCircle,
  FileText
} from "lucide-react";
import { 
  fetchOpportunityDetail, 
  fetchOpportunitySignals, 
  fetchOpportunityRouteAnalysis, 
  fetchOpportunityEcosystem, 
  fetchOpportunityTimeline,
  fetchSignalProvenance
} from "@/lib/api/opportunities";
import { SignalCard } from "@/components/opportunities/signal-card";
import { RouteComparison } from "@/components/opportunities/route-comparison";
import { EcosystemGraph } from "@/components/opportunities/ecosystem-graph";
import { Timeline } from "@/components/dashboard/timeline";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  // Provenance Query
  const { data: provenance, isLoading: isProvenanceLoading } = useQuery({
    queryKey: ["signalProvenance", id, activeSignal],
    queryFn: () => fetchSignalProvenance(id, activeSignal!),
    enabled: !!activeSignal,
  });

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
                <SignalCard 
                  key={signal.signal_id} 
                  {...signal} 
                  onExplain={() => setActiveSignal(signal.title)}
                />
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

      {/* Signal Provenance Explanation Dialog Modal Overlay */}
      {activeSignal && (
        <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-5 border-b border-border flex justify-between items-center bg-soft/20">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">
                  Signal Provenance: {activeSignal}
                </h3>
              </div>
              <button 
                onClick={() => setActiveSignal(null)}
                className="p-1 hover:bg-soft rounded text-secondary hover:text-foreground transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {isProvenanceLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-xs text-secondary">Computing signal lineage from raw CSV files…</span>
                </div>
              ) : provenance ? (
                <div className="space-y-5 text-xs">
                  
                  {/* Summary row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-soft/30 border border-border/40 p-3 rounded">
                      <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block mb-1">Signal Value</span>
                      <span className="font-semibold text-foreground text-sm">{provenance.value}</span>
                    </div>
                    <div className="bg-soft/30 border border-border/40 p-3 rounded">
                      <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block mb-1">Confidence Score</span>
                      <span className="font-mono font-bold text-foreground text-sm">{provenance.confidence}%</span>
                    </div>
                  </div>

                  {/* Formula Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Business-Readable Weighted Logic</span>
                    {provenance.formula_weights && provenance.formula_weights.length > 0 ? (
                      <div className="space-y-2">
                        {provenance.formula_weights.map((w, idx) => (
                          <div key={idx} className="bg-soft/40 border border-border/40 p-3 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-foreground">{w.factor}</span>
                              <span className="font-mono font-bold text-primary bg-soft/80 px-2 py-0.5 rounded text-[10px]">Weight: {w.weight}</span>
                            </div>
                            <p className="text-secondary text-[11px] leading-relaxed">{w.reason}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-soft/40 border border-border/50 p-3 rounded font-mono text-[11px] text-foreground whitespace-pre-wrap leading-relaxed">
                        {provenance.formula}
                      </div>
                    )}
                  </div>

                  {/* Why these weights? */}
                  {provenance.why_weights && (
                    <div className="space-y-1.5 bg-soft/20 border border-border/30 p-3 rounded">
                      <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Why these weights?</span>
                      <p className="text-secondary leading-relaxed text-[11px]">
                        {provenance.why_weights}
                      </p>
                    </div>
                  )}

                  {/* Derived From */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Derived Signals &amp; Features</span>
                    <div className="flex flex-wrap gap-2">
                      {provenance.derived_from.map((item, idx) => (
                        <span key={idx} className="bg-card border border-border px-2.5 py-1 rounded text-foreground font-medium text-[11px]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Supporting Evidence Records */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Supporting Underwriting Records</span>
                    <div className="space-y-1.5">
                      {provenance.supporting_records.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-soft/20 border border-border/30 p-2.5 rounded">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-secondary leading-relaxed">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dataset Sources */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Source Dataset Traceability</span>
                    <div className="flex flex-wrap gap-2">
                      {provenance.datasets.map((ds, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 bg-soft text-primary font-semibold px-2 py-0.5 rounded border border-border/80 text-[10px] uppercase font-mono">
                          <Database className="h-3 w-3" /> {ds}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Business Interpretation */}
                  <div className="space-y-1.5 border-t border-border/40 pt-4">
                    <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Business Interpretation</span>
                    <p className="text-secondary leading-relaxed">
                      {provenance.business_reason}
                    </p>
                  </div>

                  {/* Metadata block */}
                  {provenance.metadata && (
                    <div className="space-y-1.5 border-t border-border/40 pt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-secondary font-mono">
                      <div>
                        <span className="block text-[9px] text-secondary/60 uppercase font-bold font-sans">Signal Generated Time</span>
                        {provenance.metadata.signal_generated_time}
                      </div>
                      <div>
                        <span className="block text-[9px] text-secondary/60 uppercase font-bold font-sans">Engine Version</span>
                        {provenance.metadata.engine_version}
                      </div>
                      <div>
                        <span className="block text-[9px] text-secondary/60 uppercase font-bold font-sans">Dataset Snapshot Version</span>
                        {provenance.metadata.dataset_snapshot_version}
                      </div>
                      <div>
                        <span className="block text-[9px] text-secondary/60 uppercase font-bold font-sans">Rule Version</span>
                        {provenance.metadata.rule_version}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-6 text-secondary text-xs">Failed to load provenance metadata.</div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-soft/20 flex justify-end">
              <button 
                onClick={() => setActiveSignal(null)}
                className="px-4 py-2 text-xs font-semibold rounded bg-primary text-card hover:bg-primary-dim transition-colors"
              >
                Close Provenance View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
