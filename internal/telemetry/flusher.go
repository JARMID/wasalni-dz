package telemetry

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	_ "github.com/lib/pq"
)

// TrajectoryPointData represents a single sampled telematics coordinate
type TrajectoryPointData struct {
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
	SpeedKmh     float32 `json:"speed_kmh"`
	TimestampUTC int64   `json:"timestamp_utc"`
}

// TrajectoryFlusher batches 1Hz telemetry points in memory and flushes LineStringM geometries to PostGIS
type TrajectoryFlusher struct {
	db          *sql.DB
	buffer      map[string][]*TrajectoryPointData
	mu          sync.Mutex
	flushTicker *time.Ticker
	stopChan    chan struct{}
}

// NewTrajectoryFlusher initializes the trajectory batcher
func NewTrajectoryFlusher(db *sql.DB) *TrajectoryFlusher {
	return &TrajectoryFlusher{
		db:          db,
		buffer:      make(map[string][]*TrajectoryPointData),
		flushTicker: time.NewTicker(60 * time.Second),
		stopChan:    make(chan struct{}),
	}
}

// BufferPoint appends a new point to the active ride's in-memory trajectory
func (tf *TrajectoryFlusher) BufferPoint(rideID string, pt *TrajectoryPointData) {
	tf.mu.Lock()
	defer tf.mu.Unlock()
	tf.buffer[rideID] = append(tf.buffer[rideID], pt)
}

// Start begins the 60-second background flush loop
func (tf *TrajectoryFlusher) Start() {
	go func() {
		for {
			select {
			case <-tf.flushTicker.C:
				tf.flushAll()
			case <-tf.stopChan:
				tf.flushAll()
				return
			}
		}
	}()
}

// Stop terminates the flusher cleanly
func (tf *TrajectoryFlusher) Stop() {
	tf.flushTicker.Stop()
	close(tf.stopChan)
}

func (tf *TrajectoryFlusher) flushAll() {
	tf.mu.Lock()
	if len(tf.buffer) == 0 {
		tf.mu.Unlock()
		return
	}

	snapshot := tf.buffer
	tf.buffer = make(map[string][]*TrajectoryPointData)
	tf.mu.Unlock()

	for rideID, points := range snapshot {
		if len(points) < 2 {
			continue
		}
		if err := tf.persistTrajectory(rideID, points); err != nil {
			log.Printf("[Flusher] Error persisting trajectory for ride %s: %v", rideID, err)
		} else {
			log.Printf("[Flusher] Persisted %d trajectory points for ride %s to PostGIS", len(points), rideID)
		}
	}
}

// BuildLineStringMWKT builds PostGIS WKT: LINESTRING M (lng lat speed timestamp, ...)
func BuildLineStringMWKT(points []*TrajectoryPointData) string {
	var sb strings.Builder
	sb.WriteString("LINESTRING M (")
	for i, pt := range points {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(fmt.Sprintf("%.6f %.6f %.1f %d", pt.Longitude, pt.Latitude, pt.SpeedKmh, pt.TimestampUTC))
	}
	sb.WriteString(")")
	return sb.String()
}

func (tf *TrajectoryFlusher) persistTrajectory(rideID string, points []*TrajectoryPointData) error {
	if tf.db == nil {
		return nil // Operating in standalone mode without active postgres connection
	}

	wkt := BuildLineStringMWKT(points)
	startTime := time.Unix(points[0].TimestampUTC, 0).UTC()
	endTime := time.Unix(points[len(points)-1].TimestampUTC, 0).UTC()

	query := `
		INSERT INTO public.ride_trajectories (
			ride_id, 
			trajectory_linestring_m, 
			point_count, 
			started_at, 
			ended_at
		) VALUES (
			$1, 
			ST_GeomFromText($2, 4326), 
			$3, 
			$4, 
			$5
		)
		ON CONFLICT (ride_id) DO UPDATE SET
			trajectory_linestring_m = ST_GeomFromText($2, 4326),
			point_count = EXCLUDED.point_count,
			ended_at = EXCLUDED.ended_at;
	`

	_, err := tf.db.Exec(query, rideID, wkt, len(points), startTime, endTime)
	return err
}
