import { apiClient } from "./client";

export interface OpportunityItem {
  opportunity_id: string;
  msme_id: string;
  msme_name: string;
  recommended_route: string;
  potential_value_lakh: number;
  status: "Approved" | "Blocked" | "Warning" | "Pending Review";
  conversion_probability: number;
  priority: string;
}

export interface OpportunityDetail {
  opportunity_id: string;
  msme_id: string;
  company_name: string;
  industry: string;
  status: "Approved" | "Blocked" | "Warning" | "Pending Review";
  recommended_route: string;
  opportunity_score: number;
  opportunity_value_lakh: number;
  conversion_probability: number;
  time_to_engage: string;
  estimated_ecosystem_value_lakh: number;
  location: string;
  gst_registered: string;
  udyam_registered: string;
  annual_turnover_cr: number;
  current_banking_status: string;
  identified_anchor: string;
  associated_advisor: string;
  network_size: number;
  relationship_age: string;
}

export interface SignalItem {
  signal_id: string;
  opportunity_id: string;
  title: string;
  severity: "Approved" | "Blocked" | "Warning" | "Critical" | "High" | "Medium" | "Low";
  evidence: string;
  explanation: string;
  confidence: number;
}

export interface InfluenceFactor {
  factor: string;
  weight: number;
  impact: "positive" | "negative";
}

export interface RouteAnalysisItem {
  route: string;
  score: number;
  selected: boolean;
  why_won: string | null;
  why_lost: string | null;
  pros: string[];
  cons: string[];
  evidence: string;
  influence_factors?: InfluenceFactor[];
}

export interface SignalProvenance {
  signal: string;
  value: string;
  confidence: number;
  formula: string;
  formula_weights?: Array<{ factor: string; weight: string; reason: string }>;
  derived_from: string[];
  datasets: string[];
  supporting_records: string[];
  business_reason: string;
  why_weights?: string;
  metadata?: {
    signal_generated_time: string;
    engine_version: string;
    dataset_snapshot_version: string;
    rule_version: string;
  };
}

export interface EcosystemDetail {
  estimated_ecosystem_value_lakh: number;
  potential_future_msmes_count: number;
  second_degree_opportunities: Array<{
    msme_id: string;
    company_name: string;
    relationship: string;
    value_lakh: number;
  }>;
}

export interface ProgressStep {
  step: string;
  status: "Completed" | "Current" | "Pending";
  date: string | null;
}

export async function fetchOpportunities(): Promise<OpportunityItem[]> {
  return apiClient<OpportunityItem[]>("/dashboard/opportunities");
}

export async function fetchOpportunityDetail(id: string): Promise<OpportunityDetail> {
  return apiClient<OpportunityDetail>(`/opportunities/${id}`);
}

export async function fetchOpportunitySignals(id: string): Promise<SignalItem[]> {
  return apiClient<SignalItem[]>(`/opportunities/${id}/signals`);
}

export async function fetchOpportunityRouteAnalysis(id: string): Promise<RouteAnalysisItem[]> {
  return apiClient<RouteAnalysisItem[]>(`/opportunities/${id}/route-analysis`);
}

export async function fetchOpportunityEcosystem(id: string): Promise<EcosystemDetail> {
  return apiClient<EcosystemDetail>(`/opportunities/${id}/ecosystem`);
}

export async function fetchOpportunityTimeline(id: string): Promise<ProgressStep[]> {
  return apiClient<ProgressStep[]>(`/opportunities/${id}/timeline`);
}

export async function fetchSignalProvenance(oppId: string, signalName: string): Promise<SignalProvenance> {
  return apiClient<SignalProvenance>(`/opportunities/${oppId}/signals/${encodeURIComponent(signalName)}/provenance`);
}

