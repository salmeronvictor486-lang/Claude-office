#!/bin/bash
# Doble clic en macOS para abrir Claude Office
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Necesitas Node.js: se abre la web de descarga."; open "https://nodejs.org/es"; read -n 1; exit 1
fi
node server.js
