const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v4
 * 更长的等待时间，更好的搜索框检测
 */

async function main() {
  const searchQuery = process.argv[2] || 'NavDreamer';
  const outputDir = process.argv[3] || './output';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

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

  console.log(`Loading ${cookies.length} cookies...`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  console.log('✓ Cookies injected');

  const page = await context.newPage();

  // 监听 API 响应
  let digestData = null;
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api.scholar-inbox.com/api/')) {
      console.log(`[API] ${response.status()} ${url.split('/api/')[1]}`);
      if (response.status() === 200 && url.includes('catchup_info')) {
        try {
          const json = await response.json();
          if (json.digest_df) {
            digestData = json;
            console.log(`  → Found ${json.digest_df.length} papers in digest`);
          }
        } catch (e) {}
      }
    }
  });

  // 访问首页
  console.log('\nNavigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // 等待页面完全加载 - 检测加载指示器消失
  console.log('Waiting for page to fully load...');
  try {
    // 等待加载指示器消失
    await page.waitForFunction(() => {
      const loader = document.querySelector('.dots-loader');
      return !loader || loader.style.display === 'none' || loader.offsetParent === null;
    }, { timeout: 30000 });
    console.log('✓ Page loaded (loader disappeared)');
  } catch (e) {
    console.log('Loader wait timed out, proceeding anyway...');
  }

  // 额外等待确保React渲染完成
  await page.waitForTimeout(3000);

  // 截图
  await page.screenshot({ path: `${outputDir}/scholar_loaded.png`, fullPage: true });
  console.log('Screenshot saved: scholar_loaded.png');

  // 分析页面元素
  console.log('\n=== Analyzing page elements ===');

  // 获取所有input
  const inputInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    return inputs.map(inp => ({
      type: inp.type,
      placeholder: inp.placeholder,
      name: inp.name,
      id: inp.id,
      className: inp.className,
      visible: inp.offsetParent !== null
    }));
  });
  console.log(`Found ${inputInfo.length} input elements:`);
  inputInfo.forEach((inp, i) => {
    console.log(`  [${i}] type=${inp.type}, placeholder="${inp.placeholder}", visible=${inp.visible}`);
  });

  // 查找搜索框 - 尝试多种方式
  console.log('\n=== Finding search box ===');
  let searchInput = null;

  // 方法1: 通过placeholder
  const searchPlaceholders = ['search', 'find', 'filter', 'search papers', '找'];
  for (const inp of await page.$$('input')) {
    const placeholder = await inp.getAttribute('placeholder') || '';
    const isVisible = await inp.isVisible().catch(() => false);
    if (isVisible && searchPlaceholders.some(p => placeholder.toLowerCase().includes(p))) {
      searchInput = inp;
      console.log(`Found search input by placeholder: "${placeholder}"`);
      break;
    }
  }

  // 方法2: 如果没找到，找第一个可见的text input
  if (!searchInput) {
    for (const inp of await page.$$('input')) {
      const type = await inp.getAttribute('type');
      const isVisible = await inp.isVisible().catch(() => false);
      if (isVisible && (type === 'text' || type === 'search' || !type)) {
        searchInput = inp;
        console.log('Found first visible text input');
        break;
      }
    }
  }

  // 执行搜索
  if (searchInput) {
    console.log(`\n=== Searching for "${searchQuery}" ===`);
    await searchInput.click();
    await page.waitForTimeout(500);
    await searchInput.fill(searchQuery);
    await page.waitForTimeout(500);

    // 按 Enter
    await page.keyboard.press('Enter');
    console.log('Search submitted!');

    // 等待搜索结果
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${outputDir}/scholar_search_results.png`, fullPage: true });
    console.log('Screenshot saved: scholar_search_results.png');
  } else {
    console.log('Could not find search input!');
  }

  // 检查页面内容
  console.log('\n=== Checking search results ===');
  const pageText = await page.locator('body').innerText();
  const hasNavDreamer = pageText.toLowerCase().includes(searchQuery.toLowerCase());
  console.log(`Page contains "${searchQuery}": ${hasNavDreamer}`);

  // 如果找到论文，查找并点击点赞按钮
  if (hasNavDreamer) {
    console.log('\n=== Looking for like button ===');

    // 获取所有按钮信息
    const buttonInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, i) => ({
        index: i,
        ariaLabel: btn.getAttribute('aria-label') || '',
        title: btn.getAttribute('title') || '',
        className: btn.className,
        innerHTML: btn.innerHTML.substring(0, 200)
      }));
    });

    console.log('Analyzing buttons for like functionality...');
    for (const btn of buttonInfo) {
      const isLike = btn.ariaLabel.toLowerCase().includes('like') ||
                     btn.title.toLowerCase().includes('like') ||
                     btn.innerHTML.includes('Heart') ||
                     btn.innerHTML.includes('heart') ||
                     btn.innerHTML.includes('Favorite') ||
                     btn.className.includes('like');

      if (isLike) {
        console.log(`\nFound potential like button [${btn.index}]:`);
        console.log(`  ariaLabel: ${btn.ariaLabel}`);
        console.log(`  title: ${btn.title}`);
        console.log(`  className: ${btn.className.substring(0, 50)}`);
      }
    }

    // 尝试点击点赞按钮
    const likeSelectors = [
      'button[aria-label*="like" i]',
      'button[aria-label*="Add to favorites" i]',
      'button[aria-label*="heart" i]',
      'button[title*="like" i]'
    ];

    for (const selector of likeSelectors) {
      try {
        const likeBtn = await page.$(selector);
        if (likeBtn) {
          const isVisible = await likeBtn.isVisible();
          if (isVisible) {
            console.log(`\nClicking like button: ${selector}`);
            await likeBtn.click();
            console.log('✓ Clicked like button!');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: `${outputDir}/scholar_after_like.png`, fullPage: true });
            console.log('Screenshot saved: scholar_after_like.png');
            break;
          }
        }
      } catch (e) {}
    }
  } else {
    console.log(`\nPaper "${searchQuery}" not found in results.`);
    console.log('The paper may not be in your Scholar Inbox yet.');
    console.log('Scholar Inbox only shows papers recommended based on your research interests.');
  }

  console.log('\n=== Done! Browser will close in 15 seconds ===');
  await page.waitForTimeout(15000);

  await browser.close();
}

main().catch(console.error);
