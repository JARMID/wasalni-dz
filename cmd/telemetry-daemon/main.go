package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"dz-smart-taxi/telemetry/internal/telemetry"
	"dz-smart-taxi/telemetry/internal/valhalla"

	_ "github.com/lib/pq"
)

func main() {
	log.Println("==========================================================")
	log.Println("   WASSLANI: 1Hz TELEMETRY INGESTION & H3 DISPATCH DAEMON ")
	log.Println("==========================================================")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	var db *sql.DB
	var err error

	if dbURL != "" {
		db, err = sql.Open("postgres", dbURL)
		if err != nil {
			log.Printf("[Warning] Could not connect to PostgreSQL: %v (running in-memory only)", err)
		} else {
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(5)
			log.Println("[Database] Connected to PostgreSQL/PostGIS for trajectory flushing")
		}
	}

	valhallaURL := os.Getenv("VALHALLA_URL")
	if valhallaURL == "" {
		valhallaURL = "http://localhost:8002"
	}
	valhallaClient := valhalla.NewClient(valhallaURL)

	// Initialize components
	indexer := telemetry.NewSpatialIndexer()
	flusher := telemetry.NewTrajectoryFlusher(db)
	flusher.Start()

	hub := telemetry.NewHub(indexer, flusher)
	go hub.Run()

	// Seed with simulated active Algiers municipal taxis for testing
	seedInitialDrivers(indexer)

	// HTTP Routing
	mux := http.NewServeMux()

	// 1. WebSocket 1Hz Telemetry Ingestion
	mux.HandleFunc("/ws", hub.HandleWebSocket)

	// 2. Candidate Driver Retrieval (H3 Res 8 + Valhalla ETA)
	mux.HandleFunc("/candidates", func(w http.ResponseWriter, r *http.Request) {
		latStr := r.URL.Query().Get("lat")
		lngStr := r.URL.Query().Get("lng")
		kStr := r.URL.Query().Get("k")

		lat, err1 := strconv.ParseFloat(latStr, 64)
		lng, err2 := strconv.ParseFloat(lngStr, 64)
		if err1 != nil || err2 != nil {
			http.Error(w, "Invalid lat/lng parameters", http.StatusBadRequest)
			return
		}

		kRing := 2
		if k, err := strconv.Atoi(kStr); err == nil && k > 0 && k <= 5 {
			kRing = k
		}

		startTime := time.Now()
		candidates := indexer.FindCandidatesNear(lat, lng, kRing, 15)

		// Enrich top candidates with Valhalla street ETAs
		type RankedCandidate struct {
			*telemetry.DriverState
			DistanceMeters float64 `json:"distance_meters"`
			ETASeconds     float64 `json:"eta_seconds"`
		}

		ranked := make([]RankedCandidate, 0, len(candidates))
		for _, cand := range candidates {
			distM, etaSec, _ := valhallaClient.GetETA(cand.Latitude, cand.Longitude, lat, lng)
			ranked = append(ranked, RankedCandidate{
				DriverState:    cand,
				DistanceMeters: distM,
				ETASeconds:     etaSec,
			})
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"candidates":            ranked,
			"candidate_count":       len(ranked),
			"h3_center_cell":        telemetry.LatLngToH3Res8(lat, lng),
			"compute_time_microsec": time.Since(startTime).Microseconds(),
		})
	})

	// 3. Health check
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":            "healthy",
			"timestamp_utc":     time.Now().UTC().Format(time.RFC3339),
			"active_drivers":    indexer.ActiveDriverCount(),
			"h3_resolution":     8,
			"ingestion_protocol": "Protobuf/WebSockets 1Hz",
		})
	})

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: mux,
	}

	// Graceful shutdown listener
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("[Server] Ingestion daemon listening on http://0.0.0.0:%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("[Server] Fatal error: %v", err)
		}
	}()

	<-stopChan
	log.Println("[Server] Graceful shutdown initiated...")

	flusher.Stop()
	if db != nil {
		db.Close()
	}

	log.Println("[Server] Telemetry daemon stopped safely.")
}

func seedInitialDrivers(indexer *telemetry.SpatialIndexer) {
	algiersTaxis := []struct {
		id  string
		lat float64
		lng float64
	}{
		{"ALG-16-0482", 36.7538, 3.0588}, // Grande Poste
		{"ALG-16-1102", 36.7262, 3.0872}, // Kouba
		{"ALG-16-3049", 36.7729, 3.0583}, // Bab El Oued
		{"ALG-16-8841", 36.7456, 3.0417}, // Telemly
		{"ALG-16-5520", 36.7865, 3.0592}, // Bologhine
	}

	for _, t := range algiersTaxis {
		indexer.UpdateLocation(&telemetry.DriverState{
			DriverID:       t.id,
			Latitude:       t.lat,
			Longitude:      t.lng,
			Heading:        180.0,
			SpeedKmh:       30.0,
			LastPing:       time.Now().UTC(),
			SequenceNumber: 1,
			IsBusy:         false,
		})
	}
	log.Printf("[Bootstrap] Seeded %d initial municipal taxis in Algiers H3 grid", len(algiersTaxis))
}
