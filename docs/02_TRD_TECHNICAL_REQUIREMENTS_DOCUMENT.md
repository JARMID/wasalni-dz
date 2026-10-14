# Technical Requirements Document (TRD)
## Next-Generation Smart Taxi and Mobility Platform for Algeria

---

## 1. System Architecture Overview

The system employs an event-driven architecture designed for high geospatial throughput, low latency location streaming, and fault tolerance across fluctuating cellular networks. To comply with Algerian Law 18-07 and Law 25-11 on data sovereignty, all core backend components run on domestic Tier-3 cloud infrastructure within Algeria.

```
+---------------------------------------------------------------------------------------+
|                                    Client Tier                                        |
|  +---------------------------+  +--------------------------+  +--------------------+  |
|  |  Rider App (Flutter 3.x)  |  | Driver App (Flutter 3.x) |  | Web Dispatch Portal|  |
|  |  - iOS & Android          |  | - 720p@15fps Dashcam     |  | - Next.js 15 / R19 |  |
|  |  - TrustDesk Wallet Module|  | - Thermal Load Shedder   |  | - Realtime Fleet   |  |
|  |  - MapLibre GL Native     |  | - Drift Offline Queue    |  | - Law 25-11 Desk   |  |
|  +-------------+-------------+  +------------+-------------+  +---------+----------+  |
+----------------|-----------------------------|--------------------------|-------------+
                 |                             |                          |
                 +----------------------+      | (1Hz gRPC / WebSockets)  |
                                        |      |                          |
+---------------------------------------v------v--------------------------v-------------+
|                     Edge & High-Throughput Routing Tier (Go)                          |
|  +---------------------------------------------------------------------------------+  |
|  | Go Geospatial Ingestion Engine & Routing Service (Valhalla / OSRM)              |  |
|  | - Ingests live 1Hz driver telemetry into in-memory H3 / Valkey Geo index        |  |
|  | - Sub-15ms road distance matrix & proximity matching without database writes    |  |
|  | - Fan-out live driver coordinates to subscribed riders via lightweight WS       |  |
|  | - Batches compressed trajectories (LINESTRINGM) to PostGIS every 30-60 seconds   |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------+-----------------------------------------------+
                                        |
     +----------------------------------+----------------------------------+
     |                                  |                                  |
+----v--------------------+   +---------v---------------+   +--------------v------------+
| Self-Hosted Supabase    |   | Sovereign Storage Tier  |   | Automation Tier (Windmill)|
| (Algerian Tier-3 Cloud) |   | (Local MinIO Cluster)   |   | - Driver Document OCR     |
| - PostgreSQL 16         |   | - AES-256 Incident Lock |   | - Chargily Reconciliations|
| - PostGIS & H3 Index    |   | - S3-Compatible API     |   | - Fleet BaridiMob Audits  |
| - State Transition Logs |   | - Zero Cross-Border Flow|   | - ANPDP Law 25-11 Reports |
| - Supabase Auth (JWT)   |   +-------------------------+   +---------------------------+
+-------------------------+
```

---

## 2. Technology Stack Selection and Rationale

### 2.1 Mobile Application Tier: Flutter 3.x with Dart 3
- **Evaluation vs. Native Swift/Kotlin**:
  - Building two separate native codebases (Swift for iOS, Kotlin for Android) doubles development overhead and introduces feature parity drift.
  - In Algeria, Android accounts for over 88% of the smartphone market. Maintaining a unified Flutter codebase allows rapid engineering iterations while maintaining native 60fps and 120fps rendering performance through the Impeller engine.
  - Specialized hardware features (hardware MediaCodec video encoding, thermal state listeners, accelerometer sensors, background GPS location) connect via Flutter Platform Channels (`MethodChannel` and `EventChannel`).
- **State Management & Architecture**:
  - Riverpod 2.x with code generation (`riverpod_generator`) for compile-time safe, testable state management.
  - Clean Architecture separating Domain, Data (Drift SQLite local cache, Dio HTTP client), and Presentation layers.
  - Native integration with the **TrustDesk** digital wallet library, providing production-tested biometric authentication gates, localized currency formatters, and balance state synchronizers.

