import { apiClient } from "./client";

export interface OfferDetails {
  opportunity_id: string;
  msme_id: string;
  company_name: string;
  industry: string;
  status: "Ready For Review" | "Needs Revision" | "Approved";
  recommended_route: string;
  conversion_probability: number;
  opportunity_value_lakh: number;
  recommended_product: string;
  time_to_engage: string;
  estimated_ecosystem_value_lakh: number;
  acquisition_priority: string;
  primary_objective: string;
  ai_confidence: number;
  reasoning_chips: string[];
  expected_business_outcome: string;
  eligible_amount_lakh: number;
  interest_rate: number;
  disbursement_timeline: string;
  collateral_requirement: string;
  digital_onboarding: string;
  relationship_manager: string;
}

export interface OfferDraft {
  subject: string;
  greeting: string;
  body: string;
  signature: string;
}

export interface ComplianceCheck {
  rbi_policy_alignment: "Approved" | "Warning" | "Blocked";
  eligibility: "Approved" | "Warning" | "Blocked";
  transaction_verification: "Approved" | "Warning" | "Blocked";
  kyc_status: "Approved" | "Warning" | "Blocked";
  internal_policy_check: "Approved" | "Warning" | "Blocked";
  aml_screening: "Approved" | "Warning" | "Blocked";
}

export interface ImpactProjection {
  conversion_probability: number;
  projected_revenue_lakh: number;
  potential_new_msmes: number;
  projected_ecosystem_conversions: number;
}

export interface ActionResponse {
  opportunity_id: string;
  status?: string;
  message: string;
}

export async function fetchOfferDetails(id: string): Promise<OfferDetails> {
  return apiClient<OfferDetails>(`/offers/${id}`);
}

export async function fetchOfferDraft(id: string): Promise<OfferDraft> {
  return apiClient<OfferDraft>(`/offers/${id}/draft`);
}

export async function fetchOfferCompliance(id: string): Promise<ComplianceCheck> {
  return apiClient<ComplianceCheck>(`/offers/${id}/compliance`);
}

export async function fetchOfferImpact(id: string): Promise<ImpactProjection> {
  return apiClient<ImpactProjection>(`/offers/${id}/impact`);
}

export async function approveOfferStrategy(id: string): Promise<ActionResponse> {
  return apiClient<ActionResponse>(`/offers/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ status: "Approved" }),
  });
}

export async function requestOfferChanges(id: string, fields: string[], rationale: string): Promise<ActionResponse> {
  return apiClient<ActionResponse>(`/offers/${id}/request-changes`, {
    method: "POST",
    body: JSON.stringify({ fields_to_change: fields, rationale }),
  });
}

export async function assignOfferBranch(id: string, zone: string): Promise<ActionResponse> {
  return apiClient<ActionResponse>(`/offers/${id}/assign`, {
    method: "POST",
    body: JSON.stringify({ status: zone }),
  });
}

export async function generateOfferProposal(id: string): Promise<ActionResponse> {
  return apiClient<ActionResponse>(`/offers/${id}/generate`, {
    method: "POST",
  });
}
