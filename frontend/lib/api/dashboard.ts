import { apiClient } from "./client";

export interface DashboardStats {
  new_opportunities: number;
  high_priority: number;
  potential_value_lakh: number;
  avg_probability: number;
}

export interface RouteCount {
  route: string;
  count: number;
}

export interface EcosystemStats {
  existing: number;
  newly_discovered: number;
  potential_expansion: number;
}

export interface DiscoveryEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiClient<DashboardStats>("/dashboard/stats");
}

export async function fetchRouteDistribution(): Promise<RouteCount[]> {
  return apiClient<RouteCount[]>("/dashboard/route-distribution");
}

export async function fetchEcosystemGrowth(): Promise<EcosystemStats> {
  return apiClient<EcosystemStats>("/dashboard/ecosystem-growth");
}

export async function fetchRecentDiscoveries(): Promise<DiscoveryEvent[]> {
  return apiClient<DiscoveryEvent[]>("/dashboard/recent-discoveries");
}
