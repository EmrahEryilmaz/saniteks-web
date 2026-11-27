// Lets the i18n scripts import the TypeScript data modules: resolves "@/…" to src/ and extensionless imports.
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);
