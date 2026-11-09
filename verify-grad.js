const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 700, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("http://localhost:5173");
  await page.waitForSelector("text=Pierre Kasanani", { timeout: 10000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "graduation-invite.png", fullPage: true });
  console.log("errors:", errors.length, errors);
  await browser.close();
})().catch((e) => { console.error("FAILED", e); process.exit(1); });
