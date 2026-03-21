const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v3
 * 使用更宽松的等待策略
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

  // 监听 API 响应 - 特别是搜索相关的API
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api.scholar-inbox.com') && !url.includes('.js') && !url.includes('.css')) {
      console.log(`[API] ${response.status()} ${url}`);
      if (response.status() === 200) {
        try {
          const json = await response.json();
          // 保存API响应用于调试
          const fileName = url.split('/').pop().split('?')[0] || 'unknown';
          fs.writeFileSync(`${outputDir}/api_${fileName}.json`, JSON.stringify(json, null, 2));
        } catch (e) {}
      }
    }
  });

  // 访问首页
  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('Waiting for page to stabilize...');
  await page.waitForTimeout(5000);

  // 截图初始状态
  await page.screenshot({ path: `${outputDir}/scholar_home.png`, fullPage: true });
  console.log('Screenshot saved: scholar_home.png');

  // 查找所有input元素
  console.log('\n=== Analyzing page inputs ===');
  const inputs = await page.$$('input');
  console.log(`Found ${inputs.length} input elements`);

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    try {
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');
      const name = await input.getAttribute('name');
      const className = await input.getAttribute('class');
      const id = await input.getAttribute('id');
      const isVisible = await input.isVisible();

      console.log(`\nInput ${i + 1}:`);
      console.log(`  type: ${type}`);
      console.log(`  placeholder: ${placeholder}`);
      console.log(`  name: ${name}`);
      console.log(`  id: ${id}`);
      console.log(`  class: ${className ? className.substring(0, 50) + '...' : 'none'}`);
      console.log(`  visible: ${isVisible}`);

      // 如果是可见的文本输入框，可能是搜索框
      if (isVisible && (type === 'text' || type === 'search' || !type)) {
        if (placeholder && (placeholder.toLowerCase().includes('search') ||
            placeholder.toLowerCase().includes('找') ||
            placeholder.toLowerCase().includes('paper'))) {
          console.log('  -> This looks like a search input!');
        }
      }
    } catch (e) {}
  }

  // 尝试找到并操作搜索框
  console.log('\n=== Attempting to search ===');

  // 方法1: 使用 MUI 组件的常见选择器
  const searchSelectors = [
    'input[type="text"]',
    'input:not([type])',
    '[role="searchbox"]',
    '.MuiInputBase-input',
    'input.MuiOutlinedInput-input'
  ];

  let searchInput = null;
  for (const selector of searchSelectors) {
    const elements = await page.$$(selector);
    for (const el of elements) {
      try {
        const isVisible = await el.isVisible();
        const placeholder = await el.getAttribute('placeholder');
        if (isVisible && placeholder) {
          console.log(`Found potential search input: ${selector} with placeholder "${placeholder}"`);
          searchInput = el;
          break;
        }
      } catch (e) {}
    }
    if (searchInput) break;
  }

  if (searchInput) {
    console.log(`\nTyping "${searchQuery}" into search box...`);
    await searchInput.click();
    await page.waitForTimeout(500);
    await searchInput.fill(searchQuery);
    await page.waitForTimeout(500);

    // 按 Enter 搜索
    await page.keyboard.press('Enter');
    console.log('Search submitted!');

    // 等待搜索结果
    await page.waitForTimeout(5000);

    // 截图搜索结果
    await page.screenshot({ path: `${outputDir}/scholar_search_results.png`, fullPage: true });
    console.log('Screenshot saved: scholar_search_results.png');
  } else {
    console.log('Could not find search input, trying keyboard shortcut...');
    // 尝试 Ctrl+F 或 / 快捷键
    await page.keyboard.press('/');
    await page.waitForTimeout(500);
    await page.keyboard.type(searchQuery);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${outputDir}/scholar_keyboard_search.png`, fullPage: true });
  }

  // 查找论文卡片和点赞按钮
  console.log('\n=== Looking for paper cards and like buttons ===');

  // 获取页面文本内容
  const bodyText = await page.locator('body').innerText();
  const hasNavDreamer = bodyText.toLowerCase().includes(searchQuery.toLowerCase());
  console.log(`Page contains "${searchQuery}": ${hasNavDreamer}`);

  if (hasNavDreamer) {
    console.log('Found matching paper! Looking for like button...');

    // 查找所有可能的点赞按钮
    const buttonInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map((btn, i) => ({
        index: i,
        ariaLabel: btn.getAttribute('aria-label'),
        title: btn.getAttribute('title'),
        className: btn.className.substring(0, 50),
        innerHTML: btn.innerHTML.substring(0, 100),
        textContent: btn.textContent.substring(0, 50)
      }));
    });

    console.log('\nButtons found on page:');
    buttonInfo.forEach(btn => {
      const hasLike = (btn.ariaLabel && btn.ariaLabel.toLowerCase().includes('like')) ||
                      (btn.title && btn.title.toLowerCase().includes('like')) ||
                      btn.innerHTML.includes('heart') ||
                      btn.innerHTML.includes('Heart') ||
                      btn.innerHTML.includes('favorite');
      if (hasLike || btn.className.includes('like') || btn.className.includes('heart')) {
        console.log(`\nPotential like button [${btn.index}]:`);
        console.log(`  ariaLabel: ${btn.ariaLabel}`);
        console.log(`  title: ${btn.title}`);
        console.log(`  className: ${btn.className}`);
      }
    });

    // 尝试点击点赞按钮
    const likeSelectors = [
      'button[aria-label*="like" i]',
      'button[aria-label*="heart" i]',
      'button[aria-label*="favorite" i]',
      'button[title*="like" i]',
      'button:has(svg[path*="heart"])',
      'button:has(svg[class*="heart"])'
    ];

    for (const selector of likeSelectors) {
      try {
        const likeBtn = await page.$(selector);
        if (likeBtn) {
          const isVisible = await likeBtn.isVisible();
          if (isVisible) {
            console.log(`\nFound like button with selector: ${selector}`);
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
    console.log(`Paper "${searchQuery}" not found in current view.`);
    console.log('It may not have arrived in your inbox yet.');
  }

  // 保存页面HTML
  const html = await page.content();
  fs.writeFileSync(`${outputDir}/page_html.html`, html);
  console.log('\nPage HTML saved');

  console.log('\n=== Done! Browser will close in 10 seconds ===');
  await page.waitForTimeout(10000);

  await browser.close();
}

main().catch(console.error);
