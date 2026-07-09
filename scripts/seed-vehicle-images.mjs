#!/usr/bin/env node
/**
 * Downloads demo vehicle photos (Unsplash, license-free) to apps/web/public/vehicles/.
 * Attribution: images.unsplash.com — see UNSPLASH_ATTRIBUTION below.
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../apps/web/public/vehicles");

/** slug → Unsplash direct download URL (w=800) */
export const VEHICLE_IMAGE_SOURCES = {
  "mazda-cx5": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
  "toyota-corolla": "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
  "bmw-x3": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  "honda-crv": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
  "nissan-sentra": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  "mercedes-c-class": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
  "vw-jetta": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
};

/** Returns public web path e.g. /vehicles/mazda-cx5.jpg */
export async function ensureVehicleImages() {
  mkdirSync(OUT_DIR, { recursive: true });
  const paths = {};

  for (const [slug, url] of Object.entries(VEHICLE_IMAGE_SOURCES)) {
    const filename = `${slug}.jpg`;
    const filePath = resolve(OUT_DIR, filename);
    const publicPath = `/vehicles/${filename}`;

    if (!existsSync(filePath)) {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to download ${slug}: ${res.status}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(filePath, buf);
      console.log(`  ↓ ${filename}`);
    } else {
      console.log(`  — ${filename} (exists)`);
    }

    paths[slug] = publicPath;
  }

  return paths;
}

if (process.argv[1]?.endsWith("seed-vehicle-images.mjs")) {
  ensureVehicleImages()
    .then((paths) => {
      console.log("\nPublic paths:", paths);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
