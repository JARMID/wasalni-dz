# UI and UX Design Brief
## Next-Generation Smart Taxi and Mobility Platform for Algeria

---

## 1. Design Philosophy and Environmental Context

Mobile interfaces for transportation in Algeria must function across severe environmental constraints:
1. **Intense Ambient Glare**: Drivers face harsh sunlight reflecting off windscreens during summer months, requiring high-contrast layouts and automated contrast enhancement.
2. **Arm's Length Interaction**: In-cockpit drivers interact with smartphones mounted on air vents or windscreens at distances between 50 cm and 80 cm. Standard mobile touch targets (44x44 dp) cause mis-taps and distraction. Driver touch targets must measure at least 56x56 dp, expanding to 64 dp for critical dispatch buttons.
3. **Multilingual and Bidirectional Parity**: The application must offer complete linguistic parity across Modern Standard Arabic, Algerian Darija, French, and English, including full right-to-left (RTL) layout mirroring.

---

## 2. Color System and Contrast Architecture

The palette combines the traditional identity of Algerian municipal taxis with deep corporate tones for regulatory authority and night-time eye comfort.

```
+-----------------------------------------------------------------------------------+
| Light Mode Palette                                                                |
+-------------------+--------------------+--------------------+---------------------+
| Primary Deep Navy | Official Taxi Gold | Success Emerald    | Pure Canvas White   |
| #003366           | #F5A623            | #00843D            | #FFFFFF             |
| (Headers, Brands) | (Accents, Medallion| (Confirmations, GPS| (Card background)   |
+-------------------+--------------------+--------------------+---------------------+
| Background Slate  | Border Neutral     | Text Primary       | Text Secondary      |
| #F8FAFC           | #E2E8F0            | #0F172A            | #475569             |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| Dark Mode Palette (Optimized for Night Driving and OLED Efficiency)               |
+-------------------+--------------------+--------------------+---------------------+
| Night Canvas      | Surface Dark Slate | Accent Amber Gold  | High-Vis Mint Green |
| #0B0F19           | #1E293B            | #FBBF24            | #10B981             |
| (Deep Background) | (Floating Cards)   | (Highlights, Badges| (Active Polylines)  |
+-------------------+--------------------+--------------------+---------------------+
| Critical Alert Red| Muted Border Slate | Text Night Pure    | Text Night Muted    |
| #EF4444           | #334155            | #F8FAFC            | #94A3B8             |
+-----------------------------------------------------------------------------------+
```

### Contrast Compliance
All primary interactive text and control elements maintain a minimum contrast ratio of 7:1 against their adjacent backgrounds, surpassing WCAG AAA standards. This prevents legibility loss during mid-day driving.

---

## 3. Typography Hierarchy

### 3.1 Font Selection
- **Latin Typography (French and English)**: Inter, with Outfit for numerical data and display headings. Numbers feature tabular figures (`tnum`) to eliminate jitter during real-time fare meter and countdown updates.
- **Arabic and Darija Typography**: Cairo, paired with Readex Pro for compact navigational labels. These typefaces maintain clear legibility at smaller weights and provide proportional baseline alignment alongside Latin elements in mixed receipts.

### 3.2 Scale and Legibility Thresholds

```
Scale Name         Font Size (sp)   Line Height   Font Weight     Usage
Display Large      32               38            Bold (700)      Fare summary, total DZD
Display Medium     24               30            SemiBold (600)  Trip status headers
Title / Heading    20               26            Bold (700)      Driver name, vehicle plate
Body Large         18               24            Medium (500)    Driver cockpit metrics
Body Standard      16               22            Regular (400)   Addresses, instructions
Caption / Micro    13               18            Medium (500)    Timestamps, legal tags
```

---

## 4. Driver Cockpit Ergonomics and Dashcam Controls

### 4.1 Minimal Cognitive Load Layout
The driver in-cockpit screen avoids dense information grids. The primary view emphasizes three elements:
1. Full-screen map guidance with high-contrast route path.
2. Next-turn navigation card (minimum 80 dp height).
3. Bottom action tray containing the single primary step ("Arrived", "Start Trip", "Complete Trip") stretching across the entire device width.

