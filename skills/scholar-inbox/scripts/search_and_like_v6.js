const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v6
 * 更长的等待时间，让页面完全加载
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
  const page = await context.newPage();

  // 监听 API 响应
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('api.scholar-inbox.com')) {
      console.log(`[API] ${response.status()} ${url.split('api.scholar-inbox.com')[1]}`);
    }
  });

  // 访问首页
  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  // 等待更长时间让页面完全加载
  console.log('Waiting 15 seconds for page to fully load...');
  await page.waitForTimeout(15000);

  console.log('Taking initial screenshot...');
  await page.screenshot({ path: `${outputDir}/page_loaded.png`, fullPage: true });

  // 使用 page.evaluate 深度分析页面
  console.log('\n=== Analyzing Page DOM ===');

  const pageInfo = await page.evaluate(() => {
    const result = {
      title: document.title,
      url: window.location.href,
      bodyText: document.body.innerText.substring(0, 1000),
      inputs: [],
      buttons: [],
      muiInputs: [],
      allElements: []
    };

    // 查找所有 input 元素
    document.querySelectorAll('input').forEach((inp, i) => {
      const rect = inp.getBoundingClientRect();
      result.inputs.push({
        index: i,
        type: inp.type,
        placeholder: inp.placeholder,
        name: inp.name,
        id: inp.id,
        visible: rect.width > 0 && rect.height > 0,
        className: inp.className.substring(0, 50)
      });
    });

    // 查找所有按钮
    document.querySelectorAll('button').forEach((btn, i) => {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        result.buttons.push({
          index: i,
          text: btn.textContent.substring(0, 30).trim(),
          ariaLabel: btn.getAttribute('aria-label'),
          className: btn.className.substring(0, 50)
        });
      }
    });

    // 查找 MUI 输入框
    document.querySelectorAll('.MuiInputBase-root, [class*="MuiInput"], [class*="MuiTextField"]').forEach((el, i) => {
      const input = el.querySelector('input') || el.querySelector('textarea');
      result.muiInputs.push({
        index: i,
        hasInput: !!input,
        placeholder: input ? input.placeholder : null,
        className: el.className.substring(0, 80)
      });
    });

    // 查找可能的搜索相关元素
    document.querySelectorAll('[class*="search"], [class*="Search"], [placeholder*="search" i], [data-testid*="search"]').forEach((el, i) => {
      result.allElements.push({
        index: i,
        tagName: el.tagName,
        className: el.className.substring(0, 80),
        placeholder: el.placeholder,
        type: el.type
      });
    });

    return result;
  });

  console.log('\nPage Info:');
  console.log(`  Title: ${pageInfo.title}`);
  console.log(`  URL: ${pageInfo.url}`);
  console.log(`  Body Text Preview: ${pageInfo.bodyText.substring(0, 200)}...`);

  console.log('\n--- Inputs ---');
  console.log(JSON.stringify(pageInfo.inputs, null, 2));

  console.log('\n--- Buttons ---');
  console.log(JSON.stringify(pageInfo.buttons, null, 2));

  console.log('\n--- MUI Inputs ---');
  console.log(JSON.stringify(pageInfo.muiInputs, null, 2));

  console.log('\n--- Search Elements ---');
  console.log(JSON.stringify(pageInfo.allElements, null, 2));

  // 尝试搜索
  console.log('\n=== Attempting Search ===');

  const searchResult = await page.evaluate((query) => {
    // 查找所有可能的搜索输入框
    const allInputs = document.querySelectorAll('input');

    for (const inp of allInputs) {
      const rect = inp.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // 找到第一个可见的文本输入框
        if (inp.type === 'text' || inp.type === 'search' || !inp.type) {
          console.log('Found visible input:', inp.placeholder || inp.name || inp.id);

          // 聚焦并输入
          inp.focus();
          inp.value = query;

          // 触发各种事件确保 React 感知到变化
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
          inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

          return {
            success: true,
            method: 'input-found',
            placeholder: inp.placeholder,
            name: inp.name,
            id: inp.id
          };
        }
      }
    }

    // 尝试 MUI 组件
    const muiRoots = document.querySelectorAll('.MuiInputBase-root');
    for (const root of muiRoots) {
      const inp = root.querySelector('input');
      if (inp) {
        const rect = inp.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          inp.focus();
          inp.value = query;
          inp.dispatchEvent(new Event('input', { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));

          return {
            success: true,
            method: 'mui-input',
            placeholder: inp.placeholder
          };
        }
      }
    }

    return { success: false, reason: 'No visible input found' };
  }, searchQuery);

  console.log('Search result:', searchResult);

  if (searchResult.success) {
    console.log('Pressing Enter to submit...');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(8000);

    console.log('Taking search results screenshot...');
    await page.screenshot({ path: `${outputDir}/search_results.png`, fullPage: true });
  }

  // 检查页面内容是否包含搜索词
  const finalContent = await page.evaluate(() => document.body.innerText);
  const hasResult = finalContent.toLowerCase().includes(searchQuery.toLowerCase());
  console.log(`\nPage contains "${searchQuery}": ${hasResult}`);

  // 如果找到论文，查找并点击点赞按钮
  if (hasResult) {
    console.log('\n=== Looking for Like Button ===');

    const likeInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const likes = [];

      buttons.forEach((btn, i) => {
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const html = btn.innerHTML.toLowerCase();

        if (ariaLabel.includes('like') || ariaLabel.includes('heart') || ariaLabel.includes('favorite') ||
            title.includes('like') || html.includes('heart') || html.includes('favorite')) {
          likes.push({
            index: i,
            ariaLabel: btn.getAttribute('aria-label'),
            title: btn.getAttribute('title'),
            text: btn.textContent.substring(0, 20)
          });
        }
      });

      return likes;
    });

    console.log('Like buttons found:', likeInfo);

    if (likeInfo.length > 0) {
      // 点击第一个点赞按钮
      const clicked = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
          const html = btn.innerHTML.toLowerCase();

          if (ariaLabel.includes('like') || ariaLabel.includes('heart') || ariaLabel.includes('favorite') ||
              html.includes('heart') || html.includes('favorite')) {
            btn.click();
            return { clicked: true, label: btn.getAttribute('aria-label') };
          }
        }
        return { clicked: false };
      });

      if (clicked.clicked) {
        console.log(`✓ Clicked like button: ${clicked.label}`);
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${outputDir}/after_like.png`, fullPage: true });
        console.log('Screenshot saved: after_like.png');
      }
    }
  } else {
    console.log(`\n"${searchQuery}" not found on page.`);
    console.log('The paper may not be in your current digest.');
  }

  console.log('\n=== Keeping browser open for 30 seconds ===');
  console.log('You can interact with the page manually if needed.');
  await page.waitForTimeout(30000);

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
