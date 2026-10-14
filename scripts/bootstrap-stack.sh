#!/usr/bin/env bash
# ============================================================================
# ALGERIA SMART TAXI PLATFORM - UBUNTU SPARE PC BOOTSTRAP SCRIPT
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../docker"

if [ ! -f "$DOCKER_DIR/.env" ]; then
    echo "[i] Creating .env from .env.example..."
    cp "$DOCKER_DIR/.env.example" "$DOCKER_DIR/.env"
fi

echo "[*] Launching trimmed self-hosted Docker stack (<1.5 GB RAM footprint)..."
docker compose -f "$DOCKER_DIR/docker-compose.yml" --env-file "$DOCKER_DIR/.env" up -d

echo ""
echo "[✓] Stack initialized successfully!"
echo "------------------------------------------------------------"
echo "Supabase Studio (Web UI): http://localhost:54323"
echo "API Gateway (Kong):       http://localhost:8000"
echo "PostgreSQL Database:      localhost:54322 (user: postgres)"
echo "MinIO Console:            http://localhost:9001 (user: admin_dz)"
echo "------------------------------------------------------------"
