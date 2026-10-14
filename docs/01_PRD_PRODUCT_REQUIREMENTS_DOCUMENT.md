# Product Requirements Document (PRD)
## Next-Generation Smart Taxi and Mobility Platform for Algeria

---

## 1. Executive Summary

Urban mobility in Algerian cities relies heavily on informal ride-hailing networks and traditional yellow street taxis. Existing platforms such as Yassir, Heetch, and InDrive operate largely as digital intermediary services, deploying private civilian vehicles. This operational model creates friction with municipal transport directorates (Directions des Transports de Wilaya), generates conflicts with taxi unions (Syndicat National des Taxieurs), and exposes drivers to vehicle impoundment at security checkpoints.

This platform establishes a state-compliant digital mobility infrastructure across Algeria. By digitizing licensed taxi drivers (holders of the official *Livret de Place* and municipal *Agrément de Transport*), the platform combines the legal protection of regulated public transit with modern dispatch algorithms. 

The system features two operational innovations:
1. A dual-tier dispatch engine supporting both automated meter-rate dispatch and negotiated inter-wilaya bidding.
2. An integrated dashcam telematics subsystem providing real-time driver assistance, incident video buffering, and objective dispute resolution.

---

## 2. Market Context and Problem Definition

### 2.1 The Regulatory Impasse
In Algeria, passenger transport is strictly governed by Law No. 01-13 and Executive Decree No. 12-230. Civilian drivers operating on standard ride-hailing applications operate in a legal gray area. Police and gendarmerie checkpoints regularly inspect transit permits. Unlicensed drivers face vehicle impoundment (*mise en fourrière*) lasting 15 to 45 days, alongside substantial administrative fines.

Traditional taxi drivers possess valid municipal licenses (*agréments* often leased from rights holders or held directly) and official permits (*livrets de place*). However, they lack modern dispatch software, real-time hailing capabilities, transparent digital routing, and card payment acceptance.

### 2.2 Passenger Safety and Quality Deficits
Passengers, particularly women travelling late at night or families booking inter-city trips, face recurring uncertainties:
- Driver identities and criminal records (*bulletin numéro 3*) are rarely verified on unregulated platforms.
- Route disputes and arbitrary fare inflation occur frequently during peak hours and adverse weather.
- In the event of harassment, theft, or traffic accidents, neither the passenger nor the driver possesses objective audiovisual evidence to substantiate claims before law enforcement or insurance adjusters.

