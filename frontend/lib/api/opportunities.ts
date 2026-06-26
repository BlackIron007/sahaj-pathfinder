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

export async function fetchOpportunities(): Promise<OpportunityItem[]> {
  return apiClient<OpportunityItem[]>("/dashboard/opportunities");
}
