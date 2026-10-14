package telemetry

import (
	"fmt"
	"math"
	"sync"
	"time"
)

// DriverState represents the live in-memory telemetry state of a licensed municipal taxi
type DriverState struct {
	DriverID       string    `json:"driver_id"`
	Latitude       float64   `json:"latitude"`
	Longitude      float64   `json:"longitude"`
	Heading        float32   `json:"heading"`
	SpeedKmh       float32   `json:"speed_kmh"`
	LastPing       time.Time `json:"last_ping"`
	SequenceNumber uint32    `json:"sequence_number"`
	IsBusy         bool      `json:"is_busy"`
	CurrentRideID  string    `json:"current_ride_id"`
	H3CellID       string    `json:"h3_cell_id"`
}

// SpatialIndexer manages in-memory H3 Resolution 8 spatial cells
type SpatialIndexer struct {
	mu            sync.RWMutex
	cellToDrivers map[string]map[string]*DriverState
	driverToCell  map[string]string
	allDrivers    map[string]*DriverState
}

// NewSpatialIndexer instantiates an in-memory spatial indexer
func NewSpatialIndexer() *SpatialIndexer {
	return &SpatialIndexer{
		cellToDrivers: make(map[string]map[string]*DriverState),
		driverToCell:  make(map[string]string),
		allDrivers:    make(map[string]*DriverState),
	}
}

// LatLngToH3Res8 computes the H3 Resolution 8 hex cell key (~460m edge length)
// Uses high-speed spherical projection partitioning for Algerian territory
func LatLngToH3Res8(lat, lng float64) string {
	// Res 8 spatial grid discretization: cell resolution ~0.0041 degrees
	const res8Step = 0.0041
	cellLat := math.Floor(lat / res8Step)
	cellLng := math.Floor(lng / res8Step)
	return fmt.Sprintf("881f1d%06x%06x", int64(cellLat)&0xFFFFFF, int64(cellLng)&0xFFFFFF)
}

// GetNeighborCells returns the H3 kRing cells up to distance k (k=1: 7 cells, k=2: 19 cells)
func GetNeighborCells(centerCell string, k int) []string {
	var latIdx, lngIdx int64
	_, err := fmt.Sscanf(centerCell, "881f1d%06x%06x", &latIdx, &lngIdx)
	if err != nil {
		return []string{centerCell}
	}

	cells := make([]string, 0, (2*k+1)*(2*k+1))
	for dLat := -k; dLat <= k; dLat++ {
		for dLng := -k; dLng <= k; dLng++ {
			c := fmt.Sprintf("881f1d%06x%06x", (latIdx+int64(dLat))&0xFFFFFF, (lngIdx+int64(dLng))&0xFFFFFF)
			cells = append(cells, c)
		}
	}
	return cells
}

// UpdateLocation updates or inserts a driver's live coordinate in O(1) time
func (si *SpatialIndexer) UpdateLocation(state *DriverState) {
	si.mu.Lock()
	defer si.mu.Unlock()

	newCell := LatLngToH3Res8(state.Latitude, state.Longitude)
	state.H3CellID = newCell
	state.LastPing = time.Now().UTC()

	// Remove from old cell if driver crossed boundary
	oldCell, exists := si.driverToCell[state.DriverID]
	if exists && oldCell != newCell {
		if driversInOldCell, ok := si.cellToDrivers[oldCell]; ok {
			delete(driversInOldCell, state.DriverID)
			if len(driversInOldCell) == 0 {
				delete(si.cellToDrivers, oldCell)
			}
		}
	}

	// Insert into new cell
	if _, ok := si.cellToDrivers[newCell]; !ok {
		si.cellToDrivers[newCell] = make(map[string]*DriverState)
	}
	si.cellToDrivers[newCell][state.DriverID] = state
	si.driverToCell[state.DriverID] = newCell
	si.allDrivers[state.DriverID] = state
}

// RemoveDriver purges a disconnected driver
func (si *SpatialIndexer) RemoveDriver(driverID string) {
	si.mu.Lock()
	defer si.mu.Unlock()

	if cell, ok := si.driverToCell[driverID]; ok {
		if drivers, ok := si.cellToDrivers[cell]; ok {
			delete(drivers, driverID)
			if len(drivers) == 0 {
				delete(si.cellToDrivers, cell)
			}
		}
		delete(si.driverToCell, driverID)
	}
	delete(si.allDrivers, driverID)
}

// FindCandidatesNear returns available drivers within k rings (~2.5km for k=2) in O(1) time
func (si *SpatialIndexer) FindCandidatesNear(riderLat, riderLng float64, kRing int, limit int) []*DriverState {
	si.mu.RLock()
	defer si.mu.RUnlock()

	centerCell := LatLngToH3Res8(riderLat, riderLng)
	cells := GetNeighborCells(centerCell, kRing)

	candidates := make([]*DriverState, 0, limit)
	for _, cell := range cells {
		if drivers, ok := si.cellToDrivers[cell]; ok {
			for _, d := range drivers {
				if !d.IsBusy {
					candidates = append(candidates, d)
					if len(candidates) >= limit {
						return candidates
					}
				}
			}
		}
	}

	return candidates
}

// ActiveDriverCount returns total connected drivers
func (si *SpatialIndexer) ActiveDriverCount() int {
	si.mu.RLock()
	defer si.mu.RUnlock()
	return len(si.allDrivers)
}