### 2.3 Payment and Currency Bottlenecks
Physical cash accounts for over 85% of retail transit transactions in Algeria. Drivers frequently lack change for large denomination notes (1,000 DZD and 2,000 DZD bills), causing roadside friction. Existing international card payment gateways are unusable due to strict foreign exchange regulations (Law 90-10 and subsequent Banque d'Algérie directives). National payment rails, specifically SATIM CIB cards and Algerie Poste Edahabia cards, require dedicated local integration.

---

## 3. Product Vision and Core Value Proposition

The platform functions as a national transport network uniting riders, professional licensed drivers, fleet operators, and transport authorities.

```
+-----------------------------------------------------------------------------+
|                          Unified Mobility Platform                          |
+------------------------------------+----------------------------------------+
| Passenger Facing                   | Driver & Regulator Facing              |
| - Instant Urban Taxi (Meter Tariffs)| - 100% Legal Operation (DTW Certified) |
| - Inter-Wilaya Bidding (Negotiated) | - Zero Checkpoint Harassment           |
| - Local Cards (Edahabia, CIB) + Cash| - Dedicated Dashcam Evidence Guard     |
| - Biometric Driver Verification    | - Transparent Low Commission (8-12%)   |
+------------------------------------+----------------------------------------+
```

### 3.1 Primary Value Pillars
1. **Full Regulatory Compliance**: Every active driver is vetted with an authentic taxi permit (*Livret de Place*), municipal taxi operating rights (*Agrément de Transport* under Executive Decree No. 12-230), vehicle roadworthiness sheet, commercial passenger insurance (*assurance transport de personnes*), and police record check. The platform operates under official Commercial Register code CNRC 604103 (*Entreprise de gestion de taxis*), eliminating police checkpoint impoundment risks.
2. **Three Regulated Service Modes**:
   - *Mode 1: Individual Urban Taxi (Taxi Individuel)*: Calibrated physical taximeter fare plus a regulated in-app booking dispatch fee (*frais d'approche / réservation sur appel*) authorized under CNRC 604103, with optional drop-off photo/OCR meter verification.
   - *Mode 2: Urban Collective Taxi (Taxi Collectif Urbain)*: Fixed municipal routes charging a regulated flat tariff per seat.
   - *Mode 3: Inter-Wilaya Collective Taxi (Taxi Collectif Inter-Wilayas)*: Station-to-station (*gare routière*) routes with regulated per-seat tariffs and multi-passenger seat-ledger allocation.
3. **TrustDesk Native Digital Wallet Engine**: The platform embeds the TrustDesk fintech engine for stored value balances, P2P settlements, biometric KYC verification, and excess cash change collection, creating a direct consumer fintech ecosystem.
4. **Integrated Dashcam Telematics**: Hardware-accelerated local loop recording with automated cloud lockbox upload during rapid deceleration, collision impact, or driver SOS activation.
5. **Sovereign Payment Infrastructure**: Native processing of Algerian CIB and Edahabia cards through Chargily Pay V2 (using official Flutter and Go SDKs), alongside BaridiMob RIP fleet verification and TrustDesk instant transfers.

---

## 4. User Personas

### 4.1 Passenger: Amel (Urban Professional, Algiers)
- **Profile**: 29-year-old architect working in Bab Ezzouar, living in Kouba.
- **Pain Points**: Rejections by yellow street taxis during evening rush hour; discomfort taking unregulated civilian cars after 20:00; shortage of 100 DZD and 200 DZD change.
- **Needs**: Guaranteed pickup by a government-certified driver; live ride tracking shareable with her family; option to pay digitally using her Edahabia card.

### 4.2 Driver: Rachid (Licensed Artisan Taxi Driver, Oran)
- **Profile**: 44-year-old full-time taxi driver operating a Hyundai Accent. Holds a valid *Livret de Place* from the Wilaya of Oran.
- **Pain Points**: Idle cruising burning fuel looking for street hails; high commissions demanded by foreign-backed grey-market apps; constant suspicion of unfair passenger ratings.
- **Needs**: Steady ride requests without police harassment at fixed checkpoints; fair commission rates (capped under 12%); video protection proving he was not at fault during minor traffic collisions.

### 4.3 Fleet Operator: Karim (Inter-Wilaya Transport Agency, Blida)
- **Profile**: Manages a collective fleet of 18 Peugeot 301 and Skoda Octavia sedans operating inter-wilaya routes.
- **Pain Points**: Inability to track drivers outside the base station; cash leakages; difficulty monitoring driver behavior on mountain corridors like the Gorges de Chiffa.
- **Needs**: Unified fleet telemetry dashboard; real-time vehicle positioning; automatic dashcam incident alerting.

### 4.4 Regulatory Monitor: Directorate of Transport Auditor
- **Profile**: Municipal transport inspector auditing taxi service density and tariff compliance.
- **Needs**: Digital audit logs; electronic inspection of vehicle roadworthiness certificates; verified taxi licensing records.

---

## 5. Functional Requirements

### 5.1 Identity and Onboarding Verification
- **Passenger Registration**: Mobile phone verification via national SMS gateway. Optional national identification number capture.
- **Driver Verification Pipeline**:
  - Personal Identification: National Biometric ID (*CNIB*).
  - Transport Credentials: Driver License (*Permis de Conduire catégorie B/Transport*), *Livret de Place*, and Municipal Taxi License (*Agrément de Taxi* / contract of exploitation).
  - Vehicle Documents: Registration Card (*Carte Grise*), Technical Inspection certificate (*Contrôle Technique* valid within 6 months), and Commercial Passenger Insurance.
  - Background Verification: Police record extraction (*Casier Judiciaire Bulletin N°3*).
- **Automated Document OCR and Validation**: Automated optical character recognition on identity documents and vehicle plates to accelerate onboarding.

### 5.2 Ride Modes and Matching Mechanisms

```
Passenger Request
      |
      +---> Urban Trip (Intra-Wilaya)
      |         |
      |         +--> Automated Radius Matching (H3 Hexagonal Grid)
      |         +--> Official Regulated Tariff Calculation
      |         +--> Dispatch to Closest Certified Taxi
      |
      +---> Inter-Wilaya Trip (Cross-Country)
                |
                +--> Passenger Proposes Base Price (DZD)
                +--> Broadcast to Qualified Long-Distance Operators
                +--> Driver Counter-Offers & Bidding Negotiation
                +--> Passenger Selects Driver by Price, Rating, Vehicle Class
```

- **Urban Automated Dispatch**:
  - Spatial indexing calculates vehicle distance using H3 resolution 8 cells (approx. 460-meter radius).
  - Algorithmic dispatch directs the request to the highest-rated driver within a 3 km radius.
  - Tariff computation matches the official Wilaya taxi formula: base flag drop (*prise en charge*) + kilometer rate + waiting time rate. Night rate adjustments apply between 21:00 and 06:00.
- **Inter-Wilaya Bidding Dispatch**:
  - The passenger selects origin wilaya/commune and destination wilaya/commune.
  - The passenger proposes a price in Algerian Dinars (DZD).
  - Active licensed drivers along that inter-wilaya corridor receive the proposal and can accept or submit a single counter-offer.
  - The passenger confirms the ride based on driver profile, vehicle model, dashcam certification badge, and fare.

### 5.3 Integrated Dashcam and Telematics Subsystem
- **Operational Model Decision**: The platform implements an integrated dual-mode telematics architecture. Dashcam functionality is native to the ecosystem rather than a detached third-party utility.
  - *Tier 1 (In-App Dashcam Mode)*: Drivers mount their smartphone on the windshield cradle. The driver application runs a background cyclic camera buffer recording the road ahead in 1080p at 30 fps, storing video locally in 3-minute rolling chunks.
  - *Tier 2 (Connected IoT Hardware Dashcam)*: Fleets and professional operators pair dedicated two-channel dashcams (front road view and interior passenger cabin) via local Wi-Fi Direct or Bluetooth Low Energy.
- **Automated Incident Lockbox**:
  - The driver phone accelerometer detects sudden acceleration or deceleration exceeding 2.5G.
  - Upon impact detection or manual SOS trigger by either party, the system locks the preceding 60 seconds and following 30 seconds of video.
  - The clip is cryptographically hashed, watermarked with GPS coordinates and vehicle speed, and uploaded directly to encrypted cloud storage.
- **Driver Privacy Controls**: In-cabin video recording requires active ride status. Recording ceases automatically when the driver switches to offline status.

### 5.4 Financial Management and Payment Rails
- **Payment Methods**:
  - Cash on drop-off with in-app digital change reconciliation (excess cash credited to rider wallet).
  - CIB and Edahabia card payments processed through Chargily Pay V2.
  - BaridiMob QR code generation for direct driver balance settlements.
- **Wallet and Commission Structure**:
  - Dual wallet system: Passenger Wallet and Driver Wallet.
  - Drivers prepay commission credits or maintain a minimum operating balance.
  - Platform commission is deducted automatically upon ride completion (standard rate 10%, compared to 18-25% on legacy platforms).
  - Automated weekly or on-demand payouts to driver postal accounts (CCP / RIP).

### 5.5 Safety, SOS, and Emergency Protocols
- **Emergency Button**: Available to both rider and driver during active trips.
- **Real-Time Telemetry Relay**: Triggering SOS sends immediate alerts containing vehicle coordinates, driver credentials, vehicle license plate, and live route deviation metrics to platform safety dispatchers and local emergency responders (Protection Civile / Sûreté Nationale).
- **Audio Verification**: Optional encrypted in-ride audio buffering stored on the device for 48 hours and decrypted only upon an official dispute filing.

---

## 6. Non-Functional Requirements

### 6.1 Performance and Latency
- Real-time driver location tracking must update within 1.5 seconds under standard 4G mobile networks.
- Match dispatch latency must remain under 3 seconds from the moment a ride request is submitted.
- The mobile application cold launch time must not exceed 2.0 seconds on mid-range Android devices common in Algeria (such as Samsung Galaxy A-series or Redmi Note devices).

### 6.2 Offline Resilience and Network Failover
- Algeria's inter-urban highways often have patchy cellular coverage. The mobile client must maintain local vector tile map caching and queue telemetry points locally.
- In the event of network disruption, the ride meter continues operating using on-device GPS hardware. Telemetry logs sync automatically once connectivity resumes.

### 6.3 Security, Privacy, and Data Sovereignty (Law 18-07 and Law 25-11)
- Full compliance with Algerian Law No. 18-07 and Law No. 25-11 of July 24, 2025 regarding the protection of personal data.
- Strict cross-border data transfer prohibition: Storing citizen GPS breadcrumbs, driver credentials, and cabin video on foreign cloud infrastructure (such as AWS, Google Cloud, or Azure foreign regions) is prohibited without explicit written exemption from the ANPDP.
- Mandatory Local Infrastructure: The complete platform stack (Self-Hosted Supabase, MinIO object storage, and Go geospatial engines) must be hosted domestically on certified Algerian Tier-3 data centers (such as Algérie Télécom, ICOSNET, or ISSAL).
- Law 25-11 Mandatory Compliance Artifacts:
  - Formal Data Protection Impact Assessment (*Analyse d'Impact relative à la Protection des Données* - AIPD) covering continuous road and cabin video buffering and 1Hz location telemetry.
  - Publicly accessible Processing Registry (*Registre des activités de traitement*) documented and filed with the ANPDP.
  - Automated 5-day incident breach notification workflow to report unauthorized access or data exposure to the ANPDP and affected data subjects.
- Dashcam video files are encrypted at rest using AES-256-GCM with keys held in a local hardware security module (HSM) or secure key vault, accessible only to compliance personnel following an official judicial requisition (*réquisition judiciaire*).

### 6.4 Localization and Internationalization
- Full localization in four linguistic formats:
  - Algerian Arabic (Darija) in Arabic script.
  - Modern Standard Arabic.
  - French (widely used for commercial and business contexts).
  - English (for tourists, business travelers, and international delegations).
- Complete bidirectional UI layout support (right-to-left for Arabic, left-to-right for French and English).
