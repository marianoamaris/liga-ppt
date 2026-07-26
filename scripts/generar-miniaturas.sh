#!/usr/bin/env bash
# Genera las miniaturas de las fotos de jugadores.
#
# Los originales son de cámara: 3-6 MB cada uno, y se muestran en fichas de
# 64 px. La carpeta FOTOS_JUGADORES pesa 286 MB, así que la página de Historia
# intentaba descargar ~250 MB para pintar unas miniaturas.
#
# Los originales se conservan intactos; solo se lee de ellos. Lo que entra en
# el bundle es esta carpeta derivada.
#
#   ./scripts/generar-miniaturas.sh
set -euo pipefail

ORIGEN="src/assets/FOTOS_JUGADORES"
DESTINO="src/assets/FOTOS_JUGADORES_MIN"
# 320 px cubre una ficha de 64 px hasta 3x de densidad de pantalla
LADO=320

command -v sips >/dev/null || { echo "Necesita sips (macOS)"; exit 1; }

mkdir -p "$DESTINO"
generadas=0

for archivo in "$ORIGEN"/*.{png,jpg,jpeg,PNG,JPG}; do
  [ -e "$archivo" ] || continue
  nombre="$(basename "$archivo")"
  # Los duplicados "(1)" no se usan en la app
  case "$nombre" in *"(1)"*) continue ;; esac

  salida="$DESTINO/$nombre"
  # Solo regenera si falta o si el original es más nuevo
  if [ ! -e "$salida" ] || [ "$archivo" -nt "$salida" ]; then
    sips -Z "$LADO" "$archivo" --out "$salida" >/dev/null 2>&1
    generadas=$((generadas + 1))
  fi
done

echo "Miniaturas generadas o actualizadas: $generadas"
echo "Original: $(du -sh "$ORIGEN" | cut -f1)  →  miniaturas: $(du -sh "$DESTINO" | cut -f1)"
