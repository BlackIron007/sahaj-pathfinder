"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDemo } from "@/providers/demo-provider";
import { observe, scrollUntilVisible, verifyAndClick, waitStateChange, panoramicScrollToBottom } from "@/lib/cameraDirector";
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
  fetchSignalProvenance,
  fetchOpportunityDiscovery
} from "@/lib/api/opportunities";
import { SignalCard } from "@/components/opportunities/signal-card";
import { RouteComparison } from "@/components/opportunities/route-comparison";
import { EcosystemGraph } from "@/components/opportunities/ecosystem-graph";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeSignal, setActiveSignal] = useState<string | null>(null);
  const [activeJourneyStepIdx, setActiveJourneyStepIdx] = useState<number>(0);
  const [showFullBreakdown, setShowFullBreakdown] = useState(false);
  const [showDecisionHistory, setShowDecisionHistory] = useState(false);



  // Provenance Query
  const { data: provenance, isLoading: isProvenanceLoading } = useQuery({
    queryKey: ["signalProvenance", id, activeSignal],
    queryFn: () => fetchSignalProvenance(id, activeSignal!),
    enabled: !!activeSignal,
  });

  // Discovery Query
  const { data: discoveryDetails } = useQuery({
    queryKey: ["opportunityDiscovery", id],
    queryFn: () => fetchOpportunityDiscovery(id),
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

  const isLoading = isDetailLoading || isSignalsLoading || isRouteLoading || isEcosystemLoading;

  const { isDemoMode, currentScene, triggerTransition } = useDemo();

  useEffect(() => {
    if (!isDemoMode || currentScene !== 2 || isLoading || !detail) return;
    let active = true;

    const runScene2 = async () => {
      // 1. Begin at top — orient viewer on opportunity header
      window.scrollTo({ top: 0, behavior: "smooth" });
      await observe(1000);
      if (!active) return;

      // 2. Scroll until Discovery Summary is visible
      await scrollUntilVisible('[data-demo="discovery-summary"]');
      if (!active) return;
      await observe(600);

      // 3. Expand score breakdown
      setShowFullBreakdown(true);
      await observe(1800); // watch the accordion open
      if (!active) return;

      // 4. Scroll until Route Evaluation is visible
      await scrollUntilVisible('[data-demo="route-evaluation"]');
      if (!active) return;
      await observe(1200);

      // 5. Scroll until Signals grid is visible
      await scrollUntilVisible('[data-demo="signal-cards"]');
      if (!active) return;
      await observe(800);

      // 6. Verify first signal explain button is visible, click it
      await scrollUntilVisible('[data-demo="explain-signal"]');
      await verifyAndClick('[data-demo="explain-signal"]');
      
      // Wait until modal state loaded
      await waitStateChange(() => !!document.querySelector('[data-demo="signal-modal-content"]'));
      await observe(600); // let modal animate open
      if (!active) return;

      // 7. Scroll through modal content
      const modalContent = document.querySelector('[data-demo="signal-modal-content"]');
      if (modalContent) {
        for (const delta of [120, 120, 120]) {
          modalContent.scrollBy({ top: delta, behavior: "smooth" });
          await observe(900);
          if (!active) return;
        }
      }
      await observe(1000);
      if (!active) return;

      // 8. Close modal
      await verifyAndClick('[data-demo="signal-modal-close"]');
      await observe(800);
      if (!active) return;

      // 9. Continuous panoramic exploration to bottom of page (Governance/Decision History)
      await panoramicScrollToBottom(400, 120);
      if (!active) return;
      await observe(1500);
      if (!active) return;

      triggerTransition("/architecture", 3);
    };

    runScene2();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode, currentScene, isLoading, detail, signals]);

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

          {/* Discovery Score Summary Card */}
          {discoveryDetails && (
            <div data-demo="discovery-summary" className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">
                  Ecosystem Discovery Score Summary
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] text-secondary uppercase font-bold block">Discovery Source</span>
                    <span className="text-xs font-bold text-primary font-mono">
                      {detail.recommended_route === "Anchor" ? "Anchor Network" : 
                       detail.recommended_route === "Advisor" ? "Advisor Network" : 
                       detail.recommended_route === "Transaction" ? "Invoice Graph" : 
                       detail.recommended_route === "Direct" ? "Transaction Network" : "Supplier Network"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-foreground">{discoveryDetails.discovery_score}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">Confidence</span>
                  </div>
                </div>
              </div>
              
              {/* Top 3 Contributing Factors */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">Top 3 Contributing Factors</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {[
                    { label: "Network Connectivity", value: discoveryDetails.breakdown.network_connectivity },
                    { label: "Invoice Strength", value: discoveryDetails.breakdown.invoice_strength },
                    { label: "Anchor Trust", value: discoveryDetails.breakdown.anchor_trust },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-soft/20 border border-border/40 p-3 rounded flex justify-between items-center">
                      <span className="text-secondary font-medium">{item.label}</span>
                      <span className="font-mono font-bold text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Full Breakdown Disclosure Collapse */}
              <div className="pt-2">
                <button
                  data-demo="view-breakdown"
                  onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                  className="text-xs font-semibold text-primary hover:text-primary-dim flex items-center gap-1 focus:outline-none"
                >
                  {showFullBreakdown ? "Hide Full Breakdown" : "View Full Breakdown"}
                </button>
                
                {showFullBreakdown && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/40">
                    {[
                      { label: "Network Connectivity", value: discoveryDetails.breakdown.network_connectivity },
                      { label: "Invoice Strength", value: discoveryDetails.breakdown.invoice_strength },
                      { label: "Anchor Trust", value: discoveryDetails.breakdown.anchor_trust },
                      { label: "Advisor Confidence", value: discoveryDetails.breakdown.advisor_confidence },
                      { label: "Digital Readiness", value: discoveryDetails.breakdown.digital_readiness },
                      { label: "Growth Potential", value: discoveryDetails.breakdown.growth_potential },
                      { label: "Working Capital Need", value: discoveryDetails.breakdown.working_capital_need },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-soft/20 border border-border/40 p-3 rounded space-y-1.5">
                        <span className="text-[10px] text-secondary font-medium block">{item.label}</span>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-foreground">{item.value}%</span>
                          <div className="w-12 bg-soft rounded-full h-1 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Route Comparison Widget */}
          <div data-demo="route-evaluation">
          {routeAnalysis && <RouteComparison analysis={routeAnalysis} />}
          </div>

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
          <div data-demo="signal-cards" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {signals?.map((signal) => (
                <SignalCard 
                  key={signal.signal_id} 
                  {...signal} 
                  onExplain={() => setActiveSignal(signal.title)}
                />
              ))}
            </div>
          </div>

          {/* Discovery Evidence & Rejection Engine Analysis */}
          {discoveryDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Evidence */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
                  Why was this MSME Discovered?
                </h3>
                <div className="space-y-2 text-xs">
                  {discoveryDetails.evidence.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-status-approved-bg border border-status-approved-accent/10 px-3 py-2 rounded text-secondary leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-status-approved-accent shrink-0" />
                      <span>{ev} (verified via provenance trace)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejected Alternatives */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
                  Rejected Alternatives
                </h3>
                <div className="divide-y divide-border/40 text-xs">
                  {[
                    { company: "Om Metatech Castings", score: 58, reason: "No verified GST Verification", evidence: 2 },
                    { company: "Kalyani Trade Linkers", score: 62, reason: "Weak graph confidence", evidence: 3 },
                    { company: "Vardhaman Textiles Ltd", score: 52, reason: "No anchor relationship found", evidence: 1 }
                  ].map((cand, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5">
                      <div>
                        <span className="font-bold text-foreground block">{cand.company}</span>
                        <span className="text-[10px] text-status-blocked-accent font-semibold bg-status-blocked-bg border border-status-blocked-accent/15 px-1.5 py-0.5 rounded mt-1 inline-block">
                          {cand.reason}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-foreground">Score: {cand.score}</div>
                        <div className="text-[9.5px] text-secondary mt-0.5">{cand.evidence} evidence counts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Column (Topology & Timeline) */}
        <div className="space-y-6">
          
          {/* Ecosystem Graph Visual Block */}
          {ecosystem && <EcosystemGraph ecosystem={ecosystem} />}

          {/* Discovery Journey */}
          {discoveryDetails && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
                Ecosystem Discovery Journey
              </h3>
              <div className="flex flex-col gap-2">
                {discoveryDetails.journey.map((step, idx) => {
                  const isSelected = activeJourneyStepIdx === idx;
                  
                  // Dynamically resolve parameters for progressive disclosure
                  const getStepDetails = (sName: string) => {
                    if (sName.includes("Invoice")) return { csv: "02_invoice_transactions.csv", derivation: "Ingestion of supplier cash records", route: "Transaction Route preferred" };
                    if (sName.includes("Counterparty")) return { csv: "01_msme_profiles.csv", derivation: "Entity classification and profile linking", route: "Direct Route checked" };
                    if (sName.includes("GST")) return { csv: "01_msme_profiles.csv", derivation: "Verification with registry database", route: "All Routes compliant" };
                    if (sName.includes("Advisor")) return { csv: "04_advisor_relationships.csv", derivation: "CA node association traversal", route: "Advisor Route evaluated" };
                    if (sName.includes("Graph")) return { csv: "05_graph_edges.csv", derivation: "3-hop network distance propagation", route: "Anchor Route connection mapped" };
                    if (sName.includes("Opportunity")) return { csv: "06_acquisition_opportunities.csv", derivation: "Discovery score qualification checking", route: "Passed score threshold" };
                    if (sName.includes("Route")) return { csv: "07_opportunity_signals.csv", derivation: "Rule engine heuristics weighting", route: "Selected Transaction Route" };
                    return { csv: "07_opportunity_signals.csv", derivation: "RM proposal parameters hydration", route: "SME Smart Score Card drafted" };
                  };
                  const stepParams = getStepDetails(step.step);

                  return (
                    <div key={idx} className="border border-border/60 rounded-md overflow-hidden bg-soft/10">
                      <button
                        onClick={() => setActiveJourneyStepIdx(isSelected ? -1 : idx)}
                        className={`px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors focus:outline-none text-left w-full flex justify-between items-center ${
                          isSelected
                            ? "bg-primary text-card"
                            : "hover:bg-soft text-secondary"
                        }`}
                      >
                        <span>{step.step}</span>
                        <span className="text-[9px] font-mono opacity-80">{isSelected ? "Collapse" : "Expand"}</span>
                      </button>

                      {isSelected && (
                        <div className="p-3 bg-card border-t border-border/30 text-[10.5px] space-y-2 text-secondary leading-relaxed animate-in slide-in-from-top-2 duration-150">
                          <div>
                            <span className="font-bold text-foreground block mb-0.5">Evidence:</span>
                            {step.evidence}
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-t border-border/30 pt-2 font-mono text-[9px] text-secondary/95">
                            <div>
                              <span className="block font-sans text-[8px] uppercase font-bold text-secondary/60">CSV Provenance</span>
                              {stepParams.csv}
                            </div>
                            <div>
                              <span className="block font-sans text-[8px] uppercase font-bold text-secondary/60">Signal Derivation</span>
                              {stepParams.derivation}
                            </div>
                            <div>
                              <span className="block font-sans text-[8px] uppercase font-bold text-secondary/60">Route Comparison</span>
                              {stepParams.route}
                            </div>
                            <div>
                              <span className="block font-sans text-[8px] uppercase font-bold text-secondary/60">Timestamp</span>
                              2026-06-27 14:37:05
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Decision History */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 mt-6">
        <button
          onClick={() => setShowDecisionHistory(!showDecisionHistory)}
          className="w-full flex items-center justify-between focus:outline-none"
        >
          <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">
            Governance Decision History
          </h3>
          <span className="text-xs font-semibold text-primary">
            {showDecisionHistory ? "Hide History" : "Show History"}
          </span>
        </button>
        
        {showDecisionHistory && (
          <div className="pt-4 border-t border-border/40 text-xs space-y-3 leading-relaxed text-secondary animate-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4">
              <div>
                <span className="block font-bold text-foreground">Original Recommendation:</span>
                <span className="font-mono">{detail.recommended_route} Route</span>
              </div>
              <div>
                <span className="block font-bold text-foreground">Final RM Decision:</span>
                <span>Approved recommended pathway</span>
              </div>
              <div>
                <span className="block font-bold text-foreground">Reason for Override:</span>
                <span>No override applied. Model route matched underwriting rationale.</span>
              </div>
              <div>
                <span className="block font-bold text-foreground">Final Outcome:</span>
                <span className="font-semibold text-status-approved-accent">Offer Accepted (Active Loan)</span>
              </div>
              <div>
                <span className="block font-bold text-foreground">Model Version Used:</span>
                <span className="font-mono">v2.3-production</span>
              </div>
              <div>
                <span className="block font-bold text-foreground">Timestamp:</span>
                <span className="font-mono">2026-06-27 10:14:55</span>
              </div>
              <div>
                <span className="block font-bold text-foreground">Future Training Weight:</span>
                <span className="font-mono font-bold text-primary">1.0x (Standard reinforcement)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Signal Provenance Explanation Dialog Modal Overlay */}
      {activeSignal && (
        <div data-demo="signal-modal" className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                data-demo="signal-modal-close"
                onClick={() => setActiveSignal(null)}
                className="p-1 hover:bg-soft rounded text-secondary hover:text-foreground transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Content Body */}
            <div data-demo="signal-modal-content" className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
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
