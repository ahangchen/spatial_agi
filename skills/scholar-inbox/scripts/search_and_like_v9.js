const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v9
 * 根据页面分析结果，查找并点击Like按钮
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

  console.log('Waiting 15 seconds for page to load...');
  await page.waitForTimeout(15000);

  // 搜索
  console.log('\n=== Searching ===');
  const searchInput = page.locator('input[placeholder*="Search papers by keywords"]');
  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  await searchInput.click();
  await searchInput.fill('');
  await searchInput.type(searchQuery, { delay: 50 });
  console.log(`Typed: "${searchQuery}"`);

  await page.keyboard.press('Enter');
  console.log('Pressed Enter, waiting for results...');
  await page.waitForTimeout(10000);

  // 截图搜索结果
  await page.screenshot({ path: `${outputDir}/search_results.png`, fullPage: true });

  // 查找并点击Like按钮
  console.log('\n=== Looking for Like button ===');

  // 查找所有按钮的详细信息
  const buttonDetails = await page.evaluate(() => {
    const buttons = [];
    document.querySelectorAll('button').forEach((btn, i) => {
      const text = (btn.textContent || '').trim().toLowerCase();
      const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      const innerHTML = btn.innerHTML.toLowerCase();
      const className = btn.className || '';

      // 检查是否是 Like 按钮
      if (text.includes('like') || ariaLabel.includes('like') ||
          text === 'like' || text.startsWith('like ') ||
          innerHTML.includes('thumbup') || innerHTML.includes('thumb-up') ||
          innerHTML.includes('m12 21.35') || innerHTML.includes('M12 21.35')) {
        const rect = btn.getBoundingClientRect();
        buttons.push({
          index: i,
          text: btn.textContent.trim().substring(0, 50),
          ariaLabel: btn.getAttribute('aria-label'),
          innerHTML: innerHTML.substring(0, 100),
          visible: rect.width > 0 && rect.height > 0,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        });
      }
    });
    return buttons;
  });

  console.log('Found Like buttons:', buttonDetails.length);
  buttonDetails.forEach(b => {
    console.log(`  [${b.index}] text="${b.text}", visible=${b.visible}, rect=${JSON.stringify(b.rect)}`);
  });

  // 尝试多种方式点击 Like 按钮
  let likeClicked = false;

  // 方法1: 直接通过文本内容查找
  if (!likeClicked) {
    try {
      const likeBtn = page.locator('button').filter({ hasText: /^Like$/i }).first();
      if (await likeBtn.isVisible()) {
        console.log('\nFound Like button by text content');
        await likeBtn.click();
        likeClicked = true;
        console.log('✓ Clicked Like button!');
      }
    } catch (e) {
      console.log('Method 1 failed:', e.message);
    }
  }

  // 方法2: 通过 index 点击
  if (!likeClicked && buttonDetails.length > 0) {
    for (const btn of buttonDetails) {
      if (btn.visible) {
        try {
          const clicked = await page.evaluate((idx) => {
            const buttons = document.querySelectorAll('button');
            if (buttons[idx]) {
              buttons[idx].click();
              return true;
            }
            return false;
          }, btn.index);

          if (clicked) {
            likeClicked = true;
            console.log(`✓ Clicked Like button at index ${btn.index}`);
            break;
          }
        } catch (e) {
          console.log(`Failed to click button at index ${btn.index}`);
        }
      }
    }
  }

  // 方法3: 在页面内直接查找并点击
  if (!likeClicked) {
    const result = await page.evaluate(() => {
      // 查找所有包含 "Like" 文本的按钮
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const text = btn.textContent.trim().toLowerCase();
        const innerHTML = btn.innerHTML.toLowerCase();

        // 检查是否是 Like 按钮（不是 Dislike）
        if ((text === 'like' || text.startsWith('like ') || text.includes('thumbup')) &&
            !text.includes('dislike')) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            btn.click();
            return { success: true, text: btn.textContent.trim().substring(0, 30) };
          }
        }
      }
      return { success: false };
    });

    if (result.success) {
      likeClicked = true;
      console.log(`✓ Clicked Like button via DOM: "${result.text}"`);
    }
  }

  // 方法4: 查找包含大拇指图标的按钮
  if (!likeClicked) {
    const result = await page.evaluate(() => {
      // SVG path for thumb-up icon
      const thumbUpPath = 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z';

      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const svg = btn.querySelector('svg path');
        if (svg) {
          const d = svg.getAttribute('d') || '';
          if (d.includes('M1 21h4V9H1v12') || d.includes('M14.17 1')) {
            const rect = btn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              // 确保不是 dislike
              const text = btn.textContent.toLowerCase();
              if (!text.includes('dislike')) {
                btn.click();
                return { success: true, html: btn.innerHTML.substring(0, 100) };
              }
            }
          }
        }
      }
      return { success: false };
    });

    if (result.success) {
      likeClicked = true;
      console.log(`✓ Clicked Like button via SVG icon`);
    }
  }

  if (likeClicked) {
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${outputDir}/after_like.png`, fullPage: true });
    console.log('\n✓ Screenshot saved: after_like.png');
    console.log('✓ Like button clicked successfully!');
  } else {
    console.log('\n✗ Could not find or click Like button');
    console.log('Available buttons on page:');
    const allBtns = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button'))
        .filter(b => b.getBoundingClientRect().width > 0)
        .slice(0, 20)
        .map(b => b.textContent.trim().substring(0, 30));
    });
    allBtns.forEach((t, i) => console.log(`  ${i}: ${t}`));
  }

  console.log('\n=== Keeping browser open for 20 seconds ===');
  await page.waitForTimeout(20000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
