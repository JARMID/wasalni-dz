@echo off
title NAQL DZ - Algeria Smart Taxi Demo Platform
cd /d "%~dp0\demo"
echo ======================================================================
echo    NAQL DZ - PLATEFORME INTELLIGENTE DES TAXIS REGLEMENTES EN ALGERIE
echo    Demonstrateur Live: Decret 12-230, Dashcam, Spare Change Flywheel
echo ======================================================================
echo.
echo Lancement du serveur de demonstration sur http://localhost:3000 ...
echo.
npm run dev
pause
