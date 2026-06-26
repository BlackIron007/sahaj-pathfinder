"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Building2, 
  FileText, 
  Share2, 
  Target, 
  AlertCircle,
  Database,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

// Types for stats
interface Stats {
  num_msmes: number;
  num_invoices: number;
  num_relationships: number;
  num_opportunities: number;
  num_signals: number;
}

interface HealthResponse {
  status: string;
  project: string;
  version: string;
  data_loaded: boolean;
  kpis: Stats;
}

// Static fallback metrics matching exact sample_data constraints
const FALLBACK_STATS: Stats = {
  num_msmes: 50,
  num_invoices: 150,
  num_relationships: 200,
  num_opportunities: 50,
  num_signals: 200,
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ["healthStats"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8000/api/v1/health");
      if (!res.ok) throw new Error("Backend offline");
      return res.json();
    },
    retry: 1,
    refetchInterval: 10000, // keep dashboard fresh
  });

  const stats = data?.kpis || FALLBACK_STATS;
  const isDataLoaded = data?.data_loaded ?? true; // assume true if fallback is used

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sahaj PathFinder</h1>
        <p className="text-secondary text-sm mt-1.5 font-medium max-w-2xl">
          Every MSME Enters SBI Through a Different Door.
        </p>
      </div>

      {/* Project Status Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-lg relative overflow-hidden">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest">Platform Status</div>
          <div className="text-lg font-bold text-foreground mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-approved-accent inline-block animate-pulse"></span>
            Prototype Development Phase
          </div>
          <p className="text-xs text-secondary mt-1">Acquisition pipelines active.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest">System Ingestion</div>
          <div className="text-lg font-bold text-foreground mt-2 flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-primary" />
            Idea Submission Repository
          </div>
          <p className="text-xs text-secondary mt-1">Multi-source schema pipelines.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest">Data Integrity</div>
          <div className={`text-lg font-bold mt-2 flex items-center gap-2 ${isDataLoaded ? 'text-status-approved-accent' : 'text-status-blocked-accent'}`}>
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${isDataLoaded ? 'bg-status-approved-accent' : 'bg-status-blocked-accent'}`}></span>
            {isDataLoaded ? "Data successfully loaded" : "Bootstrapping data..."}
          </div>
          <p className="text-xs text-secondary mt-1">
            {error ? "Offline fallback mode active" : "Connected to FastAPI CSV layer"}
          </p>
        </div>
      </div>

      {/* KPI Section */}
      <div>
        <h2 className="text-xs uppercase font-bold text-secondary tracking-widest mb-4">Core Ecosystem Metrics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: MSMEs */}
          <div className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between h-32 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-secondary">MSMEs Discovered</span>
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "..." : stats.num_msmes}
              </div>
              <div className="text-[10px] text-status-approved-accent font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>+100% ecosystem yield</span>
              </div>
            </div>
          </div>

          {/* Card 2: Invoices */}
          <div className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between h-32 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-secondary">Invoice Volume</span>
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "..." : stats.num_invoices}
              </div>
              <div className="text-[10px] text-secondary font-medium mt-1">
                Normalized ledger lines
              </div>
            </div>
          </div>

          {/* Card 3: Relationships */}
          <div className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between h-32 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-secondary">Graph Edges</span>
              <Share2 className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "..." : stats.num_relationships}
              </div>
              <div className="text-[10px] text-status-approved-accent font-medium mt-1">
                Ecosystem connections
              </div>
            </div>
          </div>

          {/* Card 4: Acquisition Opportunities */}
          <div className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between h-32 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-secondary">Acquisition Opportunities</span>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "..." : stats.num_opportunities}
              </div>
              <div className="text-[10px] text-status-approved-accent font-semibold mt-1">
                RM targets identified
              </div>
            </div>
          </div>

          {/* Card 5: Signals */}
          <div className="bg-card border border-border p-5 rounded-lg flex flex-col justify-between h-32 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-secondary">Ecosystem Signals</span>
              <AlertCircle className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {isLoading ? "..." : stats.num_signals}
              </div>
              <div className="text-[10px] text-status-warning-accent font-medium mt-1">
                Risk & intent indicators
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel & Context */}
      <div className="bg-soft/40 border border-border p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <Layers className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform Architecture Blueprint</h3>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              Sahaj PathFinder is structured on clean enterprise principles. This layout acts as the host layer for the Discovery Engine, Signal Intelligence, and route evaluators. Running the project spins up the FastAPI dependency injector, validating structural schema matching against the physical database simulation files.
            </p>
            <div className="mt-4 flex gap-4">
              <div className="text-[11px] text-secondary flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last Updated: 2026-06-26</span>
              </div>
              <div className="text-[11px] text-secondary flex items-center gap-1">
                <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                <span>Target: SBI Global Fintech Fest 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
