"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo,
} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import {
  ChevronRight,
  Terminal,
  Database,
  GitBranch,
  ShieldCheck,
  Layers,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Play,
  XCircle,
  Loader2,
  ArrowRight,
  Zap,
  BarChart3,
  Network,
  FlaskConical,
  TrendingUp,
  Activity,
  Calculator,
  FileText,
  UserCheck,
  RefreshCcw,
  Rocket,
  BrainCircuit,
  GitFork,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { fetchSystemDatasets } from "@/lib/api/dashboard";
import { apiClient } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RouteScore {
  score: number;
  raw: number;
  rejection_reason: string | null;
}

interface SimulateResult {
  recommended_route: string;
  confidence: number;
  explanation: string[];
  all_scores: Record<string, RouteScore>;
}

interface MSMEPrefill {
  msme_id: string;
  company_name: string;
  industry: string;
  working_capital: number;
  digital_readiness: number;
  advisor_influence: number;
  anchor_strength: number;
}

interface DatasetStats {
  total_datasets: number;
  total_rows: number;
  relationships: number;
  signals: number;
  conversion_events: number;
  msme_profiles: number;
  opportunities: number;
}

// node animation state
type NodeState = "pending" | "active" | "done";

// ─── API helpers ──────────────────────────────────────────────────────────────

async function simulateRoute(body: {
  working_capital: number;
  digital_readiness: number;
  advisor_influence: number;
  anchor_strength: number;
}): Promise<SimulateResult> {
  return apiClient("/simulate-route", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function fetchMSMEPrefill(msmeId: string): Promise<MSMEPrefill> {
  return apiClient(`/simulate-prefill/${msmeId}`);
}

async function fetchDatasetStats(): Promise<DatasetStats> {
  return apiClient("/system/dataset-stats");
}

// ─── Static data ──────────────────────────────────────────────────────────────

const MSME_OPTIONS = [
  { id: "M001", label: "Precision Chemicals (M001)" },
  { id: "M002", label: "Precision Components (M002)" },
  { id: "M003", label: "Dynamic Engineering (M003)" },
  { id: "M005", label: "Zenith Logistics (M005)" },
  { id: "M009", label: "Vikas Engineering (M009)" },
  { id: "M014", label: "Arjun Chemicals (M014)" },
  { id: "M021", label: "Shakti Textiles (M021)" },
  { id: "M024", label: "Narmada Solutions (M024)" },
  { id: "M026", label: "Apex Industries (M026)" },
  { id: "M031", label: "Narmada Industries (M031)" },
  { id: "M038", label: "Precision Solutions (M038)" },
  { id: "M040", label: "Arjun Works (M040)" },
];

const ARCH_LAYERS = [
  {
    id: 0,
    label: "SBI Signals",
    sublabel: "Data Ingestion Layer",
    Icon: Activity,
    detail: {
      title: "Signal Ingestion Layer",
      badge: "12 datasets · 1,183 rows",
      tag: "PROTOTYPE",
      bullets: [
        "Invoice ageing, anchor relationships, GST filing, and CIBIL proxy scores ingested from CSV",
        "200+ daily signals covering working capital stress, digital readiness, and relationship strength",
        "Deduplication, normalization, and schema validation at intake via Pandas",
        "Production path: real-time Kafka streams + nightly CBS batch reconciliation",
      ],
    },
  },
  {
    id: 1,
    label: "Ecosystem Discovery Engine",
    sublabel: "Relationship Intelligence",
    Icon: Network,
    detail: {
      title: "Ecosystem Discovery Engine",
      badge: "200 edges · 50 anchors",
      tag: "PROTOTYPE",
      bullets: [
        "The graph is not used for visualization. The graph is the discovery engine powering PathFinder.",
        "Engine continuously analyzes: invoice, graph expansion, community detection, signal extraction, opportunity creation, route evaluation.",
        "In-memory graph traversal surfaces warm introduction pathways within 3 hops.",
        "Prototype uses pandas joins; production will use Neo4j Aura with Graph Data Science (GDS) algorithms.",
      ],
    },
  },
  {
    id: 2,
    label: "MSME Intelligence",
    sublabel: "Composite Scoring Engine",
    Icon: BrainCircuit,
    detail: {
      title: "MSME Intelligence Engine",
      badge: "4 composite scores",
      tag: "PROTOTYPE",
      bullets: [
        "Composite readiness score computed from: Digital Readiness + WC Stress + Anchor Strength + Advisor Influence",
        "Risk segmentation via 4-quadrant priority matrix (High / Medium / Low / Watch)",
        "Opportunity value estimation benchmarked against industry conversion rates",
        "Every score is fully traceable to its contributing signals, no black-box decisions",
      ],
    },
  },
  {
    id: 3,
    label: "Prototype Weighted Decision Engine",
    sublabel: "Weighted Formula Routing (Prototype)",
    Icon: GitBranch,
    detail: {
      title: "Prototype Weighted Decision Engine",
      badge: "4 routes · Deterministic",
      tag: "PROTOTYPE",
      bullets: [
        "Weighted formula scoring selects the optimal acquisition route from four candidates",
        "Deterministic and fully explainable - no LLM required for the current prototype",
        "Every computed signal stores its derivation, evidence, confidence, and source datasets",
        "Each route score is computed server-side via POST /api/v1/simulate-route",
        "Production path: replace with LangGraph Supervisor + 4 specialist sub-agents with tool calling",
      ],
    },
  },
  {
    id: 4,
    label: "Route Decision",
    sublabel: "4 Acquisition Paths",
    Icon: GitFork,
    detail: {
      title: "Intelligent Route Selection",
      badge: "Confidence threshold: 75%",
      tag: "PROTOTYPE",
      bullets: [
        "Transaction Route: Invoice financing for high WC stress MSMEs with urgent liquidity gaps",
        "Direct Route: YONO self-serve pipeline for digitally mature prospects",
        "Advisor Route: CA/advisor-mediated engagement for trust-dependent segments",
        "Anchor Route: Supply chain warm introduction via SBI corporate anchor relationships",
      ],
    },
  },
  {
    id: 5,
    label: "Journey & Outcome",
    sublabel: "Offer → Conversion → Feedback",
    Icon: TrendingUp,
    detail: {
      title: "Closed-Loop Outcome Engine",
      badge: "50 conversion events",
      tag: "PROTOTYPE",
      bullets: [
        "RM Offer Workspace presents AI-drafted acquisition plan with full reasoning for approval",
        "Post-conversion events (50 records) are fed back into the scoring model",
        "Ecosystem expansion: each converted MSME discovers 3–5 new prospects via graph",
        "Agent learning module adjusts route confidence weights every 30 days in production",
      ],
    },
  },
];

const REASONING_STEPS: Array<{
  id: string;
  label: string;
  Icon: LucideIcon;
  desc: string;
}> = [
  { id: "signal", label: "Signal Fetch", Icon: Activity, desc: "Ingesting raw ledger data from CSVs" },
  { id: "graph", label: "Graph Lookup", Icon: Network, desc: "Traversing supplier/buyer graph edges" },
  { id: "features", label: "Feature Extraction", Icon: Database, desc: "Calculating key financial ratio indicators" },
  { id: "scoring", label: "Weighted Scoring", Icon: Calculator, desc: "Applying deterministic heuristic weights" },
  { id: "route", label: "Route Selection", Icon: GitFork, desc: "Comparing candidate score values" },
  { id: "ready", label: "Recommendation Ready", Icon: FileText, desc: "Finalizing acquisition pathway decision" },
];

const TECH_STACK = [
  {
    category: "AI & Rule Engine",
    tag: "Prototype",
    items: [
      { name: "Weighted Formula Engine", desc: "Custom deterministic scoring" },
      { name: "FastAPI", desc: "Route simulation API" },
      { name: "Pandas", desc: "Signal processing & joins" },
      { name: "Future: LangGraph 0.2", desc: "Multi-agent orchestration" },
    ],
    Icon: BrainCircuit,
  },
  {
    category: "Data & Graph",
    tag: "Prototype",
    items: [
      { name: "CSV Datasets (12)", desc: "Synthetic MSME signal data" },
      { name: "In-memory Graph", desc: "Pandas-based relationship joins" },
      { name: "Future: Neo4j Aura", desc: "Enterprise graph database" },
      { name: "Future: Kafka Streams", desc: "Real-time signal ingestion" },
    ],
    Icon: Database,
  },
  {
    category: "Backend",
    tag: "Prototype",
    items: [
      { name: "FastAPI + Uvicorn", desc: "High-performance async API" },
      { name: "Python 3.12", desc: "Core runtime" },
      { name: "Pydantic v2", desc: "Schema validation" },
      { name: "Future: Celery + Redis", desc: "Async task orchestration" },
    ],
    Icon: Terminal,
  },
  {
    category: "Frontend",
    tag: "Prototype",
    items: [
      { name: "Next.js 15", desc: "App Router + SSR" },
      { name: "React Query v5", desc: "Server state management" },
      { name: "Recharts", desc: "Data visualizations" },
      { name: "Lucide Icons", desc: "Icon system" },
    ],
    Icon: Layers,
  },
  {
    category: "Infra & Security",
    tag: "Production Vision",
    items: [
      { name: "AWS EKS", desc: "Kubernetes orchestration" },
      { name: "HashiCorp Vault + KMS", desc: "Secret management" },
      { name: "OPA Policies", desc: "Attribute-based access control" },
      { name: "SBI CISO Compliant", desc: "Internal audit framework" },
    ],
    Icon: ShieldCheck,
  },
  {
    category: "Observability",
    tag: "Production Vision",
    items: [
      { name: "LangSmith Traces", desc: "Agent reasoning audit trail" },
      { name: "Prometheus + Grafana", desc: "Metrics & alerting" },
      { name: "OpenTelemetry", desc: "Distributed tracing" },
      { name: "Structured Logging", desc: "JSON logs to CloudWatch" },
    ],
    Icon: BarChart3,
  },
];

const PRINCIPLES = [
  {
    Icon: UserCheck,
    title: "Human-in-the-Loop",
    desc: "Every recommendation requires explicit RM approval before execution. The agent proposes; the human decides.",
  },
  {
    Icon: BookOpen,
    title: "Explainable by Default",
    desc: "Every recommendation is reproducible from structured business signals. No opaque AI decisions. Every computed signal stores its formula, evidence, confidence, reasoning trace, and source datasets. The prototype uses deterministic scoring for auditability. Production replaces the scoring engine with a LangGraph Supervisor coordinating specialized reasoning agents.",
  },
  {
    Icon: Network,
    title: "Graph-First Discovery",
    desc: "Relationship intelligence surfaces warm pathways invisible to rule engines or flat-file scoring.",
  },
  {
    Icon: RefreshCcw,
    title: "Closed-Loop Learning",
    desc: "Agent confidence recalibrated from real conversion outcomes, improving the system improves with every decision.",
  },
  {
    Icon: ShieldCheck,
    title: "Privacy & Compliance",
    desc: "No PII leaves the SBI perimeter. OPA policies enforce fine-grained access at query time.",
  },
  {
    Icon: Rocket,
    title: "Agentic, Not Scripted",
    desc: "Production path replaces rigid formulas with adaptive, tool-calling sub-agents orchestrated by a Supervisor.",
  },
];

const SIGNAL_CONTRIBUTIONS: Record<string, string[]> = {
  "Working Capital Stress": ["msme_profiles", "invoice_transactions", "opportunity_signals"],
  "Digital Readiness": ["msme_profiles", "opportunity_signals"],
  "Advisor Influence": ["advisor_relationships", "opportunity_signals"],
  "Anchor Relationship": ["anchor_relationships", "opportunity_signals"],
  "Transaction Velocity": ["invoice_transactions"]
};

const ROADMAP_PHASES = [
  {
    phase: "Phase 0",
    title: "Prototype",
    current: true,
    deliverables: "You are here. 12 synthetic CSVs, formula-based routing, RM Offer Workspace, Impact Center dashboard.",
    items: [
      "12 synthetic CSVs",
      "4-route formula engine",
      "RM Offer Workspace",
      "Impact Center",
      "Architecture Showcase",
    ],
  },
  {
    phase: "Phase 1",
    title: "Pilot - 5 Branches",
    current: false,
    deliverables: "Live CBS integration with 5 pilot branches. Real MSME data. RM training programme.",
    items: [
      "CBS live integration",
      "Real MSME data pipeline",
      "LangGraph replaces rules",
      "RM training rollout",
    ],
  },
  {
    phase: "Phase 2",
    title: "Regional Rollout",
    current: false,
    deliverables: "Neo4j graph goes live. Kafka ingestion pipeline. Advisor portal for CA partners.",
    items: [
      "Neo4j graph go-live",
      "Kafka ingestion",
      "Advisor partner portal",
      "A/B route testing",
    ],
  },
  {
    phase: "Phase 3",
    title: "National Scale",
    current: false,
    deliverables: "Full LangGraph multi-agent deployment. ML feedback loop. Full SBI CISO security audit.",
    items: [
      "LangGraph multi-agent",
      "ML feedback loop",
      "API marketplace",
      "Full SBI CISO audit",
    ],
  },
];

const ROUTE_META: Record<string, { product: string; color: string; bg: string; border: string }> = {
  Transaction: { product: "Sahaj Invoice Finance", color: "#715b3e", bg: "#f5eddd", border: "#b9b29c" },
  Direct:      { product: "YONO MSME Express",    color: "#3a684d", bg: "#edf7f1", border: "#a0ccb0" },
  Advisor:     { product: "SME Asset Backed Loan", color: "#b57a3d", bg: "#fdf4e7", border: "#d4a96a" },
  Anchor:      { product: "Supply Chain Finance",  color: "#6b5d4f", bg: "#ede8e1", border: "#b9b29c" },
};

const DATASET_META: Record<string, string> = {
  "Datasets":       "12 synthetic CSV files covering MSME profiles, signals, relationships, routes, and outcomes.",
  "Total Rows":     "Combined dataset size across all 12 files: 1,183 structured records ready for querying.",
  "MSME Profiles":  "Anonymised MSME entities with industry, turnover, city, and digital readiness attributes.",
  "Graph Edges":    "Cross-entity relationship edges linking MSMEs to anchors, advisors, and SBI corporate accounts.",
  "Signals":        "Derived business indicators extracted from invoice behaviour, GST activity, and relationship mapping.",
  "Opportunities":  "Identified acquisition targets scored by opportunity value and conversion priority.",
  "Conversions":    "Recorded outcomes from past acquisition events used to calibrate confidence weights.",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SliderRow = memo(function SliderRow({
  label,
  value,
  onChange,
  hint,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#373223" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#715b3e", minWidth: 38, textAlign: "right" }}>
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#715b3e", height: 4, cursor: disabled ? "not-allowed" : "pointer" }}
      />
      {hint && (
        <span style={{ fontSize: 11, color: "#9e8c7b", marginTop: 4, display: "block", lineHeight: 1.4 }}>
          {hint}
        </span>
      )}
    </div>
  );
});

const RouteResultCard = memo(function RouteResultCard({
  route,
  data,
  isRecommended,
}: {
  route: string;
  data: RouteScore;
  isRecommended: boolean;
}) {
  const meta = ROUTE_META[route] ?? { product: route, color: "#6b5d4f", bg: "#f5eddd", border: "#b9b29c" };
  return (
    <div
      role="region"
      aria-label={`${route} route result`}
      style={{
        marginBottom: 10,
        padding: "14px 16px",
        background: isRecommended ? meta.bg : "#fffbf2",
        border: `1.5px solid ${isRecommended ? meta.border : "#e8e0d4"}`,
        borderRadius: 9,
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <span style={{ fontSize: 13, fontWeight: isRecommended ? 700 : 600, color: meta.color, flex: 1 }}>
          {route} Route
        </span>
        {isRecommended && (
          <span style={{
            fontSize: 9, fontWeight: 700, color: "#fff", background: meta.color,
            borderRadius: 4, padding: "2px 8px", letterSpacing: "0.06em",
          }}>
            SELECTED
          </span>
        )}
        <span style={{ fontSize: 14, fontWeight: 800, color: meta.color }}>{data.score}%</span>
      </div>

      <div style={{ height: 5, background: "#e8e0d4", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
        <div style={{
          height: "100%", width: `${data.score}%`, background: meta.color,
          borderRadius: 3, transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>

      <div style={{ fontSize: 11, color: "#6b5d4f", marginBottom: data.rejection_reason ? 7 : 0 }}>
        Product: <strong style={{ color: "#373223" }}>{meta.product}</strong>
      </div>

      {!isRecommended && data.rejection_reason && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5, marginTop: 6,
          padding: "7px 10px", background: "#fff7f6", borderRadius: 6, border: "1px solid #f3d5d0" }}>
          <XCircle size={12} color="#9e422c" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, color: "#9e422c", lineHeight: 1.5 }}>
            {data.rejection_reason}
          </span>
        </div>
      )}
    </div>
  );
});

const ReasoningPipeline = memo(function ReasoningPipeline({
  nodeStates,
  recommendedRoute,
}: {
  nodeStates: NodeState[];
  recommendedRoute?: string;
}) {
  return (
    <div
      role="list"
      aria-label="Agent reasoning pipeline"
      style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto",
        padding: "8px 4px 4px", scrollbarWidth: "thin" }}
    >
      {REASONING_STEPS.map((step, idx) => {
        const state = nodeStates[idx] ?? "pending";
        const isDone = state === "done";
        const isActive = state === "active";
        const isPending = state === "pending";
        const StepIcon = step.Icon;

        // Synchronize highlight colors with selected route
        const activeColor = recommendedRoute && ROUTE_META[recommendedRoute]
          ? ROUTE_META[recommendedRoute].color
          : "#715b3e";

        return (
          <React.Fragment key={step.id}>
            <div
              role="listitem"
              style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 108 }}
            >
              <div
                aria-label={`${step.label}: ${state}`}
                style={{
                  width: 46, height: 46, borderRadius: "50%",
                  background: isDone ? "#3a684d" : isActive ? activeColor : "#f0ebe1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: isActive ? "2.5px solid #b57a3d" : isDone ? "none" : "1.5px solid #e0d8cc",
                  boxShadow: isActive ? `0 0 0 4px ${activeColor}1e` : "none",
                  marginBottom: 8,
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <StepIcon
                  size={18}
                  color={isDone || isActive ? "#fff" : "#b9b29c"}
                />
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, textAlign: "center", marginBottom: 4,
                color: isPending ? "#b9b29c" : "#373223",
                transition: "color 0.3s ease",
              }}>
                {step.label}
              </div>
              <div style={{
                fontSize: 10, color: isPending ? "#d6cfc4" : "#6b5d4f",
                textAlign: "center", lineHeight: 1.4, maxWidth: 96,
                transition: "color 0.3s ease",
              }}>
                {isPending ? "Waiting…" : step.desc}
              </div>
            </div>
            {idx < REASONING_STEPS.length - 1 && (
              <div style={{
                flex: "0 0 20px", display: "flex", alignItems: "center",
                justifyContent: "center", paddingBottom: 38,
              }}>
                <ArrowRight size={14} color={isDone ? "#715b3e" : "#e0d8cc"} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
});

const ArchitectureDiagram = memo(function ArchitectureDiagram({
  activeLayer,
  onSelectLayer,
}: {
  activeLayer: number;
  onSelectLayer: (id: number) => void;
}) {
  const layerH = 54;
  const gap = 10;
  const W = 520;
  const totalH = ARCH_LAYERS.length * (layerH + gap) + 56;

  return (
    <svg
      viewBox={`0 0 ${W} ${totalH}`}
      style={{ width: "100%", maxWidth: W, display: "block" }}
      role="img"
      aria-label="PathFinder architecture layer diagram. Click any layer to explore its details."
    >
      {/* Connector dashes */}
      {ARCH_LAYERS.map((_, idx) => {
        if (idx === ARCH_LAYERS.length - 1) return null;
        const cy = 48 + idx * (layerH + gap) + layerH;
        return (
          <line key={`conn-${idx}`} x1={W / 2} y1={cy} x2={W / 2} y2={cy + gap}
            stroke="#d0c8bc" strokeWidth={1.5} strokeDasharray="4 3" />
        );
      })}

      {ARCH_LAYERS.map((layer) => {
        const y = 48 + layer.id * (layerH + gap);
        const isActive = activeLayer === layer.id;
        const boxW = W - 32;
        const boxX = 16;
        const LayerIcon = layer.Icon;

        return (
          <g
            key={layer.id}
            onClick={() => onSelectLayer(layer.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelectLayer(layer.id)}
            tabIndex={0}
            role="button"
            aria-pressed={isActive}
            aria-label={`Layer: ${layer.label}`}
            style={{ cursor: "pointer", outline: "none" }}
          >
            {/* Glow shadow and elevation offset when active */}
            {isActive && (
              <rect x={boxX + 2} y={y + 1} width={boxW} height={layerH}
                rx={10} fill="#715b3e" opacity={0.15} />
            )}
            {/* Box */}
            <rect x={boxX} y={y} width={boxW} height={layerH}
              rx={10}
              fill={isActive ? "#715b3e" : "#fffbf2"}
              stroke={isActive ? "#715b3e" : "#d6cfc4"}
              strokeWidth={1.5}
              opacity={isActive ? 1 : 0.8}
              style={{ transition: "fill 0.2s ease, stroke 0.2s ease, opacity 0.2s ease" }}
            />
            {/* Icon background circle */}
            <rect x={boxX + 12} y={y + (layerH - 32) / 2} width={32} height={32}
              rx={8}
              fill={isActive ? "rgba(255,255,255,0.16)" : "#f5eddd"}
            />
            {/* Icon rendered as foreignObject for Lucide */}
            <foreignObject
              x={boxX + 12 + 6} y={y + (layerH - 32) / 2 + 6}
              width={20} height={20}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayerIcon size={18} color={isActive ? "#fff" : "#715b3e"} />
              </div>
            </foreignObject>
            {/* Label */}
            <text x={boxX + 56} y={y + layerH / 2 - 6}
              fontSize={13} fontWeight="700" fill={isActive ? "#fff" : "#6b5d4f"}
              opacity={isActive ? 1 : 0.85}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {layer.label}
            </text>
            {/* Sublabel */}
            <text x={boxX + 56} y={y + layerH / 2 + 12}
              fontSize={10} fill={isActive ? "rgba(255,255,255,0.75)" : "#9e8c7b"}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {layer.sublabel}
            </text>
            {/* Tag badge */}
            {isActive && (
              <>
                <rect
                  x={boxX + boxW - 90} y={y + layerH / 2 - 10}
                  width={78} height={20} rx={4}
                  fill="rgba(255,255,255,0.18)"
                />
                <text
                  x={boxX + boxW - 51} y={y + layerH / 2 + 4}
                  textAnchor="middle" fontSize={9} fontWeight="700" fill="#fff"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {layer.detail.tag}
                </text>
              </>
            )}
            {/* Layer number */}
            {!isActive && (
              <text x={boxX + boxW - 18} y={y + layerH / 2 + 5}
                textAnchor="middle" fontSize={11} fill="#c4bdb2"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {layer.id + 1}
              </text>
            )}
          </g>
        );
      })}

      {/* Top label */}
      <text x={W / 2} y={22} textAnchor="middle" fontSize={11} fontWeight="600"
        fill="#6b5d4f" style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        Click any layer to inspect
      </text>
    </svg>
  );
});// ─── Dataset stat with hover tooltip ─────────────────────────────────────────

const DatasetStat = memo(function DatasetStat({
  label,
  value,
  Icon: StatIcon,
  isLast,
}: {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  isLast?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const tooltip = DATASET_META[label] ?? "";

  return (
    <div
      style={{
        padding: "18px 12px",
        textAlign: "center",
        borderRight: isLast ? "none" : "1px solid #e8e0d4",
        position: "relative",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <StatIcon size={16} color="#715b3e" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#373223", lineHeight: 1, marginBottom: 5 }}>
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: "#6b5d4f", fontWeight: 500 }}>{label}</div>

      {/* Tooltip */}
      {hovered && tooltip && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#373223", color: "#fff",
          fontSize: 11, lineHeight: 1.5, padding: "8px 12px",
          borderRadius: 7, width: 220, textAlign: "left",
          zIndex: 100, pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>
          {tooltip}
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            width: 10, height: 10, background: "#373223",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }} />
        </div>
      )}
    </div>
  );
});

// ─── Roadmap Phase Card ───────────────────────────────────────────────────────

const RoadmapCard = memo(function RoadmapCard({
  phase,
}: {
  phase: typeof ROADMAP_PHASES[number];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => !phase.current && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: "#fffbf2",
        border: phase.current ? "2px solid #3a684d" : "1.5px solid #e8e0d4",
        borderRadius: 10,
        padding: 20,
        opacity: phase.current ? 1 : 0.75,
        height: "100%",
        transition: "opacity 0.2s ease",
      }}>
        {phase.current && (
          <div style={{
            display: "inline-block",
            background: "#3a684d", color: "#fff",
            fontSize: 9, fontWeight: 700,
            padding: "3px 9px", borderRadius: 4,
            letterSpacing: "0.08em", marginBottom: 10,
          }}>
            YOU ARE HERE
          </div>
        )}
        {!phase.current && (
          <div style={{ marginBottom: 10, height: 20 }} />
        )}
        <div style={{ fontSize: 10, fontWeight: 700, color: phase.current ? "#3a684d" : "#b9b29c",
          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          {phase.phase}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#373223", marginBottom: 14 }}>
          {phase.title}
        </div>
        {phase.items.map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 7,
            marginBottom: 7, fontSize: 11.5, color: "#6b5d4f" }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: phase.current ? "#3a684d" : "#c4bdb2",
            }} />
            {item}
          </div>
        ))}
      </div>

      {/* Hover tooltip for future phases */}
      {hovered && !phase.current && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#373223", color: "#fff",
          fontSize: 11, lineHeight: 1.5, padding: "9px 13px",
          borderRadius: 7, width: 220, textAlign: "left",
          zIndex: 100, pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        }}>
          {phase.deliverables}
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            width: 10, height: 10, background: "#373223",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }} />
        </div>
      )}
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ArchitectureShowcasePage() {
  // Layer selection
  const [activeLayer, setActiveLayer] = useState(3);

  // Playground
  const [wcStress, setWcStress] = useState(75);
  const [digitalReady, setDigitalReady] = useState(30);
  const [advisorInf, setAdvisorInf] = useState(40);
  const [anchorStr, setAnchorStr] = useState(50);
  const [selectedMSME, setSelectedMSME] = useState("");
  const [simResult, setSimResult] = useState<SimulateResult | null>(null);

  // Reasoning pipeline node states
  const [nodeStates, setNodeStates] = useState<NodeState[]>(
    REASONING_STEPS.map(() => "pending")
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [reasoningLogs, setReasoningLogs] = useState<string[]>([]);
  const [showReasoningTrace, setShowReasoningTrace] = useState(false);

  // Dataset explorer
  const [showDataExplorer, setShowDataExplorer] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState("msme_profiles");
  const [activeExplorerSignal, setActiveExplorerSignal] = useState<string | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────────

  const { data: datasetStats } = useQuery({
    queryKey: ["datasetStats"],
    queryFn: fetchDatasetStats,
    staleTime: 5 * 60 * 1000,
  });

  const { data: datasets, isLoading: isDatasetsLoading } = useQuery({
    queryKey: ["systemDatasets"],
    queryFn: fetchSystemDatasets,
    enabled: showDataExplorer,
    staleTime: 10 * 60 * 1000,
  });

  const prefillQuery = useQuery({
    queryKey: ["msme-prefill", selectedMSME],
    queryFn: () => fetchMSMEPrefill(selectedMSME),
    enabled: !!selectedMSME,
    staleTime: 60 * 1000,
  });

  // Apply prefill (RQ v5 compatible)
  useEffect(() => {
    if (prefillQuery.data) {
      const d = prefillQuery.data;
      setWcStress(Math.round(d.working_capital));
      setDigitalReady(Math.round(d.digital_readiness));
      setAdvisorInf(Math.round(d.advisor_influence));
      setAnchorStr(Math.round(d.anchor_strength));
      setSimResult(null);
      setIsSimulating(false);
      setReasoningLogs([]);
      setNodeStates(REASONING_STEPS.map(() => "pending"));
    }
  }, [prefillQuery.data]);

  // ── Simulation ───────────────────────────────────────────────────────────────

  const animatePipeline = useCallback(async (result: SimulateResult) => {
    setIsSimulating(true);
    setReasoningLogs([]);
    setNodeStates(REASONING_STEPS.map(() => "pending"));
    const logs = [
      "Ingested raw customer transaction files and digital profiles.",
      "Traversed graph nodes. Found CA advisor connection strength of 80%.",
      "Extracted digital readiness score (30%) and working capital stress indicators.",
      "Applied heuristic rule weights to score alternative routes.",
      "Comparing route scores: Advisor won with weighted score of 88%.",
      "Route selection verified. Proposal details drafted for RM workspace."
    ];
    for (let i = 0; i < REASONING_STEPS.length; i++) {
      setReasoningLogs((prev) => [...prev, logs[i]]);
      setNodeStates((prev) => prev.map((s, idx) => {
        if (idx < i) return "done";
        if (idx === i) return "active";
        return "pending";
      }));
      await new Promise((r) => setTimeout(r, 450)); // 6 steps * 450ms = 2.7s
    }
    // Mark previous nodes done, keep the last node (idx 5) active/glowing
    setNodeStates((prev) => prev.map((s, idx) => {
      if (idx < REASONING_STEPS.length - 1) return "done";
      return "active";
    }));
    setSimResult(result);
    setIsSimulating(false);
  }, []);

  const simulateMutation = useMutation({
    mutationFn: simulateRoute,
    onMutate: () => {
      setSimResult(null);
      setIsSimulating(true);
      setReasoningLogs([]);
      setNodeStates(REASONING_STEPS.map(() => "pending"));
    },
    onSuccess: (data) => {
      animatePipeline(data);
    },
    onError: () => {
      setIsSimulating(false);
    },
  });

  const handleSimulate = useCallback(() => {
    if (!selectedMSME) return; // Prevent run when no MSME is selected
    simulateMutation.mutate({
      working_capital: wcStress,
      digital_readiness: digitalReady,
      advisor_influence: advisorInf,
      anchor_strength: anchorStr,
    });
  }, [selectedMSME, wcStress, digitalReady, advisorInf, anchorStr, simulateMutation]);

  // Cleanup animation timers on unmount
  useEffect(() => {
    const ref = animationRef.current;
    return () => {
      if (ref) clearTimeout(ref);
    };
  }, []);

  const isPending = simulateMutation.isPending;
  const currentDetail = ARCH_LAYERS[activeLayer]?.detail;

  // ── Print/PDF ─────────────────────────────────────────────────────────────────

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      id="arch-root"
      style={{
        minHeight: "100vh",
        background: "#fff9ee",
        color: "#373223",
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          aside, nav, button, input[type="range"], select { display: none !important; }
          #arch-root { padding: 0 !important; }
          .no-print { display: none !important; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(113, 91, 62, 0.25); }
          70% { box-shadow: 0 0 0 8px rgba(113, 91, 62, 0); }
          100% { box-shadow: 0 0 0 0 rgba(113, 91, 62, 0); }
        }
        *:focus-visible {
          outline: 2px solid #715b3e;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div style={{
        padding: "14px 32px",
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px",
        fontSize: 12, color: "#6b5d4f",
        borderBottom: "1px solid #e8e0d4",
        background: "#fffbf2",
      }}>
        <Link href="/" style={{ color: "#715b3e", textDecoration: "none", fontWeight: 500 }}>
          Dashboard
        </Link>
        <ChevronRight size={12} />
        <span style={{ color: "#373223", fontWeight: 600 }}>Architecture</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: "#715b3e", color: "#fff",
            padding: "3px 10px", borderRadius: 4, letterSpacing: "0.05em" }}>
            JUDGE VIEW
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, background: "#f5eddd", color: "#715b3e",
            padding: "3px 10px", borderRadius: 4, border: "1px solid #b9b29c" }}>
            Technical Architecture Showcase
          </span>
        </div>
      </div>

      {/* ── Hero Header ── */}
      <div style={{
        background: "#fffbf2",
        borderBottom: "1px solid #e8e0d4",
        padding: "36px 32px 32px",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          {/* Title + Export Row */}
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                color: "#715b3e", textTransform: "uppercase", marginBottom: 8 }}>
                State Bank of India · MSME Acquisition Intelligence
              </p>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#373223",
                margin: 0, lineHeight: 1.2, letterSpacing: "-0.4px" }}>
                Sahaj PathFinder Architecture
              </h1>
              <p style={{ fontSize: 13, color: "#6b5d4f", marginTop: 8,
                maxWidth: 540, lineHeight: 1.65 }}>
                An agentic AI system that identifies MSME acquisition opportunities,
                selects optimal routes through relationship intelligence, and generates
                human-approved offer proposals with full explainability.
              </p>
              <p style={{ fontSize: 11, color: "#b9b29c", marginTop: 6, maxWidth: 540, lineHeight: 1.5 }}>
                This page is an engineering showcase created for hackathon judges and technical
                evaluators. It is not part of the Relationship Manager workflow.
              </p>
            </div>
            <button
              onClick={handleExportPDF}
              aria-label="Export architecture as PDF"
              className="no-print"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", background: "#715b3e", color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", flexShrink: 0,
              }}
            >
              <Download size={15} />
              Export PDF
            </button>
          </div>

          {/* ── Hero: Diagram + Detail Panel ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
            alignItems: "start", marginTop: 28 }}>
            {/* SVG Diagram */}
            <div style={{ background: "#fff9ee", border: "1.5px solid #e8e0d4",
              borderRadius: 12, padding: "20px 16px" }}>
              <ArchitectureDiagram
                activeLayer={activeLayer}
                onSelectLayer={setActiveLayer}
              />
            </div>

            {/* Layer Detail Panel */}
            <div
              key={activeLayer}
              style={{
                background: "#fff9ee", border: "2px solid #715b3e",
                borderRadius: 12, padding: 24,
                animation: "fadeSlide 0.22s ease",
              }}
              aria-live="polite"
              aria-label={`Layer details: ${currentDetail?.title}`}
            >
              <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 40, height: 40, background: "#f5eddd",
                  borderRadius: 10, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  {(() => { const L = ARCH_LAYERS[activeLayer]; return <L.Icon size={20} color="#715b3e" />; })()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#373223" }}>
                    {currentDetail?.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "#6b5d4f" }}>
                      {ARCH_LAYERS[activeLayer]?.sublabel}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      background: currentDetail?.tag === "PROTOTYPE" ? "#f5eddd" : "#edf7f1",
                      color: currentDetail?.tag === "PROTOTYPE" ? "#b57a3d" : "#3a684d",
                      border: `1px solid ${currentDetail?.tag === "PROTOTYPE" ? "#d4a96a" : "#a0ccb0"}`,
                      padding: "2px 7px", borderRadius: 4,
                    }}>
                      {currentDetail?.tag}
                    </span>
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, background: "#f5eddd",
                  color: "#715b3e", border: "1px solid #c9bfb0",
                  padding: "3px 9px", borderRadius: 5, whiteSpace: "nowrap",
                }}>
                  {currentDetail?.badge}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {currentDetail?.bullets.map((b, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: "#fffbf2", border: "1px solid #ede8e1",
                    borderRadius: 8, padding: "10px 13px",
                  }}>
                    <CheckCircle size={13} color="#3a684d" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12.5, color: "#373223", lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Layer switcher pills */}
              <div style={{ marginTop: 16, display: "flex", gap: 5, flexWrap: "wrap" }}>
                {ARCH_LAYERS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLayer(l.id)}
                    aria-pressed={activeLayer === l.id}
                    style={{
                      padding: "4px 11px", borderRadius: 5, fontSize: 11,
                      fontWeight: 600, cursor: "pointer",
                      background: activeLayer === l.id ? "#715b3e" : "#f5eddd",
                      color: activeLayer === l.id ? "#fff" : "#373223",
                      border: activeLayer === l.id ? "none" : "1px solid #c9bfb0",
                    }}
                  >
                    {l.id + 1}. {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "36px 32px" }}>

        <section style={{ marginBottom: 44 }} aria-labelledby="pipeline-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="pipeline-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Agent Reasoning Pipeline
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b5d4f", marginTop: 4, lineHeight: 1.5 }}>
              How PathFinder reasons from raw signal to acquisition plan. Run the playground
              below to animate this pipeline in real time.
            </p>
          </div>
          <div style={{ background: "#fffbf2", border: "1.5px solid #e8e0d4",
            borderRadius: 12, padding: "22px 20px 16px" }}>
            <ReasoningPipeline nodeStates={nodeStates} recommendedRoute={simResult?.recommended_route} />
            {reasoningLogs.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <button
                  onClick={() => setShowReasoningTrace(!showReasoningTrace)}
                  style={{
                    background: "none", border: "none", color: "#715b3e",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    padding: 0, display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  {showReasoningTrace ? "Hide reasoning trace" : "Show reasoning trace"}
                </button>
                {showReasoningTrace && (
                  <div style={{
                    marginTop: 14, borderTop: "1.5px solid #ede8e1", paddingTop: 14,
                    fontFamily: "monospace", fontSize: 11, color: "#6b5d4f",
                    display: "flex", flexDirection: "column", gap: 6, maxHeight: 140, overflowY: "auto"
                  }}>
                    {reasoningLogs.map((log, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: "#715b3e", fontWeight: "bold" }}>&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ─── Section: Route Decision Playground ─── */}
        <section style={{ marginBottom: 44 }} aria-labelledby="playground-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="playground-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Route Decision Playground
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b5d4f", marginTop: 4 }}>
              Adjust signal inputs to invoke the real scoring engine and see how PathFinder selects the optimal route.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 24, alignItems: "start" }}>
            {/* Left — Controls */}
            <div style={{ background: "#fffbf2", border: "1.5px solid #e8e0d4",
              borderRadius: 12, padding: 24 }}>
              {/* MSME prefill */}
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="msme-select" style={{ fontSize: 12, fontWeight: 700,
                  color: "#373223", display: "block", marginBottom: 7 }}>
                  Prefill from dataset
                </label>
                <select
                  id="msme-select"
                  value={selectedMSME}
                  onChange={(e) => setSelectedMSME(e.target.value)}
                  disabled={isPending}
                  style={{
                    width: "100%", padding: "9px 12px",
                    border: "1.5px solid #b9b29c", borderRadius: 7,
                    fontSize: 13, color: "#373223", background: "#fff9ee", cursor: "pointer",
                  }}
                >
                  <option value="">— Select an MSME to prefill —</option>
                  {MSME_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                {prefillQuery.isLoading && (
                  <p style={{ fontSize: 11, color: "#715b3e", marginTop: 5, display: "flex",
                    alignItems: "center", gap: 4 }}>
                    <Loader2 size={11} /> Loading signal data…
                  </p>
                )}
                {prefillQuery.data && !prefillQuery.isLoading && (
                  <p style={{ fontSize: 11, color: "#3a684d", marginTop: 5 }}>
                    <CheckCircle size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                    Prefilled from {prefillQuery.data.company_name} · {prefillQuery.data.industry}
                  </p>
                )}
              </div>

              <div style={{ borderTop: "1px solid #ede8e1", paddingTop: 20, marginBottom: 20 }}>
                <SliderRow label="Working Capital Stress" value={wcStress}
                  onChange={setWcStress} disabled={isPending}
                  hint="Invoice ageing, outstanding payables, liquidity gap proxy" />
                <SliderRow label="Digital Readiness" value={digitalReady}
                  onChange={setDigitalReady} disabled={isPending}
                  hint="GST portal activity, YONO login frequency, UPI transaction density" />
                <SliderRow label="Advisor / CA Influence" value={advisorInf}
                  onChange={setAdvisorInf} disabled={isPending}
                  hint="Dependency on CA or advisor for financial decisions" />
                <SliderRow label="Anchor Relationship Strength" value={anchorStr}
                  onChange={setAnchorStr} disabled={isPending}
                  hint="Supply chain linkage to existing SBI corporate anchor" />
              </div>

              <button
                onClick={handleSimulate}
                disabled={isPending || isSimulating || !selectedMSME}
                aria-busy={isPending || isSimulating}
                aria-label="Run route simulation"
                style={{
                  width: "100%", padding: "13px",
                  background: (isPending || isSimulating || !selectedMSME) ? "#b9b29c" : "#715b3e",
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 13, fontWeight: 700,
                  cursor: (isPending || isSimulating || !selectedMSME) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.2s ease",
                }}
              >
                {isPending || isSimulating ? (
                  <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Simulating…</>
                ) : (
                  <><Play size={14} /> Run Simulation</>
                )}
              </button>
            </div>

            {/* Right — Results */}
            <div>
              {!simResult && !isPending && !isSimulating && (
                <div style={{
                  background: "#fffbf2", border: "1.5px dashed #c9bfb0",
                  borderRadius: 12, padding: 40, textAlign: "center", color: "#c9bfb0",
                }}>
                  <FlaskConical size={38} style={{ marginBottom: 14, opacity: 0.45 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#9e8c7b" }}>
                    Adjust inputs and run simulation
                  </div>
                  <div style={{ fontSize: 11.5, marginTop: 6, color: "#b9b29c" }}>
                    Results will appear here with full route reasoning and rejection analysis
                  </div>
                </div>
              )}

              {(isPending || isSimulating) && !simResult && (() => {
                const activeStepIdx = nodeStates.findIndex((s) => s === "active");
                const activeStepName = activeStepIdx !== -1 ? REASONING_STEPS[activeStepIdx].label : "Starting engine";
                return (
                  <div style={{ background: "#fffbf2", border: "1.5px solid #e8e0d4",
                    borderRadius: 12, padding: 40, textAlign: "center" }}>
                    <Loader2 size={32} color="#715b3e" style={{
                      marginBottom: 12, animation: "spin 0.8s linear infinite",
                    }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#373223" }}>
                      Executing: {activeStepName}…
                    </div>
                    <div style={{ fontSize: 11.5, color: "#6b5d4f", marginTop: 6 }}>
                      Calibrating pathway scores in real-time
                    </div>
                  </div>
                );
              })()}

              {simResult && (
                <div style={{ background: "#fffbf2", border: "1.5px solid #e8e0d4",
                  borderRadius: 12, padding: 22 }}>
                  {/* Recommended route summary */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    marginBottom: 18, padding: "13px 16px",
                    background: ROUTE_META[simResult.recommended_route]?.bg ?? "#f5eddd",
                    borderRadius: 9,
                    border: `1.5px solid ${ROUTE_META[simResult.recommended_route]?.border ?? "#b9b29c"}`,
                  }}>
                    <CheckCircle size={20} color="#3a684d" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: "#373223" }}>
                        {simResult.recommended_route} Route Selected
                      </div>
                      <div style={{ fontSize: 11.5, color: "#6b5d4f", marginTop: 2 }}>
                        {ROUTE_META[simResult.recommended_route]?.product ?? ""} · Confidence{" "}
                        <strong>{simResult.confidence}%</strong>
                      </div>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#3a684d" }}>
                      {simResult.confidence}%
                    </div>
                  </div>

                  {/* Why this route */}
                  {simResult.explanation.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#373223",
                        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 9 }}>
                        Why this route?
                      </p>
                      {simResult.explanation.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7,
                          marginBottom: 6 }}>
                          <CheckCircle size={12} color="#3a684d" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ fontSize: 12.5, color: "#373223", lineHeight: 1.55 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All routes with why-not */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#373223",
                    textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                    All Routes - Why not?
                  </p>
                  {Object.entries(simResult.all_scores)
                    .sort(([, a], [, b]) => b.score - a.score)
                    .map(([route, data]) => (
                      <RouteResultCard
                        key={route}
                        route={route}
                        data={data}
                        isRecommended={route === simResult.recommended_route}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── Section: Dataset Statistics ─── */}
        <section style={{ marginBottom: 44 }} aria-labelledby="data-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="data-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Synthetic Dataset
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b5d4f", marginTop: 4 }}>
              12 structured CSV files powering the entire PathFinder prototype. Hover any metric for details.
            </p>
          </div>

          {/* Stats strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
            background: "#fffbf2", border: "1.5px solid #e8e0d4",
            borderRadius: 12, overflow: "visible" }}>
            {[
              { label: "Datasets",       value: datasetStats?.total_datasets   ?? 12,  Icon: Database  },
              { label: "Total Rows",     value: datasetStats?.total_rows        ?? 1183, Icon: BarChart3 },
              { label: "MSME Profiles",  value: datasetStats?.msme_profiles     ?? 50,  Icon: Layers    },
              { label: "Graph Edges",    value: datasetStats?.relationships      ?? 200, Icon: Network   },
              { label: "Signals",        value: datasetStats?.signals            ?? 200, Icon: Zap       },
              { label: "Opportunities",  value: datasetStats?.opportunities      ?? 50,  Icon: TrendingUp },
              { label: "Conversions",    value: datasetStats?.conversion_events  ?? 50,  Icon: CheckCircle },
            ].map((stat, idx, arr) => (
              <DatasetStat key={stat.label} {...stat} isLast={idx === arr.length - 1} />
            ))}
          </div>

          {/* Expand dataset explorer */}
          <button
            onClick={() => setShowDataExplorer((v) => !v)}
            aria-expanded={showDataExplorer}
            aria-controls="data-explorer"
            className="no-print"
            style={{
              width: "100%", marginTop: 8, padding: "11px 16px",
              background: "#f5eddd", border: "1.5px solid #c9bfb0",
              borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#373223",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
            }}
          >
            {showDataExplorer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showDataExplorer ? "Hide" : "Explore"} Dataset Schemas &amp; Previews
          </button>

          {showDataExplorer && (
            <div id="data-explorer" style={{ background: "#fffbf2",
              border: "1.5px solid #e8e0d4", borderRadius: 12,
              marginTop: 8, overflow: "hidden" }}>
              {isDatasetsLoading ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <Loader2 size={24} color="#b9b29c" style={{ animation: "spin 0.8s linear infinite" }} />
                </div>
              ) : datasets ? (
                <div>
                  {/* Signals Traceability Header */}
                  <div style={{ padding: "12px 18px", borderBottom: "1px solid #e8e0d4", background: "#f5eddd" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#373223", marginRight: 12 }}>
                      Highlight Contributing CSVs for Signal:
                    </span>
                    <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.keys(SIGNAL_CONTRIBUTIONS).map((sig) => {
                        const isActive = activeExplorerSignal === sig;
                        return (
                          <button
                            key={sig}
                            onClick={() => setActiveExplorerSignal(isActive ? null : sig)}
                            style={{
                              padding: "4px 10px", borderRadius: 5, fontSize: 10.5,
                              fontWeight: 600, cursor: "pointer",
                              background: isActive ? "#715b3e" : "#fffbf2",
                              color: isActive ? "#fff" : "#373223",
                              border: isActive ? "none" : "1px solid #b9b29c",
                            }}
                          >
                            {sig}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "210px 1fr" }}>
                    {/* List */}
                    <div style={{ borderRight: "1px solid #e8e0d4", padding: "12px 0",
                      maxHeight: 360, overflowY: "auto" }}>
                      {Object.keys(datasets).map((key) => {
                        const isHighlighted = activeExplorerSignal
                          ? SIGNAL_CONTRIBUTIONS[activeExplorerSignal]?.includes(key)
                          : false;
                        const isSelected = selectedDataset === key;

                        return (
                          <button key={key} onClick={() => setSelectedDataset(key)}
                            aria-pressed={isSelected}
                            style={{
                              display: "block", width: "100%", textAlign: "left",
                              padding: "9px 14px", fontSize: 11.5,
                              fontWeight: isSelected ? 700 : 400,
                              color: isSelected ? "#715b3e" : "#373223",
                              background: isSelected ? "#f5eddd" : "transparent",
                              border: "none", cursor: "pointer",
                              boxShadow: isHighlighted ? "inset 4px 0 0 0 #3a684d" : "none",
                              backgroundColor: isHighlighted ? "rgba(58, 104, 77, 0.08)" : (isSelected ? "#f5eddd" : "transparent"),
                            }}>
                            {datasets[key].name || key}
                            <div style={{ fontSize: 10, color: isHighlighted ? "#3a684d" : "#b9b29c", marginTop: 1, fontWeight: isHighlighted ? 600 : 400 }}>
                              {datasets[key].total_rows} rows {isHighlighted && "· CONTRIBUTOR"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  {/* Preview */}
                  <div style={{ display: "flex", flexDirection: "column", height: 360, overflow: "hidden", padding: 18 }}>
                    {datasets[selectedDataset] && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: "#373223", flexShrink: 0 }}>
                          {datasets[selectedDataset].name}
                          <span style={{ fontSize: 10.5, color: "#b9b29c", fontWeight: 400, marginLeft: 8 }}>
                            Showing up to 20 rows · {datasets[selectedDataset].total_rows} total rows ·{" "}
                            {datasets[selectedDataset].columns?.length ?? 0} columns
                          </span>
                        </div>
                        {datasets[selectedDataset].preview?.length > 0 && (
                          <div style={{ flex: 1, overflowY: "auto", overflowX: "auto", border: "1px solid #e8e0d4", borderRadius: 8 }}>
                            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 10.5 }}>
                              <thead>
                                <tr>
                                  {datasets[selectedDataset].columns.map((col: string) => (
                                    <th key={col} style={{
                                      position: "sticky", top: 0, zIndex: 10,
                                      textAlign: "left", padding: "8px 12px",
                                      background: "#f5eddd", borderBottom: "1.5px solid #e8e0d4",
                                      color: "#373223", whiteSpace: "nowrap", fontWeight: 600,
                                    }}>{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {datasets[selectedDataset].preview.slice(0, 20).map(
                                  (row: Record<string, unknown>, i: number) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? "#fffbf2" : "#fff9ee" }}>
                                      {datasets[selectedDataset].columns.map((col: string) => (
                                        <td key={col} style={{
                                          padding: "8px 12px",
                                          borderBottom: "1px solid #f0ebe1",
                                          color: "#6b5d4f", whiteSpace: "nowrap",
                                        }}>
                                          {String(row[col] ?? "")}
                                        </td>
                                      ))}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            </div>
          )}
        </section>

        {/* ─── Section: Agentic Architecture ─── */}
        <section style={{ marginBottom: 44 }} aria-labelledby="agentic-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="agentic-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Prototype vs. Production Architecture
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b5d4f", marginTop: 4 }}>
              What we built for this hackathon, and what a production SBI deployment would look like.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1.1fr", gap: 16, alignItems: "stretch" }}>
            {/* Prototype */}
            <div style={{
              background: "#fffbf2", border: "1.5px solid #e8e0d4",
              borderRadius: 10, padding: 22,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#b57a3d",
                textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8 }}>
                Current Prototype
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#373223", marginBottom: 14 }}>
                Formula-Based Rule Engine
              </div>
              {[
                "Deterministic weighted scoring formulas",
                "FastAPI + Pandas + CSV ingestion",
                "In-memory graph joins for relationships",
                "Fully explainable with no LLM dependency",
                "Every computed signal stores derivation, evidence, confidence, and source datasets",
                "Next.js frontend with React Query",
              ].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 7,
                  marginBottom: 8, fontSize: 12.5, color: "#6b5d4f" }}>
                  <CheckCircle size={13} color="#b57a3d" style={{ flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>

            {/* Migration Strategy */}
            <div style={{
              background: "#fffbf2", border: "1.5px dashed #b57a3d",
              borderRadius: 10, padding: 22,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#b57a3d",
                textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8 }}>
                Migration Strategy
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#373223", marginBottom: 14 }}>
                Incremental LangGraph Adoption
              </div>
              {[
                "Transition current pandas scoring to localized state machine nodes",
                "Integrate LangGraph supervisor agent to route complex edge-cases",
                "Gradually replace hardcoded heuristic checks with agentic reasoning models",
                "Expose signal outputs to feedback loop for continuous offline training",
                "Establish dual-run mode: validate agent reasoning against rule baseline",
                "Gradual database migration from localized memory NetworkX to Neo4j",
              ].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 7,
                  marginBottom: 8, fontSize: 12.5, color: "#6b5d4f" }}>
                  <CheckCircle size={13} color="#b57a3d" style={{ flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>

            {/* Production */}
            <div style={{
              background: "#fffbf2", border: "2px solid #715b3e",
              borderRadius: 10, padding: 22,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#715b3e",
                textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 8 }}>
                Production SBI Stack
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#373223", marginBottom: 14 }}>
                LangGraph Supervisor + Multi-Agent
              </div>
              {[
                "LangGraph Supervisor orchestrates 4 specialist sub-agents",
                "Each sub-agent calls tools: graph, signals, scoring, drafting",
                "Full reasoning trace logged to audit store",
                "Human-in-the-loop RM approval gate before execution",
                "Monthly feedback loop recalibrates confidence weights",
                "Neo4j + Kafka + PostgreSQL production data stack",
              ].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 7,
                  marginBottom: 8, fontSize: 12.5, color: "#373223" }}>
                  <CheckCircle size={13} color="#3a684d" style={{ flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section: Technology Blueprint ─── */}
        <section style={{ marginBottom: 44 }} aria-labelledby="tech-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="tech-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Technology Blueprint
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b5d4f", marginTop: 4 }}>
              Stack composition from prototype to enterprise. Items marked <em>Future</em> represent
              the production path.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TECH_STACK.map((cat) => (
              <div key={cat.category} style={{
                background: "#fffbf2", border: "1.5px solid #ede8e1",
                borderRadius: 10, padding: 22,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div style={{ color: "#715b3e", flexShrink: 0 }}>
                    <cat.Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#373223" }}>
                      {cat.category}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    background: cat.tag === "Prototype" ? "#fdf4e7" : "#edf7f1",
                    color: cat.tag === "Prototype" ? "#b57a3d" : "#3a684d",
                    border: `1px solid ${cat.tag === "Prototype" ? "#d4a96a" : "#a0ccb0"}`,
                    padding: "2px 7px", borderRadius: 4,
                  }}>
                    {cat.tag.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {cat.items.map((item, i) => (
                    <div key={item.name} style={{
                      padding: "10px 0",
                      borderBottom: i < cat.items.length - 1 ? "1px solid #f0ebe1" : "none",
                    }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#373223",
                        lineHeight: 1.3, marginBottom: 2 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#9e8c7b", lineHeight: 1.5 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Section: Design Principles ─── */}
        <section style={{ marginBottom: 44 }} aria-labelledby="principles-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="principles-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Design Principles
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.title} style={{
                background: "#fffbf2", border: "1.5px solid #ede8e1",
                borderRadius: 10, padding: 22,
                display: "flex", flexDirection: "column", gap: 0,
              }}>
                <div style={{
                  width: 40, height: 40, background: "#f5eddd",
                  borderRadius: 10, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: 14, flexShrink: 0,
                }}>
                  <p.Icon size={20} color="#715b3e" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#373223",
                  marginBottom: 9, lineHeight: 1.3 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: "#6b5d4f", lineHeight: 1.65, flex: 1 }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Section: Roadmap ─── */}
        <section style={{ marginBottom: 44 }} aria-labelledby="roadmap-heading">
          <div style={{ marginBottom: 16 }}>
            <h2 id="roadmap-heading" style={{ fontSize: 17, fontWeight: 700, color: "#373223", margin: 0 }}>
              Implementation Roadmap
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b5d4f", marginTop: 4 }}>
              Four phases from hackathon prototype to national deployment at SBI scale.
              Hover future phases for expected deliverables.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {ROADMAP_PHASES.map((phase) => (
              <RoadmapCard key={phase.phase} phase={phase} />
            ))}
          </div>
        </section>

        {/* ─── Footer ─── */}
        <div style={{
          borderTop: "1px solid #e8e0d4", paddingTop: 24,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 8,
          fontSize: 11, color: "#b9b29c",
        }}>
          <span>
            Sahaj PathFinder · SBI MSME Acquisition Intelligence ·{" "}
            {new Date().getFullYear()} · Hackathon Demo
          </span>
          <span style={{ color: "#715b3e", fontWeight: 600 }}>
            Technical Architecture Showcase · Judge View
          </span>
        </div>
      </div>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
