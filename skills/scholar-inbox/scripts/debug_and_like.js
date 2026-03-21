const { chromium } = require('playwright');
const fs = require('fs');

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

  // 更长的等待时间
  console.log('Waiting 20 seconds for page to fully load...');
  await page.waitForTimeout(20000);

  // 查找搜索框
  console.log('\n=== Finding search box ===');
  const searchInput = await page.$('input[placeholder*="Search papers"]');

  if (searchInput) {
    console.log('Found search input!');
    await searchInput.click();
    await page.waitForTimeout(500);
    await searchInput.fill('NavDreamer');
    await page.waitForTimeout(500);
    await page.keyboard.press('Enter');
    console.log('Searching for NavDreamer...');
    await page.waitForTimeout(10000);
  } else {
    console.log('Search input not found, analyzing current page...');
  }

  // 截图当前状态
  await page.screenshot({ path: `${outputDir}/current_page.png`, fullPage: true });

  // 分析所有按钮
  console.log('\n=== Analyzing all buttons ===');
  const buttons = await page.evaluate(() => {
    const btns = [];
    document.querySelectorAll('button').forEach((btn, i) => {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        btns.push({
          index: i,
          text: btn.textContent.trim().substring(0, 40),
          ariaLabel: btn.getAttribute('aria-label'),
          className: btn.className.substring(0, 60)
        });
      }
    });
    return btns;
  });

  console.log(`Found ${buttons.length} visible buttons:`);
  buttons.forEach(b => console.log(`  [${b.index}] "${b.text}" | aria="${b.ariaLabel}"`));

  // 分析所有可点击元素
  console.log('\n=== Analyzing clickable elements ===');
  const clickables = await page.evaluate(() => {
    const elements = [];
    // 查找所有可能是点赞的元素
    document.querySelectorAll('[class*="like"], [class*="Like"], [class*="thumb"], [class*="vote"], [class*="recommend"]').forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        elements.push({
          tag: el.tagName,
          text: el.textContent.trim().substring(0, 30),
          className: el.className.substring(0, 50)
        });
      }
    });
    return elements;
  });

  console.log('Elements with like-related classes:');
  clickables.forEach(e => console.log(`  <${e.tag}> "${e.text}" class="${e.className}"`));

  // 查找页面上的 Like/Dislike 区域
  console.log('\n=== Looking for interaction buttons ===');
  const interactions = await page.evaluate(() => {
    const results = [];

    // 查找所有包含数字的小元素（可能是点赞数）
    document.querySelectorAll('span, div, button').forEach(el => {
      const text = el.textContent.trim();
      if (/^\d+$/.test(text) && text.length < 4) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.width < 50) {
          // 检查附近是否有 Like 相关的元素
          const parent = el.parentElement;
          const parentText = parent ? parent.textContent.toLowerCase() : '';
          if (parentText.includes('like') || parentText.includes('thumb') || parentText.includes('recommend')) {
            results.push({
              number: text,
              parentText: parentText.substring(0, 50)
            });
          }
        }
      }
    });

    return results;
  });

  console.log('Potential like counts:', interactions);

  // 保持浏览器打开
  console.log('\n=== Browser will stay open for 30 seconds ===');
  console.log('Please manually check the page for Like button.');
  await page.waitForTimeout(30000);

  await browser.close();
}

main().catch(console.error);
