# NAQL DZ • Plateforme Intelligente des Taxis Réglementés en Algérie
## Guide de Démonstration Exécutive pour Présentation Client & Entreprise

---

## 1. Résumé Exécutif & Positionnement Stratégique

Les plateformes VTC traditionnelles en Algérie (Yassir, Heetch, InDrive) opèrent dans une zone grise juridique en recrutant des particuliers sans licence commerciale, exposant leurs chauffeurs à la mise en fourrière lors des barrages de police et de gendarmerie.

**NAQL DZ résout ce défi à la racine** en intégrant exclusivement les chauffeurs de taxi professionnels détenteurs d'un **Agrément de Transport (DTW)** et d'un **Livret de Place** sous le **Décret exécutif n° 12-230**, avec une licence d'exploitation officielle sous le code **CNRC 604103**.

### Les Innovations Majeures Présentées dans ce Démonstrateur :
1. **Les 3 Modes Réglementaires (Décret 12-230)** :
   - Mode 1: Taxi Individuel avec compteur fiscal + frais d'approche réglementés de 100 DA.
   - Mode 2: Taxi Collectif Urbain avec réservation individuelle sur 4 sièges distincts (50 DA/place).
   - Mode 3: Taxi Inter-Wilaya au départ de la Gare Routière du Caroubier (lignes vers Blida, Tizi Ouzou, Boumerdes, Bouira).
