from typing import List, Dict, Any
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
