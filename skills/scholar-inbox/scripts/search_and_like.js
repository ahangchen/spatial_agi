const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like
 * 搜索指定论文并点赞
 *
 * 用法: node search_and_like.js <search_query> [output_dir]
 */

async function main() {
  const searchQuery = process.argv[2] || 'NavDreamer';
  const outputDir = process.argv[3] || './output';

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. 使用 cookies
  const cookiePath = `${outputDir}/scholar_cookies.json`;

  if (!fs.existsSync(cookiePath)) {
    console.error('请先运行 fetch_cookies.py 获取 Chrome cookies');
    process.exit(1);
  }

  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
  const playwrightCookies = cookies.map(c => ({
    domain: c.domain,
    name: c.name,
    value: c.value,
    path: c.path,
    secure: Boolean(c.secure)
  }));

  console.log(`Loading ${cookies.length} cookies from Chrome...`);

  // 2. 启动 Playwright (有头模式，用户可见)
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  console.log('✓ Cookies injected');

  const page = await context.newPage();

  // 3. 访问 Scholar Inbox
  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // 等待页面加载
  await page.waitForTimeout(3000);
  console.log('Page loaded');

  // 4. 查找搜索框并搜索
  console.log(`Searching for: "${searchQuery}"`);

  // 尝试多种可能的搜索框选择器
  const searchSelectors = [
    'input[type="search"]',
    'input[placeholder*="search" i]',
    'input[placeholder*="Search" i]',
    '[data-testid="search-input"]',
    'input[name="search"]',
    'input[name="query"]',
    '.search-input',
    '#search-input'
  ];

  let searchInput = null;
  for (const selector of searchSelectors) {
    try {
      searchInput = await page.$(selector);
      if (searchInput) {
        console.log(`Found search input with selector: ${selector}`);
        break;
      }
    } catch (e) {
      // 继续尝试下一个
    }
  }

  if (searchInput) {
    await searchInput.fill(searchQuery);
    await page.keyboard.press('Enter');
    console.log('Search submitted');
    await page.waitForTimeout(3000);
  } else {
    console.log('Could not find search input, looking for papers in current view...');
  }

  // 5. 截图当前状态
  const screenshotPath = `${outputDir}/scholar_inbox_search.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // 6. 查找匹配的论文和点赞按钮
  console.log('Looking for paper matching search query...');

  // 获取页面内容
  const pageContent = await page.content();

  // 尝试找到包含搜索关键词的论文卡片
  const likeSelectors = [
    'button[aria-label*="like" i]',
    'button[title*="like" i]',
    '[data-testid="like-button"]',
    '.like-button',
    'button.like',
    'button[class*="like"]',
    'svg[class*="heart"]',
    'button:has(svg[class*="heart"])',
    'button:has(svg[class*="Heart"])'
  ];

  // 查找包含 NavDreamer 的元素
  try {
    const paperLocator = page.locator(`text=/.*${searchQuery}.*/i`);
    const count = await paperLocator.count();
    console.log(`Found ${count} elements containing "${searchQuery}"`);

    if (count > 0) {
      // 找到论文，尝试找到附近的爱护按钮
      const paperElement = paperLocator.first();

      // 获取论文的父元素
      const parentElement = await paperElement.evaluateHandle(el => {
        let parent = el.parentElement;
        // 向上查找直到找到卡片容器
        for (let i = 0; i < 5 && parent; i++) {
          if (parent.classList.contains('paper-card') ||
              parent.classList.contains('card') ||
              parent.querySelector('button[aria-label*="like" i]') ||
              parent.querySelector('button[title*="like" i]')) {
            return parent;
          }
          parent = parent.parentElement;
        }
        return el.parentElement;
      });

      // 在父元素中查找点赞按钮
      for (const selector of likeSelectors) {
        try {
          const likeButton = await parentElement.$(selector);
          if (likeButton) {
            console.log(`Found like button with selector: ${selector}`);

            // 点击点赞按钮
            await likeButton.click();
            console.log('✓ Clicked like button!');

            // 等待一下看效果
            await page.waitForTimeout(1000);

            // 截图点赞后的状态
            const afterScreenshotPath = `${outputDir}/scholar_inbox_after_like.png`;
            await page.screenshot({ path: afterScreenshotPath, fullPage: true });
            console.log(`After-like screenshot saved to: ${afterScreenshotPath}`);

            break;
          }
        } catch (e) {
          // 继续尝试
        }
      }
    }
  } catch (e) {
    console.log(`Error finding paper: ${e.message}`);
  }

  // 7. 保持浏览器打开一段时间让用户看到
  console.log('\n=== 操作完成 ===');
  console.log('浏览器将在10秒后关闭，或您可以手动关闭...');

  // 等待用户查看
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
