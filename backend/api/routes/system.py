from typing import List, Dict, Any
import pandas as pd
from fastapi import APIRouter, status
from backend.core.config import settings
from backend.services.data_loader import data_loader_service
from backend.schemas.data_models import DatasetStats

router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """Health check endpoint to verify system viability and data loading state."""
    stats = data_loader_service.get_stats()
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "data_loaded": stats.num_msmes > 0,
        "kpis": stats
    }

@router.get("/version")
async def get_version():
    """Returns the current application version details."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": "production-mvp"
    }

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    """Returns aggregated KPI values for the Executive Dashboard."""
    opps = data_loader_service.acquisition_opportunities
    
    total_val = sum(o.opportunity_value_lakh for o in opps)
    high_priority = sum(1 for o in opps if o.priority.lower() == "high")
    avg_probability = sum(o.conversion_probability for o in opps) / len(opps) if opps else 0
    
    return {
        "new_opportunities": len(opps),
        "high_priority": high_priority,
        "potential_value_lakh": total_val,
        "avg_probability": round(avg_probability, 1)
    }

@router.get("/dashboard/opportunities")
async def get_dashboard_opportunities() -> List[Dict[str, Any]]:
    """Returns a list of joined opportunities including MSME profile data and outreach status."""
    opps = data_loader_service.acquisition_opportunities
    msmes = {m.msme_id: m for m in data_loader_service.msme_profiles}
    
    # Map status from conversion events or outreach history
    conversions = {c.opportunity_id: c.result for c in data_loader_service.conversion_events}
    outreaches = {o.opportunity_id: o.status for o in data_loader_service.outreach_history}
    
    results = []
    for o in opps:
        msme = msmes.get(o.msme_id)
        msme_name = msme.company_name if msme else "Unknown MSME"
        
        # Calculate status
        conv_status = conversions.get(o.opportunity_id)
        outreach_status = outreaches.get(o.opportunity_id)
        
        if conv_status:
            status_val = "Approved" if conv_status.lower() in ["converted", "approved"] else "Blocked"
        elif outreach_status:
            status_val = "Pending Review"
        else:
            status_val = "Warning"
            
        results.append({
            "opportunity_id": o.opportunity_id,
            "msme_id": o.msme_id,
            "msme_name": msme_name,
            "recommended_route": o.recommended_route,
            "potential_value_lakh": o.opportunity_value_lakh,
            "status": status_val,
            "conversion_probability": o.conversion_probability,
            "priority": o.priority
        })
    return results

@router.get("/dashboard/route-distribution")
async def get_route_distribution() -> List[Dict[str, Any]]:
    """Returns recommended routes distribution for charting."""
    opps = data_loader_service.acquisition_opportunities
    dist = {}
    for o in opps:
        dist[o.recommended_route] = dist.get(o.recommended_route, 0) + 1
    return [{"route": k, "count": v} for k, v in dist.items()]

@router.get("/dashboard/ecosystem-growth")
async def get_ecosystem_growth():
    """Returns existing vs newly discovered ecosystem statistics."""
    msmes = data_loader_service.msme_profiles
    existing = sum(1 for m in msmes if m.existing_sbi_customer.lower() == "yes")
    newly_discovered = sum(1 for m in msmes if m.existing_sbi_customer.lower() == "no")
    
    # Estimated potential expansion nodes discovered post-conversion
    potential_expansion = sum(e.new_msmes_discovered for e in data_loader_service.ecosystem_expansions)
    
    return {
        "existing": existing,
        "newly_discovered": newly_discovered,
        "potential_expansion": potential_expansion
    }

@router.get("/dashboard/recent-discoveries")
async def get_recent_discoveries() -> List[Dict[str, Any]]:
    """Returns a list of recent discoveries sorted by newest first."""
    opps = sorted(data_loader_service.acquisition_opportunities, key=lambda x: x.identified_date, reverse=True)
    msmes = {m.msme_id: m.company_name for m in data_loader_service.msme_profiles}
    
    events = []
    for idx, o in enumerate(opps[:10]): # top 10 recent
        name = msmes.get(o.msme_id, "Unknown MSME")
        events.append({
            "id": f"evt-{idx}",
            "type": "opportunity_created" if idx % 2 == 0 else "supplier_discovered",
            "title": f"Supplier Discovered: {name}" if idx % 2 != 0 else f"Opportunity created for {name}",
            "description": f"Identified path via {o.recommended_route} route worth {o.opportunity_value_lakh} Lakhs",
            "date": o.identified_date
        })
    return events

@router.get("/system/datasets")
async def get_system_datasets() -> Dict[str, Any]:
    """Returns metadata and preview rows for all 12 synthetic datasets."""
    datasets_metadata = {
        "msme_profiles": {
            "name": "01_msme_profiles.csv",
            "description": "Comprehensive profiles of MSMEs including sector, constitution, turnover, and existing banking relationships.",
        },
        "invoice_transactions": {
            "name": "02_invoice_transactions.csv",
            "description": "Granular B2B invoice details containing invoice values, payment terms, buyer/seller links, and delays.",
        },
        "anchor_relationships": {
            "name": "03_anchor_relationships.csv",
            "description": "SBI Corporate Anchor tier-1 connections and supplier network mappings.",
        },
        "advisor_relationships": {
            "name": "04_advisor_relationships.csv",
            "description": "Empanelled Chartered Accountants and financial consultants linked to MSMEs.",
        },
        "graph_edges": {
            "name": "05_graph_edges.csv",
            "description": "Network connection edges modeling supply chain flows, trade volumes, and credit scores.",
        },
        "acquisition_opportunities": {
            "name": "06_acquisition_opportunities.csv",
            "description": "Target MSME opportunities flagged for potential acquisition based on network presence.",
        },
        "opportunity_signals": {
            "name": "07_opportunity_signals.csv",
            "description": "Structured business triggers representing working capital stress, digital readiness, and anchor trust.",
        },
        "route_evaluations": {
            "name": "08_route_evaluation_results.csv",
            "description": "Simulation scores, conversion probabilities, and routing explanations for each path.",
        },
        "outreach_history": {
            "name": "09_outreach_history.csv",
            "description": "Log of generated engagement templates, RM approvals, and outreach communication status.",
        },
        "conversion_events": {
            "name": "10_customer_conversion_events.csv",
            "description": "Final onboarding outcomes, actual conversions, generated loan book size, and YONO login events.",
        },
        "ecosystem_expansions": {
            "name": "11_ecosystem_expansion_tracking.csv",
            "description": "Secondary network effects tracking supplier networks mapped post-onboarding.",
        },
        "learning_feedback": {
            "name": "12_agent_learning_feedback.csv",
            "description": "Model tuning inputs capturing how actual outcomes calibrate future routing parameters.",
        }
    }

    result = {}
    for key, info in datasets_metadata.items():
        df = data_loader_service._dfs.get(key)
        if df is not None:
            records = df.head(20).to_dict(orient="records")
            # Convert NaN/NaT to None for json serialization
            clean_records = [
                {k: (None if pd.isna(v) else v) for k, v in r.items()}
                for r in records
            ]
            result[key] = {
                "name": info["name"],
                "description": info["description"],
                "columns": list(df.columns),
                "total_rows": len(df),
                "preview": clean_records
            }
        else:
            result[key] = {
                "name": info["name"],
                "description": info["description"],
                "columns": [],
                "total_rows": 0,
                "preview": []
            }
    return result


class SimulateRouteRequest(dict):
    pass


@router.post("/simulate-route")
async def simulate_route(body: Dict[str, Any]) -> Dict[str, Any]:
    """
    Real route scoring engine using formula-based heuristics.
    Inputs: working_capital (0-100), digital_readiness (0-100),
            advisor_influence (0-100), anchor_strength (0-100)
    Returns: recommended_route, confidence, explanation list, and all route scores.
    """
    wc = float(body.get("working_capital", 50))
    dr = float(body.get("digital_readiness", 50))
    ai = float(body.get("advisor_influence", 50))
    anch = float(body.get("anchor_strength", 50))

    # Scoring formulas for each route (normalized 0-100)
    score_transaction = round(0.50 * wc + 0.20 * (100 - dr) + 0.15 * (100 - anch) + 0.15 * (100 - ai), 1)
    score_direct      = round(0.55 * dr + 0.20 * (100 - wc) + 0.15 * (100 - ai) + 0.10 * (100 - anch), 1)
    score_advisor     = round(0.50 * ai + 0.20 * (100 - dr) + 0.20 * wc + 0.10 * anch, 1)
    score_anchor      = round(0.50 * anch + 0.20 * wc + 0.15 * (100 - dr) + 0.15 * (100 - ai), 1)

    all_scores = {
        "Transaction": score_transaction,
        "Direct": score_direct,
        "Advisor": score_advisor,
        "Anchor": score_anchor,
    }

    # Normalize to 0-100 percentage confidence
    max_score = max(all_scores.values())
    min_score = min(all_scores.values())
    score_range = max_score - min_score if max_score != min_score else 1

    def normalize(s: float) -> int:
        return min(99, max(45, round(50 + ((s - min_score) / score_range) * 45)))

    recommended_route = max(all_scores, key=lambda k: all_scores[k])
    confidence = normalize(all_scores[recommended_route])

    # Build explanation factors
    explanation_factors = []
    rejection_reasons = {}

    if recommended_route == "Transaction":
        if wc >= 70:
            explanation_factors.append("High working capital stress detected (%.0f%%)" % wc)
        if dr < 50:
            explanation_factors.append("Low digital readiness limits self-serve onboarding")
        if wc > 60:
            explanation_factors.append("Immediate liquidity gap identified from invoice delays")
        rejection_reasons = {
            "Direct": "Digital readiness too low for self-serve pipeline (%.0f%%)" % dr,
            "Advisor": "Urgency of liquidity gap outweighs advisor engagement timeline",
            "Anchor": "Anchor relationship present but insufficient for immediate intervention",
        }
    elif recommended_route == "Direct":
        if dr >= 70:
            explanation_factors.append("High digital readiness enables autonomous onboarding (%.0f%%)" % dr)
        explanation_factors.append("Low friction self-serve YONO pipeline is optimal")
        if ai < 50:
            explanation_factors.append("Low CA influence indicates no advisor dependency")
        rejection_reasons = {
            "Transaction": "No acute working capital stress detected (%.0f%%)" % wc,
            "Advisor": "CA influence score below threshold (%.0f%%)" % ai,
            "Anchor": "No dominant anchor relationship to leverage",
        }
    elif recommended_route == "Advisor":
        if ai >= 60:
            explanation_factors.append("Strong CA/advisor dependency detected (%.0f%%)" % ai)
        explanation_factors.append("Financial decisions require trusted intermediary validation")
        if dr < 60:
            explanation_factors.append("Digital readiness insufficient for direct self-serve onboarding")
        rejection_reasons = {
            "Transaction": "Liquidity stress manageable; immediate financing not necessary",
            "Direct": "Digital readiness below self-serve threshold (%.0f%%)" % dr,
            "Anchor": "Anchor relationship does not dominate the acquisition trigger",
        }
    else:  # Anchor
        if anch >= 60:
            explanation_factors.append("Strong corporate anchor relationship identified (%.0f%%)" % anch)
        explanation_factors.append("Supply chain trust enables warm introduction pathway")
        if wc > 40:
            explanation_factors.append("Moderate working capital need supports financing proposition")
        rejection_reasons = {
            "Transaction": "Anchor pathway provides lower-friction entry than invoice financing",
            "Direct": "Anchor trust more powerful than self-serve for this prospect profile",
            "Advisor": "Advisor influence lower than anchor relationship strength",
        }

    return {
        "recommended_route": recommended_route,
        "confidence": confidence,
        "explanation": explanation_factors,
        "all_scores": {
            route: {
                "score": normalize(score),
                "raw": score,
                "rejection_reason": rejection_reasons.get(route) if route != recommended_route else None
            }
            for route, score in all_scores.items()
        }
    }


@router.get("/simulate-prefill/{msme_id}")
async def simulate_prefill(msme_id: str) -> Dict[str, Any]:
    """Returns pre-filled signal scores for a specific MSME from the dataset."""
    # Find the opportunity linked to this MSME
    opps = {o.msme_id: o for o in data_loader_service.acquisition_opportunities}
    msmes = {m.msme_id: m for m in data_loader_service.msme_profiles}
    signals_by_opp: Dict[str, Dict[str, float]] = {}
    for sig in data_loader_service.opportunity_signals:
        if sig.opportunity_id not in signals_by_opp:
            signals_by_opp[sig.opportunity_id] = {}
        signals_by_opp[sig.opportunity_id][sig.signal_name] = float(sig.signal_score)

    msme = msmes.get(msme_id)
    opp = opps.get(msme_id)

    if not msme or not opp:
        return {"error": f"MSME {msme_id} not found"}

    sigs = signals_by_opp.get(opp.opportunity_id, {})

    return {
        "msme_id": msme_id,
        "company_name": msme.company_name,
        "industry": msme.industry,
        "working_capital": sigs.get("Working Capital Stress", 50.0),
        "digital_readiness": float(msme.digital_readiness_score),
        "advisor_influence": sigs.get("Advisor Dependence", 40.0),
        "anchor_strength": sigs.get("Anchor Relationship", 40.0),
    }


@router.get("/system/dataset-stats")
async def get_dataset_stats() -> Dict[str, Any]:
    """Returns headline statistics for the 12 synthetic datasets."""
    msmes = len(data_loader_service.msme_profiles)
    invoices = len(data_loader_service.invoice_transactions)
    anchors = len(data_loader_service.anchor_relationships)
    advisors = len(data_loader_service.advisor_relationships)
    edges = len(data_loader_service.graph_edges)
    opps = len(data_loader_service.acquisition_opportunities)
    signals = len(data_loader_service.opportunity_signals)
    evaluations = len(data_loader_service.route_evaluations)
    outreach = len(data_loader_service.outreach_history)
    conversions = len(data_loader_service.conversion_events)
    expansions = len(data_loader_service.ecosystem_expansions)
    learning = len(data_loader_service.learning_feedback)

    total_rows = msmes + invoices + anchors + advisors + edges + opps + signals + evaluations + outreach + conversions + expansions + learning

    return {
        "total_datasets": 12,
        "total_rows": total_rows,
        "relationships": edges,
        "signals": signals,
        "conversion_events": conversions,
        "msme_profiles": msmes,
        "opportunities": opps,
    }

