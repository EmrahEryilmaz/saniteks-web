#!/usr/bin/env bash
# Publishes the standalone package to Plesk over FTP(S) with lftp (runs on the GitHub runner).
#
#   ftp-release.sh deploy <bundle-dir>   upload into <app>-next, then <app> → <app>-prev and <app>-next → <app>
#   ftp-release.sh rollback              swap <app> and <app>-prev
#   ftp-release.sh test                  only check the connection and list the FTP home (changes nothing)
#
# Environment: FTP_HOST, FTP_USER, LFTP_PASSWORD, APP_DIR (relative to the FTP account's home, e.g. "app"),
# optional FTP_PORT (21) and FTP_TLS: "require" (default, verified certificate), "noverify" (encrypted, certificate
# not checked — e.g. a self-signed Plesk certificate or connecting by IP) or "off" (plain FTP; avoid).
# The renames are done in one FTP session, so the site never runs from a half-uploaded folder. Phusion Passenger is
# restarted by uploading <app>/tmp/restart.txt. Environment variables (SMTP etc.) live in Plesk, not in these folders.
set -euo pipefail

action="${1:-}"
bundle="${2:-}"

missing=()
[ -n "${FTP_HOST:-}" ] || missing+=(PLESK_FTP_HOST)
[ -n "${FTP_USER:-}" ] || missing+=(PLESK_FTP_USER)
[ -n "${LFTP_PASSWORD:-}" ] || missing+=(PLESK_FTP_PASSWORD)
[ -n "${APP_DIR:-}" ] || missing+=(PLESK_APP_DIR)
if [ ${#missing[@]} -gt 0 ]; then
  echo "::error::Eksik GitHub secret/variable: ${missing[*]} (DEPLOY.md › Yöntem C)"
  exit 1
fi
if [[ ! "$APP_DIR" =~ ^[A-Za-z0-9._-]+(/[A-Za-z0-9._-]+)*$ ]] || [[ "$APP_DIR" == *..* ]]; then
  echo "::error::Geçersiz PLESK_APP_DIR: '$APP_DIR' (FTP ana klasörüne göre göreli olmalı, ör. app)"
  exit 1
fi

app="$APP_DIR"
prev="${APP_DIR}-prev"
next="${APP_DIR}-next"

settings="set cmd:fail-exit yes; set net:max-retries 3; set net:timeout 30; set net:reconnect-interval-base 5;"
settings+=" set ftp:passive-mode on; set mirror:parallel-transfer-count 8;"
case "${FTP_TLS:-require}" in
  require)  settings+=" set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate true;" ;;
  noverify) settings+=" set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate false;" ;;
  off)      settings+=" set ftp:ssl-allow false;"; echo "::warning::FTP şifrelenmeden kullanılıyor (PLESK_FTP_TLS=off)." ;;
  *)        echo "::error::PLESK_FTP_TLS 'require', 'noverify' veya 'off' olmalı."; exit 1 ;;
esac

ftp() {
  lftp -c "$settings open --env-password -u \"$FTP_USER\" -p \"${FTP_PORT:-21}\" \"$FTP_HOST\"; $1"
}

# True when <dir>/<file> exists on the server.
exists() {
  ftp "cls -1 \"$1\"" >/dev/null 2>&1
}

# Connection check with diagnostics: TCP reachability of the control port, then an lftp login + directory listing
# (needs a passive-mode data connection) with protocol debug output on failure. lftp masks the password in debug.
check_connection() {
  local port="${FTP_PORT:-21}"
  echo "Bağlantı denetleniyor: $FTP_HOST:$port (TLS: ${FTP_TLS:-require})"
  if ! timeout 15 bash -c "exec 3<>/dev/tcp/$FTP_HOST/$port" 2>/dev/null; then
    echo "::error::$FTP_HOST:$port adresine TCP bağlantısı kurulamadı. Sunucu/güvenlik duvarı GitHub'ın IP'lerinden FTP'ye izin vermiyor olabilir (ör. yurtdışı engeli) ya da adres/port yanlış."
    return 1
  fi
  echo "TCP bağlantısı tamam (port $port açık)."
  local log
  log="$(mktemp)"
  if lftp -c "$settings set net:max-retries 1; set net:timeout 20; debug 3; open --env-password -u \"$FTP_USER\" -p \"$port\" \"$FTP_HOST\"; cls -1 ." >"$log" 2>&1; then
    echo "Giriş ve klasör listeleme tamam. FTP ana klasöründekiler:"
    grep -vE '^(---|<---|--->|\*\*\*\*)' "$log" | sed 's/^/  /'
    return 0
  fi
  echo "::error::FTP girişi veya klasör listeleme başarısız. Ayrıntılı günlük:"
  sed -E 's/(PASS ).*/\1********/' "$log" | tail -n 60
  return 1
}

restart_file="$(mktemp -d)/restart.txt"
date -u +%FT%TZ > "$restart_file"
restart_cmd="mkdir -p -f \"$app/tmp\"; put -O \"$app/tmp\" \"$restart_file\""

case "$action" in
  deploy)
    [ -f "$bundle/server.js" ] || { echo "::error::Pakette server.js yok: $bundle"; exit 1; }
    check_connection

    if exists "$next"; then ftp "rm -r \"$next\""; fi
    echo "Yükleniyor → $next ($(find "$bundle" -type f | wc -l) dosya)…"
    ftp "mkdir -p \"$next\"; mirror -R --no-perms --verbose=1 \"$bundle\" \"$next\"; cls -1 \"$next/server.js\""

    if exists "$prev"; then
      echo "Eski yedek siliniyor: $prev"
      ftp "rm -r \"$prev\""
    fi
    if exists "$app"; then
      ftp "mv \"$app\" \"$prev\"; mv \"$next\" \"$app\"; $restart_cmd"
    else
      ftp "mv \"$next\" \"$app\"; $restart_cmd"
    fi
    echo "Yayınlandı: $app ($(cat "$bundle/REVISION" 2>/dev/null || echo '?')). Önceki sürüm: $prev"
    ;;
  test)
    check_connection
    echo "Bağlantı testi başarılı; sunucuda hiçbir şey değiştirilmedi."
    ;;
  rollback)
    exists "$prev" || { echo "::error::Geri dönülecek önceki sürüm yok: $prev"; exit 1; }
    if exists "$next"; then ftp "rm -r \"$next\""; fi
    ftp "mv \"$app\" \"$next\"; mv \"$prev\" \"$app\"; mv \"$next\" \"$prev\"; $restart_cmd"
    echo "Geri dönüldü: $app"
    ;;
  *)
    echo "Kullanım: ftp-release.sh deploy <bundle-dir> | rollback | test" >&2
    exit 1
    ;;
esac
