from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from backend.services.data_loader import data_loader_service

router = APIRouter()

@router.get("/opportunities/{id}")
async def get_opportunity_detail(id: str) -> Dict[str, Any]:
    """Returns opportunity and entity profiles for a specific opportunity ID."""
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
    
    # Join Anchor & Advisor Relationship
    anchor_rel = next((a for a in data_loader_service.anchor_relationships if a.supplier_id == msme.msme_id), None)
    advisor_rel = next((adv for adv in data_loader_service.advisor_relationships if adv.msme_id == msme.msme_id), None)
    
    # Map network size and conversion status
    conversions = {c.opportunity_id: c.result for c in data_loader_service.conversion_events}
    outreaches = {o.opportunity_id: o.status for o in data_loader_service.outreach_history}
    
    conv_status = conversions.get(opp.opportunity_id)
    outreach_status = outreaches.get(opp.opportunity_id)
    
    if conv_status:
        status_val = "Approved" if conv_status.lower() in ["converted", "approved"] else "Blocked"
    elif outreach_status:
        status_val = "Pending Review"
    else:
        status_val = "Warning" # Action Needed

    # Aggregate stats
    return {
        "opportunity_id": opp.opportunity_id,
        "msme_id": msme.msme_id,
        "company_name": msme.company_name,
        "industry": msme.industry,
        "status": status_val,
        "recommended_route": opp.recommended_route,
        "opportunity_score": opp.conversion_probability, # score matches conversion probability
        
        # Summary metrics
        "opportunity_value_lakh": opp.opportunity_value_lakh,
        "conversion_probability": opp.conversion_probability,
        "time_to_engage": opp.time_to_engage,
        "estimated_ecosystem_value_lakh": (anchor_rel.annual_business_lakh if anchor_rel else 150) * 3,
        
        # Entity Profile details
        "location": f"{msme.city}, {msme.state}",
        "gst_registered": msme.gst_registered,
        "udyam_registered": msme.udyam_registered,
        "annual_turnover_cr": msme.annual_turnover_cr,
        "current_banking_status": msme.existing_sbi_customer,
        "identified_anchor": anchor_rel.anchor_name if anchor_rel else "N/A",
        "associated_advisor": advisor_rel.advisor_name if advisor_rel else "N/A",
        "network_size": 12 if anchor_rel else 4,
        "relationship_age": "5 Years" if msme.existing_sbi_customer == "Yes" else "N/A"
    }

@router.get("/opportunities/{id}/signals")
async def get_opportunity_signals(id: str) -> List[Dict[str, Any]]:
    """Returns detected signals for a specific opportunity ID."""
    signals = [s for s in data_loader_service.opportunity_signals if s.opportunity_id == id]
    
    # Business context definitions based on signal names
    signal_explanations = {
        "Working Capital Stress": {
            "explanation": "Trade receivables are locked up, indicating cash flow deficits.",
            "evidence": "AVG invoice outstanding days exceed 85 days, leading to short-term liquidity stress."
        },
        "Anchor Relationship": {
            "explanation": "Strong trade relationships with Tier-1 corporate anchors.",
            "evidence": "LTM transaction volume matches anchor-approved buyer lists."
        },
        "Advisor Dependence": {
            "explanation": "Taxation and audit operations are routed through centralized Chartered Accountants.",
            "evidence": "Advisor influence score is highly rated by connected nodes."
        },
        "Digital Readiness": {
            "explanation": "GST ledger integration capacity is high, facilitating clean credit underwriting.",
            "evidence": "GST registration validated with Udyam verification active."
        },
        "Invoice Frequency": {
            "explanation": "High volume of trade ledgers, indicating constant transaction flows.",
            "evidence": "More than 15 invoices cleared monthly through trade partners."
        },
        "Payment Behaviour": {
            "explanation": "High credit compliance with low delay histories.",
            "evidence": "Zero default alerts flagged across supplier network."
        }
    }

    enriched = []
    for s in signals:
        meta = signal_explanations.get(s.signal_name, {
            "explanation": "Operational pattern detected across MSME trade networks.",
            "evidence": "Exposed through connected trade ledger logs."
        })
        enriched.append({
            "signal_id": s.signal_id,
            "opportunity_id": s.opportunity_id,
            "title": s.signal_name,
            "severity": "Low" if s.severity.lower() == "low" else ("Medium" if s.severity.lower() == "medium" else "Critical"),
            "evidence": meta["evidence"],
            "explanation": meta["explanation"],
            "confidence": s.signal_score
        })
    
    # Fallback default signals if CSV has none to populate Screen 2 fully
    if not enriched:
        defaults = [
            ("Working Capital Stress", "Medium", "Receivables outstanding: 68 days average delay", "Working capital locked in unpaid supplier ledgers.", 84),
            ("Anchor Relationship", "Low", "Tier-1 anchor corporate supply connection found", "Highly dependable cashflow backing via verified anchor.", 92),
            ("Digital Readiness", "Low", "GST & Udyam systems validated", "Fully digital ledgers support instant credit underwriting.", 89)
        ]
        for idx, (title, sev, ev, exp, conf) in enumerate(defaults):
            enriched.append({
                "signal_id": f"fallback-sig-{idx}",
                "opportunity_id": id,
                "title": title,
                "severity": sev,
                "evidence": ev,
                "explanation": exp,
                "confidence": conf
            })
            
    return enriched

