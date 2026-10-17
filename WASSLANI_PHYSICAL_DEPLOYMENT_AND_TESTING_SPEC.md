# WASSLANI Physical Deployment, Hardware & Testing Specification

> Master operational guide for physical procurement, in-vehicle hardware installation, cloud infrastructure, AI services, and field testing for WASSLANI (وصلني) in Greater Algiers.

---

## 1. Executive Architecture Summary

WASSLANI transitions from an in-browser demonstrator to a live transport network through five distinct layers:
1. **In-Vehicle Hardware:** Rugged Android tablets, optical CameraX dashcams, hardwired power regulators, and RS-232/USB serial bridges to ONML-approved horokilometric taximeters.
2. **Central Dispatch Station:** High-reliability operator workstation running dual-monitor H3 telematics, driver onboarding, and emergency escalations.
3. **Cloud & Database Infrastructure:** Production-grade Supabase instance, sovereign S3 storage for judicial video lockboxes, domain names, and local telecom SMS channels.
4. **AI & Machine Learning Services:** Voice transcription for Algerian Darija/French, vision OCR for physical receipts, and deterministic H3 spatial routing.
5. **Real-World Field Testing:** Step-by-step road verification protocol across Algiers expressways and DTW checkpoints.

```
[In-Car Cockpit Tablet]  <-- 4G LTE (Mobilis/Djezzy) -->  [Supabase Pro + Realtime]
         |                                                       |
   (RS-232 / USB)                                                +--> [Central Dispatch Station]
         v                                                       |
[ONML Taximeter]                                                 +--> [Sovereign Video S3 / MinIO]
         |                                                       |
   (ESC/POS BT)                                                  +--> [Groq LPU / Whisper AI]
         v                                                       |
[Thermal Quittance Printer]                                      +--> [Chargily Pay / BaridiMob]
```

---

## 2. In-Vehicle Hardware Bill of Materials (Per Taxi Cab)

Each participating vehicle requires a standardized hardware kit to comply with Algerian Executive Decree 12-230 and Law 25-11.

| Component | Technical Specification | Recommended Model | Estimated Unit Cost (DZD) | Rationale & Requirements |
| :--- | :--- | :--- | :--- | :--- |
| **Cockpit Tablet** | 8.0" to 10.4" Android 12+, 4GB RAM, 64GB Storage, 4G LTE SIM slot, GPS + GLONASS, CameraX support (f/2.0 or wider, 1080p). | Samsung Galaxy Tab Active3 LTE / Lenovo Tab M10 Plus LTE Gen 3 | 32,000 to 52,000 DZD | High thermal tolerance for Algiers summer heat; must sustain continuous GPS tracking and 30-second optical ring buffer without overheating. |
| **Mounting Rig** | Commercial dashboard bolt mount or heavy-duty locking suction arm with 360-degree ball joint. | RAM Mounts composite arm or Joyroom magnetic mechanical locking mount | 4,500 to 8,000 DZD | Prevents vibration artifacts on CameraX optical sensor; ensures camera field of view captures roadway and partial cockpit. |
| **Power Regulator** | Hardwired 12V-to-5V step-down buck converter (3A / 15W minimum) connected to vehicle ACC fuse line, or heavy-duty dual USB-PD 30W adapter. | Baseus 65W car charger or hardwired Anker 12V fuse tap kit | 2,500 to 4,500 DZD | Cigarette lighter sockets often disconnect over rough cobblestones; hardwired ACC connection turns the tablet on/off with vehicle ignition. |
| **Taximeter Bridge Cable** | RS-232 DB9 Female to USB-C OTG cable with FTDI / Prolific chipset. | FTDI Chip USB-RS232-WE or UGREEN USB to DB9 RS-232 adapter | 3,200 to 5,500 DZD | Reads real-time flag drop and kilometer pulses directly from ONML-certified meters (SEMIT, Digitax, Kienzle). |
| **Thermal Quittance Printer** | 58mm mobile Bluetooth thermal printer, ESC/POS compatible, 1500mAh rechargeable battery. | Xprinter XP-58IIH or Netum 58mm Bluetooth Mini | 7,500 to 11,000 DZD | Prints official paper quittances with SHA-256 QR code for passengers who do not use smartphones. |
| **Telecom 4G Data SIM** | Postpaid or prepaid corporate 4G SIM with static IP or pooled data. | Mobilis PixX Pro, Djezzy Business, or Ooredoo Sahla Box | 1,500 to 2,500 DZD/month | Consumes 8 to 15 GB/month per cab for real-time WebSocket telemetry, maps, and ride updates. |

