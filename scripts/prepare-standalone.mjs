// Runs after `next build`: the standalone server does not include `public/` and `.next/static/`,
// so copy them next to .next/standalone/server.js (https://nextjs.org/docs → output: "standalone").
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(path.join(standalone, "server.js"))) {
  console.error("prepare-standalone: .next/standalone/server.js bulunamadı — next.config.ts içinde output: \"standalone\" olmalı.");
  process.exit(1);
}

for (const [from, to] of [
  [path.join(root, "public"), path.join(standalone, "public")],
  [path.join(root, ".next", "static"), path.join(standalone, ".next", "static")],
]) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  console.log(`prepare-standalone: ${path.relative(root, from)} → ${path.relative(root, to)}`);
}
