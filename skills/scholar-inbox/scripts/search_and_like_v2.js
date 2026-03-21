const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v2
 * 更精确地搜索论文并点赞
 *
 * 用法: node search_and_like_v2.js <search_query> [output_dir]
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

  // 2. 启动 Playwright (有头模式)
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  console.log('✓ Cookies injected');

  const page = await context.newPage();

  // 3. 监听 API 响应
  const apiData = [];
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('digest') || url.includes('inbox') || url.includes('search')) {
      console.log(`[API] ${response.status()} ${url.substring(0, 100)}`);
      if (response.status() === 200) {
        try {
          const json = await response.json();
          apiData.push({ url, data: json });
        } catch (e) {
          // Not JSON
        }
      }
    }
  });

  // 4. 访问 Scholar Inbox 搜索页面
  // 尝试直接访问带搜索参数的URL
  const searchUrl = `https://www.scholar-inbox.com/home?search=${encodeURIComponent(searchQuery)}`;
  console.log(`Navigating to: ${searchUrl}`);

  await page.goto(searchUrl, {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // 等待数据加载
  console.log('Waiting for data to load...');
  await page.waitForTimeout(5000);

  // 5. 截图
  const screenshotPath = `${outputDir}/scholar_inbox_search_v2.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // 6. 获取页面HTML结构
  const pageHTML = await page.content();
  fs.writeFileSync(`${outputDir}/page_structure.html`, pageHTML);
  console.log('Page HTML saved');

  // 7. 打印API数据看看有什么
  console.log('\n=== API Data Found ===');
  for (const item of apiData) {
    console.log(`URL: ${item.url.substring(0, 80)}`);
    if (item.data) {
      const keys = Object.keys(item.data);
      console.log(`  Keys: ${keys.join(', ')}`);
      if (item.data.digest_df) {
        console.log(`  Papers in digest_df: ${item.data.digest_df.length}`);

        // 搜索匹配的论文
        const matchingPapers = item.data.digest_df.filter(p =>
          p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchingPapers.length > 0) {
          console.log(`\n  ✓ Found ${matchingPapers.length} matching papers!`);
          matchingPapers.forEach((p, i) => {
            console.log(`  [${i + 1}] ${p.title}`);
            console.log(`      ArXiv ID: ${p.arxiv_id}`);
            console.log(`      Relevance: ${(p.ranking_score * 100).toFixed(2)}`);
          });
        }
      }
      if (item.data.results) {
        console.log(`  Results: ${item.data.results.length}`);
      }
    }
    console.log('---');
  }

  // 8. 尝试在页面上查找搜索框
  console.log('\n=== Looking for search UI ===');

  // 检查常见的搜索框选择器
  const searchBoxSelectors = [
    'input[type="text"]',
    'input[type="search"]',
    'input[placeholder*="search" i]',
    'input[placeholder*="找" i]',
    '[role="searchbox"]',
    '.search input',
    '#search',
    '.searchbox'
  ];

  for (const selector of searchBoxSelectors) {
    const elements = await page.$$(selector);
    if (elements.length > 0) {
      console.log(`Found ${elements.length} elements matching: ${selector}`);

      // 尝试第一个
      const firstEl = elements[0];
      const isVisible = await firstEl.isVisible().catch(() => false);
      if (isVisible) {
        console.log('  -> Visible, trying to use it');
        try {
          await firstEl.click();
          await page.waitForTimeout(500);
          await firstEl.fill(searchQuery);
          await page.waitForTimeout(500);
          await page.keyboard.press('Enter');
          console.log(`  -> Searched for "${searchQuery}"`);
          await page.waitForTimeout(3000);

          // 截图搜索结果
          const afterSearchPath = `${outputDir}/scholar_inbox_after_search.png`;
          await page.screenshot({ path: afterSearchPath, fullPage: true });
          console.log(`After-search screenshot saved to: ${afterSearchPath}`);
          break;
        } catch (e) {
          console.log(`  -> Error: ${e.message}`);
        }
      }
    }
  }

  // 9. 查找并点击点赞按钮
  console.log('\n=== Looking for paper and like button ===');

  // 查找包含搜索关键词的文本
  try {
    // 获取所有可见文本
    const bodyText = await page.locator('body').innerText();
    if (bodyText.toLowerCase().includes(searchQuery.toLowerCase())) {
      console.log(`✓ Found "${searchQuery}" in page content!`);

      // 查找所有可能的点赞按钮
      const heartSelectors = [
        'button:has(svg)',
        '[class*="heart"]',
        '[class*="like"]',
        '[class*="favorite"]',
        'button[aria-label*="like" i]',
        'button[aria-label*="heart" i]'
      ];

      for (const selector of heartSelectors) {
        try {
          const buttons = await page.$$(selector);
          console.log(`Found ${buttons.length} elements matching: ${selector}`);
        } catch (e) {
          // Skip
        }
      }
    } else {
      console.log(`"${searchQuery}" not found in current page content`);
      console.log('The paper may not be in your inbox yet.');
    }
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // 10. 等待用户查看
  console.log('\n=== 操作完成 ===');
  console.log('浏览器将在15秒后关闭...');
  await page.waitForTimeout(15000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
