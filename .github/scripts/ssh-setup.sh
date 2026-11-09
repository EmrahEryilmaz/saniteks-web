#!/usr/bin/env bash
# Writes ~/.ssh/config with a "plesk" host from the PLESK_SSH_* secrets (passed in as SSH_* env vars).
set -euo pipefail

missing=()
for v in SSH_HOST SSH_USER SSH_KEY; do
  [ -n "${!v:-}" ] || missing+=("PLESK_${v}")
done
if [ ${#missing[@]} -gt 0 ]; then
  echo "::error::Eksik GitHub secret: ${missing[*]} (DEPLOY.md › Yöntem C)"
  exit 1
fi

mkdir -p ~/.ssh
chmod 700 ~/.ssh
printf '%s\n' "$SSH_KEY" > ~/.ssh/plesk_key
chmod 600 ~/.ssh/plesk_key

port="${SSH_PORT:-22}"
if [ -n "${SSH_KNOWN_HOSTS:-}" ]; then
  printf '%s\n' "$SSH_KNOWN_HOSTS" > ~/.ssh/known_hosts
else
  # Without a pinned host key, trust the key the server presents now and print its fingerprint for comparison.
  echo "::warning::PLESK_SSH_KNOWN_HOSTS tanımlı değil; sunucu anahtarı ilk bağlantıda kabul ediliyor."
  ssh-keyscan -p "$port" -H "$SSH_HOST" > ~/.ssh/known_hosts 2>/dev/null
  ssh-keygen -lf ~/.ssh/known_hosts
fi

cat > ~/.ssh/config <<CFG
Host plesk
  HostName $SSH_HOST
  Port $port
  User $SSH_USER
  IdentityFile ~/.ssh/plesk_key
  IdentitiesOnly yes
  BatchMode yes
  StrictHostKeyChecking yes
  ServerAliveInterval 15
CFG
chmod 600 ~/.ssh/config

ssh plesk true
echo "SSH bağlantısı tamam."