```
+---------------------------------------------------------+
| [=] Online: Ready         [Speed: 45 km/h]      (o) 100%|
+---------------------------------------------------------+
|  +---------------------------------------------------+  |
|  | [<- 150m] Turn Left on Boulevard Mohamed V        |  |
|  +---------------------------------------------------+  |
|                                                         |
|                     [ MAP CANVAS ]                      |
|                                                         |
|             ( Taxi Vehicle Marker )                     |
|                        |                                |
|                        v                                |
|             [=== Route Polyline ===]                    |
|                                                         |
|  [Mini Dashcam Status]                                  |
|  [ (REC) 1080p | Lockbox Ready ]                        |
|                                                         |
+---------------------------------------------------------+
|  Passenger: Karim B.               Fare: ~450 DZD       |
|  Destination: Place des Martyrs    Wait: 01:24          |
+---------------------------------------------------------+
| [             ARRIVED AT PICKUP POINT                 ] |
|                 (64dp Touch Target)                     |
+---------------------------------------------------------+
```

### 4.2 Dashcam Interface Treatment
- The video buffer operates in the background without obscuring map navigation.
- A discrete pill indicator positioned in the upper right displays dashcam health:
  - **Green Pill (`REC`)**: Camera feed unobstructed, circular buffer actively writing to cache.
  - **Red Pill with Pulse (`LOCKED`)**: G-force shock detected or SOS triggered. Incident clip locked and actively transferring to cloud storage.
  - **Amber Pill (`OBSTRUCTED`)**: Vision engine detects that the camera lens is blocked by windshield clutter or poor cradle alignment.
- Tapping the indicator opens an optional 120x80 dp picture-in-picture preview window for camera alignment during cradle setup.

---

## 5. Rider Interface and Booking Experience

### 5.1 Map-Centric Exploration
The rider home view opens immediately onto a clean map canvas centered on the user's current GPS location.
- Nearby certified taxis are rendered with official taxi roof-light icons reflecting real-time heading.
- A floating destination input card is placed in the lower third of the screen, within thumb reach on large smartphones.

### 5.2 Regulatory Trust Badges
When a driver is assigned, the vehicle card highlights government certification:
- Gold verified badge containing the municipal district and license identifier (such as *Agrément Alger N° 1420*).
- Star rating and total verified trips completed.
- Direct quick-actions for in-app voice call, SMS, and WhatsApp trip share link.

```
+---------------------------------------------------------+
| < Back to Map           RIDE CONFIRMED                  |
+---------------------------------------------------------+
|  +--------+  Mohamed Amine S.                           |
|  | Driver |  [★ 4.92] (1,420 trips)                     |
|  | Photo  |  [✓ Agrément DTW Alger: N° 04-1829]         |
|  +--------+                                             |
|  Vehicle: Peugeot 301 (White)                           |
|  Plate: 10482 - 116 - 16                                |
+---------------------------------------------------------+
|  Pickup in: 3 min (850 m away)                          |
+---------------------------------------------------------+
|  [ Call Driver ]  [ Message ]  [ Share Trip via Link ]  |
+---------------------------------------------------------+
|  [                  EMERGENCY SOS                     ] |
|  [          (Hold 2 Seconds to Trigger)               ] |
+---------------------------------------------------------+
```

---

## 6. Accessibility, Motion, and Micro-Interactions

### 6.1 Safety SOS Interaction Pattern
Accidental triggering of emergency alerts disrupts dispatch operations. The SOS control uses a deliberate interaction model:
- The user must perform a continuous 2.0-second hold or a deliberate horizontal slide across a dedicated red slider track.
- A circular haptic pulse pattern confirms the activation.
- A 5-second countdown with an audible abort button allows cancellation before external emergency services are contacted.

### 6.2 Motion Design Principles
- Transitions between booking states use smooth spring physics with a maximum duration of 250 milliseconds.
- Vehicle markers interpolate smoothly between coordinate updates using dead reckoning calculations, preventing jarring jumps during location updates.
- Animations respect system accessibility settings. If `reduce-motion` is active, transitions switch to instantaneous opacity cuts.