### In-Car Assembly Protocol
1. Secure the mounting rig to the dashboard center console, angled toward the driver while keeping the camera lens unobstructed through the windshield.
2. Route the USB power cable behind the dashboard trim to the vehicle fuse box, tapping into the ACC line with a 5A inline fuse.
3. Connect the RS-232 serial cable to the diagnostic port of the vehicle's horokilometric taximeter and plug the USB-C adapter into the tablet.
4. Pair the Bluetooth thermal printer and test a 58mm sample quittance containing the DTW accreditation number.

---

## 3. Central Dispatch Workstation & Physical Server Requirements

### Do You Need a Separate PC?
**Yes, for live dispatch operations and local data governance.**
While the software runs on cloud servers, managing a fleet of vehicles in Algiers requires a dedicated physical workstation in your central operations office. Additionally, if you plan to store driver video archives locally to satisfy national data sovereignty regulations (Law 18-07 and Law 25-11), you will benefit from an on-premise storage and inference node.

### Workstation Tier 1: Fleet Operations & Dispatch Console (Mandatory for Office)
This machine acts as the nerve center for dispatchers monitoring the Algiers 57 Communes live map, handling driver disputes, and communicating with DTW regulators.

* **Form Factor:** Compact desktop workstation or high-performance mini-PC.
* **Processor:** Intel Core i5 (13th or 14th Gen) or AMD Ryzen 7 7700 (8 cores, 16 threads).
* **Memory:** 32 GB DDR5 RAM (to maintain multiple real-time browser sessions, Leaflet GIS maps, and database admin panels).
* **Storage:** 1 TB NVMe M.2 Gen4 SSD (minimum 5,000 MB/s read speed).
* **Display Configuration:** Dual 27-inch 1440p (QHD) IPS monitors. Screen 1 displays the H3 hex-grid telematics radar; Screen 2 displays the live driver queue, quittance audit log, and passenger support tickets.
* **Network Interface:** Gigabit Ethernet (RJ-45) hardwired to an Algérie Télécom Fibre (Idoom Fibre) connection.
* **Power Protection:** Uninterruptible Power Supply (UPS / Onduleur) 1000VA to 1500VA (APC Back-UPS or Eaton 5E). Electrical stability is critical in Algiers to prevent session termination during grid flickers.
* **Estimated Hardware Budget:** 180,000 to 240,000 DZD.

### Workstation Tier 2: Dedicated Local Sovereign Storage & AI Node (Recommended for Law 18-07/25-11 Compliance)
If regulatory authorities mandate that accident black box video archives and financial transaction logs remain physically on Algerian soil rather than in overseas datacenters, you can run an on-premise local server:

* **Processor:** AMD Ryzen 9 7900X or Intel Core i7-14700K.
* **Graphics Card (GPU):** NVIDIA GeForce RTX 4070 Ti Super (16 GB VRAM) or RTX 4080 (16 GB VRAM). Required for running local Whisper large-v3 speech models (voice notes) and local vision OCR without recurring cloud API fees.
* **Memory:** 64 GB DDR5 RAM.
* **Storage Array:** 2x 4 TB SATA Enterprise HDDs in RAID 1 (Mirrored) for encrypted video storage + 1 TB NVMe for operating system.
* **Backup:** External LTO tape drive or offline NAS encrypted with VeraCrypt.
* **Estimated Hardware Budget:** 380,000 to 480,000 DZD.

---

## 4. Cloud Infrastructure, SaaS Accounts & Monthly Services

To launch the platform beyond the free tier, configure the following accounts and subscriptions:

| Service Provider | Tier / Plan | Monthly Cost (USD / DZD) | Function & Necessity |
| :--- | :--- | :--- | :--- |
| **Supabase** | Pro Plan | $25/month (~5,500 DZD) | **Mandatory.** Unlocks automated daily backups, Point-in-Time Recovery (PITR), 8 GB database storage, 100 GB asset storage, 50,000 monthly active users, and eliminates project pause timers. Essential for real-time WebSocket vehicle telematics. |
| **Vercel / Sovereign VPS** | Vercel Pro or OVH/Local VPS | $20/month (~4,400 DZD) or local hosting | Hosts the web application, dispatcher portal, public verification console, and REST/RPC API endpoints. |
| **Domain Registration** | Sovereign `.dz` Domain | ~2,500 DZD/year | Register `wasslani.dz` through NIC.dz / CERIST. Official transport platforms in Algeria must operate under a sovereign `.dz` top-level domain for trust and institutional integration. |
| **Map Tile Provider** | Protomaps / MapLibre self-hosted or Mapbox Pay-as-you-go | $0 to $30/month | Renders Greater Algiers street maps without incurring high per-request Google Maps billing. |
| **SMS Gateway** | Local A2P SMS Provider | ~3.50 to 5.00 DZD per SMS | Dispatches rider phone number verification OTPs and sends parent safety SMS links. Can be sourced via Mobilis, Djezzy, or regional aggregators like SMS Algeria. |
| **App Store Licenses** | Google Play & Apple Developer | $25 one-time (Google) + $99/year (Apple) | Required to distribute the production Rider and Driver APKs/IPAs through official smartphone stores. |

