# Dashcam and Telematics Subsystem Analysis
## Strategic Architecture: Integrated Subsystem vs. Standalone Product

---

## 1. The Core Architectural Dilemma

A primary question in the platform design is whether the dashcam system should be built as an independent, standalone product (with its own hardware, standalone mobile application, and isolated cloud backend) or integrated natively into the mobility platform.

```
+-----------------------------------------------------------------------------------+
|  Option A: Standalone Dashcam Project       Option B: Native Integrated Subsystem |
+-------------------------------------------+---------------------------------------+
|  - Separate mobile app for driver         |  - Single unified Driver mobile app   |
|  - Independent user accounts              |  - Automatic shift & ride binding     |
|  - Video disconnected from ride data      |  - Video tied to Trip ID & GPS trail  |
|  - High operational friction for drivers  |  - Zero driver context switching      |
|  - Complex data synchronization           |  - Instant dispute & accident lockbox |
+-------------------------------------------+---------------------------------------+
```

### The Strategic Recommendation: Unified Native Subsystem with Modular API Boundaries
The dashcam functionality must be built as an **integrated subsystem with modular boundaries**, rather than an isolated external product.

#### Rationale:
1. **Evidentiary Context Binding**: A video recording of a collision or dispute is legally and operationally actionable only when tied to verified metadata: the active Trip ID, passenger ID, driver taxi permit number, exact GPS coordinates, vehicle speed, and route polyline. A detached dashcam app cannot correlate these data points without complex, error-prone manual exports.
2. **In-Cockpit Driver Friction**: Taxi drivers operate under high cognitive load navigating traffic. Forcing a driver to open, configure, and maintain two separate mobile applications (one for ride dispatches and another for video recording) leads to abandonment of the dashcam software within days.
3. **Hardware Barrier and Capital Expenditure**: Mandating expensive physical dashcam hardware upfront creates a severe barrier to driver acquisition. An integrated software architecture enables a two-tier model:
   - **Tier 1 (Software In-App Dashcam)**: Zero hardware cost. Every driver turns their existing smartphone into a dashcam the moment they mount it to their windshield cradle.
   - **Tier 2 (Connected Fleet IoT Dashcam)**: Fleet agencies and premium operators connect dedicated dual-lens hardware cameras directly into the platform's standardized telematics API.

---

## 2. Dual-Tier Hardware and Software Deployment Architecture

```
+---------------------------------------------------------------------------------------+
|                               Unified Telematics Pipeline                             |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   [ Tier 1: Smartphone In-App Mode ]           [ Tier 2: Dedicated IoT Dashcam ]      |
|   - Windshield phone cradle                    - Dual-lens hardware (Front + Cabin)   |
|   - Rear camera 1080p @ 30fps                  - Built-in GPS & 4G/eSIM or Wi-Fi AP   |
|   - Local circular buffer (3x 60s)             - Continuous microSD loop buffer       |
|   - Phone IMU sensor (Kalman filter)           - Hardware G-sensor & IR night vision  |
|                                                                                       |
+---------------------------+-----------------------------------+-----------------------+
                            |                                   |
                            v                                   v
             +------------------------------+   +-------------------------------+
             | Flutter Platform Channels    |   | Local Wi-Fi Direct / BLE Sync |
             | (Android CameraX / iOS AVF)  |   | (Standardized Telematics API) |
             +--------------+---------------+   +---------------+---------------+
                            |                                   |
                            +-----------------+-----------------+
                                              |
                                              v
                              +-------------------------------+
                              | Telematics & Evidence Engine  |
                              | - Watermark Video Overlay     |
                              | - Sensor Shock Triage (>2.5G) |
                              | - SHA-256 Hash Generation     |
                              | - AES-256-GCM Envelope        |
                              +---------------+---------------+
                                              |
                                              v (HTTPS Multipart Upload)
                              +-------------------------------+
                              | Supabase Storage Lockbox      |
                              +-------------------------------+
```

---

## 3. Tier 1: Smartphone In-App Dashcam Implementation

### 3.1 Resource Management and Thermal Throttling
Algerian summers present extreme in-vehicle temperatures, often exceeding 48 degrees Celsius inside a closed vehicle in inland cities such as Biskra, Setif, or Chlef. Running continuous 1080p video recording alongside 60fps MapLibre navigation and 4G data streaming causes budget Android SoCs (Redmi, Realme, Samsung A-series) to overheat within 20 to 30 minutes, triggering aggressive kernel CPU/GPU throttling or OS camera service kills.

