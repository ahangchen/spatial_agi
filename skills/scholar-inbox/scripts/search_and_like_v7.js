const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v7
 * 正确触发搜索并在结果中查找论文点赞
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

  // 找到搜索框并使用 Playwright 的 fill 方法输入
  console.log('\n=== Finding and filling search box ===');

  // 使用更精确的选择器找到搜索框
  const searchInput = page.locator('input[placeholder*="Search papers by keywords"]');

  try {
    await searchInput.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Found search input!');

    // 点击并清空
    await searchInput.click();
    await searchInput.fill('');
    await page.waitForTimeout(500);

    // 逐字输入以触发 React 事件
    console.log(`Typing "${searchQuery}"...`);
    await searchInput.type(searchQuery, { delay: 100 });

    await page.waitForTimeout(1000);

    // 验证输入值
    const inputValue = await searchInput.inputValue();
    console.log(`Search box value: "${inputValue}"`);

    // 按 Enter 搜索
    await page.keyboard.press('Enter');
    console.log('Pressed Enter to search');

    // 等待搜索结果加载
    console.log('Waiting for search results...');
    await page.waitForTimeout(8000);

    // 截图
    await page.screenshot({ path: `${outputDir}/search_results_v7.png`, fullPage: true });
    console.log('Screenshot saved');

  } catch (e) {
    console.log(`Error finding search input: ${e.message}`);
  }

  // 检查页面内容
  const pageContent = await page.evaluate(() => document.body.innerText);
  console.log('\n=== Page Content Analysis ===');

  const hasNavDreamer = pageContent.toLowerCase().includes(searchQuery.toLowerCase());
  console.log(`Page contains "${searchQuery}": ${hasNavDreamer}`);

  // 获取页面上的所有论文标题
  const paperTitles = await page.evaluate(() => {
    const titles = [];
    // 尝试多种选择器找论文标题
    document.querySelectorAll('h1, h2, h3, h4, [class*="title"], [class*="Title"]').forEach(el => {
      const text = el.textContent.trim();
      if (text.length > 10 && text.length < 300) {
        titles.push(text);
      }
    });
    return [...new Set(titles)].slice(0, 20);  // 去重，取前20个
  });

  console.log('\nPaper titles found on page:');
  paperTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t.substring(0, 80)}...`));

  // 如果找到 NavDreamer，查找并点击点赞按钮
  if (hasNavDreamer) {
    console.log('\n=== Looking for Like Button ===');

    // 先截图当前状态
    await page.screenshot({ path: `${outputDir}/before_like.png`, fullPage: true });

    // 查找点赞按钮 - 使用多种选择器
    const likeSelectors = [
      'button[aria-label*="like" i]',
      'button[aria-label*="Like" i]',
      'button[aria-label*="Add to liked" i]',
      'button[aria-label*="heart" i]',
      'button[title*="like" i]'
    ];

    let likeClicked = false;

    // 在包含 NavDreamer 的论文卡片附近找点赞按钮
    for (const selector of likeSelectors) {
      try {
        const likeBtns = await page.$$(selector);
        console.log(`Found ${likeBtns.length} buttons matching: ${selector}`);

        for (const btn of likeBtns) {
          const isVisible = await btn.isVisible();
          if (isVisible) {
            const ariaLabel = await btn.getAttribute('aria-label');
            console.log(`  Trying button: ${ariaLabel}`);
            await btn.click();
            likeClicked = true;
            console.log(`✓ Clicked like button: ${ariaLabel}`);
            break;
          }
        }
        if (likeClicked) break;
      } catch (e) {}
    }

    // 如果上面的选择器没找到，尝试在页面内查找
    if (!likeClicked) {
      console.log('Trying to find like button by traversing DOM...');

      const clicked = await page.evaluate((query) => {
        // 找到包含搜索词的元素
        const allElements = document.querySelectorAll('*');
        let paperCard = null;

        for (const el of allElements) {
          if (el.textContent.toLowerCase().includes(query.toLowerCase()) &&
              el.textContent.length < 500) {
            paperCard = el.closest('[class*="card"], [class*="Card"], [class*="paper"], [class*="Paper"], article, section');
            if (paperCard) break;
          }
        }

        if (paperCard) {
          // 在论文卡片内找点赞按钮
          const buttons = paperCard.querySelectorAll('button');
          for (const btn of buttons) {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const innerHTML = btn.innerHTML.toLowerCase();

            if (ariaLabel.includes('like') || ariaLabel.includes('heart') ||
                innerHTML.includes('thumbup') || innerHTML.includes('favorite')) {
              btn.click();
              return { success: true, label: btn.getAttribute('aria-label') };
            }
          }
        }

        // 如果还是没找到，尝试找所有可见的点赞按钮
        const allButtons = document.querySelectorAll('button');
        for (const btn of allButtons) {
          const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
          const innerHTML = btn.innerHTML.toLowerCase();

          if ((ariaLabel.includes('like') && !ariaLabel.includes('dislike')) ||
              ariaLabel.includes('heart') || ariaLabel.includes('favorite')) {
            const rect = btn.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              btn.click();
              return { success: true, label: btn.getAttribute('aria-label') };
            }
          }
        }

        return { success: false, reason: 'No like button found' };
      }, searchQuery);

      if (clicked.success) {
        console.log(`✓ Clicked like button via DOM traversal: ${clicked.label}`);
        likeClicked = true;
      } else {
        console.log(`Could not find like button: ${clicked.reason}`);
      }
    }

    if (likeClicked) {
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${outputDir}/after_like.png`, fullPage: true });
      console.log('Screenshot saved: after_like.png');
    }
  } else {
    console.log(`\n"${searchQuery}" not found in search results.`);
    console.log('The paper may not be indexed in Scholar Inbox yet.');
    console.log('\nScholar Inbox only shows papers from arXiv, bioRxiv, medRxiv, and ChemRxiv.');
  }

  console.log('\n=== Keeping browser open for 30 seconds ===');
  console.log('You can manually search and like the paper if needed.');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
