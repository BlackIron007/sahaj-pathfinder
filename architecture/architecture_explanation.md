<div align="center">

# End-to-End System Flow: Sahaj PathFinder
**Category:** Agentic MSME Acquisition Intelligence Platform

[![Workflow](https://img.shields.io/badge/Workflow-Autonomous_Routing-2ea44f?style=for-the-badge)]()
[![Approval](https://img.shields.io/badge/Approval-Human--in--the--Loop-ffc107?style=for-the-badge)]()
[![Governance](https://img.shields.io/badge/Governance-RBIA_Compliant-8a2be2?style=for-the-badge)]()

*A transparent, 6-stage operational pipeline transforming raw SBI ecosystem signals into high-conversion, fully governed acquisition journeys.*

---
</div>

## Executive Summary

**Sahaj PathFinder** is an Acquisition Intelligence Platform that transforms fragmented ecosystem signals into explainable, governed acquisition decisions. 

Rather than generating generic marketing leads that sit idly in a CRM, the platform operates as a continuous engine: discovering MSMEs, evaluating multiple acquisition pathways, recommending the optimal engagement strategy, supporting Relationship Manager decision-making, and learning from business outcomes through a strictly governed feedback loop.

---

## The Acquisition Intelligence Lifecycle

```mermaid
flowchart TD
    %% Theme-Safe Styling
    classDef signal fill:#f2f0eb,stroke:#333,stroke-width:1px,color:#000;
    classDef agent fill:#fbeeb8,stroke:#b8860b,stroke-width:2px,color:#000;
    classDef route fill:#e6eed6,stroke:#2b542c,stroke-width:2px,color:#000;
    classDef action fill:#d6e4ee,stroke:#1034a6,stroke-width:2px,color:#000;
    linkStyle default stroke:#888,stroke-width:2px;

    A[1. Signal Collection\nMSME Sahaj, NEFT, Anchors]:::signal --> B[2. Ecosystem Discovery\nIdentify Hidden MSMEs]:::signal
    B --> C[3. Signal Intelligence\nGenerate Business Signals]:::signal
    C --> D{4. Decision Intelligence\nCompare Acquisition Routes}:::agent

    D -->|Digital Ready| E1(Direct Route):::route
    D -->|Advisor Driven| E2(Advisor Route):::route
    D -->|Anchor Ecosystem| E3(Anchor Route):::route
    D -->|Liquidity Need| E4(Transaction Route):::route

    E1 --> F[5. Offer Workspace\nGenerate RM Recommendation]:::action
    E2 --> F
    E3 --> F
    E4 --> F

    F --> G[6. RM Approval & Customer Journey]:::action
    G -.->|Feedback Loop| D
```
---

## Why This Architecture Is Different

| Feature | Traditional Acquisition | Sahaj PathFinder |
| --- | --- | --- |
| **Target Identification** | Lead scoring models | **Ecosystem discovery & extraction** |
| **Context** | Static CRM records | **Dynamic relationship graph reasoning** |
| **Strategy** | Single, fixed recommendation | **Multi-route parallel evaluation** |
| **Trust** | Black-box scoring | **100% Complete explainability (XAI)** |
| **RM Role** | Manual prioritization | **AI-assisted decision approval** |
| **Evolution** | Static models | **Governed continuous learning** |

*The platform is designed to augment Relationship Managers with superhuman context, rather than attempt to replace them.*

---

## Enterprise Evolution Target

The current prototype intentionally prioritizes deterministic reasoning, explainability, and governance. Production deployment will extend this architecture incrementally, minimizing operational risk while preserving auditability.

| Subsystem | MVP Prototype Execution | Enterprise Target Execution |
| --- | --- | --- |
| **Decision Engine** | Weighted Decision Engine | **LangGraph Supervisor** |
| **Graph Database** | NetworkX (In-Memory) | **Neo4j Enterprise** |
| **Data Ingestion** | CSV Dataset Simulation | **Kafka Event Streams** |
| **Model Registry** | Simulated Local Registry | **MLflow Enterprise Registry** |
| **Observability** | Internal Python Logging | **LangSmith + OpenTelemetry** |

---

## The 5 Engineering Principles

The architecture follows five non-negotiable principles throughout every stage of the workflow:

1. **Explainability First:** Every recommendation mathematically exposes its evidence, calculations, and confidence.
2. **Human-in-the-Loop:** Relationship Managers authorize and approve every single customer-facing action.
3. **Governance Before Automation:** Candidate models require offline validation, shadow deployment, and human board approval before entering production.
4. **Continuous Learning:** Business outcomes improve future recommendations through structured, labeled feedback.
5. **Incremental Modernization:** Enterprise capabilities replace prototype components gradually via microservices, without disrupting RM workflows.

---

## Conclusion

Sahaj PathFinder combines ecosystem discovery, explainable decision intelligence, governed AI, and continuous learning into a single, cohesive acquisition platform.

The current prototype demonstrates the complete acquisition lifecycle using deterministic reasoning and human oversight, while providing a realistic, derisked migration path toward an enterprise-scale, multi-agent architecture operating securely within SBI's massive ecosystem.