@router.get("/opportunities/{id}/route-analysis")
async def get_route_analysis(id: str) -> List[Dict[str, Any]]:
    """Returns route confidence comparisons and pros/cons decision rationale."""
    evals = [e for e in data_loader_service.route_evaluations if e.opportunity_id == id]
    
    # Comprehensive decision rationale templates
    route_details = {
        "Transaction": {
            "why_won": "Transaction route is recommended due to immediate trade receivable invoices waiting to be discounted.",
            "why_lost": "Direct transaction flow is blocked by lack of direct trade ledger integration.",
            "pros": ["Highest yield margin", "Guaranteed collateral in invoices", "Fully automated digital path"],
            "cons": ["High initial RM effort", "Depends on buyer verification response"],
            "evidence": "Multiple overdue invoices (INV0001) back this trade flow."
        },
        "Advisor": {
            "why_won": "Advisor route won because the CA (Advisor) holds a high influence weight over the board of directors.",
            "why_lost": "Advisor route has lower priority since there's no pre-existing advisor engagement.",
            "pros": ["Trusted relationship conversion", "Higher loan ticket potential"],
            "cons": ["Longer conversion timelines", "Requires advisor fee structures"],
            "evidence": " CA Advisor connection has influence weight score > 80%."
        },
        "Anchor": {
            "why_won": "Anchor route won due to direct API links into corporate anchors, allowing automated ledger clearing.",
            "why_lost": "Anchor route is less suitable because of low LTM transaction business ratios.",
            "pros": ["Low default risk", "API-based supply chain data extraction"],
            "cons": ["Anchor contract constraints", "Requires anchor onboarding approval"],
            "evidence": "Direct Tier-1 supply tier link found with Anchor Enterprise."
        },
        "Direct": {
            "why_won": "Direct route is favored because MSME has pre-existing retail banking relations with SBI.",
            "why_lost": "Direct route loses since cold outreach conversion probabilities are low.",
            "pros": ["Zero channel partnership dependencies", "Fastest disbursement potential"],
            "cons": ["High risk default indicators", "Lacks invoice security verification"],
            "evidence": "MSME annual turnover is high, suggesting direct capacity."
        }
    }

    results = []
    # If no evaluation exists, construct default scores
    if not evals:
        # Create default mock evaluations
        default_evals = [
            ("Transaction", 91, "Yes"),
            ("Advisor", 64, "No"),
            ("Anchor", 48, "No"),
            ("Direct", 22, "No")
        ]
        for route_name, score, selected in default_evals:
            meta = route_details.get(route_name)
            results.append({
                "route": route_name,
                "score": score,
                "selected": selected == "Yes",
                "why_won": meta["why_won"] if selected == "Yes" else None,
                "why_lost": meta["why_lost"] if selected == "No" else None,
                "pros": meta["pros"],
                "cons": meta["cons"],
                "evidence": meta["evidence"],
                "influence_factors": get_influence_factors(id, route_name)
            })
    else:
        for e in evals:
            meta = route_details.get(e.route, {
                "why_won": "Recommended based on network density scores.",
                "why_lost": "Other routes present stronger underwriting parameters.",
                "pros": ["Favorable risk ratio"],
                "cons": ["Timelines may exceed standard SLAs"],
                "evidence": "Ecosystem node connectivity index is high."
            })
            results.append({
                "route": e.route,
                "score": e.score,
                "selected": e.selected == "Yes",
                "why_won": meta["why_won"] if e.selected == "Yes" else None,
                "why_lost": meta["why_lost"] if e.selected == "No" else None,
                "pros": meta["pros"],
                "cons": meta["cons"],
                "evidence": meta["evidence"],
                "influence_factors": get_influence_factors(id, e.route)
            })
            
    return results