### 2.2 Core Backend and Database Tier: Self-Hosted Supabase on Algerian Infrastructure
- **Data Sovereignty Compliance**:
  - In accordance with Law 18-07 and Law 25-11, the platform deploys self-hosted Supabase using Docker and Kubernetes directly on domestic Algerian Tier-3 data centers (such as Algérie Télécom, ICOSNET, or ISSAL).
  - Foreign cloud clusters (such as AWS, Google Cloud, or Azure foreign regions) are strictly avoided to eliminate illegal cross-border data transfer violations.
- **Database Engine**: PostgreSQL 16 with native extensions:
  - `postgis`: Spatial indexing, geodesic distance computations, and boundary containment checks.
  - `h3` / `pg_h3`: Hexagonal hierarchical spatial indexing for driver clustering and demand aggregation.
  - `pgcrypto`: Cryptographic hashing and UUIDv4 generation.
- **Decoupled Telemetry Pipeline**:
  - To prevent PostgreSQL Write-Ahead Log (WAL) bloat and MVCC tuple churn from high-frequency coordinate updates (such as 3,000 pings/second from active drivers), 1Hz live telemetry is stripped from the database write path.
  - The Go Geospatial Engine ingests 1Hz pings directly into an in-memory spatial index. PostgreSQL receives writes only on trip state changes (REQUESTED, ACCEPTED, PICKED_UP, COMPLETED) or as periodic trajectory batches (`LINESTRINGM` with timestamps) flushed every 60 seconds.
- **Local MinIO Object Storage**:
  - Deployed in high-availability mode on domestic servers, providing S3-compatible signed URL access controls for identity verification documents (*livret de place*, identity card, insurance policy) and encrypted dashcam incident video footage.

### 2.3 High-Performance Geospatial Routing Engine: Dedicated Go Service
- Standard database queries are inefficient for complex routing matrices (calculating travel times for 50 candidate drivers to a pickup point).
- The platform operates a dedicated, stateless routing microservice written in Go wrapping an optimized OpenStreetMap (OSM) routing engine (OSRM or Valhalla) and an in-memory H3 spatial index.
- Generates turn-by-turn directions, snappable polylines, and distance matrices in under 15 milliseconds per calculation without external commercial mapping API fees.

### 2.4 Administrative and Dispatch Portal: Next.js 15 and React 19
- Built with React 19, Tailwind CSS, MapLibre GL, and Zustand for state management.
- Provides real-time fleet map rendering, emergency SOS alerts, document audit workflows, and Law 25-11 compliance dashboards.

### 2.5 Automation and Background Processing: Windmill
- Self-hosted Windmill execution cluster handles asynchronous, multi-step workflows:
  - Triggering OCR analysis on newly uploaded driver permits and taximeter drop-off photos.
  - Daily reconciliation runs between platform ledger balances, Chargily Pay settlements, and driver cash reports.
  - Asynchronous audit of high-value fleet BaridiMob RIP transfers.
  - Automated generation of the Law 25-11 data processing registry and breach notification escalations.

---

## 3. Geospatial Processing and Matching Architecture

