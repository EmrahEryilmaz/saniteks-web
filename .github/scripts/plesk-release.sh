#!/usr/bin/env bash
# Runs ON the Plesk server (piped over SSH by .github/workflows/deploy.yml).
#
#   plesk-release.sh deploy   <app-dir>   unpack ~/.saniteks-release.tgz into <app-dir>, keep the old one as <app-dir>-prev
#   plesk-release.sh rollback <app-dir>   swap <app-dir> and <app-dir>-prev
#
# <app-dir> is the Plesk Node.js "Application Root", relative to the SSH user's home (e.g. "saniteks-web").
# The swap is two directory renames, so the site never runs from a half-copied folder. Phusion Passenger is restarted
# by touching <app-dir>/tmp/restart.txt. Environment variables (SMTP etc.) live in Plesk, not in these folders.
set -euo pipefail

action="${1:-}"
dir="${2:-}"

if [[ ! "$dir" =~ ^[A-Za-z0-9._-]+(/[A-Za-z0-9._-]+)*$ ]] || [[ "$dir" == *..* ]]; then
  echo "Geçersiz PLESK_APP_DIR: '$dir' (ev klasörüne göre göreli bir yol olmalı, ör. saniteks-web)" >&2
  exit 1
fi

cd "$HOME"
app="$dir"
prev="${dir}-prev"
next="${dir}-next"

restart() {
  mkdir -p "$app/tmp"
  touch "$app/tmp/restart.txt"
}

case "$action" in
  deploy)
    archive="$HOME/.saniteks-release.tgz"
    [ -f "$archive" ] || { echo "Paket bulunamadı: $archive" >&2; exit 1; }
    rm -rf "$next"
    mkdir -p "$next"
    tar -xzf "$archive" -C "$next"
    rm -f "$archive"
    [ -f "$next/server.js" ] || { echo "Pakette server.js yok; yayın iptal." >&2; rm -rf "$next"; exit 1; }

    rm -rf "$prev"
    if [ -d "$app" ]; then mv "$app" "$prev"; fi
    mv "$next" "$app"
    restart
    echo "Yayınlandı: $app ($(cat "$app/REVISION" 2>/dev/null || echo '?')). Önceki sürüm: $prev"
    ;;
  rollback)
    [ -d "$prev" ] || { echo "Geri dönülecek önceki sürüm yok: $prev" >&2; exit 1; }
    rm -rf "$next"
    mv "$app" "$next"
    mv "$prev" "$app"
    mv "$next" "$prev"
    restart
    echo "Geri dönüldü: $app ($(cat "$app/REVISION" 2>/dev/null || echo '?'))"
    ;;
  *)
    echo "Kullanım: plesk-release.sh deploy|rollback <app-dir>" >&2
    exit 1
    ;;
esac
