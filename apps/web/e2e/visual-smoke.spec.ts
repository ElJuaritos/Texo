import { test, expect } from "@playwright/test";
import { mkdirSync } from "fs";
import { join } from "path";

const SCREENSHOT_DIR = join(process.cwd(), "e2e", "screenshots");

/** Captura pantallas clave del demo web. */
test.describe("Visual smoke", () => {
  test.beforeAll(() => {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  });

  test("home catalog", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "TEXO" })).toBeVisible();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `home-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test("login page", async ({ page }, testInfo) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Iniciar sesión" })).toBeVisible();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `login-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test("register page", async ({ page }, testInfo) => {
    await page.goto("/register");
    await expect(page.getByRole("button", { name: "Crear cuenta" })).toBeVisible();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `register-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test("search page", async ({ page }, testInfo) => {
    await page.goto("/search");
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `search-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test("terms page", async ({ page }, testInfo) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "Términos y Condiciones" })).toBeVisible();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `terms-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test("vehicle detail", async ({ page }, testInfo) => {
    await page.goto("/vehicles/dddddddd-dddd-dddd-dddd-dddddddd0006");
    await expect(page.getByText("Mercedes-Benz")).toBeVisible();
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `vehicle-detail-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test("sell page redirect to login", async ({ page }, testInfo) => {
    await page.goto("/sell");
    await page.screenshot({
      path: join(SCREENSHOT_DIR, `sell-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });
});
