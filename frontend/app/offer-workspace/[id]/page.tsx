"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useDemo } from "@/providers/demo-provider";
import { observe, scrollUntilVisible, verifyAndClick, waitStateChange, panoramicScrollToBottom, ensureReachedPageBottom } from "@/lib/cameraDirector";
import { hoverAndClick } from "@/lib/cursorController";
import { executiveConfig } from "@/lib/executiveConfig";
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  ChevronRight, 
  ShieldAlert,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fetchOfferDetails,
  fetchOfferDraft,
  fetchOfferCompliance,
  fetchOfferImpact,
  approveOfferStrategy,
  requestOfferChanges,
  assignOfferBranch,
  generateOfferProposal,
  OfferDetails
} from "@/lib/api/offers";

// Reusable custom components
import { OfferSummaryCard } from "@/components/opportunities/offer-summary-card";
import { StrategyCard } from "@/components/opportunities/strategy-card";
import { ComplianceChecklist } from "@/components/opportunities/compliance-checklist";
import { BusinessImpactGrid } from "@/components/opportunities/business-impact-grid";
import { OutreachPreview } from "@/components/opportunities/outreach-preview";
import { OfferDetailsGrid } from "@/components/opportunities/offer-details-grid";
import { ActivityLog } from "@/components/opportunities/activity-log";
import { DecisionPanel } from "@/components/opportunities/decision-panel";
import { DeploymentTimeline } from "@/components/opportunities/deployment-timeline";

