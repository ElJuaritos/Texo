#!/usr/bin/env node
/** Restaura middleware.ts tras build estático. */
import { existsSync, renameSync } from "fs";
import { resolve } from "path";

const middleware = resolve(process.cwd(), "apps/web/src/middleware.ts");
const disabled = resolve(process.cwd(), "apps/web/src/middleware.ts.disabled");

if (existsSync(disabled)) {
  renameSync(disabled, middleware);
  console.log("✓ middleware.ts restaurado");
}
