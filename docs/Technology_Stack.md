# Technology Stack: Sahaj PathFinder

**Agentic MSME Acquisition Intelligence Platform**

Sahaj PathFinder is architected as an enterprise-ready Agentic AI platform. The technology stack is deliberately bifurcated to satisfy three competing objectives:

1. **Rapid Prototype Development:** Delivering a functional, high-impact prototype for the hackathon.
2. **Scalable Production Deployment:** Ensuring the architecture can migrate seamlessly into SBI’s internal infrastructure.
3. **Secure & Explainable AI:** Guaranteeing that every automated acquisition routing decision is deterministic, auditable, and strictly compliant with banking regulations.

---

## 1. The Hackathon MVP Stack (Local Execution)

*This stack powers the current repository, designed for lightweight local execution, rapid iteration, and high-fidelity demonstrations.*

### Agentic Core & LLMs

* **Orchestration:** `LangGraph` (Constructs the deterministic state-machine workflow for route evaluation, preventing LLM hallucination).
* **Tool Binding:** `LangChain` (Provides the framework for the agent to query the graph and draft structured JSON outputs).
* **Inference Engine (Multi-LLM):**
* *Routing/Reasoning:* `Llama-3-8B-Instruct` (Fast, localized reasoning).
* *Complex Data Parsing:* `GPT-4o-mini` / `Gemini 2.5 Flash` (Used strictly for parsing unstructured synthetic invoice inputs).



### Data & Graph Intelligence

* **Graph Engine:** `NetworkX` (Handles localized, in-memory graph construction and ecosystem relationship traversal for the prototype).
* **Data Processing:** `Pandas` (Processes synthetic MSME profiles, invoice relationships, and signal generation).
* **Storage:** Local `CSV` datasets acting as simulated database tables.

### Frontend & Visualization

* **Application Framework:** `Next.js (React)` (Delivers a high-performance, production-grade Single Page Application for the Executive Dashboard and Offer Workspace).
* **UI Architecture:** `Tailwind CSS` + `shadcn/ui` (Ensures a premium, pixel-perfect enterprise fintech aesthetic while maintaining extreme speed for hackathon prototyping).
* **Continuous Ecosystem Discovery:** `React Flow` & `Recharts` (Enables continuous ecosystem discovery mapping and node attributes inspections natively in the browser, eliminating the latency of server-side generation).

---

## 2. The SBI Enterprise Stack (Production Target)

*The target architecture required to deploy PathFinder securely inside SBI’s on-premise, RBI-compliant infrastructure.*

| Component | MVP Prototype | Enterprise Target State | Justification for SBI |
| --- | --- | --- | --- |
| **Data Ingestion** | Synthetic CSVs | **Apache Kafka & Spark** | Real-time streaming of NEFT/RTGS rails and *MSME Sahaj* API ledgers. |
| **Graph Database** | NetworkX (In-Memory) | **Neo4j Enterprise / TigerGraph** | Highly scalable, persistent storage for multi-tier supply chain traversal. |
| **AI Inference** | Commercial APIs | **Self-Hosted Quantized SLMs** | On-premise deployment (e.g., vLLM hosting Llama-3) ensuring zero PII data leakage. |
| **Data Storage** | Local Files | **PostgreSQL + S3 Object Storage** | ACID-compliant storage for audit logs, outreach history, and conversion events. |
| **Frontend** | Next.js (React) | **React Micro-frontends / Angular** | Native integration directly into the existing SBI Relationship Manager (RM) Workbench via modular micro-frontends. |

---

## 3. Architectural Mapping

The PathFinder system maps specific technologies to distinct operational layers to ensure modularity. If SBI wishes to swap out an underlying LLM or database, the core routing logic remains intact.

| System Layer | Core Responsibility | Assigned Technology (MVP) |
| --- | --- | --- |
| **1. Discovery Engine** | Counterparty extraction & identification | `Python` + `Pandas` |
| **2. Signal Intelligence** | Detecting liquidity & compliance stress | `Python` + `Regex` + `NLP` |
| **3. Graph Intelligence** | Mapping anchor/advisor influence | `NetworkX` |
| **4. PathFinder Agent** | State management & route reasoning | `LangGraph` |
| **5. Tool Calling** | Data retrieval & payload formatting | `LangChain` |
| **6. Strategy Execution**| Presentation of generated outreach | `Next.js` + `React Flow` |

---

## 4. Core Engineering Principles

To ensure this prototype transitions successfully from a hackathon concept to enterprise software, the codebase adheres to strict design principles:

* **Explainable AI (XAI):** The `LangGraph` state machine and our **Signal Provenance Engine** force the model to output its reasoning step-by-step and provide a direct trace to the underlying CSV files, supporting records, formulas, and confidence scores for absolute audit transparency.
* **Human-in-the-Loop (HITL):** The system generates the strategy, but execution halts at the "Offer Workspace" until an authorized Relationship Manager explicitly approves the payload.
* **Zero-Knowledge Routing:** The agent evaluates anonymized financial signals and graph edges; it does not require access to highly sensitive PII to determine the optimal acquisition route.
* **Modular Architecture:** Built to evolve. The `NetworkX` graph can be replaced by a `Neo4j` connection string in production without rewriting the agent's logic.