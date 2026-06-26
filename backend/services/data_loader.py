import logging
from pathlib import Path
from typing import Dict, List, Any
import pandas as pd
from backend.core.config import settings
from backend.schemas.data_models import (
    MSMEProfile,
    InvoiceTransaction,
    AnchorRelationship,
    AdvisorRelationship,
    GraphEdge,
    AcquisitionOpportunity,
    OpportunitySignal,
    RouteEvaluationResult,
    OutreachHistory,
    CustomerConversionEvent,
    EcosystemExpansionTracking,
    AgentLearningFeedback,
    DatasetStats,
)

logger = logging.getLogger(__name__)

class DataLoaderService:
    def __init__(self, data_dir: Path = settings.SAMPLE_DATA_DIR):
        self.data_dir = data_dir
        self.msme_profiles: List[MSMEProfile] = []
        self.invoice_transactions: List[InvoiceTransaction] = []
        self.anchor_relationships: List[AnchorRelationship] = []
        self.advisor_relationships: List[AdvisorRelationship] = []
        self.graph_edges: List[GraphEdge] = []
        self.acquisition_opportunities: List[AcquisitionOpportunity] = []
        self.opportunity_signals: List[OpportunitySignal] = []
        self.route_evaluations: List[RouteEvaluationResult] = []
        self.outreach_history: List[OutreachHistory] = []
        self.conversion_events: List[CustomerConversionEvent] = []
        self.ecosystem_expansions: List[EcosystemExpansionTracking] = []
        self.learning_feedback: List[AgentLearningFeedback] = []
        
        # DataFrames for fast indexing and query support in future analytical engines
        self._dfs: Dict[str, pd.DataFrame] = {}

    def load_all_data(self) -> None:
        """Loads and validates all CSVs in the sample data directory."""
        logger.info(f"Starting ingestion from {self.data_dir}")
        
        # Mapping CSV names to loaders
        mappings = {
            "01_msme_profiles.csv": (self._load_msme_profiles, "msme_profiles"),
            "02_invoice_transactions.csv": (self._load_invoice_transactions, "invoice_transactions"),
            "03_anchor_relationships.csv": (self._load_anchor_relationships, "anchor_relationships"),
            "04_advisor_relationships.csv": (self._load_advisor_relationships, "advisor_relationships"),
            "05_graph_edges.csv": (self._load_graph_edges, "graph_edges"),
            "06_acquisition_opportunities.csv": (self._load_acquisition_opportunities, "acquisition_opportunities"),
            "07_opportunity_signals.csv": (self._load_opportunity_signals, "opportunity_signals"),
            "08_route_evaluation_results.csv": (self._load_route_evaluations, "route_evaluations"),
            "09_outreach_history.csv": (self._load_outreach_history, "outreach_history"),
            "10_customer_conversion_events.csv": (self._load_conversion_events, "conversion_events"),
            "11_ecosystem_expansion_tracking.csv": (self._load_ecosystem_expansions, "ecosystem_expansions"),
            "12_agent_learning_feedback.csv": (self._load_learning_feedback, "learning_feedback"),
        }

        for filename, (loader_func, df_key) in mappings.items():
            file_path = self.data_dir / filename
            if not file_path.exists():
                logger.error(f"Required data file missing: {file_path}")
                raise FileNotFoundError(f"Missing {filename}")
            
            # Load into Pandas DataFrame
            df = pd.read_csv(file_path)
            # Standardize NaN values to None for clean Pydantic parsing
            df = df.where(pd.notnull(df), None)
            self._dfs[df_key] = df
            
            # Run specific model validation loader
            loader_func(df)
            logger.info(f"Loaded {len(df)} records from {filename}")

    def get_stats(self) -> DatasetStats:
        """Helper to get aggregate counts for landing dashboard KPIs."""
        return DatasetStats(
            num_msmes=len(self.msme_profiles),
            num_invoices=len(self.invoice_transactions),
            num_relationships=len(self.graph_edges),
            num_opportunities=len(self.acquisition_opportunities),
            num_signals=len(self.opportunity_signals)
        )

    def _clean_records(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        # Using a list comprehension to clean nan values from each record dict
        return [
            {k: (None if pd.isna(v) else v) for k, v in row.items()}
            for row in df.to_dict(orient="records")
        ]

    def _load_msme_profiles(self, df: pd.DataFrame) -> None:
        self.msme_profiles = [MSMEProfile(**row) for row in self._clean_records(df)]

    def _load_invoice_transactions(self, df: pd.DataFrame) -> None:
        self.invoice_transactions = [InvoiceTransaction(**row) for row in self._clean_records(df)]

    def _load_anchor_relationships(self, df: pd.DataFrame) -> None:
        self.anchor_relationships = [AnchorRelationship(**row) for row in self._clean_records(df)]

    def _load_advisor_relationships(self, df: pd.DataFrame) -> None:
        self.advisor_relationships = [AdvisorRelationship(**row) for row in self._clean_records(df)]

    def _load_graph_edges(self, df: pd.DataFrame) -> None:
        self.graph_edges = [GraphEdge(**row) for row in self._clean_records(df)]

    def _load_acquisition_opportunities(self, df: pd.DataFrame) -> None:
        self.acquisition_opportunities = [AcquisitionOpportunity(**row) for row in self._clean_records(df)]

    def _load_opportunity_signals(self, df: pd.DataFrame) -> None:
        self.opportunity_signals = [OpportunitySignal(**row) for row in self._clean_records(df)]

    def _load_route_evaluations(self, df: pd.DataFrame) -> None:
        self.route_evaluations = [RouteEvaluationResult(**row) for row in self._clean_records(df)]

    def _load_outreach_history(self, df: pd.DataFrame) -> None:
        self.outreach_history = [OutreachHistory(**row) for row in self._clean_records(df)]

    def _load_conversion_events(self, df: pd.DataFrame) -> None:
        self.conversion_events = [CustomerConversionEvent(**row) for row in self._clean_records(df)]

    def _load_ecosystem_expansions(self, df: pd.DataFrame) -> None:
        self.ecosystem_expansions = [EcosystemExpansionTracking(**row) for row in self._clean_records(df)]

    def _load_learning_feedback(self, df: pd.DataFrame) -> None:
        self.learning_feedback = [AgentLearningFeedback(**row) for row in self._clean_records(df)]

# Global Singleton Service instance for Dependency Injection
data_loader_service = DataLoaderService()
