@echo off
chcp 65001 >nul
title Claude Office
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Necesitas Node.js para abrir Claude Office.
  echo   Se abre la web de descarga: instala la version LTS y vuelve a hacer doble clic aqui.
  echo.
  start "" https://nodejs.org/es
  pause
  exit /b
)
node server.js
pause