@router.get("/opportunities/{id}/ecosystem")
async def get_opportunity_ecosystem(id: str) -> Dict[str, Any]:
    """Returns ecosystem topology details and 2nd degree opportunities."""
    # Find opportunity
    opp = next((o for o in data_loader_service.acquisition_opportunities if o.opportunity_id == id), None)
    msme_id = opp.msme_id if opp else "M001"
    
    expansion = next((e for e in data_loader_service.ecosystem_expansions if e.converted_msme == msme_id), None)
    
    estimated_value = expansion.estimated_ecosystem_value_lakh if expansion else 240
    new_msmes = expansion.new_msmes_discovered if expansion else 3
    
    return {
        "estimated_ecosystem_value_lakh": estimated_value,
        "potential_future_msmes_count": new_msmes,
        "second_degree_opportunities": [
            {"msme_id": "M091", "company_name": "Dynamic Castings Ltd", "relationship": "Downstream Buyer", "value_lakh": 85},
            {"msme_id": "M092", "company_name": "Zenith Valves Pvt Ltd", "relationship": "Sub-supplier Tier-3", "value_lakh": 40},
            {"msme_id": "M093", "company_name": "Express Alloys Corp", "relationship": "Anchor Partner Supplier", "value_lakh": 115}
        ]
    }

@router.get("/opportunities/{id}/timeline")
async def get_opportunity_timeline(id: str) -> List[Dict[str, Any]]:
    """Returns discovery timeline progress steps."""
    return [
        {"step": "Invoice Uploaded", "status": "Completed", "date": "2026-06-01"},
        {"step": "Supplier Identified", "status": "Completed", "date": "2026-06-02"},
        {"step": "Graph Updated", "status": "Completed", "date": "2026-06-03"},
        {"step": "Signal Analysis", "status": "Completed", "date": "2026-06-04"},
        {"step": "Route Evaluation", "status": "Current", "date": "2026-06-05"},
        {"step": "Opportunity Created", "status": "Pending", "date": None}
    ]


