#!/usr/bin/env node
/**
 * Seed demo data for Texo — requires SUPABASE_SERVICE_ROLE_KEY in env.
 * Usage: npm run seed:demo
 *
 * Creates demo users, 7 catalog vehicles with photos, and one pending_inspection.
 */
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { ensureVehicleImages } from "./seed-vehicle-images.mjs";

/** Loads KEY=VALUE pairs from apps/web/.env.local when present. */
function loadWebEnvLocal() {
  const envPath = resolve(process.cwd(), "apps/web/.env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadWebEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const password =
  process.env.DEMO_SEED_PASSWORD ??
  randomBytes(18).toString("base64url");

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const LEGACY_EMAIL_SUFFIX = "@texo.demo";

const USERS = [
  {
    email: "admin@texo.mx",
    role: "admin",
    full_name: "Admin Texo",
    metadataRole: "buyer",
  },
  {
    email: "seller@texo.mx",
    role: "seller",
    full_name: "Vendedor Demo",
    metadataRole: "seller",
  },
  {
    email: "buyer@texo.mx",
    role: "buyer",
    full_name: "Comprador Demo",
    metadataRole: "buyer",
  },
];

/** Demo catalog — varied for filter QA. */
const DEMO_VEHICLES = [
  {
    slug: "mazda-cx5",
    make: "Mazda",
    model: "CX-5",
    year: 2022,
    trim: "Grand Touring",
    mileage: 42000,
    listing_price: 449000,
    estimated_price: 445000,
    status: "published",
    score: 92,
  },
  {
    slug: "toyota-corolla",
    make: "Toyota",
    model: "Corolla",
    year: 2021,
    trim: "LE",
    mileage: 38000,
    listing_price: 320000,
    estimated_price: 315000,
    status: "published",
    score: 88,
  },
  {
    slug: "bmw-x3",
    make: "BMW",
    model: "X3",
    year: 2020,
    trim: "xDrive30i",
    mileage: 52000,
    listing_price: 580000,
    estimated_price: 575000,
    status: "published",
    score: 85,
  },
  {
    slug: "honda-crv",
    make: "Honda",
    model: "CR-V",
    year: 2019,
    trim: "EX",
    mileage: 61000,
    listing_price: 395000,
    estimated_price: 390000,
    status: "published",
    score: 78,
  },
  {
    slug: "nissan-sentra",
    make: "Nissan",
    model: "Sentra",
    year: 2020,
    trim: "Advance",
    mileage: 45000,
    listing_price: 280000,
    estimated_price: 275000,
    status: "published",
    score: 72,
  },
  {
    slug: "mercedes-c-class",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    trim: "C200",
    mileage: 35000,
    listing_price: 620000,
    estimated_price: 610000,
    status: "published",
    score: 94,
  },
  {
    slug: "vw-jetta",
    make: "Volkswagen",
    model: "Jetta",
    year: 2018,
    trim: "Comfortline",
    mileage: 72000,
    listing_price: 250000,
    estimated_price: 245000,
    status: "pending_inspection",
    score: null,
  },
];

async function listAllUsers() {
  const all = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    all.push(...(data.users ?? []));
    if ((data.users ?? []).length < perPage) break;
    page += 1;
  }

  return all;
}

async function removeLegacyDemoUsers() {
  const users = await listAllUsers();
  const legacy = users.filter((u) => u.email?.endsWith(LEGACY_EMAIL_SUFFIX));

  for (const user of legacy) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
    console.log(`✗ Removed legacy: ${user.email}`);
  }

  if (legacy.length === 0) {
    console.log("— No legacy @texo.demo accounts found");
  }
}

async function ensureUser({ email, role, full_name, metadataRole }) {
  const users = await listAllUsers();
  const existing = users.find((u) => u.email === email);

  if (existing) {
    const { error: updateAuthError } = await admin.auth.admin.updateUserById(
      existing.id,
      {
        password,
        email_confirm: true,
        user_metadata: { role: metadataRole, full_name },
      },
    );
    if (updateAuthError) throw updateAuthError;

    const { error: profileError } = await admin
      .from("profiles")
      .update({ role, full_name })
      .eq("id", existing.id);
    if (profileError) throw profileError;

    return existing.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: metadataRole, full_name },
  });

  if (error) throw error;
  const userId = data.user.id;

  const { error: profileError } = await admin
    .from("profiles")
    .update({ role, full_name })
    .eq("id", userId);
  if (profileError) throw profileError;

  return userId;
}

