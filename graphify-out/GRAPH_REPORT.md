# Graph Report - dash  (2026-10-16)

## Corpus Check
- 146 files · ~120,324 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1287 nodes · 1787 edges · 94 communities (75 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `584df5bd`
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
- driver_app/windows/runner/win32_window.cpp
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
- react
- rider_app/windows/runner/win32_window.cpp
- offline_sync_queue.dart
- thermal_state_machine.dart
- SoundEngine
- driver_app_test.dart
- service_mode.dart
- naql_core.dart
- CockpitHomeScreen
- vercel.json
- Flutter
- StatelessWidget
- verify-entire-platform.sh script
- taximeter_quittance.dart
- supabase_service.dart
- driver_shift.dart
- quittance_qr_widget.dart
- trip_history_item.dart
- spare_change_engine.dart
- wWinMain
- dashcam_incident.dart
- wWinMain
- driver_app/web/manifest.json
- audio_haptic_service.dart
- rider_app/web/manifest.json
- package.json
- ledger_entry.dart
- RideState
- ride_rating.dart
- geo_hub.dart
- route_maneuver.dart
- @immutable
- AiCopilotModal.tsx
- MainActivity
- driver_app
- MainActivity
- rider_app
- OfflineSyncQueue
- gsap
- leaflet
- lucide-react
- react
- three
- @types/three
- driver_app/ios/Runner/Assets.xcassets/LaunchImage.imageset/README.md
- rider_app/ios/Runner/Assets.xcassets/LaunchImage.imageset/README.md
- String?

## God Nodes (most connected - your core abstractions)
1. `AppLang` - 32 edges
2. `SoundEngine` - 29 edges
3. `react` - 27 edges
4. `compilerOptions` - 18 edges
5. `Win32Window` - 18 edges
6. `Win32Window` - 18 edges
7. `DriverProfile` - 15 edges
8. `compilerOptions` - 15 edges
9. `ActiveTab` - 14 edges
10. `getTranslation()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `NewTrajectoryFlusher()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/flusher.go
- `main()` --calls--> `LatLngToH3Res8()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/h3index.go
- `main()` --calls--> `NewSpatialIndexer()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/h3index.go
- `main()` --calls--> `NewHub()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/telemetry/hub.go
- `main()` --calls--> `NewClient()`  [INFERRED]
  cmd/telemetry-daemon/main.go → internal/valhalla/client.go

## Import Cycles
- None detected.

## Communities (94 total, 19 thin omitted)

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
Cohesion: 0.07
Nodes (30): main(), seedInitialDrivers(), Conn, DB, BuildLineStringMWKT(), NewTrajectoryFlusher(), GetNeighborCells(), RWMutex (+22 more)

### Community 8 - "1. Phased Engineering Roadmap"
Cohesion: 0.17
Nodes (11): 1. Phased Engineering Roadmap, 2. Technology Stack and Infrastructure Matrix, 3. Specialized Subagent and Team Allocation, 4. Risk Analysis and Mitigation Strategies, Implementation Plan and Technical Roadmap, Next-Generation Smart Taxi and Mobility Platform for Algeria, Phase 1: Architecture, Database, and Regulatory Onboarding (Weeks 1 to 4), Phase 2: Geospatial Engine, Dispatch Radar, and Mobile Foundations (Weeks 5 to 8) (+3 more)

### Community 9 - "Backend Schema and Database Architecture"
Cohesion: 0.33
Nodes (5): 1. Relational Entity Relationship Diagram, 2. PostgreSQL DDL Schema and Core Extensions, 4. Geospatial Proximity Matching RPC Function, Backend Schema and Database Architecture, Next-Generation Smart Taxi and Mobility Platform for Algeria

### Community 10 - "App.tsx"
Cohesion: 0.19
Nodes (16): App(), LedgerViewProps, ALGIERS_MUNICIPAL_FLEET, INITIAL_DRIVER, INITIAL_LEDGER, INITIAL_WALLETS, MunicipalTaxiVehicle, LedgerEntry (+8 more)

### Community 11 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+7 more)

### Community 14 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 15 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 16 - "dependencies"
Cohesion: 0.13
Nodes (15): canvas-confetti, dependencies, canvas-confetti, react-dom, @supabase/supabase-js, tailwindcss, @tailwindcss/vite, @types/canvas-confetti (+7 more)

### Community 17 - "3. Parcours de Démonstration Guidé (Scénario en 6 Étapes)"
Cohesion: 0.12
Nodes (16): 1. Résumé Exécutif & Positionnement Stratégique, 2. Comment Lancer la Démonstration (En 1 Clic), 3. Parcours de Démonstration Guidé (Scénario en 6 Étapes), 4. Outils et Modules Backend Implémentés, 5. Ce que Vous Devez Préparer pour la Suite (Checklist Projet), Guide de Démonstration Exécutive pour Présentation Client & Entreprise, Les Innovations Majeures Présentées dans ce Démonstrateur :, NAQL DZ • Plateforme Intelligente des Taxis Réglementés en Algérie (+8 more)

### Community 18 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 19 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 23 - "driver_app/windows/runner/win32_window.cpp"
Cohesion: 0.05
Nodes (56): PluginRegistry, RegisterPlugins(), DartProject, HWND, LPARAM, LRESULT, UINT, WPARAM (+48 more)

### Community 27 - "driver_profile.dart"
Cohesion: 0.10
Nodes (19): agrementNumber, communeName, copyWith, currentLat, currentLng, fullName, heading, id (+11 more)

### Community 28 - "ride_state.dart"
Cohesion: 0.06
Nodes (35): agrementNumber, arrivedAt, cancelledAt, completedAt, createdAt, currentSpeedKmh, destinationLat, destinationLng (+27 more)

### Community 29 - "Header.tsx"
Cohesion: 0.09
Nodes (33): FluidShaderCanvas(), FluidShaderCanvasProps, PALETTE_COLORS, parseCssColor(), FooterReveal(), FooterRevealProps, ActiveTab, BRAND_OPTIONS (+25 more)

### Community 30 - "parse_baridimob_text"
Cohesion: 0.15
Nodes (15): BaridiMobReceipt, calculate_algerian_rip_key(), parse_baridimob_text(), BaridiMob and Algérie Poste receipt parser. Extracts transaction references,…, Calculates the 2-digit control key for an Algerian CCP account according to…, Verifies an Algerian 20-digit Relevé d'Identité Postale (RIP). Format: 007…, Parses OCR-extracted text from a BaridiMob transaction voucher. Supports French…, verify_algerian_rip() (+7 more)

### Community 31 - "envelope_encryption.dart"
Cohesion: 0.11
Nodes (18): _bytesToHex, calculateFingerprint, combineShamir2of3, EnvelopeEncryption, generateDek, _gfDivide, _gfMultiply, _gfPow (+10 more)

### Community 32 - "RiderView.tsx"
Cohesion: 0.09
Nodes (39): DashcamHUD(), DashcamHUDProps, InteractiveMap(), InteractiveMapProps, MAP_STYLES, MapStyleConfig, MapStyleKey, SURROUNDING_TAXIS (+31 more)

### Community 33 - "rider_app/lib/main.dart"
Cohesion: 0.05
Nodes (37): _accumulatedSpareChangeDzd, build, _buildBookingTab, _buildLawItem, _buildModeCard, _buildOfflineStatusBanner, _buildRegulatoryTab, _buildWalletTab (+29 more)

### Community 34 - "driver_app/lib/main.dart"
Cohesion: 0.06
Nodes (33): DriverProfile, build, _buildComplianceRow, _buildOfflineStatusBanner, _buildRideStateView, _computedMeterDzd, createState, currentRide (+25 more)

### Community 35 - "AppLang"
Cohesion: 0.21
Nodes (18): DispatchView(), DispatchViewProps, DriverCockpit(), DriverCockpitProps, InspectorViewProps, LedgerView(), OfficialReceiptModalProps, CANNED_MESSAGES (+10 more)

### Community 36 - "react"
Cohesion: 0.25
Nodes (7): InspectorView(), WILAYAS_58, OfficialCitationModal(), OfficialCitationModalProps, ThreeCanvasProps, OfficialCitationPV, react

### Community 37 - "rider_app/windows/runner/win32_window.cpp"
Cohesion: 0.05
Nodes (56): PluginRegistry, RegisterPlugins(), DartProject, HWND, LPARAM, LRESULT, UINT, WPARAM (+48 more)

### Community 38 - "offline_sync_queue.dart"
Cohesion: 0.06
Nodes (33): dart:async, DateTime? get, int get, attachSupabaseService, clearQueue, enqueueDashcamIncident, enqueuedAt, enqueueLedgerEntry (+25 more)

### Community 39 - "thermal_state_machine.dart"
Cohesion: 0.15
Nodes (12): double get, _currentLevel, _currentTempCelsius, description, fromTemperature, maxTempCelsius, name, targetFps (+4 more)

### Community 40 - "SoundEngine"
Cohesion: 0.15
Nodes (6): BaridiMobModal(), BaridiMobModalProps, SAMPLE_RECEIPTS, ChargilyTopupModal(), ChargilyTopupModalProps, SoundEngine

### Community 41 - "driver_app_test.dart"
Cohesion: 0.17
Nodes (14): dart:convert, main, main, main, main, main, main, package:driver_app/main.dart (+6 more)

### Community 42 - "service_mode.dart"
Cohesion: 0.20
Nodes (9): double?, approachFeeDzd, baseSeatCount, displayNameAr, displayNameFr, fixedSeatPriceDzd, fromId, id (+1 more)

### Community 43 - "naql_core.dart"
Cohesion: 0.05
Nodes (41): dart:math, library, naql_core, algiersHubs, calculateDistanceKm, distanceBetweenHubs, estimateDurationMinutes, estimateFareForRoute (+33 more)

### Community 44 - "CockpitHomeScreen"
Cohesion: 0.40
Nodes (6): CockpitHomeScreen, _CockpitHomeScreenState, RiderHomeScreen, _RiderHomeScreenState, State, StatefulWidget

### Community 45 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, outputDirectory, rewrites

### Community 46 - "Flutter"
Cohesion: 0.08
Nodes (21): Flutter, FlutterAppDelegate, FlutterImplicitEngineDelegate, FlutterSceneDelegate, AppDelegate, Any, Bool, FlutterImplicitEngineBridge (+13 more)

### Community 47 - "StatelessWidget"
Cohesion: 0.50
Nodes (4): DriverCockpitApp, QuittanceQrWidget, RiderApp, StatelessWidget

### Community 52 - "taximeter_quittance.dart"
Cohesion: 0.07
Nodes (27): agrementNumber, _computeVerificationHash, destinationName, distanceKm, driverName, durationMinutes, fareHorokilometriqueDzd, fraisApprocheDzd (+19 more)

### Community 53 - "supabase_service.dart"
Cohesion: 0.09
Nodes (22): Client, Map, anonKey, baseUrl, bytes, _client, defaultAnonKey, defaultBaseUrl (+14 more)

### Community 54 - "driver_shift.dart"
Cohesion: 0.11
Nodes (17): bool get, approachFeesDzd, commissionDeductionDzd, completedTrips, copyWith, driverId, endedAt, grossMeterEarningsDzd (+9 more)

### Community 55 - "quittance_qr_widget.dart"
Cohesion: 0.12
Nodes (16): Color, CustomPainter, List, backgroundColor, build, data, foregroundColor, _generateMatrix (+8 more)

### Community 56 - "trip_history_item.dart"
Cohesion: 0.12
Nodes (16): geo_hub.dart, agrementNumber, date, destination, distanceKm, driverName, fareDzd, id (+8 more)

### Community 57 - "spare_change_engine.dart"
Cohesion: 0.14
Nodes (13): LedgerEntry, cashReturnedDzd, changeDueDzd, digitalCreditDzd, fareDzd, ledgerEntry, rideId, settle (+5 more)

### Community 58 - "wWinMain"
Cohesion: 0.23
Nodes (9): _In_, _In_opt_, wWinMain(), string, vector, wchar_t, CreateAndAttachConsole(), GetCommandLineArguments() (+1 more)

### Community 59 - "dashcam_incident.dart"
Cohesion: 0.17
Nodes (11): driverId, encryptionKeyId, id, peakGForce, rideId, shamirSharesCount, speedKmh, status (+3 more)

### Community 60 - "wWinMain"
Cohesion: 0.23
Nodes (9): _In_, _In_opt_, wWinMain(), string, vector, wchar_t, CreateAndAttachConsole(), GetCommandLineArguments() (+1 more)

### Community 61 - "driver_app/web/manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 62 - "audio_haptic_service.dart"
Cohesion: 0.18
Nodes (10): AudioHapticService, isAudioEnabled, isHapticEnabled, onCrashLockboxTriggered, onDriverArrived, onRideDispatched, onSelectionClick, onSpareChangeCredited (+2 more)

### Community 63 - "rider_app/web/manifest.json"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 65 - "ledger_entry.dart"
Cohesion: 0.20
Nodes (9): amountDzd, creditAccount, debitAccount, description, entryType, id, rideId, timestamp (+1 more)

### Community 66 - "RideState"
Cohesion: 0.20
Nodes (10): RideCancelled, RideCompleted, RideDriverArrived, RideDriverAssigned, RideFareEntry, RideIdle, RideInProgress, RideRequested (+2 more)

### Community 67 - "ride_rating.dart"
Cohesion: 0.22
Nodes (8): DateTime, cleanlinessRating, comment, ratedAt, respectedTaximeter, rideId, safeDrivingRating, stars

### Community 68 - "geo_hub.dart"
Cohesion: 0.22
Nodes (8): commune, GeoHub, id, lat, lng, localizedName, nameAr, nameFr

### Community 69 - "route_maneuver.dart"
Cohesion: 0.22
Nodes (8): distanceMeters, instructionAr, instructionFr, localizedInstruction, ManeuverType, roadName, speedLimitKmh, package:meta/meta.dart

### Community 70 - "@immutable"
Cohesion: 0.29
Nodes (7): @immutable, DashcamIncident, DriverProfile, DriverShift, LedgerEntry, RideRating, RouteManeuver

### Community 71 - "AiCopilotModal.tsx"
Cohesion: 0.50
Nodes (4): AiCopilotModal(), AiCopilotModalProps, AiCopilotMessage, queryAiCopilot()

## Knowledge Gaps
- **633 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+628 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SupabaseService` connect `supabase_service.dart` to `rider_app/lib/main.dart`, `driver_app/lib/main.dart`, `offline_sync_queue.dart`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `RideState` connect `RideState` to `rider_app/lib/main.dart`, `driver_app/lib/main.dart`, `ride_state.dart`, `@immutable`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `GeoHub` connect `geo_hub.dart` to `trip_history_item.dart`, `rider_app/lib/main.dart`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _633 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Algeria Smart Taxi & Mobility Platform` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `Technical Requirements Document (TRD)` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Product Requirements Document (PRD)` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._