The Tier 1 engine enforces a strict thermal budget:
- **Resolution and Frame Rate Cap**: Resolution is locked at 720p (1280x720) at 15 fps. This reduces video encoding pipeline workload by over 60% compared to 1080p at 30 fps while preserving clear legibility of vehicle license plates, road signage, and cabin activity.
- **Hardware-Accelerated Zero-Copy Encoding**: The video pipeline utilizes direct Android `MediaCodec` surface input and iOS `AVCaptureMovieFileOutput`. Frames stream directly from the image sensor into the hardware encoder without transit through the CPU or Flutter UI compositor.
- **Automated Thermal Load Shedding**:
  - The mobile app subscribes to Android's `PowerManager.OnThermalStatusChangedListener` (and iOS `ProcessInfo.thermalState`).
  - *Status Normal*: Full operation (720p @ 15fps dashcam + 60fps map navigation).
  - *Status Moderate*: MapLibre rendering automatically drops to 25fps, camera preview HUD is dimmed, and background network batching intervals expand.
  - *Status Severe*: Video recording gracefully pauses, while high-priority GPS location tracking, IMU crash detection, and dispatch channels remain active.
- **Rolling Circular Buffer**:
  - The application maintains exactly three 60-second video files in volatile cache (`chunk_0.mp4`, `chunk_1.mp4`, `chunk_2.mp4`).
  - Total on-device storage never exceeds 60 megabytes.
  - As `chunk_3` begins writing, `chunk_0` is unlinked. Storage is written in a pre-allocated append-unlink cycle that eliminates disk fragmentation.

### 3.2 Automated G-Shock and Accident Detection
- **Sampling Frequency**: Mobile accelerometer and gyroscope data are captured at 50Hz via native sensor event listeners.
- **Filtering Algorithm**: A low-pass Butterworth filter strips out standard engine vibrations and cobblestone noise. A high-pass filter isolates sharp deceleration spikes.
- **Incident Lock Condition**: If net deceleration along the horizontal plane exceeds $2.5 \text{ G}$ ($24.5 \text{ m/s}^2$) for more than 40 milliseconds, an accident trigger is generated immediately:
  - The system locks the current 60-second chunk and the preceding 60-second chunk.
  - Recording continues for 30 seconds after the trigger to capture post-collision vehicle positions.
  - The three chunks are concatenated, watermarked, cryptographically signed, and marked for upload.

---

## 4. Tier 2: Connected Fleet IoT Dashcam Architecture

For commercial fleet operators (such as inter-wilaya transport cooperatives), the platform provides direct compatibility with connected dashcam hardware via a standardized local interface.

### 4.1 Hardware Specifications
- **Form Factor**: Dual-channel windshield-mounted camera or smart rearview mirror.
  - Front Camera: 1080p wide-angle (140-degree field of view).
  - Cabin Camera: 720p with infrared (IR) LEDs for low-light night-time passenger recording.
- **Connectivity**: Wi-Fi 802.11 b/g/n access point mode and Bluetooth Low Energy (BLE).
- **Power**: Hardwired directly to the vehicle fuse box via an ACC line, supporting continuous parking-mode security monitoring without draining the car battery.

### 4.2 Synchronization Protocol
- When the driver enters the vehicle and opens the Driver App, the mobile phone discovers the dashcam over BLE and establishes a local Wi-Fi Direct connection.
- The Driver App sends periodic heartbeats containing the active `trip_id` and GPS coordinates.
- The dashcam records continuously to an automotive-grade microSD card (Class 10 / U3).
- Upon collision or SOS activation, the dashcam pushes the incident clip to the mobile app over the local Wi-Fi connection for immediate relay to the cloud.

---

## 5. Privacy, Legal Compliance, Law 18-07, and Law 25-11

Passenger and driver surveillance is strictly regulated under Algerian Law No. 18-07 and Law No. 25-11 of July 24, 2025 regarding the protection of individuals in the processing of personal data, overseen by the ANPDP (*Autorité Nationale de Protection des Données à Caractère Personnel*).

### 5.1 Regulatory Compliance Rules
1. **Clear Passenger Notification**:
   - The Rider App explicitly displays a privacy disclosure upon booking: *"This vehicle is equipped with an integrated safety dashcam operating in compliance with Law 18-07 and Law 25-11."*
   - Vehicles in the program must display a standardized sticker on the passenger window stating video surveillance is active for safety purposes.
2. **Cabin Video Privacy Rules**:
   - Continuous cabin recording is restricted strictly to active trips.
   - When the driver toggles to offline status, all video capture terminates immediately.
3. **Data Retention and Access Gatekeeping**:
   - Rolling buffer chunks that are not associated with an incident trigger are purged automatically from device storage every three minutes.
   - Incident footage uploaded to local MinIO storage is encrypted with AES-256-GCM.
   - Raw footage is strictly inaccessible to drivers, riders, or standard platform operators. Decryption and retrieval are permitted only by authorized compliance officers following a verified police inquiry (*réquisition judiciaire*) or insurance dispute.
   - Uncontested incident footage is permanently purged after 90 days.
4. **Law 25-11 Mandatory Artifacts**:
   - Formal Data Protection Impact Assessment (*Analyse d'Impact relative à la Protection des Données* - AIPD) documented and submitted to the ANPDP.
   - Maintained Processing Registry (*Registre des activités de traitement*) logging data retention periods, encryption keys, and authorized roles.
   - Automated 5-day security breach notification procedure to notify the ANPDP and data subjects in the event of an incident.