---

## 5. AI Engines & Machine Learning Integration

WASSLANI does not need heavy general-purpose chatbots. It requires three focused, task-specific artificial intelligence models:

### 1. Voice Note Transcription (Darija & Algerian French)
* **Use Case:** Drivers operating in dense Algiers traffic cannot type. They communicate pickup obstacles or customer cancellations via voice notes.
* **Engine:** OpenAI Whisper large-v3 or Whisper-turbo.
* **Deployment Options:**
  - *Cloud Option (Ultra Fast):* Groq LPU API running `whisper-large-v3-turbo` at under 250 milliseconds per request (cost: fractions of a cent per minute).
  - *Sovereign Local Option:* Run `faster-whisper` on your local central station GPU (NVIDIA RTX 4070).
* **Vocabulary Adaptation:** Inject a custom dictionary containing Algiers communes, landmarks, and street names (e.g., *Grande Poste, Bab Ezzouar, Kouba, Ain Naadja, Chevalley, Rocade Nord, trémie*).

### 2. Vision OCR for Paper Receipts & DTW Cards
* **Use Case:** Processing physical BaridiMob transaction slips, fuel receipts, and DTW Livret de Place inspection permits.
* **Engine:** Llama 3.2 11B Vision or NVIDIA Nemotron-parse.
* **Deployment:** Executed via cloud inference or local PyTorch worker to extract the CCP transaction reference, timestamp, and amount, checking against the Modulo 97 algorithm.

### 3. Algorithmic Spatial Dispatch Engine (Deterministic AI)
* **Use Case:** Matching the nearest qualified taxi to a passenger while respecting Algiers topography, one-way alleys, and highway interchanges.
* **Engine:** Uber H3 Hexagonal Hierarchical Spatial Index (Resolution 8 for neighborhood clustering, Resolution 9 for street level) coupled with an Open Source Routing Machine (OSRM) engine running Algiers road network data with a 1.34x winding factor.
* **Cost:** $0 (runs purely on CPU within your Node.js or Dart microservices).

---

## 6. Financial Rails & Payment Gateway Setup

To handle fare splitting and driver payouts legally:

1. **Chargily Pay V2 (CIB & EDAHABIA):**
   - Register a business account at `chargily.com`.
   - Submit your Registre de Commerce (RC), NIF, NIS, and bank RIB.
   - Configure webhook endpoints with raw-buffer HMAC-SHA256 signature verification in your backend.
   - Enables passenger in-app card payments.

2. **Algérie Poste BaridiMob Agreement:**
   - Establish an institutional merchant agreement with Algérie Poste for enterprise RIP accounts.
   - Enables automated CCP batch transfers for the 88% driver fare settlements and instant digital change restitution.

3. **Double-Entry General Ledger:**
   - Ledger accounts already configured in Supabase:
     - `1010` (Cash in Vault / CIB Transit)
     - `2010` (Driver Payables)
     - `2020` (Passenger Pre-funded Wallets)
     - `4010` (WASSLANI Platform Commission: 8% to 12%)
     - `5010` (ANPDP Regulatory Audit Reserve)

---

## 7. Step-by-Step Real-World Testing Protocol

Execute testing in five sequential stages before boarding paying passengers:

```
[Phase 1: Bench Test]  -->  [Phase 2: Single-Car Road Test]  -->  [Phase 3: Crash Sensor Calibration]
                                                                        |
[Phase 5: DTW Roadside Audit]  <--  [Phase 4: 5-Car Pilot Fleet]  <----+
```

