// Startup file for the Plesk Node.js app (published as app.js at the application root by git-release.sh).
//
// The Plesk Git deployment on this host adds and deletes files reliably but leaves files that already exist with
// their old content, so a release must never reuse a path. Each release therefore lives in its own folder,
// releases/<timestamp>-<commit>/, and this launcher starts the newest complete one. When a newer release appears it
// exits; Phusion Passenger starts the app again on the next request and the launcher picks the new folder.
//
// KEEP THIS FILE BYTE-FOR-BYTE STABLE: a changed app.js would not be updated on the server either. If it ever has to
// change, publish it under a new name and change "Uygulamayı Başlatma Dosyası" in Plesk.
const fs = require("node:fs");
const path = require("node:path");

const releases = path.join(__dirname, "releases");

function newest() {
  try {
    return (
      fs
        .readdirSync(releases)
        .filter((name) => fs.existsSync(path.join(releases, name, "zz-ready")))
        .sort()
        .pop() || null
    );
  } catch {
    return null;
  }
}

const current = newest();
if (!current) {
  console.error("saniteks: releases/ altında tamamlanmış sürüm yok.");
  process.exit(1);
}

setInterval(() => {
  const latest = newest();
  if (latest && latest !== current) {
    console.log(`saniteks: yeni sürüm ${latest} (çalışan ${current}); süreç yeniden başlatılmak üzere kapanıyor.`);
    process.exit(0);
  }
}, 5000).unref();

console.log(`saniteks: sürüm ${current} başlatılıyor.`);
require(path.join(releases, current, "server.js"));
