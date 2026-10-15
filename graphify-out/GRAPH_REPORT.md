# Graph Report - dash  (2026-10-15)

## Corpus Check
- 84 files · ~88,308 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 789 nodes · 1153 edges · 52 communities (45 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7085f5d6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- driver_profile.dart
- ride_state.dart
- Header.tsx
- parse_baridimob_text
- envelope_encryption.dart
- RiderView.tsx
- rider_app/lib/main.dart
- driver_app/lib/main.dart
- AppLang
- index.ts
- react
- InteractiveMap.tsx
- thermal_state_machine.dart
- SoundEngine
- driver_app_test.dart
- service_mode.dart
- naql_core.dart
- CockpitHomeScreen
- vercel.json
- ThreeCanvas.tsx
- DriverCockpitApp
- verify-entire-platform.sh script

## God Nodes (most connected - your core abstractions)
1. `AppLang` - 32 edges
2. `SoundEngine` - 29 edges
3. `react` - 27 edges
4. `compilerOptions` - 18 edges
5. `DriverProfile` - 15 edges
6. `getTranslation()` - 15 edges
7. `compilerOptions` - 15 edges
8. `ActiveTab` - 14 edges
9. `TrajectoryFlusher` - 13 edges
10. `RideState` - 13 edges

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

## Communities (52 total, 7 thin omitted)

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
Cohesion: 0.18
Nodes (17): App(), LedgerView(), LedgerViewProps, ALGIERS_MUNICIPAL_FLEET, INITIAL_DRIVER, INITIAL_LEDGER, INITIAL_WALLETS, MunicipalTaxiVehicle (+9 more)

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
Cohesion: 0.07
Nodes (27): canvas-confetti, dependencies, canvas-confetti, gsap, leaflet, lucide-react, react, react-dom (+19 more)

### Community 17 - "3. Parcours de Démonstration Guidé (Scénario en 6 Étapes)"
Cohesion: 0.12
Nodes (16): 1. Résumé Exécutif & Positionnement Stratégique, 2. Comment Lancer la Démonstration (En 1 Clic), 3. Parcours de Démonstration Guidé (Scénario en 6 Étapes), 4. Outils et Modules Backend Implémentés, 5. Ce que Vous Devez Préparer pour la Suite (Checklist Projet), Guide de Démonstration Exécutive pour Présentation Client & Entreprise, Les Innovations Majeures Présentées dans ce Démonstrateur :, NAQL DZ • Plateforme Intelligente des Taxis Réglementés en Algérie (+8 more)

### Community 18 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 19 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 23 - "client.go"
Cohesion: 0.33
Nodes (7): haversineDistance(), NewClient(), Client, Location, MatrixElement, MatrixRequest, MatrixResponse

### Community 27 - "driver_profile.dart"
Cohesion: 0.04
Nodes (46): @immutable, DateTime, DashcamIncident, driverId, encryptionKeyId, id, peakGForce, rideId (+38 more)

### Community 28 - "ride_state.dart"
Cohesion: 0.05
Nodes (46): agrementNumber, arrivedAt, cancelledAt, completedAt, createdAt, currentSpeedKmh, destinationLat, destinationLng (+38 more)

### Community 29 - "Header.tsx"
Cohesion: 0.11
Nodes (29): FluidShaderCanvas(), FluidShaderCanvasProps, PALETTE_COLORS, parseCssColor(), FooterReveal(), FooterRevealProps, ActiveTab, BRAND_OPTIONS (+21 more)

### Community 30 - "parse_baridimob_text"
Cohesion: 0.16
Nodes (15): Any, BaridiMobReceipt, calculate_algerian_rip_key(), parse_baridimob_text(), BaridiMob and Algérie Poste receipt parser. Extracts transaction references,…, Calculates the 2-digit control key for an Algerian CCP account according to…, Verifies an Algerian 20-digit Relevé d'Identité Postale (RIP). Format: 007…, Parses OCR-extracted text from a BaridiMob transaction voucher. Supports French… (+7 more)

### Community 31 - "envelope_encryption.dart"
Cohesion: 0.09
Nodes (21): dart:convert, dart:math, _bytesToHex, calculateFingerprint, combineShamir2of3, EnvelopeEncryption, generateDek, _gfDivide (+13 more)

### Community 32 - "RiderView.tsx"
Cohesion: 0.16
Nodes (18): AiCopilotModal(), MOCK_RIDER_HISTORY, POPULAR_CHIPS, RECURRING_DAYS_LIST, RiderView(), ALGIERS_LOCATIONS, AiCopilotMessage, checkPwnedPinOrPassword() (+10 more)

### Community 33 - "rider_app/lib/main.dart"
Cohesion: 0.09
Nodes (21): _accumulatedSpareChangeDzd, build, _buildBookingTab, _buildLawItem, _buildModeCard, _buildRegulatoryTab, _buildWalletTab, _cancelRide (+13 more)

### Community 34 - "driver_app/lib/main.dart"
Cohesion: 0.10
Nodes (20): DriverProfile, List, build, _buildRideStateView, _computedMeterDzd, createState, currentRide, driver (+12 more)

### Community 35 - "AppLang"
Cohesion: 0.18
Nodes (16): AiCopilotModalProps, DashcamHUDProps, DispatchView(), DispatchViewProps, DriverCockpit(), DriverCockpitProps, LandingView(), OfficialReceiptModal() (+8 more)

### Community 36 - "index.ts"
Cohesion: 0.18
Nodes (16): InspectorView(), InspectorViewProps, WILAYAS_58, OfficialCitationModal(), OfficialCitationModalProps, RiderViewProps, BookingType, DriverProfile (+8 more)

### Community 37 - "react"
Cohesion: 0.22
Nodes (10): BaridiMobModal(), BaridiMobModalProps, SAMPLE_RECEIPTS, ChargilyTopupModal(), ChargilyTopupModalProps, CANNED_MESSAGES, RideChatModal(), RideChatModalProps (+2 more)

### Community 38 - "InteractiveMap.tsx"
Cohesion: 0.21
Nodes (12): DashcamHUD(), InteractiveMap(), InteractiveMapProps, MAP_STYLES, MapStyleConfig, MapStyleKey, SURROUNDING_TAXIS, LocationPoint (+4 more)

### Community 39 - "thermal_state_machine.dart"
Cohesion: 0.15
Nodes (12): double get, _currentLevel, _currentTempCelsius, description, fromTemperature, maxTempCelsius, name, targetFps (+4 more)

### Community 41 - "driver_app_test.dart"
Cohesion: 0.20
Nodes (8): main, main, main, package:driver_app/main.dart, package:flutter/material.dart, package:flutter_test/flutter_test.dart, package:naql_core/naql_core.dart, package:rider_app/main.dart

### Community 42 - "service_mode.dart"
Cohesion: 0.20
Nodes (9): double?, approachFeeDzd, baseSeatCount, displayNameAr, displayNameFr, fixedSeatPriceDzd, fromId, id (+1 more)

### Community 43 - "naql_core.dart"
Cohesion: 0.20
Nodes (9): library, naql_core, models/dashcam_incident.dart, models/driver_profile.dart, models/ledger_entry.dart, models/ride_state.dart, models/service_mode.dart, security/envelope_encryption.dart (+1 more)

### Community 44 - "CockpitHomeScreen"
Cohesion: 0.40
Nodes (6): CockpitHomeScreen, _CockpitHomeScreenState, RiderHomeScreen, _RiderHomeScreenState, State, StatefulWidget

### Community 45 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, rewrites

### Community 47 - "DriverCockpitApp"
Cohesion: 0.67
Nodes (3): DriverCockpitApp, RiderApp, StatelessWidget

## Knowledge Gaps
- **392 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+387 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RideState` connect `ride_state.dart` to `rider_app/lib/main.dart`, `driver_app/lib/main.dart`, `driver_profile.dart`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `RiderView.tsx`, `AppLang`, `index.ts`, `InteractiveMap.tsx`, `App.tsx`, `ThreeCanvas.tsx`, `plugins`, `Header.tsx`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `SoundEngine` connect `SoundEngine` to `RiderView.tsx`, `AppLang`, `index.ts`, `react`, `InteractiveMap.tsx`, `App.tsx`, `Header.tsx`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _392 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Algeria Smart Taxi & Mobility Platform` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Technical Requirements Document (TRD)` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Product Requirements Document (PRD)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._