### Phase 1: Bench & Laboratory Simulation (Day 1 to 3)
* Connect the Android tablet to a bench 12V power supply.
* Connect an RS-232 serial simulator generating periodic NMEA taxi pulses (100 DZD flag drop + 35 DZD every 1,000 meters).
* Verify that the Driver Cockpit UI updates tariffs without lag.
* Trigger a simulated BaridiMob payment receipt through the verification worker and confirm database ledger entry.

### Phase 2: Single-Car Expressway Road Test (Day 4 to 7)
* Install one complete kit into a test vehicle.
* Route: Start at Bab Ezzouar (USTHB), take Rocade Sud toward Ben Aknoun, descend to Grande Poste, and return via Rocade Nord.
* Test GPS tracking under tunnels and overpasses (Oued Ouchayah tunnel, Faculté Centrale underpass).
* Verify automatic reconnection when switching between 4G cell towers (Mobilis to Djezzy roaming zones).
* Ensure total round-trip distance recorded by the tablet matches the physical vehicle odometer within 1.5%.

### Phase 3: Deceleration & Crash Lockbox Calibration (Day 8 to 10)
* Calibrate the tablet's built-in 3-axis accelerometer.
* Perform controlled hard braking tests on an empty closed asphalt surface at 40 km/h.
* Ensure normal emergency braking (0.8G to 1.4G) does not trigger false accident locks.
* Simulate a sharp impact shock (> 2.84G threshold) using a test rig.
* Verify that the application locks the last 30 seconds of 720p front-facing video, encrypts the file with AES-256-GCM, splits the decryption key into 2-of-3 Shamir shares, and transmits the cryptographic receipt to the central server.

### Phase 4: Five-Car Live Pilot Fleet (Weeks 2 to 4)
* Recruit five licensed Algiers taxi drivers holding valid Livrets de Place.
* Equip each vehicle with the hardware kit.
* Run 250 real passenger trips across Kouba, Hydra, Alger Centre, and Bab Ezzouar.
* Validate the BaridiMob change return mechanism: passengers paying 1,000 DZD for a 450 DZD fare receive 550 DZD credited directly to their registered CCP account.
* Check driver battery drain and tablet temperature after an 8-hour shift under sunlight.

### Phase 5: Simulated DTW Roadside Police Checkpoint (Week 5)
* Position an inspector on the roadside with a standard smartphone.
* Stop a test vehicle and request proof of accreditation.
* Scan the QR code displayed on the driver's tablet or printed on the thermal quittance.
* Verify that the public verification console displays the driver's full name, vehicle plate, DTW 16 permit number, calibration date, and green cryptographic signature confirmation.

---

## 8. Summary Checklist: What to Buy & What to Do

### Hardware Shopping List (Immediate Phase)
1. **1x Dispatch Workstation PC:** Intel i5 or AMD Ryzen 7, 32 GB RAM, 1 TB SSD, Dual 27" monitors, 1500VA UPS (~220,000 DZD).
2. **2x Android Test Tablets:** Samsung Galaxy Tab Active3 LTE or Lenovo Tab M10 Plus LTE (~80,000 DZD for 2 units).
3. **2x Commercial Tablet Mounts:** Rigid dashboard mounting arms (~12,000 DZD for 2 units).
4. **2x 12V Hardwired Car Chargers:** 30W USB-PD fuse tap power kits (~6,000 DZD for 2 units).
5. **2x RS-232 to USB-C Serial OTG Cables:** FTDI chipset (~8,000 DZD for 2 units).
6. **2x 58mm Bluetooth Thermal Printers:** Rechargeable mobile receipt printers (~18,000 DZD for 2 units).
7. **2x 4G LTE SIM Cards:** Mobilis or Djezzy business data lines (~4,000 DZD).

### Online Subscriptions to Activate
1. **Supabase Pro Account:** $25/month (~5,500 DZD).
2. **Vercel Pro Account:** $20/month (~4,400 DZD).
3. **Groq Cloud API Key:** Pay-as-you-go (~$5 to $15/month for Whisper transcription).
4. **Sovereign Domain `wasslani.dz`:** Register via NIC.dz (~2,500 DZD/year).
5. **Google Play Console Developer Account:** $25 one-time fee.
6. **Chargily Pay Merchant Account:** Submit KYC documents for live payment gateway activation.

### Legal & Administrative Filings
1. File platform declaration with the **National Personal Data Protection Authority (ANPDP)** under Law 18-07.
2. Submit technical application to the **Direction des Transports de la Wilaya d'Alger (DTW 16)** demonstrating compliance with Executive Decree 12-230.
3. Submit video lockbox protocols to relevant judicial authorities demonstrating compliance with Law 25-11.
