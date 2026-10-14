# Implementation Plan and Technical Roadmap
## Next-Generation Smart Taxi and Mobility Platform for Algeria

---

## 1. Phased Engineering Roadmap

The platform rollout spans twenty weeks organized into five four-week development milestones.

```
+-----------------------------------------------------------------------------------+
| Weeks 1-4   : Phase 1 - Architecture, Database, & Regulatory Onboarding           |
| Weeks 5-8   : Phase 2 - Geospatial Engine, Dispatch Radar, & Mobile Foundations    |
| Weeks 9-12  : Phase 3 - Native Dashcam Subsystem, Telematics, & Safety Desk       |
| Weeks 13-16 : Phase 4 - Algerian Payment Rails & Closed Pilot (Algiers/Oran)       |
| Weeks 17-20 : Phase 5 - Inter-Wilaya Bidding, Fleet Console, & National Scale      |
+-----------------------------------------------------------------------------------+
```

### Phase 1: Architecture, Database, and Regulatory Onboarding (Weeks 1 to 4)
- Deploy Self-Hosted Supabase cluster (PostgreSQL 16 with `postgis`, `pgcrypto`, and H3 extensions) and local MinIO object storage on domestic Algerian Tier-3 cloud infrastructure (Algérie Télécom, ICOSNET, or ISSAL).
- Apply full relational DDL schema with strict Row Level Security (RLS) policies and collective multi-seat ledger tables.
- Establish the Law 25-11 data compliance foundation: generate the Data Protection Impact Assessment (AIPD) and processing registry for ANPDP filing.
- Build driver document upload and validation workflows on the Next.js compliance web portal.
- Integrate initial document OCR scanner to verify *Agrément de Taxi*, *Livret de Place*, and *Contrôle Technique*.

### Phase 2: Geospatial Engine, Dispatch Radar, and Mobile Foundations (Weeks 5 to 8)
- Deploy the dedicated Go routing microservice with a customized OpenStreetMap (OSM) Algerian road network image and in-memory H3 spatial index.
- Decouple 1Hz live telemetry: Stream coordinate pings directly to the Go engine via gRPC/WebSockets, caching hot-path positions in memory and flushing compressed `LINESTRINGM` polylines to PostgreSQL every 60 seconds.
- Develop the core Flutter 3 mobile shell for Rider and Driver profiles using Riverpod 2.x and MapLibre GL Native.
- Ingest the **TrustDesk** digital wallet module into the client apps for balance management and biometric authentication gates.
- Implement the 15-second driver dispatch notification and accept/reject state machine.

### Phase 3: Native Dashcam Subsystem, Telematics, and Safety Desk (Weeks 9 to 12)
- Build native Android (CameraX/MediaCodec) and iOS (AVFoundation) Flutter platform channels for hardware-accelerated 720p @ 15fps background recording.
- Implement the rolling circular buffer (3x 60-second chunks, 60MB max cache) with pre-allocated file blocks.
- Integrate automated thermal load shedding via Android `PowerManager.OnThermalStatusChangedListener` and iOS `ProcessInfo.thermalState` (drop MapLibre to 25fps at MODERATE, pause camera while preserving GPS/IMU at SEVERE).
- Develop the 50Hz accelerometer sensor fusion module with Kalman filtering to detect sudden deceleration exceeding 2.5G.
- Create the video lockbox packaging service: GPS watermark burn-in, SHA-256 cryptographic hashing, and MinIO multipart upload.
- Construct the Real-time Safety Operations Desk in the Next.js web portal with high-priority audio alarms and live telemetry mapping.

### Phase 4: Algerian Payment Rails and Closed Pilot (Weeks 13 to 16)
- Integrate the official `chargily-pay-dart` Flutter SDK and Go SDK for zero-touch in-app CIB and Edahabia card payments and driver wallet top-ups.
- Build the double-entry accounting ledger engine (`wallets`, `ledger_entries`, `payments_chargily`) to eliminate floating-point drift and prevent phantom balances.
- Implement cash collection workflows with in-app digital change reconciliation crediting the rider's TrustDesk wallet balance.
- Deploy Windmill automation jobs for automated BaridiMob RIP receipt verification for high-value fleet deposits.
- Deploy an automated SMS/USSD fallback gateway to ensure trip state completion across dead zones.
- Launch a closed commercial pilot with 100 licensed yellow taxi drivers in Algiers (covering Bab Ezzouar, Kouba, Hydra, and downtown Algiers).

### Phase 5: Collective Taxi Modes, Fleet Console, and National Scale (Weeks 17 to 20)
- Launch the multi-passenger seat-ledger state machine for Mode 2 (Urban Collective Taxi) and Mode 3 (Inter-Wilaya Collective Taxi per seat).
- Build the Multi-Vehicle Fleet Management Console for transport agencies and taxi cooperatives.
- Finalize legal certifications with the National Personal Data Protection Authority (ANPDP) under Law 18-07 and Law 25-11.
- Expand platform onboarding to licensed taxi drivers across major wilayas.

