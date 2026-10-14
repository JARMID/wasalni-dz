# Graph Report - dash  (2026-10-14)

## Corpus Check
- 45 files · ~41,229 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 425 nodes · 538 edges · 27 communities (23 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Algeria Smart Taxi & Mobility Platform
- Technical Requirements Document (TRD)
- Product Requirements Document (PRD)
- Phase 1 Execution & Master Tooling Playbook
- 2. Rider Journey Workflows
- UI and UX Design Brief
- Dashcam and Telematics Subsystem Analysis
- TrajectoryFlusher
- 1. Phased Engineering Roadmap
- Backend Schema and Database Architecture
- App.tsx
- devDependencies
- bootstrap-stack.sh script
- compilerOptions
- compilerOptions
- dependencies
- 3. Parcours de Démonstration Guidé (Scénario en 6 Étapes)
- plugins
- React + TypeScript + Vite
- tsconfig.json
- client.go
- build-valhalla-tiles.sh script
- dz-smart-taxi/telemetry

## God Nodes (most connected - your core abstractions)
1. `SoundEngine` - 20 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `TrajectoryFlusher` - 13 edges
5. `Algeria Smart Taxi & Mobility Platform` - 13 edges
6. `react` - 12 edges
7. `SpatialIndexer` - 11 edges
8. `DriverProfile` - 9 edges
9. `Technical Requirements Document (TRD)` - 9 edges
10. `RideRequest` - 8 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `NewClient()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/valhalla/client.go
- `main()` --calls--> `NewTrajectoryFlusher()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/flusher.go
- `main()` --calls--> `LatLngToH3Res8()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/h3index.go
- `main()` --calls--> `NewSpatialIndexer()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/h3index.go
- `main()` --calls--> `NewHub()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/hub.go

## Import Cycles
- None detected.

## Communities (27 total, 4 thin omitted)

### Community 0 - "Algeria Smart Taxi & Mobility Platform"
Cohesion: 0.06
Nodes (34): 10. Technical Implementation Roadmap (20 Weeks), 11.1 H3 Spatial Resolution: Fixed Res 8 Dispatch Pool, 11.2 Ingestion Serialization Protocol: WebSockets with Binary Protobuf, 11.3 Dashcam Chunk Encryption: Envelope Encryption with Shamir Secret Sharing, 11.4 Taximeter OCR Engine: Bundled INT8 TFLite Two-Stage Pipeline, 11. Finalized Technical Consensus and Architectural Decisions, 1.1 The Regulatory Impasse in Algeria, 1.2 The Regulated Fleet Model (+26 more)

### Community 1 - "Technical Requirements Document (TRD)"
Cohesion: 0.08
Nodes (23): 1. System Architecture Overview, 2.1 Mobile Application Tier: Flutter 3.x with Dart 3, 2.2 Core Backend and Database Tier: Self-Hosted Supabase on Algerian Infrastructure, 2.3 High-Performance Geospatial Routing Engine: Dedicated Go Service, 2.4 Administrative and Dispatch Portal: Next.js 15 and React 19, 2.5 Automation and Background Processing: Windmill, 2. Technology Stack Selection and Rationale, 3.1 Hexagonal Spatial Indexing (H3) (+15 more)

### Community 2 - "Product Requirements Document (PRD)"
Cohesion: 0.08
Nodes (25): 1. Executive Summary, 2.1 The Regulatory Impasse, 2.2 Passenger Safety and Quality Deficits, 2.3 Payment and Currency Bottlenecks, 2. Market Context and Problem Definition, 3.1 Primary Value Pillars, 3. Product Vision and Core Value Proposition, 4.1 Passenger: Amel (Urban Professional, Algiers) (+17 more)

### Community 3 - "Phase 1 Execution & Master Tooling Playbook"
Cohesion: 0.06
Nodes (31): 1.1 Docker Compose Configuration (Low-Memory Trim), 1.2 Database Migration Script, 1.3 System General Ledger (GL) Seed Data, 1. Executive Strategy & Dual-Track Execution Architecture, 2.1 Data Extraction & Ingestion, 2. Environment Comparison: Single PC vs. Dual PC, 3.1 Binary Protobuf Protocol Schema, 3.1 Core Runtimes and Compilers (+23 more)

### Community 4 - "2. Rider Journey Workflows"
Cohesion: 0.11
Nodes (17): 1. Overview of Multi-Surface Workflows, 2.1 Onboarding and Profile Setup, 2.2 Urban Trip Booking (Automated Taxi Dispatch), 2.3 Active Trip and Safety Tools, 2.4 Drop-off and Payment Settlement, 2.5 Inter-Wilaya Trip (Negotiated Bidding Mode), 2. Rider Journey Workflows, 3.1 Regulatory Onboarding and Verification Pipeline (+9 more)

### Community 5 - "UI and UX Design Brief"
Cohesion: 0.11
Nodes (17): 1. Design Philosophy and Environmental Context, 2. Color System and Contrast Architecture, 3.1 Font Selection, 3.2 Scale and Legibility Thresholds, 3. Typography Hierarchy, 4.1 Minimal Cognitive Load Layout, 4.2 Dashcam Interface Treatment, 4. Driver Cockpit Ergonomics and Dashcam Controls (+9 more)

### Community 6 - "Dashcam and Telematics Subsystem Analysis"
Cohesion: 0.13
Nodes (14): 1. The Core Architectural Dilemma, 2. Dual-Tier Hardware and Software Deployment Architecture, 3.1 Resource Management and Thermal Throttling, 3.2 Automated G-Shock and Accident Detection, 3. Tier 1: Smartphone In-App Dashcam Implementation, 4.1 Hardware Specifications, 4.2 Synchronization Protocol, 4. Tier 2: Connected Fleet IoT Dashcam Architecture (+6 more)

### Community 7 - "TrajectoryFlusher"
Cohesion: 0.08
Nodes (23): main(), seedInitialDrivers(), Conn, DB, BuildLineStringMWKT(), NewTrajectoryFlusher(), GetNeighborCells(), RWMutex (+15 more)

### Community 8 - "1. Phased Engineering Roadmap"
Cohesion: 0.17
Nodes (11): 1. Phased Engineering Roadmap, 2. Technology Stack and Infrastructure Matrix, 3. Specialized Subagent and Team Allocation, 4. Risk Analysis and Mitigation Strategies, Implementation Plan and Technical Roadmap, Next-Generation Smart Taxi and Mobility Platform for Algeria, Phase 1: Architecture, Database, and Regulatory Onboarding (Weeks 1 to 4), Phase 2: Geospatial Engine, Dispatch Radar, and Mobile Foundations (Weeks 5 to 8) (+3 more)

### Community 9 - "Backend Schema and Database Architecture"
Cohesion: 0.33
Nodes (5): 1. Relational Entity Relationship Diagram, 2. PostgreSQL DDL Schema and Core Extensions, 4. Geospatial Proximity Matching RPC Function, Backend Schema and Database Architecture, Next-Generation Smart Taxi and Mobility Platform for Algeria

### Community 10 - "App.tsx"
Cohesion: 0.09
Nodes (38): App(), ChargilyTopupModal(), ChargilyTopupModalProps, DashcamHUD(), DashcamHUDProps, DispatchView(), DispatchViewProps, DriverCockpit() (+30 more)

### Community 11 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+16 more)

### Community 14 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 16 - "dependencies"
Cohesion: 0.11
Nodes (19): canvas-confetti, dependencies, canvas-confetti, leaflet, lucide-react, react, react-dom, tailwindcss (+11 more)

### Community 17 - "3. Parcours de Démonstration Guidé (Scénario en 6 Étapes)"
Cohesion: 0.12
Nodes (15): 1. Résumé Exécutif & Positionnement Stratégique, 2. Comment Lancer la Démonstration (En 1 Clic), 3. Parcours de Démonstration Guidé (Scénario en 6 Étapes), 4. Outils et Modules Backend Implémentés, Guide de Démonstration Exécutive pour Présentation Client & Entreprise, Les Innovations Majeures Présentées dans ce Démonstrateur :, NAQL DZ • Plateforme Intelligente des Taxis Réglementés en Algérie, Option A (Double-Clic Windows) : (+7 more)

### Community 18 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 19 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 23 - "client.go"
Cohesion: 0.33
Nodes (7): haversineDistance(), NewClient(), Client, Location, MatrixElement, MatrixRequest, MatrixResponse

## Knowledge Gaps
- **211 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+206 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `react` connect `App.tsx` to `plugins`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _211 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Algeria Smart Taxi & Mobility Platform` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Technical Requirements Document (TRD)` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Product Requirements Document (PRD)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Phase 1 Execution & Master Tooling Playbook` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._