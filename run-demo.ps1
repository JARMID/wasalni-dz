# ============================================================================
# NAQL DZ - ALGERIA SMART TAXI DEMO LAUNCHER
# Starts the interactive demo on http://localhost:3000
# ============================================================================

$DemoDir = Join-Path $PSScriptRoot "demo"

Write-Host "======================================================================" -ForegroundColor Yellow
Write-Host "   NAQL DZ - PLATEFORME INTELLIGENTE DES TAXIS REGLEMENTES EN ALGERIE" -ForegroundColor Yellow
Write-Host "   Demonstrateur Live: Decret 12-230, Dashcam, Spare Change Flywheel" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "[*] Lancement du serveur sur http://localhost:3000 ..." -ForegroundColor Green
Write-Host ""

Set-Location $DemoDir
npm run dev
