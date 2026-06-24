# Sahaj PathFinder: System Architecture

> **The Core Shift:** Traditional systems ask, *"Which customer should we target?"* PathFinder asks, *"Which acquisition pathway will convert this customer most effectively?"*

## High-Level Architecture
*(Reference: `sahaj_pathfinder_architecture.jpg`)*

![Sahaj PathFinder Architecture](sahaj_pathfinder_architecture.png)

## The 6 Intelligence Layers

The platform operates across six interconnected layers, transforming fragmented banking data into automated, high-conversion acquisition journeys.

| Layer | Component | Core Function | Example Output |
| :--- | :--- | :--- | :--- |
| **1** | **SBI Ecosystem Signals** | Ingests fragmented data from existing SBI networks. | *Invoices from MSME Sahaj, UPI/RTGS logs, YONO data.* |
| **2** | **Discovery Engine** | Identifies non-SBI entities hiding within the customer network. | *Flags "Supplier B" as an unregistered prospect.* |
| **3** | **Signal Intelligence** | Extracts behavioral and financial triggers from raw data. | *Detects "45-day delayed payment" (Working Capital Stress).* |
| **4** | **PathFinder Agent** | **The Brain.** Evaluates signals and reasons through multiple acquisition strategies. | *Decides direct marketing will fail; immediate financing is needed.* |
| **5** | **Acquisition Routes** | The specialized execution pathways selected by the Agent. | *Selects **Transaction Route** over Advisor or Direct Routes.* |
| **6** | **Personalized Journey** | Generates the tailored onboarding and RM handoff. | *Issues a 1-click ₹15 Lakh MSME Sahaj financing offer.* |

## The 4 Acquisition Routes (Layer 5 Deep-Dive)

Instead of a single funnel, the Agentic Router dynamically deploys one of four distinct pathways based on the prospect's immediate motivation:

* **Direct Route:** Deployed when digital readiness is high. *(Triggers YONO Business self-serve onboarding).*
* **Advisor Route:** Deployed when CA influence is strong. *(Triggers outreach through empanelled tax consultants).*
* **Anchor Route:** Deployed for deep supply chains. *(Leverages existing Tier-1 corporate relationships).*
* **Transaction Route:** Deployed during liquidity stress. *(Transforms an unpaid invoice into an instant financing pull).*