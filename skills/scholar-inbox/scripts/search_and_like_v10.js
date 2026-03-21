const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const searchQuery = 'NavDreamer';
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

  console.log('Starting Scholar Inbox automation...');

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  const page = await context.newPage();

  // 监听网络请求
  page.on('response', response => {
    const url = response.url();
    if (url.includes('search') || url.includes('like')) {
      console.log(`[Network] ${response.status()} ${url.substring(0, 80)}`);
    }
  });

  // 1. 访问页面
  console.log('\n1. Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(20000);

  // 2. 等待搜索框出现
  console.log('\n2. Finding search box...');
  const searchBox = page.locator('input.MuiInputBase-input').first();
  await searchBox.waitFor({ state: 'visible', timeout: 10000 });
  console.log('   Search box found!');

  // 3. 输入搜索词
  console.log(`\n3. Searching for "${searchQuery}"...`);
  await searchBox.click();
  await page.waitForTimeout(500);
  await searchBox.fill(searchQuery);
  await page.waitForTimeout(1000);

  // 4. 按 Enter 搜索
  await page.keyboard.press('Enter');
  console.log('   Enter pressed, waiting for results...');
  await page.waitForTimeout(12000);

  // 5. 截图搜索结果
  await page.screenshot({ path: `${outputDir}/search_done.png`, fullPage: true });
  console.log('   Screenshot saved: search_done.png');

  // 6. 检查是否有搜索结果
  const pageText = await page.evaluate(() => document.body.innerText);
  const hasResult = pageText.toLowerCase().includes('navdreamer');
  console.log(`\n4. Search result contains NavDreamer: ${hasResult}`);

  if (!hasResult) {
    console.log('   Paper not found in results. Ending...');
    await page.waitForTimeout(10000);
    await browser.close();
    return;
  }

  // 7. 查找并点击点赞按钮
  console.log('\n5. Looking for Like button...');

  // 方法1: 通过文本内容查找
  const thumbElements = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.textContent && el.textContent.includes('thumb_up_alt')) {
        results.push({
          tag: el.tagName,
          text: el.textContent.substring(0, 30),
          className: el.className.substring(0, 50)
        });
      }
    });
    return results;
  });

  console.log(`   Found ${thumbElements.length} elements with thumb_up_alt`);
  thumbElements.forEach(t => console.log(`   - <${t.tag}> "${t.text}"`));

  // 8. 点击点赞按钮
  console.log('\n6. Clicking Like button...');
  const clicked = await page.evaluate(() => {
    // 查找包含 thumb_up_alt 的元素
    const allElements = Array.from(document.querySelectorAll('*'));
    for (const el of allElements) {
      const text = el.textContent || '';
      if (text.includes('thumb_up_alt')) {
        // 找到最近的可点击父元素
        let target = el;
        for (let i = 0; i < 10; i++) {
          const rect = target.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && rect.width < 100) {
            // 尝试点击
            if (target.tagName === 'BUTTON' ||
                target.getAttribute('role') === 'button' ||
                target.hasAttribute('onclick') ||
                target.style.cursor === 'pointer') {
              target.click();
              return { success: true, tag: target.tagName, text: target.textContent.substring(0, 30) };
            }
          }
          if (target.parentElement) {
            target = target.parentElement;
          } else {
            break;
          }
        }

        // 直接点击元素本身
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          el.click();
          return { success: true, tag: el.tagName, method: 'direct' };
        }
      }
    }
    return { success: false };
  });

  if (clicked.success) {
    console.log(`   ✓ Like button clicked! (${clicked.tag}, "${clicked.text || clicked.method}")`);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${outputDir}/like_clicked.png`, fullPage: true });
    console.log('   Screenshot saved: like_clicked.png');
  } else {
    console.log('   ✗ Could not automatically click Like button');
  }

  console.log('\n7. Keeping browser open for 30 seconds...');
  console.log('   You can manually click the Like button if needed.');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('\nDone!');
}

main().catch(console.error);
