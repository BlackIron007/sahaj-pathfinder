from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from pydantic import BaseModel
from backend.services.data_loader import data_loader_service

router = APIRouter()

class OfferStatusUpdate(BaseModel):
    status: str

class RMFeedback(BaseModel):
    comments: str

class RMChangeRequest(BaseModel):
    fields_to_change: List[str]
    rationale: str

@router.get("/offers/{id}")
async def get_offer_details(id: str) -> Dict[str, Any]:
    """Returns the generated acquisition offer and workspace configurations for a specific opportunity ID."""
    # Find opportunity
    opp = next((o for o in data_loader_service.acquisition_opportunities if o.opportunity_id == id), None)
    if not opp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity {id} not found"
        )
    
    # Find MSME Profile
    msme = next((m for m in data_loader_service.msme_profiles if m.msme_id == opp.msme_id), None)
    if not msme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"MSME profile for opportunity {id} not found"
        )

    # Determine mock/ingested state details
    conversions = {c.opportunity_id: c.result for c in data_loader_service.conversion_events}
    outreaches = {o.opportunity_id: o.status for o in data_loader_service.outreach_history}
    
    conv_status = conversions.get(opp.opportunity_id)
    outreach_status = outreaches.get(opp.opportunity_id)
    
    if conv_status:
        status_val = "Approved"
    elif outreach_status:
        status_val = "Pending Review"
    else:
        status_val = "Ready For Review"

    # Define eligible offer details based on company details
    eligible_amount_lakh = int(opp.opportunity_value_lakh * 1.5)
    interest_rate = 8.75 if msme.annual_turnover_cr > 10 else 9.5

    return {
        "opportunity_id": opp.opportunity_id,
        "msme_id": msme.msme_id,
        "company_name": msme.company_name,
        "industry": msme.industry,
        "status": status_val,
        "recommended_route": opp.recommended_route,
        "conversion_probability": opp.conversion_probability,
        "opportunity_value_lakh": opp.opportunity_value_lakh,
        
        # Summary metrics
        "recommended_product": "Working Capital Sandbox Loan" if opp.recommended_route == "Transaction" else "SME Smart Score Card",
        "time_to_engage": opp.time_to_engage,
        "estimated_ecosystem_value_lakh": opp.opportunity_value_lakh * 3,
        "acquisition_priority": opp.priority,

        # Recommended strategy details
        "primary_objective": "Digitize supply chain ledgers and capture downstream supplier flow.",
        "ai_confidence": opp.conversion_probability,
        "reasoning_chips": [
            "Strong anchor relationship",
            "Consistent cash flow",
            "Working capital gap detected",
            "High digital readiness",
            "Verified Udyam",
            "Existing supplier network"
        ],
        "expected_business_outcome": f"By onboarding {msme.company_name}, SBI establishes a primary ledger anchor node. This unlocks instant invoice discounting access for up to {data_loader_service.get_stats().num_opportunities // 2} secondary suppliers.",

        # Offer details grid values
        "eligible_amount_lakh": eligible_amount_lakh,
        "interest_rate": interest_rate,
        "disbursement_timeline": "48 Hours",
        "collateral_requirement": "No collateral required - Invoiced backing",
        "digital_onboarding": "Eligible via GST-consent APIs",
        "relationship_manager": "Dev Sharma"
    }

@router.get("/offers/{id}/draft")
async def get_offer_draft(id: str) -> Dict[str, Any]:
    """Generates the AI copilot email outreach draft tailored to the opportunity context."""
    opp = next((o for o in data_loader_service.acquisition_opportunities if o.opportunity_id == id), None)
    msme = next((m for m in data_loader_service.msme_profiles if m.msme_id == opp.msme_id), None) if opp else None
    company_name = msme.company_name if msme else "MSME Partner"

    subject = f"SBI Custom Financial Assistance | Working Capital Optimization for {company_name}"
    greeting = f"Dear Directors of {company_name},"
    
    body = (
        "We have reviewed your transaction flow through our supply chain ledger analytics framework. "
        "Based on your transaction records with your anchor buyers, SBI has pre-approved a working capital facility "
        "under our digital integration program. This offer comes with no physical collateral requirements "
        "and is fully executable within 48 hours utilizing automated GST consents."
    )
    signature = "Sincerely,\nDev Sharma\nSBI Relationship Manager"

    return {
        "subject": subject,
        "greeting": greeting,
        "body": body,
        "signature": signature
    }

@router.get("/offers/{id}/compliance")
async def get_offer_compliance(id: str) -> Dict[str, Any]:
    """Returns compliance checklists for visual checks verification."""
    return {
        "rbi_policy_alignment": "Approved",
        "eligibility": "Approved",
        "transaction_verification": "Approved",
        "kyc_status": "Approved",
        "internal_policy_check": "Approved",
        "aml_screening": "Warning"
    }

@router.get("/offers/{id}/impact")
async def get_offer_impact(id: str) -> Dict[str, Any]:
    """Returns predicted business impact projection counts."""
    opp = next((o for o in data_loader_service.acquisition_opportunities if o.opportunity_id == id), None)
    prob = opp.conversion_probability if opp else 82
    val = opp.opportunity_value_lakh if opp else 120

    return {
        "conversion_probability": prob,
        "projected_revenue_lakh": round(val * 0.12, 1),
        "potential_new_msmes": 3,
        "projected_ecosystem_conversions": 5
    }

@router.post("/offers/{id}/approve")
async def approve_strategy(id: str, payload: OfferStatusUpdate) -> Dict[str, Any]:
    """Action helper to approve customer acquisition strategy."""
    return {
        "opportunity_id": id,
        "status": "Approved",
        "message": "Strategy approved successfully. Disbursing outreach pipeline."
    }

@router.post("/offers/{id}/request-changes")
async def request_changes(id: str, request: RMChangeRequest) -> Dict[str, Any]:
    """Action helper to request changes on strategy."""
    return {
        "opportunity_id": id,
        "status": "Needs Revision",
        "message": f"Change request logged for fields: {', '.join(request.fields_to_change)}."
    }

@router.post("/offers/{id}/assign")
async def assign_manager(id: str, payload: OfferStatusUpdate) -> Dict[str, Any]:
    """Action helper to assign proposal to local branch manager."""
    return {
        "opportunity_id": id,
        "message": f"Proposal successfully routed to branch manager for zone: {payload.status}."
    }

@router.post("/offers/{id}/generate")
async def generate_proposal(id: str) -> Dict[str, Any]:
    """Triggers generation or recalculation pipeline."""
    return {
        "opportunity_id": id,
        "message": "Proposal recalculated with fresh ledger logs."
    }
