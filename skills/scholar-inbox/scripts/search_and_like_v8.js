const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v8
 * 确保按Enter触发搜索，并等待足够长时间
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

  // 监听 API 响应
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api.scholar-inbox.com') && !url.includes('.js')) {
      console.log(`[API] ${response.status()} ${url.split('api.scholar-inbox.com')[1]}`);
    }
  });

  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  console.log('Waiting 15 seconds for page to load...');
  await page.waitForTimeout(15000);

  // 截图初始状态
  await page.screenshot({ path: `${outputDir}/01_initial.png`, fullPage: true });

  // 找到搜索框
  console.log('\n=== Finding search box ===');
  const searchInput = page.locator('input[placeholder*="Search papers by keywords"]');

  await searchInput.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Found search input!');

  // 点击搜索框
  await searchInput.click();
  await page.waitForTimeout(500);

  // 清空并输入搜索词
  await searchInput.fill('');
  await page.waitForTimeout(300);

  console.log(`Typing "${searchQuery}"...`);
  await searchInput.type(searchQuery, { delay: 50 });
  await page.waitForTimeout(500);

  // 验证输入
  const inputValue = await searchInput.inputValue();
  console.log(`Search box value: "${inputValue}"`);

  // 截图输入后的状态
  await page.screenshot({ path: `${outputDir}/02_after_input.png`, fullPage: true });

  // 按下 Enter 键触发搜索
  console.log('\n=== Pressing Enter to trigger search ===');
  await page.keyboard.press('Enter');
  console.log('Enter key pressed!');

  // 等待搜索结果 - 增加等待时间到15秒
  console.log('Waiting 15 seconds for search results...');
  await page.waitForTimeout(15000);

  // 截图搜索结果
  await page.screenshot({ path: `${outputDir}/03_search_results.png`, fullPage: true });
  console.log('Screenshot saved: 03_search_results.png');

  // 检查页面内容
  console.log('\n=== Analyzing search results ===');
  const pageContent = await page.evaluate(() => document.body.innerText);

  const hasNavDreamer = pageContent.toLowerCase().includes(searchQuery.toLowerCase());
  console.log(`Page contains "${searchQuery}": ${hasNavDreamer}`);

  // 获取搜索框的值，看是否还保留
  const searchValue = await searchInput.inputValue().catch(() => '');
  console.log(`Search box still contains: "${searchValue}"`);

  // 提取论文标题
  const paperInfo = await page.evaluate(() => {
    const results = [];

    // 查找可能的论文卡片
    document.querySelectorAll('[class*="paper"], [class*="Paper"], [class*="card"], [class*="Card"]').forEach(card => {
      const title = card.querySelector('h1, h2, h3, h4, [class*="title"]');
      if (title && title.textContent.trim().length > 10) {
        results.push({
          title: title.textContent.trim().substring(0, 100),
          className: card.className.substring(0, 50)
        });
      }
    });

    // 如果没找到，尝试其他方式
    if (results.length === 0) {
      document.querySelectorAll('h1, h2, h3').forEach(h => {
        const text = h.textContent.trim();
        if (text.length > 20 && text.length < 200 && !text.includes('Scholar Inbox')) {
          results.push({ title: text, className: h.tagName });
        }
      });
    }

    return results;
  });

  console.log('\nPaper titles found:');
  paperInfo.slice(0, 10).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.title}`);
  });

  // 如果找到论文，查找并点击点赞按钮
  if (hasNavDreamer) {
    console.log('\n=== Found NavDreamer! Looking for like button ===');

    // 查找所有按钮并分析
    const allButtons = await page.evaluate(() => {
      const buttons = [];
      document.querySelectorAll('button').forEach((btn, i) => {
        const ariaLabel = btn.getAttribute('aria-label') || '';
        const title = btn.getAttribute('title') || '';
        const className = btn.className || '';
        const innerText = btn.innerText || '';
        const innerHTML = btn.innerHTML.substring(0, 200);

        buttons.push({
          index: i,
          ariaLabel,
          title,
          className: className.substring(0, 50),
          innerText: innerText.substring(0, 30),
          hasLike: ariaLabel.toLowerCase().includes('like') ||
                   ariaLabel.toLowerCase().includes('heart') ||
                   innerHTML.toLowerCase().includes('thumbup') ||
                   innerHTML.includes('M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5')
        });
      });
      return buttons;
    });

    console.log('Buttons with like functionality:');
    allButtons.filter(b => b.hasLike).forEach(b => {
      console.log(`  [${b.index}] ariaLabel: ${b.ariaLabel}, innerText: ${b.innerText}`);
    });

    // 点击点赞按钮
    const likeButtons = allButtons.filter(b => b.hasLike);
    if (likeButtons.length > 0) {
      const btnIdx = likeButtons[0].index;
      const clicked = await page.evaluate((idx) => {
        const buttons = document.querySelectorAll('button');
        if (buttons[idx]) {
          buttons[idx].click();
          return true;
        }
        return false;
      }, btnIdx);

      if (clicked) {
        console.log('✓ Clicked like button!');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${outputDir}/04_after_like.png`, fullPage: true });
        console.log('Screenshot saved: 04_after_like.png');
      }
    }
  } else {
    console.log(`\n=== "${searchQuery}" not found in search results ===`);
    console.log('Possible reasons:');
    console.log('1. The paper is too new and not yet indexed');
    console.log('2. The paper is not in your interest categories');
    console.log('3. Scholar Inbox may not have this paper in their database');
  }

  console.log('\n=== Keeping browser open for 30 seconds ===');
  console.log('You can manually verify the search and interact with the page.');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
