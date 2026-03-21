const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like - Final
 * 通过 thumb_up_alt 找到并点击点赞按钮
 */

async function main() {
  const searchQuery = process.argv[2] || 'NavDreamer';
  const outputDir = process.argv[3] || './output';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const cookiePath = `${outputDir}/scholar_cookies.json`;
  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
  const playwrightCookies = cookies.map(c => ({
    domain: c.domain,
    name: c.name,
    value: c.value,
    path: c.path,
    secure: Boolean(c.secure)
  }));

  console.log(`Loading ${cookies.length} cookies...`);

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

  console.log('Waiting 20 seconds for page to load...');
  await page.waitForTimeout(20000);

  // 搜索
  console.log(`\n=== Searching for "${searchQuery}" ===`);
  const searchInput = await page.$('input[placeholder*="Search papers"]');
  if (searchInput) {
    await searchInput.click();
    await page.waitForTimeout(300);
    await searchInput.fill(searchQuery);
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    console.log('Search submitted, waiting for results...');
    await page.waitForTimeout(10000);
  }

  // 截图搜索结果
  await page.screenshot({ path: `${outputDir}/search_results.png`, fullPage: true });

  // 查找并点击点赞按钮
  console.log('\n=== Looking for Like button (thumb_up_alt) ===');

  const likeResult = await page.evaluate(() => {
    // 查找包含 thumb_up_alt 的元素
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      // 检查文本内容
      if (el.textContent && el.textContent.includes('thumb_up_alt')) {
        // 找到包含 thumb_up_alt 的父元素
        const clickable = el.closest('button, [role="button"], [tabindex], div[onclick]');
        if (clickable) {
          const rect = clickable.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            clickable.click();
            return { success: true, element: clickable.tagName, className: clickable.className.substring(0, 50) };
          }
        }

        // 如果没有找到可点击的父元素，尝试点击元素本身
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          el.click();
          return { success: true, element: el.tagName, className: el.className.substring(0, 50) };
        }
      }
    }

    // 方法2: 查找包含 thumb 图标的按钮
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const html = btn.innerHTML;
      if (html.includes('thumb_up') || html.includes('ThumbUp') || html.includes('thumb-up')) {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          btn.click();
          return { success: true, element: 'BUTTON', method: 'inner-html-thumb' };
        }
      }
    }

    // 方法3: 查找 SVG 图标
    const svgs = document.querySelectorAll('svg');
    for (const svg of svgs) {
      const path = svg.querySelector('path');
      if (path) {
        const d = path.getAttribute('d') || '';
        // thumb_up 图标的 path
        if (d.includes('M1 21h4V9H1v12') || d.includes('M14.17 1 7.59')) {
          // 找到最近的可点击父元素
          let parent = svg.parentElement;
          for (let i = 0; i < 5 && parent; i++) {
            if (parent.tagName === 'BUTTON' || parent.getAttribute('role') === 'button' || parent.hasAttribute('onclick')) {
              parent.click();
              return { success: true, element: parent.tagName, method: 'svg-parent' };
            }
            parent = parent.parentElement;
          }
        }
      }
    }

    return { success: false, reason: 'Could not find like button' };
  });

  if (likeResult.success) {
    console.log(`✓ Clicked Like button! (${likeResult.method || likeResult.element})`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${outputDir}/after_like.png`, fullPage: true });
    console.log('Screenshot saved: after_like.png');
  } else {
    console.log(`✗ Could not click Like button: ${likeResult.reason}`);

    // 尝试直接在页面上查找并点击
    console.log('\nTrying alternative method...');

    // 使用 locator 查找
    try {
      // 查找包含 thumb_up 的任何可点击元素
      const likeBtn = page.locator('button:has-text("thumb_up")').first();
      if (await likeBtn.isVisible()) {
        await likeBtn.click();
        console.log('✓ Clicked Like button using locator!');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${outputDir}/after_like_v2.png`, fullPage: true });
      }
    } catch (e) {
      console.log('Locator method failed:', e.message);
    }
  }

  console.log('\n=== Keeping browser open for 20 seconds ===');
  console.log('You can verify the like status manually.');
  await page.waitForTimeout(20000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
