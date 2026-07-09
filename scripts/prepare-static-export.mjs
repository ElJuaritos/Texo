#!/usr/bin/env node
/**
 * Deshabilita middleware.ts durante build estático (GitHub Pages).
 * Next.js no soporta middleware con output: 'export'.
 */
import { existsSync, renameSync } from "fs";
import { resolve } from "path";

const middleware = resolve(process.cwd(), "apps/web/src/middleware.ts");
const disabled = resolve(process.cwd(), "apps/web/src/middleware.ts.disabled");

if (existsSync(middleware)) {
  renameSync(middleware, disabled);
  console.log("✓ middleware.ts deshabilitado para static export");
} else if (existsSync(disabled)) {
  console.log("— middleware ya deshabilitado");
} else {
  console.log("— middleware.ts no encontrado");
}
