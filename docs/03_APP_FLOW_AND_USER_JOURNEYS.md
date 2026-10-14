# Application Flows and User Journeys
## Next-Generation Smart Taxi and Mobility Platform for Algeria

---

## 1. Overview of Multi-Surface Workflows

The platform coordinates four discrete operational surfaces:
1. **Rider Mobile App**: Map exploration, booking, tariff negotiation, digital payment, and safety tracking.
2. **Driver Mobile App**: Dashcam recording, dispatch handling, turn-by-turn routing, fare calculation, and wallet management.
3. **Fleet Manager Console**: Multi-vehicle monitoring, driver shift tracking, and agency operations.
4. **Administrative & Dispatch Portal**: Regulatory verification, safety escalation, incident video review, and financial reconciliations.

---

## 2. Rider Journey Workflows

### 2.1 Onboarding and Profile Setup

```
[ Download App ]
       |
       v
[ Phone Number Entry (+213) ]
       |
       v
[ SMS OTP Verification (6-digit) ]
       |
       +---> [ Existing User ] ---> [ Load Profile & Wallet ] ---> [ Home Map ]
       |
       +---> [ New User ]
                 |
                 v
             [ Name & Optional Email ]
                 |
                 v
             [ Preferred Language Selection ]
             (Darija / Arabic / French / English)
                 |
                 v
             [ Location Permission Grant ]
                 |
                 v
             [ Home Map Interface ]
```

### 2.2 Urban Trip Booking (Automated Taxi Dispatch)

```
[ Home Map Screen ]
       |
       v
[ Search Destination / Tap on Map ]
       |
       v
[ Route Preview & Fare Calculation ]
  - Displays Route Polyline
  - Shows Distance (km) and Travel Time (mins)
  - Shows Regulated Fare Bracket (Day: 06:00-21:00 / Night: 21:00-06:00)
  - Select Payment Method: Cash / Edahabia / CIB Card / In-App Wallet
       |
       v
[ Tap "Confirm Taxi Booking" ]
       |
       v
[ Algorithmic Dispatch Radar (H3 Radius Search) ]
       |
       +---> [ Driver Accepts within 15s ]
       |         |
       |         v
       |     [ Driver Profile Screen ]
       |       - Driver Photo & Legal Taxi Badge
       |       - Vehicle Model & Registration Plate
       |       - Municipal Agrément / Livret de Place ID
       |       - Real-time ETA & Approaching Vehicle Marker
       |
       +---> [ No Response after 45s ] ---> [ Expand Search Radius or Cancel ]
```

### 2.3 Active Trip and Safety Tools

```
[ Driver Arrives at Pickup ]
       |
       v (Push Notification: "Your taxi is waiting outside")
[ Rider Boards Vehicle & Confirms Start Code (4-digit PIN) ]
       |
       v
[ Active Trip Screen ]
  - Live Turn-by-Turn Progress on Map
  - Continuous Speed and Route Tracking
  - "Share My Trip" Button (Generates secure web tracking link for SMS/WhatsApp)
  - "Emergency SOS" Button
       |
       +---> If SOS Pressed:
                 - High-priority alert sent to Safety Operations Desk
                 - Vehicle coordinates and live GPS stream forwarded
                 - Phone dials National Police (1548) or Protection Civile (14)
```

### 2.4 Drop-off and Payment Settlement

```
[ Vehicle Reaches Destination ]
       |
       v
[ Driver Ends Trip ]
       |
       +---> [ Payment Method: Cash ]
       |         |
       |         v
       |     [ Fare Breakdown Displayed (DZD) ]
       |     [ Rider Hands Cash to Driver ]
       |     [ Optional: Driver Credits Excess Change to Rider Wallet ]
       |
       +---> [ Payment Method: Digital (Edahabia / CIB) ]
                 |
                 v
             [ Instant Wallet / Card Balance Deduction ]
                 |
                 v
             [ Digital Receipt Generated (*Quittance Fiscale*) ]
                 |
                 v
             [ Driver Rating (1 to 5 Stars) & Optional Feedback ]
```

### 2.5 Inter-Wilaya Trip (Negotiated Bidding Mode)

```
[ Select Inter-Wilaya Tab ]
       |
       v
[ Choose Origin & Destination Wilayas (e.g., Algiers -> Oran) ]
       |
       v
[ Select Service Type ]
  - Individual Private Taxi (Entire Vehicle)
  - Collective Seat (*Place par Place* - Shared Taxi)
       |
       v
[ Enter Proposed Price (DZD) & Departure Time ]
       |
       v
[ Request Broadcasted to Certified Long-Distance Drivers ]
       |
       v
[ Incoming Driver Offers Table ]
  - Shows Driver Name, Verified License Status, Rating
  - Shows Vehicle Year and Air Conditioning Status
  - Shows Driver Proposed Fare (Accept Original or Counter-Offer)
       |
       v
[ Rider Accepts Offer ] ---> [ Direct In-App Call / Chat ] ---> [ Trip Confirmed ]
```