export default function OfferWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  // Collapsible sections state variables (Expanded on desktop by default)
  const [isComplianceOpen, setIsComplianceOpen] = useState(true);
  const [isImpactOpen, setIsImpactOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isActivityOpen, setIsActivityOpen] = useState(true);

  // Status banner toast feedback
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Hydrate all datasets via React Query
  const { data: detail, isLoading: isDetailLoading, error: detailError } = useQuery({
    queryKey: ["offerDetail", id],
    queryFn: () => fetchOfferDetails(id),
  });

  const { data: draft, isLoading: isDraftLoading } = useQuery({
    queryKey: ["offerDraft", id],
    queryFn: () => fetchOfferDraft(id),
  });

  const { data: compliance, isLoading: isComplianceLoading } = useQuery({
    queryKey: ["offerCompliance", id],
    queryFn: () => fetchOfferCompliance(id),
  });

  const { data: impact, isLoading: isImpactLoading } = useQuery({
    queryKey: ["offerImpact", id],
    queryFn: () => fetchOfferImpact(id),
  });

  // Action Mutations
  const approveMutation = useMutation({
    mutationFn: () => approveOfferStrategy(id),
    onSuccess: (data) => {
      queryClient.setQueryData<OfferDetails>(["offerDetail", id], (prev) => prev ? { ...prev, status: "Approved" } : prev);
      setFeedbackMsg({ type: "success", text: data.message });
      setCurrentStep(3); // Advanced in workflow
    }
  });

  const requestChangesMutation = useMutation({
    mutationFn: () => requestOfferChanges(id, ["eligible_amount_lakh", "interest_rate"], "Relationship Manager request for competitive offer rates."),
    onSuccess: (data) => {
      queryClient.setQueryData<OfferDetails>(["offerDetail", id], (prev) => prev ? { ...prev, status: "Needs Revision" } : prev);
      setFeedbackMsg({ type: "success", text: data.message });
    }
  });

  const assignBranchMutation = useMutation({
    mutationFn: () => assignOfferBranch(id, "Mumbai Corporate Hub"),
    onSuccess: (data) => {
      setFeedbackMsg({ type: "success", text: data.message });
    }
  });

  const recalculateMutation = useMutation({
    mutationFn: () => generateOfferProposal(id),
    onSuccess: (data) => {
      setFeedbackMsg({ type: "success", text: data.message });
    }
  });

  const isLoading = isDetailLoading || isDraftLoading || isComplianceLoading || isImpactLoading;
  const isActionLoading = approveMutation.isPending || requestChangesMutation.isPending || assignBranchMutation.isPending || recalculateMutation.isPending;



  const { isDemoMode, currentScene, triggerTransition, isExecutiveMode } = useDemo();

  useEffect(() => {
    if (!isDemoMode || currentScene !== 4 || isLoading || !detail) return;
    let active = true;

    const runScene4Detail = async () => {
      // 1. Start at top — let viewer see the full workspace header
      window.scrollTo({ top: 0, behavior: "smooth" });
      await observe(1000);
      if (!active) return;

      // 2. Scroll until Recalculate button is visible, click it
      await scrollUntilVisible('[data-demo="recalculate-btn"]');
      await verifyAndClick('[data-demo="recalculate-btn"]');

      // 3. Camera stays — wait for recalculation query state change to complete
      await waitStateChange(() => !recalculateMutation.isPending);
      await observe(1500); // let viewer watch updated proposal values
      if (!active) return;

      // 4. Scroll until compliance checklist is visible
      await scrollUntilVisible('[data-demo="compliance-checklist"]');
      if (!active) return;
      await observe(1000);

      // 5. Scroll until business impact estimates are visible
      await scrollUntilVisible('[data-demo="business-impact"]');
      if (!active) return;
      await observe(1000);

      // 6. Continuous panoramic exploration to bottom of page (Activity Log, Outreach Preview & decision panels)
      await panoramicScrollToBottom(400, 120);
      if (!active) return;
      await observe(1500);
      if (!active) return;

      triggerTransition("/impact-center", 5);
    };

    const runExecutiveScene4Detail = async () => {
      // 1. Start at top — let viewer see the full workspace header
      window.scrollTo({ top: 0, behavior: "smooth" });
      await observe(2000);
      if (!active) return;

      // 2. Offer Details overview — scroll and pause
      // Scroll to the main metadata cards container
      const overviewEl = document.querySelector('[data-demo="recalculate-btn"]')?.parentElement?.parentElement as HTMLElement | null;
      if (overviewEl) {
        const targetY = window.scrollY + overviewEl.getBoundingClientRect().top - window.innerHeight * 0.35;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      }
      await observe(2000);
      if (!active) return;

      // 3. Recalculate Offer — viewport center, cursor move, hover, click, wait, pause
      await scrollUntilVisible('[data-demo="recalculate-btn"]');
      await observe(executiveConfig.pauseBeforeClick);
      if (!active) return;
      await hoverAndClick('[data-demo="recalculate-btn"]');
      await waitStateChange(() => !recalculateMutation.isPending);
      await observe(2500); // let viewer watch updated proposal values
      if (!active) return;

      // 4. Compliance Checklist — scroll and pause
      await scrollUntilVisible('[data-demo="compliance-checklist"]');
      await observe(2000);
      if (!active) return;

      // 5. Business Impact — scroll and pause
      await scrollUntilVisible('[data-demo="business-impact"]');
      await observe(2000);
      if (!active) return;

      // 6. Underwriting Decision Panel / Request Changes (Edit Review) — scroll, hover, click, wait
      await scrollUntilVisible('[data-demo="request-changes-btn"]');
      await observe(executiveConfig.pauseBeforeClick);
      if (!active) return;
      await hoverAndClick('[data-demo="request-changes-btn"]');
      await waitStateChange(() => detail.status === "Needs Revision");
      await observe(3500); // observe updated status banner
      if (!active) return;

      // 7. Activity Log & Outreach — scroll and pause
      await panoramicScrollToBottom(executiveConfig.scrollStepDelay, executiveConfig.scrollStepPx);
      await observe(2000);
      if (!active) return;

      // 8. Navigate to Impact Center via sidebar click
      await ensureReachedPageBottom();
      await hoverAndClick('[data-demo="sidebar-link-impact-center"]');
    };

    if (isExecutiveMode) {
      runExecutiveScene4Detail();
    } else {
      runScene4Detail();
    }

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode, currentScene, isLoading, isExecutiveMode]);

  if (detailError || (!isLoading && !detail)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <ShieldAlert className="h-10 w-10 text-status-blocked-accent" />
        <h2 className="text-base font-bold text-foreground">Offer Workspace Offline</h2>
        <p className="text-xs text-secondary max-w-sm">
          Failed to fetch offer review specifications. Check database server availability.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-soft rounded-lg"></div>
            <div className="h-64 bg-soft rounded-lg"></div>
          </div>
          <div className="h-96 bg-soft rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Define chronological Agent Activity Log
  const mockActivityLogs = [
    { time: "09:12", event: "Ledger transaction CSV uploaded" },
    { time: "09:13", event: "Supplier nodes discovered in ecosystem" },
    { time: "09:14", event: "Discovery signals generated" },
    { time: "09:15", event: "Route probability evaluated" },
    { time: "09:16", event: "Acquisition proposal generated" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* High-contrast breadcrumb navigation panel */}
      <div className="flex items-center gap-2 text-[10px] text-secondary font-medium tracking-wider uppercase border-b border-border/40 pb-3">
        <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="h-3 w-3 text-secondary/60" />
        <Link href="/acquisition-intelligence" className="hover:text-primary transition-colors">Acquisition Intelligence</Link>
        <ChevronRight className="h-3 w-3 text-secondary/60" />
        <span className="text-secondary font-semibold">Offer Workspace</span>
        <ChevronRight className="h-3 w-3 text-secondary/60" />
        <span className="text-foreground">{detail.company_name}</span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push(`/acquisition-intelligence/${id}`)}
              className="p-1.5 hover:bg-soft rounded text-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-secondary uppercase tracking-widest leading-none">
                PathFinder Offer Workspace
              </h1>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground mt-2 leading-none">
                {detail.company_name}
              </h2>
            </div>
            <Badge variant={detail.status} className="mt-5">{detail.status}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pl-10">
            <span className="flex items-center gap-1 font-bold text-foreground">{detail.company_name}</span>
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {detail.industry}</span>
            <span className="flex items-center gap-1 font-mono"><MapPin className="h-3.5 w-3.5" /> Route: {detail.recommended_route} ({detail.conversion_probability}%)</span>
          </div>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-2 pl-10 md:pl-0 md:pt-4">
          <button 
            data-demo="recalculate-btn"
            onClick={() => recalculateMutation.mutate()}
            disabled={isActionLoading}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-border bg-card text-foreground hover:bg-soft transition-colors disabled:opacity-50"
          >
            Recalculate Offer
          </button>
        </div>
      </div>

      {/* Feedback Toast Toast - Moved right below headers */}
      {feedbackMsg && (
        <div className={`p-4 rounded-md border flex items-center gap-3 text-xs -mt-2 ${
          feedbackMsg.type === "success" 
            ? "bg-status-approved-bg text-status-approved-accent border-status-approved-accent/20" 
            : "bg-status-blocked-bg text-status-blocked-accent border-status-blocked-accent/20"
        }`}>
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="ml-auto font-bold font-mono">×</button>
        </div>
      )}

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <OfferSummaryCard 
          title="Opportunity Value" 
          value={`${detail.opportunity_value_lakh} Lakhs`} 
          description="Cumulative asset growth target from active pipeline" 
        />
        <OfferSummaryCard 
          title="Conversion" 
          value={`${detail.conversion_probability}%`} 
          description="AI-computed statistical likelihood of converting prospect" 
        />
        <OfferSummaryCard 
          title="Recommended Product" 
          value={detail.recommended_product} 
          description="Optimal business product surfaced by discovery model" 
        />
        <OfferSummaryCard 
          title="Time To Engage" 
          value={detail.time_to_engage} 
          description="Estimated conversion SLA required for complete review" 
        />
        <OfferSummaryCard 
          title="Ecosystem Value" 
          value={`${(detail.estimated_ecosystem_value_lakh / 100).toFixed(1)} Cr`} 
          description="Aggregated potential cross-sell yield from Suppliers" 
        />
        <OfferSummaryCard 
          title="Acquisition Priority" 
          value={detail.acquisition_priority} 
          description="CRM-defined tier priority for SBI Relationship Managers" 
        />
      </div>

      {/* Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (65% width representation - lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: PathFinder Strategy */}
          <StrategyCard 
            primaryObjective={detail.primary_objective}
            selectedProduct={detail.recommended_product}
            recommendedRoute={detail.recommended_route}
            aiConfidence={detail.ai_confidence}
            reasoningChips={detail.reasoning_chips}
            expectedOutcome={detail.expected_business_outcome}
          />

          {/* Section 2: Compliance Checklist (Collapsible) */}
          <div data-demo="compliance-checklist" className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsComplianceOpen(!isComplianceOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">PathFinder Risk & Compliance Checks</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isComplianceOpen ? "rotate-180" : ""}`} />
            </button>
            {isComplianceOpen && compliance && (
              <div className="p-1">
                <ComplianceChecklist checks={compliance} />
              </div>
            )}
          </div>

          {/* Section 3: Impact Grid Projections (Collapsible) */}
          <div data-demo="business-impact" className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsImpactOpen(!isImpactOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">PathFinder Business Impact Estimates</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isImpactOpen ? "rotate-180" : ""}`} />
            </button>
            {isImpactOpen && impact && (
              <div className="p-1">
                <BusinessImpactGrid impact={impact} />
              </div>
            )}
          </div>

          {/* Section 4: AI Generated Outreach Preview */}
          {draft && <OutreachPreview draft={draft} />}

          {/* Section 5: Offer Details Grid (Collapsible) */}
          <div data-demo="offer-details" className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">PathFinder Offer Details Grid</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isDetailsOpen ? "rotate-180" : ""}`} />
            </button>
            {isDetailsOpen && (
              <div className="p-1">
                <OfferDetailsGrid 
                  amount={detail.eligible_amount_lakh}
                  rate={detail.interest_rate}
                  product={detail.recommended_product}
                  timeline={detail.disbursement_timeline}
                  collateral={detail.collateral_requirement}
                  onboarding={detail.digital_onboarding}
                  manager={detail.relationship_manager}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column (35% width representation) */}
        <div className="space-y-6">
          {/* Section 7 & 8: Decision Panel and wins summary */}
          <DecisionPanel 
            status={detail.status}
            onApprove={() => approveMutation.mutate()}
            onRequestChanges={() => requestChangesMutation.mutate()}
            onAssignBranch={() => assignBranchMutation.mutate()}
            onEscalate={() => assignBranchMutation.mutate()}
            isActionLoading={isActionLoading}
          />

          {/* Section 6: Activity Log (Collapsible) */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <button 
              onClick={() => setIsActivityOpen(!isActivityOpen)}
              className="w-full flex items-center justify-between p-4 focus:outline-none bg-soft/20 border-b border-border/40"
            >
              <span className="text-xs uppercase font-bold text-secondary tracking-widest">PathFinder Agent Activity Log</span>
              <ChevronDown className={`h-4.5 w-4.5 text-secondary transition-transform ${isActivityOpen ? "rotate-180" : ""}`} />
            </button>
            {isActivityOpen && (
              <div className="p-1">
                <ActivityLog logs={mockActivityLogs} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 9: Deploy Strategy Timeline Workflow */}
      {impact && (
        <DeploymentTimeline 
          currentStep={currentStep}
          projectedProb={impact.conversion_probability}
          projectedRev={impact.projected_revenue_lakh}
          potentialNewNodes={impact.potential_new_msmes}
          ecosystemExpansion={impact.projected_ecosystem_conversions}
          onLaunchJourney={() => {
            setCurrentStep(5);
            setFeedbackMsg({ type: "success", text: "Acquisition Strategy launched. System onboarding pipeline active." });
          }}
          onSaveDraft={() => setFeedbackMsg({ type: "success", text: "Proposal draft configuration cached successfully." })}
          isActionLoading={isActionLoading}
        />
      )}
    </div>
  );
}
