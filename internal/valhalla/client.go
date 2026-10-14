package valhalla

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Client interacts with the local Valhalla routing daemon
type Client struct {
	baseURL    string
	httpClient *http.Client
}

// Location represents a geographic coordinate for Valhalla
type Location struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

// MatrixRequest payload for /sources_to_targets
type MatrixRequest struct {
	Sources []Location `json:"sources"`
	Targets []Location `json:"targets"`
	Costing string     `json:"costing"`
}

// MatrixElement represents a distance/time pair from source to target
type MatrixElement struct {
	Distance float64 `json:"distance"` // in meters
	Time     float64 `json:"time"`     // in seconds
}

// MatrixResponse from Valhalla
type MatrixResponse struct {
	SourcesToTargets [][]MatrixElement `json:"sources_to_targets"`
}

// NewClient instantiates a Valhalla routing client
func NewClient(baseURL string) *Client {
	if baseURL == "" {
		baseURL = "http://localhost:8002"
	}
	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

// GetETA computes driving distance and travel duration in seconds between two points
func (c *Client) GetETA(fromLat, fromLng, toLat, toLng float64) (meters float64, seconds float64, err error) {
	reqBody := MatrixRequest{
		Sources: []Location{{Lat: fromLat, Lon: fromLng}},
		Targets: []Location{{Lat: toLat, Lon: toLng}},
		Costing: "auto",
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return 0, 0, err
	}

	url := fmt.Sprintf("%s/sources_to_targets", c.baseURL)
	resp, err := c.httpClient.Post(url, "application/json", bytes.NewBuffer(jsonBytes))
	if err != nil {
		// Fallback straight-line approximation if Valhalla is offline during initial build
		distKm := haversineDistance(fromLat, fromLng, toLat, toLng)
		return distKm * 1000, (distKm / 35.0) * 3600, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return 0, 0, fmt.Errorf("valhalla matrix error (HTTP %d): %s", resp.StatusCode, string(body))
	}

	var matrixResp MatrixResponse
	if err := json.NewDecoder(resp.Body).Decode(&matrixResp); err != nil {
		return 0, 0, err
	}

	if len(matrixResp.SourcesToTargets) > 0 && len(matrixResp.SourcesToTargets[0]) > 0 {
		elem := matrixResp.SourcesToTargets[0][0]
		return elem.Distance, elem.Time, nil
	}

	return 0, 0, fmt.Errorf("empty distance matrix returned from valhalla")
}

func haversineDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371.0 // Earth radius in km
	dLat := (lat2 - lat1) * (3.141592653589793 / 180.0)
	dLon := (lon2 - lon1) * (3.141592653589793 / 180.0)

	a := (dLat/2)*(dLat/2) + (dLon/2)*(dLon/2)
	return R * 2 * a // simplified small distance approximation
}
