package telemetry

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow internal fleet tablets
	},
}

// Client represents an active driver tablet WebSocket session
type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	driverID string
	send     chan []byte
}

// Hub orchestrates all active driver WebSocket connections and telematics ingestion
type Hub struct {
	indexer    *SpatialIndexer
	flusher    *TrajectoryFlusher
	clients    map[string]*Client
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

// NewHub initializes the telematics WebSocket hub
func NewHub(indexer *SpatialIndexer, flusher *TrajectoryFlusher) *Hub {
	return &Hub{
		indexer:    indexer,
		flusher:    flusher,
		clients:    make(map[string]*Client),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Run starts the concurrent hub event loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.driverID] = client
			h.mu.Unlock()
			log.Printf("[Hub] Driver registered: %s (Total: %d)", client.driverID, len(h.clients))

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client.driverID]; ok {
				delete(h.clients, client.driverID)
				close(client.send)
				h.indexer.RemoveDriver(client.driverID)
			}
			h.mu.Unlock()
			log.Printf("[Hub] Driver disconnected: %s (Total: %d)", client.driverID, len(h.clients))
		}
	}
}

// HandleWebSocket upgrades incoming HTTP connections to 1Hz WebSocket streams
func (h *Hub) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	driverID := r.URL.Query().Get("driver_id")
	if driverID == "" {
		http.Error(w, "Missing driver_id query parameter", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("[WebSocket] Upgrade error: %v", err)
		return
	}

	client := &Client{
		hub:      h,
		conn:     conn,
		driverID: driverID,
		send:     make(chan []byte, 256),
	}

	h.register <- client

	go client.writePump()
	go client.readPump()
}

func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(4096)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		messageType, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("[Client] Read error: %v", err)
			}
			break
		}

		if messageType == websocket.BinaryMessage || messageType == websocket.TextMessage {
			// Parse driver 1Hz ping
			var state DriverState
			if err := json.Unmarshal(message, &state); err == nil {
				state.DriverID = c.driverID
				c.hub.indexer.UpdateLocation(&state)

				// If in active ride, buffer point for trajectory flusher
				if state.CurrentRideID != "" && state.IsBusy {
					c.hub.flusher.BufferPoint(state.CurrentRideID, &TrajectoryPointData{
						Latitude:     state.Latitude,
						Longitude:    state.Longitude,
						SpeedKmh:     state.SpeedKmh,
						TimestampUTC: time.Now().UTC().Unix(),
					})
				}
			}
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
