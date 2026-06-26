from typing import Optional
from pydantic import BaseModel, Field

class MSMEProfile(BaseModel):
    msme_id: str
    company_name: str
    industry: str
    city: str
    state: str
    annual_turnover_cr: float
    employee_count: int
    digital_readiness_score: int
    existing_sbi_customer: str
    customer_since: Optional[str] = None
    gst_registered: str
    udyam_registered: str

class InvoiceTransaction(BaseModel):
    invoice_id: str
    supplier_id: str
    buyer_id: str
    invoice_value_lakh: float
    invoice_date: str
    due_date: str
    days_outstanding: int
    status: str

class AnchorRelationship(BaseModel):
    anchor_id: str
    anchor_name: str
    supplier_id: str
    relationship_strength: int
    annual_business_lakh: int

class AdvisorRelationship(BaseModel):
    advisor_id: str
    advisor_name: str
    advisor_type: str
    msme_id: str
    relationship_strength: int

class GraphEdge(BaseModel):
    edge_id: str
    source_node: str
    target_node: str
    relationship_type: str
    strength: int

class AcquisitionOpportunity(BaseModel):
    opportunity_id: str
    msme_id: str
    identified_date: str
    opportunity_value_lakh: int
    priority: str
    recommended_route: str
    conversion_probability: int
    time_to_engage: str

class OpportunitySignal(BaseModel):
    signal_id: str
    opportunity_id: str
    signal_name: str
    severity: str
    signal_score: int

class RouteEvaluationResult(BaseModel):
    evaluation_id: str
    opportunity_id: str
    route: str
    score: int
    selected: str

class OutreachHistory(BaseModel):
    outreach_id: str
    opportunity_id: str
    route_used: str
    outreach_date: str
    channel: str
    status: str

class CustomerConversionEvent(BaseModel):
    conversion_id: str
    opportunity_id: str
    conversion_date: str
    result: str
    loan_book_value_lakh: int

class EcosystemExpansionTracking(BaseModel):
    expansion_id: str
    converted_msme: str
    new_msmes_discovered: int
    estimated_ecosystem_value_lakh: int

class AgentLearningFeedback(BaseModel):
    feedback_id: str
    opportunity_id: str
    selected_route: str
    actual_result: str
    confidence_before: int
    confidence_after: int

class DatasetStats(BaseModel):
    num_msmes: int
    num_invoices: int
    num_relationships: int
    num_opportunities: int
    num_signals: int
