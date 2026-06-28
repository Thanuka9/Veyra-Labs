import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "https://thanukaellepola.careers/en";
const OUT = path.join(process.cwd(), "public", "projects");

const shots = [
  { path: "", name: "thanuka-careers-overview.png", viewport: { width: 1440, height: 900 } },
  { path: "/case-studies", name: "thanuka-careers-case-studies.png", viewport: { width: 1440, height: 900 } },
  { path: "/skills", name: "thanuka-careers-skills.png", viewport: { width: 1440, height: 900 } },
];

async function dismissConsent(page) {
  const btn = page.getByRole("button", { name: /acknowledge/i });
  if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(400);
  }
}

const browser = await chromium.launch();
try {
  await mkdir(OUT, { recursive: true });
  for (const shot of shots) {
    const page = await browser.newPage({ viewport: shot.viewport });
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle", timeout: 60000 });
    await dismissConsent(page);
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(OUT, shot.name),
      type: "png",
    });
    console.log("saved", shot.name);
    await page.close();
  }
} finally {
  await browser.close();
}