### 3.1 Hexagonal Spatial Indexing (H3)
Algerian urban layouts feature non-grid road structures with heavy bottlenecks (such as Algiers' tunnel exits, port bypasses, and coastal corniche roads). Traditional bounding box coordinate queries (`ST_DWithin`) degrade in performance at scale.

```
           [ Resolution 8 H3 Hexagon ]
                  /\
                 /  \
                /    \
               |  *   |  <-- Driver A (Lat/Lng)
               |      |
                \    /   <-- Rider (Lat/Lng)
                 \  /
                  \/
```

- Every driver coordinate ping is converted into an H3 Resolution 8 index (average hexagon area: 0.737 square kilometers, edge length: ~461 meters).
- When a rider requests a pickup:
  1. The pickup coordinate is mapped to its H3 index cell.
  2. The system queries drivers in the origin cell and immediate concentric rings (k-ring distance = 1 to 3).
  3. The top 5 nearest drivers by linear distance are sent to the Go routing engine to evaluate real road driving duration.
  4. The ride dispatch event is sent to the nearest driver.

### 3.2 Vector Maps and Tile Serving
- Commercial mapping services (such as Google Maps Platform) charge substantial per-request fees that prove economically unviable for high-volume taxi operations in emerging markets.
- The platform uses MapLibre Native SDK on mobile clients with vector tiles rendered from OpenStreetMap datasets tailored for Algerian wilayas. Offline tile packages for key metropolitan areas (Algiers, Oran, Constantine, Annaba, Setif) are cached on driver devices to preserve operational continuity during connectivity dropouts.

---

## 4. Dashcam and Telematics Subsystem Architecture

### 4.1 Subsystem Placement Decision
The dashcam subsystem is fully integrated into the driver client software rather than deployed as an isolated product. This integration ensures that video footage is directly linked to trip IDs, passenger records, GPS breadcrumb trails, and accelerometer readings.

```
+-----------------------------------------------------------------------------------+
|                        Driver Mobile Device Hardware                              |
|                                                                                   |
|  [ Camera Hardware ]         [ Accelerometer / IMU ]       [ GNSS / GPS Engine ]  |
|         |                              |                             |            |
|         v                              v                             v            |
|  CameraX / AVFoundation        SensorsPlus (50Hz)             Geolocator (1Hz)    |
|         |                              |                             |            |
|  Rolling Circular Buffer       Kalman Shock Filter            Location Buffer     |
|  (3x 60s Video Chunks)         (Threshold > 2.5G)             (Coords + Bearing)  |
|         |                              |                             |            |
+---------|------------------------------|-----------------------------|------------+
          |                              |                             |
          +-----------------------+      |      +----------------------+
                                  |      |      |
                        +---------v------v------v---------+
                        |     Incident Trigger Logic      |
                        |     - G-Shock > 2.5G            |
                        |     - Hard Deceleration         |
                        |     - SOS Button Pressed        |
                        |     - Route Deviation Alert     |
                        +----------------+----------------+
                                         |
                                         v
                        +---------------------------------+
                        |  Evidence Packaging Service     |
                        |  1. Lock 60s pre + 30s post     |
                        |  2. Burn GPS/Speed Watermark    |
                        |  3. Compute SHA-256 Hash        |
                        |  4. Encrypt with AES-256-GCM    |
                        +----------------+----------------+
                                         |
                                         v (HTTPS S3 Multipart Upload)
                        +---------------------------------+
                        |  Supabase Storage Lockbox       |
                        +---------------------------------+
```

### 4.2 Technical Execution Rules
1. **Camera Resource Optimization and Thermal Budget**:
   - In Algerian summer conditions (cockpit glass temperatures reaching 40°C to 48°C), 1080p recording induces rapid thermal throttling and OS process kills on budget Android SoCs.
   - Resolution: Capped strictly at 720p (1280x720) at 15 fps.
   - Encoding pipeline: Hardware-accelerated H.264/HEVC using Android `MediaCodec` surface input (and iOS `AVCaptureMovieFileOutput`), writing directly to a pre-allocated 3x 60-second file buffer without CPU frame copying.
   - Dynamic Thermal Load Shedding:
     - The mobile client subscribes to Android's `PowerManager.OnThermalStatusChangedListener` and iOS `ProcessInfo.thermalState`.
     - At `THERMAL_STATUS_MODERATE`: MapLibre rendering drops from 60fps to 25fps and the dashcam HUD preview is dimmed.
     - At `THERMAL_STATUS_SEVERE`: The dashcam video capture is gracefully paused, while high-priority GPS location, IMU crash detection, and dispatch channels remain fully active.
2. **Sensor Fusion**:
   - Accelerometer and gyroscope data are sampled continuously at 50Hz via native event listeners.
   - A Kalman filter eliminates road vibrations, engine hum, and minor potholes.
   - When net acceleration exceeds 2.5G along any horizontal axis (indicating collision or heavy emergency braking), an incident event is raised.
3. **Evidence Integrity and Watermarking**:
   - Every incident video is stamped with an immutable digital overlay containing: timestamp (UTC+1), driver license number, trip UUID, GPS coordinates, and vehicle speed.
   - A SHA-256 cryptographic checksum is calculated immediately upon chunk finalization. This hash is written to the database ledger to verify that footage submitted to insurers or transport authorities has not been altered.

---

## 5. Offline Data Synchronization and Resilience

### 5.1 On-Device Storage (Drift SQLite) and Low-Connectivity Fallbacks
The mobile client contains a local SQLite relational store managed through Drift:
- **Cached Tables**: Active trip record, scheduled waypoints, offline tariff configurations, driver profile, and pending telemetry pings.
- **Offline Meter Functionality**: If mobile data connection is severed during an active trip:
  - The driver app relies on hardware GPS NMEA sentences to calculate distance covered.
  - The fare accumulates based on cached tariff variables.
  - Telemetry pings are staged into an on-device queue.
  - Upon reconnection, pending records are flushed to the backend using an idempotent batch endpoint.
- **Low-Connectivity SMS/USSD Fallback**:
  - Inter-wilaya corridors (such as the Chiffa gorges or highlands) regularly experience 3G/EDGE drops where WebSockets and HTTPS connections fail.
  - For critical trip state transitions (such as completing an inter-wilaya trip), the mobile app features an automated SMS fallback gateway. An encrypted, base64-encoded SMS payload containing trip UUID, final GPS coordinates, completion timestamp, and client signature is dispatched to the platform telecom gateway, ensuring trips are never trapped in an unclosable state.

### 5.2 Idempotency and State Synchronization
- Every state-altering HTTP request (initiating a trip, completing a trip, recording a payment) carries an `X-Idempotency-Key` header with a client-generated UUIDv4.
- If a dropped TCP connection triggers an automatic retry, the backend detects the duplicate key and returns the cached result without repeating the mutation or billing the rider twice.

---

## 6. Financial Architecture, TrustDesk Wallet, and Payment Processing

```
+-----------------------------------------------------------------------------------+
|               Double-Entry Ledger Engine (Powered by TrustDesk)                   |
+-----------------------------------------------------------------------------------+
|  Accounts Involved:                                                               |
|  - 1010: Cash In Transit (Driver Pocket)                                          |
|  - 1020: Digital Escrow (Chargily Pay CIB/Edahabia)                               |
|  - 2010: Rider TrustDesk Wallet Balance (Customer Liability)                      |
|  - 2020: Driver Operating Balance (Driver Payable)                                |
|  - 4010: Platform Commission Revenue (CNRC 604103 Booking Fee)                    |
|  - 5010: Transaction Gateway Processing Fees                                      |
+-----------------------------------------------------------------------------------+
```

### 6.1 Transaction Life Cycle
1. **Cash Payment Mode**:
   - Rider pays the driver in cash based on the physical taximeter plus the regulated booking fee.
   - Driver confirms payment received.
   - In-app digital change reconciliation: If the rider lacks small change (such as paying 1,000 DZD for an 850 DZD fare), the driver enters the tendered amount. The 150 DZD change is credited immediately to the rider's TrustDesk digital wallet balance and debited from the driver's operating balance.
   - Platform commission (10%) is deducted automatically from the driver's wallet.
2. **Digital Payment Mode (Chargily Pay V2)**:
   - Rider pays via CIB or Edahabia card through the official `chargily-pay-dart` Flutter SDK.
   - Upon successful card debit, Chargily fires a cryptographically signed HMAC-SHA256 webhook to the self-hosted Supabase Edge Function.
   - The edge function credits the platform escrow account, transfers 90% of the fare to the driver digital balance, and records the platform booking fee.
3. **Driver Wallet Top-Up Rails**:
   - **Primary Zero-Touch Rail**: Drivers top up their operational balance instantly using their personal CIB or Edahabia card directly inside the Driver App via the official `chargily-pay-dart` SDK. Balance is credited instantly with zero human intervention.
   - **High-Value Fleet Deposit Rail**: Large transport cooperatives depositing substantial balances (exceeding 50,000 DZD) can initiate bank/CCP transfers or BaridiMob RIP transfers to the platform corporate account. The transfer receipt is scanned in-app, verified via a Windmill automated OCR worker, and passed to manual treasury approval before crediting the fleet account.

---

## 7. Security, Access Control, and Telemetry Encryption

### 7.1 Row Level Security (RLS) Model
All tables in the Supabase PostgreSQL database enforce strict Row Level Security.
- Riders can only query their own trip records and active drivers assigned to their pending or confirmed rides.
- Drivers can view only rides assigned to them and incoming bidding broadcasts within their geographic zone.
- Telematics and dashcam video records are strictly inaccessible to public API keys. Access is gated by administrative role policies verified against custom JWT claims.

### 7.2 Cryptographic Envelope for Video Footage
- Video chunks flagged during emergencies are encrypted on the driver device using AES-256-GCM before transport.
- The decryption key is generated per incident, encrypted with the platform's public RSA master key, and transmitted over an authenticated TLS 1.3 channel.
- Even if a driver device is physically seized, raw incident footage cannot be extracted or deleted from the device cache once locked.