---

## 2. Technology Stack and Infrastructure Matrix

```
+--------------------+--------------------------------+-------------------------------------+
| Domain             | Technology Selected            | Architectural Purpose               |
+--------------------+--------------------------------+-------------------------------------+
| Primary Database   | Self-Hosted Supabase (PG 16)   | PostGIS, RLS, Local Algerian Cloud  |
| Object Storage     | Local MinIO Cluster (S3 API)   | Encrypted dashcam clips, KYC files  |
| Edge Serverless    | Supabase Edge Functions (Deno) | Webhook processing, FCM relays      |
| Telemetry & Routing| Go Service (Valhalla / OSRM)   | 1Hz in-memory H3 ingest, matrices   |
| Mobile Clients     | Flutter 3.x with Dart 3        | Unified iOS & Android cross-platform|
| Mobile State       | Riverpod 2.x + Drift SQLite    | Compile-safe state & offline queue  |
| Mobile Wallet      | TrustDesk Fintech Engine       | Stored value, KYC, P2P settlements  |
| Mobile Mapping     | MapLibre GL Native             | Vector tiles with offline packages  |
| Native Bridges     | Flutter Platform Channels      | MediaCodec 720p@15fps, SensorsPlus  |
| Web Portals        | Next.js 15 & React 19          | Compliance, Dispatch, Fleet Console |
| Background Jobs    | Windmill (Self-Hosted)         | Asynchronous OCR, BaridiMob audits  |
| Payment Rails      | Chargily Pay V2 (Dart/Go SDK)  | National CIB, Edahabia instant rail |
| AI Verification    | NVIDIA NIM / Local ML Kit      | Document classification, plate OCR  |
+--------------------+--------------------------------+-------------------------------------+
```

---

## 3. Specialized Subagent and Team Allocation

To maintain technical standards across different components, work is decomposed into five specialized agent roles:

```
+-----------------------------------------------------------------------------------+
|                        Specialized Engineering Agents                             |
+-----------------------------------+-----------------------------------------------+
| Agent Role                        | Primary Deliverable                           |
+-----------------------------------+-----------------------------------------------+
| algeria-fintech-payments-engineer | Chargily Pay V2 Dart SDK, BaridiMob audits,   |
|                                   | TrustDesk wallet, and double-entry ledger.    |
|                                   |                                               |
| geospatial-telematics-architect   | Go routing microservice, PostGIS spatial RPC, |
|                                   | 1Hz in-memory H3 ingest, and trajectories.    |
|                                   |                                               |
| dashcam-edge-engineer             | Platform channels, 720p@15fps circular buffer,|
|                                   | thermal load shedding, and MinIO lockbox.     |
|                                   |                                               |
| flutter-mobile-engineer           | Riverpod 2 architecture, MapLibre navigation, |
|                                   | Drift offline caching, and SMS fallback.      |
|                                   |                                               |
| regulatory-compliance-lead        | DTW taxi license validation, Law 25-11 AIPD,  |
|                                   | ANPDP registry, and emergency protocols.      |
+-----------------------------------+-----------------------------------------------+
```

---

## 4. Risk Analysis and Mitigation Strategies

```
+-------------------------------+-----------------------+-----------------------------------+
| Identified Risk               | Impact & Likelihood   | Architectural Mitigation          |
+-------------------------------+-----------------------+-----------------------------------+
| Cellular network drops on     | High Impact           | Offline-first Drift SQLite store; |
| inter-urban highways          | High Likelihood       | hardware GPS meter operates       |
|                               |                       | independently; idempotent sync.   |
|                               |                       |                                   |
| In-cockpit smartphone thermal | High Impact           | Headless native SurfaceTexture;   |
| throttling during summer heat | Medium Likelihood     | 1080p H.264 capped at 4.5 Mbps;   |
|                               |                       | automatic duty cycle management.  |
|                               |                       |                                   |
| Resistance from traditional   | High Impact           | Platform exclusively serves       |
| taxi unions and syndicates    | Medium Likelihood     | licensed taxi drivers; protects   |
|                               |                       | their legal status; low 10% fee.  |
|                               |                       |                                   |
| Cash payment disputes and     | Medium Impact         | Digital excess change credited    |
| lack of small bank notes      | High Likelihood       | to passenger in-app wallet;       |
|                               |                       | upfront fare lock before pickup.  |
|                               |                       |                                   |
| Payment gateway downtime or   | Medium Impact         | Automatic fallback to cash;       |
| webhook processing delays     | Medium Likelihood     | idempotent reconciliation queue;  |
|                               |                       | manual review for delayed pings.  |
+-------------------------------+-----------------------+-----------------------------------+
```