---

## 3. Driver Journey Workflows

### 3.1 Regulatory Onboarding and Verification Pipeline

```
[ Driver App Download ]
       |
       v
[ Phone Number Entry & Verification ]
       |
       v
[ Document Submission Step ]
  1. National Biometric ID (Front & Back)
  2. Professional Driver License (*Permis de Conduire*)
  3. Municipal Taxi Permit (*Livret de Place*)
  4. Taxi License Exploitation Authorization (*Agrément de Taxi*)
  5. Vehicle Registration Card (*Carte Grise*)
  6. Technical Inspection Certificate (*Contrôle Technique*)
  7. Commercial Insurance Policy (*Assurance Transport de Personnes*)
       |
       v
[ Automated Document OCR & Quality Scan ]
       |
       v
[ Compliance Desk Audit & Background Check ]
       |
       +---> [ Approved ] ---> [ Driver Profile Activated ]
       +---> [ Incomplete / Rejected ] ---> [ Resubmission Request with Guidance ]
```

### 3.2 Shift Activation and Dashcam Calibration

```
[ Driver Opens Application ]
       |
       v
[ Mount Smartphone in Windshield Cradle ]
       |
       v
[ Toggle Status to "Online" ]
       |
       v
[ Dashcam Automatic Diagnostic Check ]
  - Verifies Camera Permission and Clear Lens Field
  - Starts Rolling Circular Video Buffer (H.264, 1080p, 60s chunks)
  - Calibrates Accelerometer Baseline against vehicle vibration
       |
       v
[ Ready Screen: Listening for Dispatches ]
```

### 3.3 Urban Ride Execution Flow

```
[ Audio Dispatch Alert ]
  - Displays Pickup Location & Driving Distance
  - Displays Estimated Fare (DZD)
  - 15-Second Countdown Timer
       |
       v
[ Driver Taps "Accept Ride" ]
       |
       v
[ Turn-by-Turn Navigation to Pickup Point ]
       |
       v
[ Tap "Arrived at Pickup" ]
  - Triggers 5-Minute Free Waiting Timer for Passenger
       |
       v
[ Passenger Boards -> Enter 4-Digit Rider PIN ]
       |
       v
[ Meter Engaged & Trip Underway ]
  - Real-time GPS distance calculation
  - Background Dashcam continuously buffers video
  - Live speed alerts if driver exceeds municipal speed limits
       |
       v
[ Tap "Complete Trip" at Destination ]
       |
       v
[ Fare Summary Screen: Cash Collection or Card Confirmed ]
       |
       v
[ Rate Passenger & Return to Online Status ]
```

### 3.4 Dashcam Incident Workflow

```
[ During Active Trip ]
       |
       +---> [ Event: High-G Shock (> 2.5G Deceleration or Impact) ]
       |                           OR
       +---> [ Event: Driver or Rider Presses Emergency SOS ]
                                   |
                                   v
             [ Incident Lockbox Triggered Automatically ]
               1. System locks previous 60 seconds of video
               2. Records subsequent 30 seconds of video
               3. Stamps video with GPS, speed, timestamp, and trip ID
               4. Computes SHA-256 integrity hash
               5. Background upload queued directly to Cloud Storage
                                   |
                                   v
             [ Dispatch Safety Desk Flagged with High Priority Alert ]
```

---

## 4. Administrative and Safety Operations Workflows

### 4.1 Safety Escalation Desk

```
[ Incident / SOS Alert Fired ]
       |
       v
[ High-Priority Banner on Dispatch Console ]
  - Audio Alarm sounds at monitoring station
  - Displays vehicle real-time coordinates, driver identity, and passenger record
  - Pulls live route polyline and recent speed telemetry
       |
       v
[ Operator Protocol ]
  1. Instant in-app voice call to driver device
  2. If unanswered within 30 seconds, phone call to passenger
  3. Retrieve encrypted dashcam incident clip from cloud lockbox
  4. Coordinate directly with national emergency dispatchers (1548 / 14)
  5. Log incident resolution notes in permanent compliance ledger
```

### 4.2 Document Expiry and Compliance Auditing

```
[ Automated Nightly Worker (Windmill) ]
       |
       v
[ Scan All Active Drivers in Database ]
  - Identify Contrôle Technique expiring within 14 days
  - Identify Commercial Insurance policies expiring within 7 days
  - Identify Municipal Taxi Agrément renewals due
       |
       v
[ Notification Trigger ]
  - Push notification sent to driver: "Your technical inspection expires in X days"
  - If document passes expiry date without renewal:
      -> Automatic status change: Active -> Suspended
      -> Driver blocked from receiving new dispatches until renewed
```