def get_influence_factors(opp_id: str, route: str) -> List[Dict[str, Any]]:
    # Retrieve signals for this opportunity
    sigs = {s.signal_name: float(s.signal_score) for s in data_loader_service.opportunity_signals if s.opportunity_id == opp_id}
    wc = sigs.get("Working Capital Stress", 75.0)
    dr = sigs.get("Digital Readiness", 30.0)
    ai = sigs.get("Advisor Dependence", 40.0)
    anch = sigs.get("Anchor Relationship", 50.0)
    
    if route == "Transaction":
        factors = [
            {"factor": "Working Capital Stress", "weight": round(0.50 * wc, 1), "impact": "positive"},
            {"factor": "Low Digital Readiness", "weight": round(0.20 * (100 - dr), 1), "impact": "positive"},
            {"factor": "Low Anchor Relationship", "weight": round(-0.15 * (100 - anch), 1), "impact": "negative"},
            {"factor": "Low Advisor Influence", "weight": round(-0.15 * (100 - ai), 1), "impact": "negative"}
        ]
    elif route == "Direct":
        factors = [
            {"factor": "Digital Readiness", "weight": round(0.55 * dr, 1), "impact": "positive"},
            {"factor": "Low Working Capital Stress", "weight": round(0.20 * (100 - wc), 1), "impact": "positive"},
            {"factor": "Low CA Influence", "weight": round(-0.15 * (100 - ai), 1), "impact": "negative"},
            {"factor": "Low Anchor Strength", "weight": round(-0.10 * (100 - anch), 1), "impact": "negative"}
        ]
    elif route == "Advisor":
        factors = [
            {"factor": "Advisor CA Influence", "weight": round(0.50 * ai, 1), "impact": "positive"},
            {"factor": "Working Capital Need", "weight": round(0.20 * wc, 1), "impact": "positive"},
            {"factor": "Low Digital Readiness", "weight": round(-0.20 * (100 - dr), 1), "impact": "negative"},
            {"factor": "Anchor Strength", "weight": round(-0.10 * (100 - anch), 1), "impact": "negative"}
        ]
    else:  # Anchor
        factors = [
            {"factor": "Anchor Relationship Strength", "weight": round(0.50 * anch, 1), "impact": "positive"},
            {"factor": "Working Capital Need", "weight": round(0.20 * wc, 1), "impact": "positive"},
            {"factor": "Low Digital Readiness", "weight": round(-0.15 * (100 - dr), 1), "impact": "negative"},
            {"factor": "Low CA Influence", "weight": round(-0.15 * (100 - ai), 1), "impact": "negative"}
        ]
        
    factors.sort(key=lambda x: abs(x["weight"]), reverse=True)
    return factors


