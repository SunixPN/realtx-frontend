import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';

const BASE = 'http://localhost:3002';
const OUT = 'D:/development/realtx-frontend/_qa/screens-map';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const WIDTHS = [325, 360, 414, 640, 768, 1024];
const browser = await chromium.launch({ channel: 'chrome' });
const results = [];

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
  } catch (e) {
    results.push({ w, page: 'map', error: String(e).slice(0, 200) });
    await ctx.close();
    continue;
  }
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    const overflows = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right - 0.5 > window.innerWidth || r.left < -0.5) {
        if (el.offsetParent !== null || el === document.body) {
          overflows.push({
            tag: el.tagName,
            cls: (el.className && el.className.toString && el.className.toString().slice(0, 100)) || '',
            right: r.right,
            left: r.left,
          });
        }
      }
    });
    return {
      docWidth: de.scrollWidth,
      winWidth: window.innerWidth,
      hasHScroll: de.scrollWidth > window.innerWidth + 1,
      overflows: overflows.slice(0, 5),
    };
  });
  await page.screenshot({ path: `${OUT}/map-${w}.png`, fullPage: false });
  results.push({ w, page: 'map', ...overflow });
  await ctx.close();
}
console.log('=== MAP VIEWPORT ===');
console.log(JSON.stringify(results, null, 2));

// Interactive: open filters bottom sheet at 360
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const allFilters = page.locator('button:has-text("Все фильтры"), button:has-text("All filters")').first();
  await allFilters.click();
  await page.waitForTimeout(500);
  const sheetVisible = await page.locator('[role=dialog][aria-modal="true"]').isVisible();
  await page.screenshot({ path: `${OUT}/filters-sheet-360.png`, fullPage: false });
  results.push({ test: 'filters-sheet-360', sheetVisible });
  await ctx.close();
}

// Chip mini-sheet: click Price chip at 360
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const priceChip = page.locator('button:has-text("Цена"), button:has-text("Price")').first();
  await priceChip.click();
  await page.waitForTimeout(400);
  const chipSheetVisible = await page.locator('[role=dialog][aria-modal="true"]').isVisible();
  await page.screenshot({ path: `${OUT}/chip-sheet-360.png`, fullPage: false });
  results.push({ test: 'chip-sheet-360', chipSheetVisible });
  await ctx.close();
}

// Mode toggle at bottom at 360
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const heat = page.locator('button:has-text("Выгодность районов"), button:has-text("Heat")').first();
  await heat.click().catch(() => {});
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/heat-mode-360.png`, fullPage: false });
  await ctx.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
