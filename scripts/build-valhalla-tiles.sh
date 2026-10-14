#!/usr/bin/env bash
# Valhalla Algeria OSM Tile Build Script for Ubuntu / Debian / WSL2
# Downloads the Geofabrik Algeria extract and builds Valhalla routing tiles in a Docker container

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VALHALLA_DIR="$PROJECT_ROOT/docker/volumes/valhalla_tiles"
CONFIG_SOURCE="$PROJECT_ROOT/docker/valhalla/valhalla.json"

echo "=========================================================="
echo "   NAQL DZ: BUILD DES TUILES VALHALLA ALGERIE (OSM)       "
echo "=========================================================="

mkdir -p "$VALHALLA_DIR"
cp -f "$CONFIG_SOURCE" "$VALHALLA_DIR/valhalla.json"

OSM_PBF="$VALHALLA_DIR/algeria-latest.osm.pbf"
if [ ! -f "$OSM_PBF" ]; then
    echo "[*] Telechargement de l'extrait OSM Algerie depuis Geofabrik (~130 Mo)..."
    curl -L -o "$OSM_PBF" https://download.geofabrik.de/africa/algeria-latest.osm.pbf
    echo "[+] Telechargement termine."
else
    echo "[+] Extrait OSM deja present: $OSM_PBF"
fi

echo "[*] Compilation des tuiles routieres Valhalla en cours..."
docker run --rm -v "$VALHALLA_DIR:/custom_files" \
    ghcr.io/valhalla/valhalla:latest \
    valhalla_build_tiles -c /custom_files/valhalla.json /custom_files/algeria-latest.osm.pbf

echo "[+] Tuiles Valhalla compilees avec succes dans $VALHALLA_DIR"
echo "[*] Pret pour demarrage via docker compose up -d valhalla"
