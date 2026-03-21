const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Debug - 分析页面上所有按钮的完整信息
 */

async function main() {
  const outputDir = './output';

  const cookiePath = `${outputDir}/scholar_cookies.json`;
  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
  const playwrightCookies = cookies.map(c => ({
    domain: c.domain,
    name: c.name,
    value: c.value,
    path: c.path,
    secure: Boolean(c.secure)
  }));

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  const page = await context.newPage();

  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForTimeout(15000);

  // 搜索
  const searchInput = page.locator('input[placeholder*="Search papers by keywords"]');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.click();
  await searchInput.fill('');
  await searchInput.type('NavDreamer', { delay: 50 });
  await page.keyboard.press('Enter');
  console.log('Searching for NavDreamer...');
  await page.waitForTimeout(10000);

  // 获取页面上所有元素的详细信息
  console.log('\n=== Analyzing all interactive elements ===');

  const allElements = await page.evaluate(() => {
    const results = {
      buttons: [],
      clickableDivs: [],
      svgs: [],
      inputs: []
    };

    // 所有 button 元素
    document.querySelectorAll('button').forEach((btn, i) => {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        results.buttons.push({
          index: i,
          text: btn.textContent.trim().substring(0, 50),
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title'),
          className: btn.className.substring(0, 80),
          innerHTML: btn.innerHTML.substring(0, 150),
          rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
        });
      }
    });

    // 所有可点击的 div
    document.querySelectorAll('div[role="button"], div[onclick], div[tabindex]').forEach((div, i) => {
      const rect = div.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        results.clickableDivs.push({
          index: i,
          text: div.textContent.trim().substring(0, 30),
          role: div.getAttribute('role'),
          className: div.className.substring(0, 50)
        });
      }
    });

    // 所有 SVG 图标
    document.querySelectorAll('svg').forEach((svg, i) => {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.width < 50) {
        const path = svg.querySelector('path');
        results.svgs.push({
          index: i,
          viewBox: svg.getAttribute('viewBox'),
          pathD: path ? (path.getAttribute('d') || '').substring(0, 50) : null,
          parentTag: svg.parentElement ? svg.parentElement.tagName : null,
          parentClass: svg.parentElement ? svg.parentElement.className.substring(0, 30) : null
        });
      }
    });

    return results;
  });

  console.log('\n--- All Buttons ---');
  allElements.buttons.forEach(b => {
    console.log(`[${b.index}] "${b.text}" | ariaLabel="${b.ariaLabel}" | rect=(${b.rect.x},${b.rect.y})`);
  });

  console.log('\n--- SVG Icons (small ones that might be icons) ---');
  allElements.svgs.slice(0, 20).forEach(s => {
    console.log(`[${s.index}] viewBox="${s.viewBox}" | parentTag="${s.parentTag}" | parentClass="${s.parentClass}"`);
  });

  // 查找可能的 Like 按钮
  console.log('\n=== Looking for Like-related elements ===');

  const likeElements = await page.evaluate(() => {
    const results = [];

    // 查找包含特定文本的元素
    const keywords = ['like', 'dislike', 'thumb', 'recommend', 'upvote', 'downvote'];

    const walkElements = (selector) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        const text = el.textContent.toLowerCase();
        const innerHTML = el.innerHTML.toLowerCase();

        keywords.forEach(kw => {
          if (text.includes(kw) || innerHTML.includes(kw)) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              results.push({
                tag: el.tagName,
                text: el.textContent.trim().substring(0, 50),
                keyword: kw,
                className: el.className.substring(0, 50)
              });
            }
          }
        });
      });
    };

    walkElements('button');
    walkElements('div');
    walkElements('span');
    walkElements('a');

    return results;
  });

  console.log('Elements containing like-related keywords:');
  likeElements.forEach(e => {
    console.log(`  <${e.tag}> "${e.text}" (matched: ${e.keyword})`);
  });

  // 截图
  await page.screenshot({ path: `${outputDir}/debug_page.png`, fullPage: true });
  console.log('\nScreenshot saved: debug_page.png');

  console.log('\n=== Keeping browser open for 30 seconds ===');
  await page.waitForTimeout(30000);

  await browser.close();
}

main().catch(console.error);