async function upsertInspection(vehicleId, score) {
  const { data: existing } = await admin
    .from("inspections")
    .select("id")
    .eq("vehicle_id", vehicleId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("inspections")
      .update({
        score,
        passed: score >= 75,
        certified_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    return;
  }

  const { data: inspection, error } = await admin
    .from("inspections")
    .insert({
      vehicle_id: vehicleId,
      inspector_name: "Texo / Taller Polanco",
      score,
      passed: score >= 75,
      certified_at: new Date().toISOString(),
      notes: "Inspección certificada demo.",
    })
    .select("id")
    .single();

  if (error) throw error;

  await admin.from("inspection_items").insert([
    {
      inspection_id: inspection.id,
      category: "mechanical",
      component: "Motor",
      severity: "low",
      description: "Operación normal.",
    },
    {
      inspection_id: inspection.id,
      category: "exterior",
      component: "Carrocería",
      severity: "low",
      description: "Sin daños estructurales.",
    },
  ]);
}

/** Crea o actualiza vehículos demo con fotos. */
async function seedVehicles(sellerId, imagePaths) {
  const ids = [];

  for (const v of DEMO_VEHICLES) {
    const cover_image_url = imagePaths[v.slug] ?? null;

    const { data: existing } = await admin
      .from("vehicles")
      .select("id")
      .eq("seller_id", sellerId)
      .eq("make", v.make)
      .eq("model", v.model)
      .eq("year", v.year)
      .maybeSingle();

    let vehicleId;

    const payload = {
      seller_id: sellerId,
      make: v.make,
      model: v.model,
      year: v.year,
      trim: v.trim,
      mileage: v.mileage,
      listing_price: v.listing_price,
      estimated_price: v.estimated_price,
      status: v.status,
      cover_image_url,
      published_at:
        v.status === "published" ? new Date().toISOString() : null,
    };

    if (existing) {
      const { error } = await admin
        .from("vehicles")
        .update(payload)
        .eq("id", existing.id);
      if (error) throw error;
      vehicleId = existing.id;
      console.log(`— Updated: ${v.make} ${v.model}`);
    } else {
      const { data, error } = await admin
        .from("vehicles")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      vehicleId = data.id;
      console.log(`✓ Created: ${v.make} ${v.model}`);
    }

    if (v.score != null) {
      await upsertInspection(vehicleId, v.score);
    }

    ids.push(vehicleId);
  }

  return ids;
}

function saveCredentialsLocal() {
  const content = `# Texo demo credentials — DO NOT COMMIT
# Generated: ${new Date().toISOString()}
Password (all accounts): ${password}

admin@texo.mx
seller@texo.mx
buyer@texo.mx
`;
  const filePath = resolve(process.cwd(), ".demo-credentials.local");
  writeFileSync(filePath, content, "utf8");
  console.log(`\nCredentials saved to ${filePath} (gitignored)`);
}

async function main() {
  console.log("Rotating Texo demo accounts…\n");

  await removeLegacyDemoUsers();

  const ids = {};
  for (const u of USERS) {
    ids[u.role] = await ensureUser(u);
    console.log(`✓ ${u.role}: ${u.email}`);
  }

  console.log("\nDownloading vehicle images…");
  const imagePaths = await ensureVehicleImages();

  console.log("\nSeeding vehicles…");
  const vehicleIds = await seedVehicles(ids.seller, imagePaths);
  console.log(`✓ ${vehicleIds.length} vehicles in catalog`);

  saveCredentialsLocal();

  console.log("\n--- Demo credentials ---");
  console.log("Password (all accounts):", password);
  console.log("Admin:  admin@texo.mx");
  console.log("Seller: seller@texo.mx");
  console.log("Buyer:  buyer@texo.mx");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
