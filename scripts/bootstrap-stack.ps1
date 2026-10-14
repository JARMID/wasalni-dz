# ============================================================================
# ALGERIA SMART TAXI PLATFORM - WINDOWS/WSL2 BOOTSTRAP SCRIPT
# Starts the trimmed self-hosted Supabase and MinIO stack
# ============================================================================

$DockerDir = Join-Path $PSScriptRoot "..\docker"
$EnvFile = Join-Path $DockerDir ".env"
$EnvExample = Join-Path $DockerDir ".env.example"

if (-not (Test-Path $EnvFile)) {
    Write-Host "[i] No .env found. Creating from .env.example..." -ForegroundColor Cyan
    Copy-Item $EnvExample $EnvFile
}

Write-Host "[*] Launching trimmed self-hosted Docker stack (<1.5 GB RAM footprint)..." -ForegroundColor Green
docker compose -f (Join-Path $DockerDir "docker-compose.yml") --env-file $EnvFile up -d

Write-Host "`n[✓] Stack initialized successfully!" -ForegroundColor Green
Write-Host "------------------------------------------------------------"
Write-Host "Supabase Studio (Web UI): http://localhost:54323" -ForegroundColor Yellow
Write-Host "API Gateway (Kong):       http://localhost:8000" -ForegroundColor Yellow
Write-Host "PostgreSQL Database:      localhost:54322 (user: postgres)" -ForegroundColor Yellow
Write-Host "MinIO Console:            http://localhost:9001 (user: admin_dz)" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------"