2. **Télématique & Dashcam Intégrée (Loi 25-11)** :
   - Tampon circulaire 720p@15fps avec affichage optique HUD (timecode milliseconde, vitesse, coordonnées GPS réelles d'Alger).
   - Accéléromètre dynamique G-Sensor avec simulation de choc à 2.84G et bouton SOS d'urgence.
   - Verrouillage instantané et chiffrement enveloppe AES-256-GCM avec quorum de secret Shamir 2-sur-3 stocké en infrastructure locale (MinIO S3 Alger).
   - Délestage thermique cockpit (NORMAL 38°C -> MODERATE 41°C -> SEVERE 47°C -> CRITICAL 52°C) adapté à l'ensoleillement estival algérien.
3. **Le "Spare Change Flywheel" (Moteur TrustDesk)** :
   - Conversion automatique de la monnaie physique restante en solde digital TrustDesk pour le passager (ex: course à 850 DA payée avec un billet de 1 000 DA = 150 DA crédités immédiatement sur le compte TrustDesk).
4. **Passerelle Chargily Pay V2 Intégrée** :
   - Rechargement instantané des soldes chauffeur et passager par carte CIB et Edahabia avec simulation 3D-Secure SATIM (code SMS à 6 chiffres).
5. **Grand Livre Comptable en Partie Double** :
   - Traçabilité financière immuable de chaque écriture entre les comptes 1010 (Espèces chauffeurs), 1020 (Escrow Chargily), 2010 (Passager TrustDesk), 2020 (Solde opérationnel chauffeur) et 4010 (Revenus plateforme).
   - Contrôle d'équilibre comptable en temps réel (Actif = Passif + Capitaux) et export du journal en fichier CSV.
6. **Synthèse Vocale & Audio Tactile** :
   - Moteur Web Audio natif produisant des signaux sonores pour les clics, les carillons de confirmation, les cliquetis de caisse enregistreuse et les alarmes de choc.
   - Synthèse vocale de dispatching pour les chauffeurs au volant.

---

## 2. Comment Lancer la Démonstration (En 1 Clic)

### Option A (Double-Clic Windows) :
Double-cliquez simplement sur le fichier :
```
d:\dash\run-demo.bat
```

### Option B (PowerShell) :
```powershell
cd d:\dash
.\run-demo.ps1
```

Ouvrez ensuite votre navigateur sur : **`http://localhost:3000`**

---

## 3. Parcours de Démonstration Guidé (Scénario en 6 Étapes)

### Étape 1 : Vue "Multi-Device Sync" (Double Écran Simultané)
- Dans la barre supérieure, sélectionnez **Multi-Device Sync**.
- Vous visualisez à gauche la **Tablette Cockpit du Chauffeur** avec sa Dashcam active, au centre la **Carte interactive d'Alger** avec la grille hexagonale H3 Résolution 8 et la flotte municipale en patrouille, et à droite le **Smartphone du Passager**.

### Étape 2 : Commande de Course par le Passager
1. Sur le smartphone passager (à droite) :
   - Testez les 3 modes : **Individuel**, **Collectif** (avec sélection interactive des places 1 à 4), ou **Inter-Wilaya** (avec choix de ligne au Caroubier).
   - Sélectionnez le mode **Individuel**.
   - Point de prise en charge : **Kouba (Mairie / Place Centrale)**.
   - Destination : **Grande Poste (Alger Centre)**.
   - Mode de paiement : **Espèces**.
   - Cliquez sur **COMMANDER UN TAXI AGRÉÉ**.

### Étape 3 : Réception de l'Alerte & Cockpit Chauffeur
1. Le cockpit chauffeur (à gauche) bascule en alerte avec carillon et compte à rebours de **15 secondes**.
2. Cliquez sur **ACCEPTER LA COURSE**.
3. Observez le taxi se déplacer avec rotation fluide sur la carte vers Kouba.
4. Cliquez sur **JE SUIS ARRIVÉ AU POINT DE PRISE**.

### Étape 4 : Embarquement Sécurisé par Code PIN
1. Le smartphone passager affiche un **Code PIN de Prise en Charge** (ex: `8492`) avec bouton de copie rapide.
2. Saisissez ce code dans le cockpit chauffeur et cliquez sur **DÉMARRER COMPTEUR & COURSE**.
3. La course passe en cours vers Alger Centre.
4. Sur la Dashcam, testez :
   - Le bouton **Simuler Impact 2.8G** : Déclenche l'alarme sonar et verrouille le bloc vidéo chiffré AES-256-GCM.
   - Le bouton **Thermal State** : Fait alterner l'état thermique de NORMAL (38°C) à SEVERE (47°C).
   - Le bouton **Webcam Réelle** : Permet d'activer la caméra réelle de votre ordinateur pour tester l'affichage tête haute en direct.

### Étape 5 : Clôture de Course & Le "Spare Change Flywheel"
1. Cliquez sur **ARRIVÉ À DESTINATION • ENCAISSER**.
2. Entrez le montant affiché par le compteur fiscal (ex: `750` DA) + frais d'approche (100 DA) = **Total : 850.00 DZD**.
3. Cliquez sur **ENCAISSER & CONVERTIR MONNAIE TRUSTDESK**.
4. La modale du **Spare Change Flywheel** s'ouvre :
   - Sélectionnez le billet remis par le passager : **1 000 DA**.
   - La monnaie due est de **150.00 DZD**.
   - Cliquez sur **Valider & Créditer 150.00 DZD**.
5. Explosion de confettis et carillon de caisse :
   - Le solde du passager augmente instantanément de 150 DZD.
   - Le solde opérationnel du chauffeur est débité de 150 DZD + 100 DZD de commission.
   - Le chauffeur garde le billet physique de 1 000 DA.

### Étape 6 : Inspection du Grand Livre & Dispatch
1. Cliquez sur l'onglet **TrustDesk Grand Livre** en haut :
   - Vérifiez l'égalité comptable Débit / Crédit (Δ 0.00 DA).
   - Téléchargez le journal comptable via le bouton **Export CSV**.
2. Cliquez sur l'onglet **Dispatch & Sûreté** :
   - Visualisez la fiche réglementaire du chauffeur avec son Agrément DTW (`16/2024/0482`) et son Livret de Place.
   - Inspectez le **Lockbox Évidences Dashcam** avec la répartition de clé Shamir 2-sur-3 et le bouton de transmission au Parquet.

---

## 4. Outils et Modules Backend Implémentés

- **Module 1 : Base de Données & Schéma Core** :
  - `supabase/migrations/20261014000001_core_schema.sql` (10 tables, RLS, fonction PL/pgSQL sécurisée `execute_spare_change_credit` avec verrou `FOR UPDATE`).
  - `supabase/seed.sql` (Comptes GL 1010, 1020, 4010 déployés sur l'instance cloud dédiée `jgctorgztxwrgdkfkuxv`).
- **Module 2 : Moteur de Routage Valhalla Algérie** :
  - `docker/valhalla/valhalla.json` (Configuration routière adaptée aux spécificités d'Alger).
  - `scripts/build-valhalla-tiles.ps1` et `.sh` (Téléchargement de l'extrait OpenStreetMap Algérie et compilation des tuiles).
- **Module 3 : Démon d'Ingestion Télématique 1Hz en Go** :
  - `proto/telemetry.proto` (Format binaire compact ~32 octets).
  - `internal/telemetry/h3index.go` (Indexation spatiale mémoire H3 Résolution 8 en O(1)).
  - `internal/telemetry/hub.go` (Gestionnaire de connexions WebSockets concurrentes).
  - `internal/telemetry/flusher.go` (Compression et écriture périodique des trajectoires PostGIS LineStringM).
  - `internal/valhalla/client.go` (Client HTTP pour matrice de distance et calcul d'ETA en millisecondes).
  - `cmd/telemetry-daemon/main.go` (Point d'entrée du serveur avec endpoints `/ws`, `/candidates`, `/health`).
- **Module 4 : Monorepo Mobile Flutter 3.44 / Dart 3.12** :
  - `mobile/packages/naql_core` (Modèles de domaine, machine d'états scellée `RideState`, chiffrement d'enveloppe avec partage de clé Shamir 2-sur-3 en arithmétique GF(256), machine d'états thermique 38°C à 52°C, tests unitaires vérifiés).
  - `mobile/packages/driver_app` (Application tablette cockpit chauffeur avec badge d'agrégation Décret 12-230, viseur dashcam CameraX, déclencheur choc 2.84G, taximètre fiscal et dialogue reliquat TrustDesk).
  - `mobile/packages/rider_app` (Application smartphone passager avec sélecteur 3 modes, validation par code PIN, portefeuille TrustDesk et intégration de recharge CIB/Edahabia).
- **Module 5 : Service de Vérification des Reçus BaridiMob** :
  - `services/baridimob_verifier/parser.py` (Extraction des données de virement Algérie Poste et validation de clé RIP par formule modulo 97).
  - `services/baridimob_verifier/verifier.py` (Garde anti-rejeu par signature d'idempotence SHA-256 et écriture des écritures comptables en partie double).
  - `services/baridimob_verifier/test_verifier.py` (Suite de tests unitaires validée avec succès).
- **Synchronisation Temps Réel Multi-Écrans** :
  - Diffusion en direct des statuts, positions et recharges via Supabase Realtime Broadcast (`naql_fleet_room`).
  - Accès réseau local disponible à l'adresse `http://192.168.100.20:3000` pour connecter un smartphone ou une tablette en direct.

---

## 5. Ce que Vous Devez Préparer pour la Suite (Checklist Projet)

1. **Clés d'API Marchand Chargily Pay V2** :
   - Pour passer du simulateur au paiement bancaire réel CIB et Edahabia, créez un compte marchand sur [chargily.com](https://chargily.com) et renseignez vos clés dans le fichier `.env` (`VITE_CHARGILY_PUBLIC_KEY` et `CHARGILY_SECRET_KEY`).
2. **Convention avec l'Union Nationale des Taxis (UGCAA / SNTL)** :
   - Présentez ce démonstrateur aux représentants syndicaux des taxis d'Alger pour négocier l'intégration pilote des 50 premiers chauffeurs municipaux de Sidi M'Hamed et Bab El Oued.
3. **Tablettes Cockpit Android pour les Véhicules Pilotes** :
   - Modèle recommandé : Tablettes 8 pouces avec connectivité 4G LTE et support de pare-brise ventilé (pour limiter l'exposition au soleil estival).
4. **Hébergement National Souverain (Loi 18-07)** :
   - Le schéma Supabase déployé sur le cloud (`jgctorgztxwrgdkfkuxv`) est opérationnel dès maintenant. Pour la production définitive, déployez la stack `docker/docker-compose.yml` sur un serveur dédié situé dans un centre de données en Algérie (Algérie Télécom Djezzy ou Ooredoo Business).

