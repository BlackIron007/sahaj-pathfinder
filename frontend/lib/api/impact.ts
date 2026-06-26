import { apiClient } from "./client";

export interface ImpactSummary {
  strategies_executed: number;
  successful_acquisitions: number;
  avg_conversion_rate: number;
  projected_loan_book_cr: number;
  new_ecosystem_nodes: number;
  confidence_gain_percent: number;
  summary: string;
}

export interface RoutePerformanceItem {
  route: string;
  conversion_rate: number;
  wins: number;
  revenue_cr: number;
}

export interface NetworkExpansionData {
  potential_msmes_discovered: number;
  estimated_ecosystem_value_cr: number;
  network_growth_percent: number;
  new_downstream_opportunities: number;
}

export interface InsightItem {
  id: string;
  title: string;
  content: string;
}

export interface LearningStep {
  step: string;
  status: "Completed" | "Current" | "Pending";
  description: string;
}

export interface LearningMetricsData {
  strategies_evaluated: number;
  successful_acquisitions: number;
  learning_confidence_gain_percent: number;
  average_decision_time: string;
  average_offer_acceptance: string;
  route_accuracy: number;
}

export interface LearningResponse {
  learning_timeline: LearningStep[];
  metrics: LearningMetricsData;
}

export async function fetchImpactSummary(): Promise<ImpactSummary> {
  return apiClient<ImpactSummary>("/impact/summary");
}

export async function fetchImpactRoutes(): Promise<RoutePerformanceItem[]> {
  return apiClient<RoutePerformanceItem[]>("/impact/routes");
}

export async function fetchImpactNetwork(): Promise<NetworkExpansionData> {
  return apiClient<NetworkExpansionData>("/impact/network");
}

export async function fetchImpactInsights(): Promise<InsightItem[]> {
  return apiClient<InsightItem[]>("/impact/insights");
}

export async function fetchImpactLearning(): Promise<LearningResponse> {
  return apiClient<LearningResponse>("/impact/learning");
}
