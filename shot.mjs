import { chromium } from "playwright";
const browser = await chromium.launch({ args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
// desktop title + stack
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("work").scrollIntoView({block:"center"}));
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/claude-1000/-home-slowinseven/1bf5f360-71ec-44fe-a5ac-745dd7164626/scratchpad/title-stack-desktop.png" });
// about title to see serif
await page.evaluate(() => document.getElementById("about").scrollIntoView({block:"start"}));
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/claude-1000/-home-slowinseven/1bf5f360-71ec-44fe-a5ac-745dd7164626/scratchpad/title-about.png" });
// mobile stack
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto("http://localhost:5173", { waitUntil: "networkidle" });
await m.evaluate(() => document.getElementById("work").scrollIntoView({block:"center"}));
await m.waitForTimeout(800);
await m.screenshot({ path: "/tmp/claude-1000/-home-slowinseven/1bf5f360-71ec-44fe-a5ac-745dd7164626/scratchpad/stack-mobile-bigger.png" });
const hOverflow = await m.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
console.log("mobileOverflow:", hOverflow);
process.exit(0);
