# Valhalla Algeria OSM Tile Build Script for Windows PowerShell
# Downloads the Geofabrik Algeria extract and builds Valhalla routing tiles in a Docker container

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$valhallaDir = Join-Path $projectRoot "docker\volumes\valhalla_tiles"
$configSource = Join-Path $projectRoot "docker\valhalla\valhalla.json"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   NAQL DZ: BUILD DES TUILES VALHALLA ALGERIE (OSM)       " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $valhallaDir)) {
    New-Item -ItemType Directory -Force -Path $valhallaDir | Out-Null
    Write-Host "[+] Repertoire des tuiles cree: $valhallaDir" -ForegroundColor Green
}

# Copy base configuration
Copy-Item -Force $configSource (Join-Path $valhallaDir "valhalla.json")

# Download Algeria extract if not present
$osmPbfPath = Join-Path $valhallaDir "algeria-latest.osm.pbf"
if (-not (Test-Path $osmPbfPath)) {
    Write-Host "[*] Telechargement de l'extrait OSM Algerie depuis Geofabrik (~130 Mo)..." -ForegroundColor Yellow
    $url = "https://download.geofabrik.de/africa/algeria-latest.osm.pbf"
    Invoke-WebRequest -Uri $url -OutFile $osmPbfPath
    Write-Host "[+] Telechargement termine avec succes." -ForegroundColor Green
} else {
    Write-Host "[+] Extrait OSM deja present: $osmPbfPath" -ForegroundColor Green
}

# Run Valhalla Docker container to build tiles
Write-Host "[*] Compilation des tuiles routieres Valhalla en cours..." -ForegroundColor Yellow
docker run --rm -v "${valhallaDir}:/custom_files" `
    ghcr.io/valhalla/valhalla:latest `
    valhalla_build_tiles -c /custom_files/valhalla.json /custom_files/algeria-latest.osm.pbf

Write-Host "[+] Tuiles Valhalla compilees avec succes dans $valhallaDir" -ForegroundColor Green
Write-Host "[*] Vous pouvez demarrer le conteneur Valhalla via docker-compose up -d valhalla" -ForegroundColor Cyan
