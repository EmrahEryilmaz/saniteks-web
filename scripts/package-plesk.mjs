// Builds an upload package for Plesk (Linux) from a local build: deploy/saniteks-web.zip
//
//   npm run package:plesk
//
// The standalone bundle contains the image library (sharp) for the machine it was built on. A package
// built on Windows therefore gets the Linux x64 (glibc) sharp binaries added here, so /_next/image
// works on the server. Requires network access to the npm registry.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const deployDir = path.join(root, "deploy");
const target = path.join(deployDir, "saniteks-web");
const zipFile = path.join(deployDir, "saniteks-web.zip");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(cmd, args, opts = {}) {
  console.log(`> ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", ...opts });
}

// 1. Fresh production build (also copies public/ and .next/static/ into the standalone folder).
run(npm, ["run", "build"], { cwd: root });

// 2. Copy the standalone bundle into deploy/saniteks-web.
fs.rmSync(deployDir, { recursive: true, force: true });
fs.mkdirSync(deployDir, { recursive: true });
fs.cpSync(standalone, target, { recursive: true });

// 3. Add Linux x64 sharp binaries next to the bundled sharp (same version).
const sharpPkg = path.join(target, "node_modules", "sharp", "package.json");
if (fs.existsSync(sharpPkg)) {
  const { version } = JSON.parse(fs.readFileSync(sharpPkg, "utf8"));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "sharp-linux-"));
  fs.writeFileSync(path.join(tmp, "package.json"), JSON.stringify({ name: "sharp-linux", private: true }));
  run(npm, ["install", "--no-audit", "--no-fund", "--os=linux", "--cpu=x64", "--libc=glibc", `sharp@${version}`], { cwd: tmp });
  const imgSrc = path.join(tmp, "node_modules", "@img");
  const imgDst = path.join(target, "node_modules", "@img");
  for (const dir of fs.readdirSync(imgSrc).filter((d) => d.includes("linux-x64"))) {
    fs.cpSync(path.join(imgSrc, dir), path.join(imgDst, dir), { recursive: true });
    console.log(`package-plesk: @img/${dir} eklendi`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
} else {
  console.warn("package-plesk: paket içinde sharp yok — görsel optimizasyonu sunucuda çalışmayabilir.");
}

// 4. Never ship local secrets.
for (const f of fs.readdirSync(target).filter((f) => f.startsWith(".env"))) fs.rmSync(path.join(target, f));

// 5. Zip (bsdtar ships with Windows 10+ and macOS; Linux needs `zip` or bsdtar).
run("tar", ["-a", "-c", "-f", zipFile, "-C", target, "."]);
console.log(`\npackage-plesk: hazır → ${path.relative(root, zipFile)}`);
