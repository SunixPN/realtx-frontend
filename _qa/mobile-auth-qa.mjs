import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';

const BASE = 'http://localhost:3002';
const OUT = 'D:/development/realtx-frontend/_qa/screens';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: 'sign-in', url: '/sign-in' },
  { name: 'register', url: '/register' },
  { name: 'phone', url: '/sign-in/phone' },
  { name: 'reset', url: '/reset' },
  { name: 'reset-new-notoken', url: '/reset/new' },
  { name: 'verify-email', url: '/verify-email' },
];

const WIDTHS = [325, 360, 414, 640, 768, 1024];

const browser = await chromium.launch({ channel: 'chrome' });
const results = [];

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    const url = BASE + p.url;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {
      results.push({ w, page: p.name, error: String(e).slice(0, 200) });
      continue;
    }
    // check horizontal overflow
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
    await page.screenshot({ path: `${OUT}/${p.name}-${w}.png`, fullPage: true });
    results.push({ w, page: p.name, ...overflow });
  }
  await ctx.close();
}

console.log('=== VIEWPORT RESULTS ===');
console.log(JSON.stringify(results, null, 2));

// Test mobile menu at 360
{
  const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/sign-in', { waitUntil: 'networkidle' });
  const burger = page.locator('header button[aria-label="Открыть меню"], header button[aria-label="Open menu"]');
  await burger.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/menu-open-360.png`, fullPage: false });
  const menuVisible = await page.locator('aside[aria-label]').isVisible();
  results.push({ test: 'menu-open-360', menuVisible });
  await ctx.close();
}

// Test legal modal at 325
{
  const ctx = await browser.newContext({ viewport: { width: 325, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/sign-in', { waitUntil: 'networkidle' });
  const termsBtn = await page.locator('footer button').first();
  await termsBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/legal-modal-325.png`, fullPage: false });
  const modalVisible = await page.locator('[role=dialog]').isVisible();
  results.push({ test: 'legal-modal-325', modalVisible });
  await ctx.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
