import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function resolve(specifier, context, nextResolve) {
  const spec = specifier.startsWith("@/") ? pathToFileURL(path.join(root, "src", specifier.slice(2))).href : specifier;
  try {
    return await nextResolve(spec, context);
  } catch (error) {
    if (!(spec.startsWith(".") || spec.startsWith("file:"))) throw error;
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      try {
        return await nextResolve(spec + ext, context);
      } catch {
        // try the next extension
      }
    }
    throw error;
  }
}
