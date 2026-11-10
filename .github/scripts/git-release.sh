#!/usr/bin/env bash
# Publishes the standalone package as a commit on a release branch of this repository (runs on the GitHub runner).
# The Plesk server pulls that branch with its Git extension and deploys it into the Node.js application folder, so
# no inbound connection to the server is needed (the hosting firewall blocks FTP/SSH from GitHub).
#
#   git-release.sh deploy <bundle-dir>   commit the package (tree replaced as a whole) on top of the release branch
#   git-release.sh rollback              commit the previous release's tree again (running it twice undoes it)
#
# Environment: GITHUB_TOKEN + GITHUB_REPOSITORY (set by Actions; the job needs `contents: write`),
# optional RELEASE_BRANCH (default "yayin") and RELEASE_REMOTE (override the push URL, for local tests).
# Layout on the branch: app.js (stable launcher) + releases/<timestamp>-<commit>/<package> + public/.keep.
set -euo pipefail

action="${1:-}"
bundle="${2:-}"
branch="${RELEASE_BRANCH:-yayin}"

if [[ ! "$branch" =~ ^[A-Za-z0-9._-]+$ ]] || [[ "$branch" == "main" ]]; then
  echo "::error::Geçersiz yayın dalı: '$branch'"
  exit 1
fi
remote="${RELEASE_REMOTE:-https://x-access-token:${GITHUB_TOKEN:?GITHUB_TOKEN gerekli}@github.com/${GITHUB_REPOSITORY:?}.git}"
rev="${GITHUB_SHA:-$(date -u +%Y%m%d%H%M%S)}"

export GIT_AUTHOR_NAME="github-actions[bot]" GIT_COMMITTER_NAME="github-actions[bot]"
export GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

work="$(mktemp -d)"
if git ls-remote --exit-code --heads "$remote" "$branch" >/dev/null 2>&1; then
  git clone --quiet --depth 2 --branch "$branch" --single-branch "$remote" "$work"
else
  [ "$action" = deploy ] || { echo "::error::'$branch' dalı yok; önce bir yayın yapılmalı."; exit 1; }
  echo "'$branch' dalı yok; ilk yayınla oluşturulacak."
  git init --quiet --initial-branch "$branch" "$work"
  git -C "$work" remote add origin "$remote"
fi

mark_restart() {
  mkdir -p "$work/tmp"
  printf '%s %s\n' "$1" "$(date -u +%FT%TZ)" > "$work/tmp/restart.txt"
}

case "$action" in
  deploy)
    [ -f "$bundle/server.js" ] || { echo "::error::Pakette server.js yok: $bundle"; exit 1; }
    find "$work" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
    # Plesk's Git deployment adds and deletes files but does not refresh files that already exist, so every release
    # goes into a folder of its own and app.js (plesk-launcher.js) starts the newest one. See that file.
    name="$(date -u +%Y%m%d%H%M%S)-${rev:0:7}"
    if [ "${LEGACY_ROOT:-false}" = true ]; then
      # Transitional: also keep the old layout (package at the root, startup file server.js) so the site stays up
      # until "Uygulamayı Başlatma Dosyası" is switched to app.js in Plesk.
      cp -a "$bundle"/. "$work"/
      mark_restart "$rev"
    fi
    mkdir -p "$work/releases/$name" "$work/public"
    cp -a "$bundle"/. "$work/releases/$name"/
    printf '%s\n' "$name" > "$work/releases/$name/zz-ready"
    cp "$(dirname "$0")/plesk-launcher.js" "$work/app.js"
    # The document root (public/) must exist; static files are served by the app from the release folder.
    [ -e "$work/public/.keep" ] || : > "$work/public/.keep"
    # Store every file byte-for-byte (no line-ending conversion on the server's checkout).
    printf '* -text\n' > "$work/.gitattributes"
    git -C "$work" add --all --force .
    git -C "$work" commit --quiet -m "Yayın ${rev}"
    ;;
  rollback)
    git -C "$work" rev-parse --verify --quiet HEAD~1 >/dev/null \
      || { echo "::error::Geri dönülecek önceki yayın yok."; exit 1; }
    prev_msg="$(git -C "$work" log -1 --format=%s HEAD~1)"
    git -C "$work" read-tree -u --reset HEAD~1
    mark_restart "rollback"
    git -C "$work" add --all --force .
    git -C "$work" commit --quiet -m "Geri dönüş → ${prev_msg}"
    ;;
  *)
    echo "Kullanım: git-release.sh deploy <bundle-dir> | rollback" >&2
    exit 1
    ;;
esac

git -C "$work" push --quiet origin "HEAD:refs/heads/${branch}"
echo "'$branch' dalına gönderildi: $(git -C "$work" log -1 --format='%h %s')"
echo "Plesk › saniteks.com.tr › Git: otomatik dağıtım açıksa birkaç dakika içinde, değilse \"Şimdi çek\" ile sunucuya iner."