@router.get("/opportunities/{id}/signals/{signal_name}/provenance")
async def get_signal_provenance(id: str, signal_name: str) -> Dict[str, Any]:
    """Returns dynamic provenance details, formulas, and supporting records for a signal."""
    opp = next((o for o in data_loader_service.acquisition_opportunities if o.opportunity_id == id), None)
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    msme_id = opp.msme_id
    msme = next((m for m in data_loader_service.msme_profiles if m.msme_id == msme_id), None)
    if not msme:
        raise HTTPException(status_code=404, detail="MSME profile not found")
        
    # Filter invoices
    invoices = [inv for inv in data_loader_service.invoice_transactions if inv.supplier_id == msme_id]
    
    avg_outstanding = sum(inv.days_outstanding for inv in invoices) / len(invoices) if invoices else 45.0
    total_val = sum(inv.invoice_value_lakh for inv in invoices) if invoices else 12.0
    
    # Check signal score in opportunity_signals
    opp_sig = next((s for s in data_loader_service.opportunity_signals 
                    if s.opportunity_id == id and s.signal_name == signal_name), None)
    confidence = opp_sig.signal_score if opp_sig else 75
    
    from datetime import datetime

    metadata = {
        "signal_generated_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "engine_version": "v1.2.0-deterministic",
        "dataset_snapshot_version": "sprint_4_v1",
        "rule_version": "rule_v4_acquisition"
    }

    why_weights = (
        "Prototype deterministic weights calibrated from banking heuristics and synthetic validation dataset. "
        "In production these weights will be learned from historical SBI conversion outcomes and periodically recalibrated."
    )
    
    if signal_name == "Working Capital Stress":
        formula_str = (
            "Invoice Age Score (Weight: 45%) - Aging unpaid invoices reflect delayed buyer settlements.\n"
            "+ Receivable Delay Score (Weight: 35%) - Consistent delays beyond credit terms indicate cash cycle bottleneck.\n"
            "+ GST Filing Consistency (Weight: 20%) - Compliance consistency acts as a proxy for business operation hygiene."
        )
        formula_weights = [
            {"factor": "Invoice Age Score", "weight": "45%", "reason": "Aging unpaid invoices reflect delayed buyer settlements."},
            {"factor": "Receivable Delay Score", "weight": "35%", "reason": "Consistent delays beyond credit terms indicate cash cycle bottleneck."},
            {"factor": "GST Filing Consistency", "weight": "20%", "reason": "Compliance consistency acts as a proxy for business operation hygiene."}
        ]
        derived_from = ["Average Invoice Age", "Outstanding Receivable Days", "GST Filing Consistency"]
        datasets = ["02_invoice_transactions.csv", "07_opportunity_signals.csv", "01_msme_profiles.csv"]
        supporting_records = [
            f"Average invoice age is {int(avg_outstanding)} days outstanding.",
            f"Total unpaid receivables valued at ₹{total_val:.1f} Lakhs.",
            f"GST registration status: {msme.gst_registered}."
        ]
        business_reason = "Multiple outstanding invoices and trade cycles indicate elevated short-term working capital requirements."
        
    elif signal_name == "Digital Readiness":
        dr_score = msme.digital_readiness_score
        formula_str = (
            "Digital Readiness Score (Weight: 50%) - Direct indicators of digital tools adoption.\n"
            "+ YONO App Adoption (Weight: 30%) - YONO Business registration and login patterns represent active online status.\n"
            "+ GST Validation Status (Weight: 20%) - Verification of tax registry records facilitates low-friction lending."
        )
        formula_weights = [
            {"factor": "Digital Readiness Score", "weight": "50%", "reason": "Direct indicators of digital tools adoption."},
            {"factor": "YONO App Adoption", "weight": "30%", "reason": "YONO Business registration and login patterns represent active online status."},
            {"factor": "GST Validation Status", "weight": "20%", "reason": "Verification of tax registry records facilitates low-friction lending."}
        ]
        derived_from = ["Digital Readiness Index", "YONO App Adoption Proxy", "GST/Udyam Verification Status"]
        datasets = ["01_msme_profiles.csv", "07_opportunity_signals.csv"]
        supporting_records = [
            f"Profile digital readiness score: {dr_score}%.",
            f"Existing SBI customer status: {msme.existing_sbi_customer}.",
            f"GST registration validated: {msme.gst_registered}."
        ]
        business_reason = "Strong baseline digital tools and registered status enable low-friction API-driven credit underwriting."
        
    elif signal_name == "Advisor Dependence" or signal_name == "Advisor Influence":
        advs = [a for a in data_loader_service.advisor_relationships if a.msme_id == msme_id]
        adv_count = len(advs)
        rel_strength = advs[0].relationship_strength if adv_count > 0 else 50
        formula_str = (
            "Advisor CA Count (Weight: 40%) - Count of empanelled Chartered Accountants linked to the entity.\n"
            "+ CA Relationship Strength (Weight: 60%) - Influence rating of CA nodes on business decision-making."
        )
        formula_weights = [
            {"factor": "Advisor CA Count", "weight": "40%", "reason": "Count of empanelled Chartered Accountants linked to the entity."},
            {"factor": "CA Relationship Strength", "weight": "60%", "reason": "Influence rating of CA nodes on business decision-making."}
        ]
        derived_from = ["Chartered Accountant Association Count", "Advisor Node Influence Weight"]
        datasets = ["04_advisor_relationships.csv", "07_opportunity_signals.csv"]
        supporting_records = [
            f"Empanelled advisor count: {adv_count}.",
            f"Primary advisor relationship strength score: {rel_strength}%."
        ]
        business_reason = "Active mediation through local empanelled financial advisors provides a warm, high-conversion pathway."
        
    elif signal_name == "Anchor Relationship" or signal_name == "Anchor Strength":
        anchors = [a for a in data_loader_service.anchor_relationships if a.supplier_id == msme_id]
        anchor_count = len(anchors)
        rel_strength = anchors[0].relationship_strength if anchor_count > 0 else 55
        biz_vol = anchors[0].annual_business_lakh if anchor_count > 0 else 80
        formula_str = (
            "Corporate Connection Strength (Weight: 50%) - Tier-1 relationship stability and tenure.\n"
            "+ Annual Trade Volume (Weight: 50%) - Transaction flow consistency backing supply-chain finance programs."
        )
        formula_weights = [
            {"factor": "Corporate Connection Strength", "weight": "50%", "reason": "Tier-1 relationship stability and tenure."},
            {"factor": "Annual Trade Volume", "weight": "50%", "reason": "Transaction flow consistency backing supply-chain finance programs."}
        ]
        derived_from = ["Corporate Anchor Connection Strength", "Annual Trade Volume with Anchor"]
        datasets = ["03_anchor_relationships.csv", "07_opportunity_signals.csv"]
        supporting_records = [
            f"Active Tier-1 anchor relationships found: {anchor_count}.",
            f"Corporate connection strength: {rel_strength}%.",
            f"Annual business value: ₹{biz_vol} Lakhs."
        ]
        business_reason = "Direct corporate buyer relationship guarantees stable trade inflows and enables supply-chain finance programs."
        
    elif signal_name == "Transaction Velocity" or signal_name == "Invoice Frequency":
        invoice_count = len(invoices)
        avg_invoice_val = sum(inv.invoice_value_lakh for inv in invoices) / len(invoices) if invoices else 2.5
        formula_str = (
            "Invoice Inflow Frequency (Weight: 55%) - Monthly volume of trade ledgers indicating transaction momentum.\n"
            "+ Average Invoice Value (Weight: 45%) - Benchmark transaction size mapping to target credit needs."
        )
        formula_weights = [
            {"factor": "Invoice Inflow Frequency", "weight": "55%", "reason": "Monthly volume of trade ledgers indicating transaction momentum."},
            {"factor": "Average Invoice Value", "weight": "45%", "reason": "Benchmark transaction size mapping to target credit needs."}
        ]
        derived_from = ["Cleared Invoice Inflow Frequency", "Average Transaction Ticket Size"]
        datasets = ["02_invoice_transactions.csv"]
        supporting_records = [
            f"Invoice count cleared: {invoice_count} transactions.",
            f"Average ticket value: ₹{avg_invoice_val:.1f} Lakhs."
        ]
        business_reason = "Consistent monthly invoice clearance rates reflect healthy demand and predictable cash generation."
        
    else:
        formula_str = (
            "Node Connectivity Coefficient (Weight: 60%) - Relationship link density.\n"
            "+ Local Trade Density Index (Weight: 40%) - Concentration of trade nodes."
        )
        formula_weights = [
            {"factor": "Node Connectivity Coefficient", "weight": "60%", "reason": "Relationship link density."},
            {"factor": "Local Trade Density Index", "weight": "40%", "reason": "Concentration of trade nodes."}
        ]
        derived_from = ["Network Connectivity Coefficient", "Local Trade Density Index"]
        datasets = ["05_graph_edges.csv"]
        supporting_records = ["Ecosystem network traversal depth is 3-hops."]
        business_reason = "Operational activity surfaced from general network transaction flows."
        
    return {
        "signal": signal_name,
        "value": "High" if confidence >= 75 else ("Medium" if confidence >= 50 else "Low"),
        "confidence": confidence,
        "formula": formula_str,
        "formula_weights": formula_weights,
        "derived_from": derived_from,
        "datasets": datasets,
        "supporting_records": supporting_records,
        "business_reason": business_reason,
        "why_weights": why_weights,
        "metadata": metadata
    }

