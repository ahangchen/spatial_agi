const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Search and Like v5
 * 使用 page.evaluate() 深度分析DOM并执行操作
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

  // 访问首页
  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // 等待加载完成
  console.log('Waiting for page load...');
  await page.waitForTimeout(8000);
  await page.screenshot({ path: `${outputDir}/page_initial.png`, fullPage: true });

  // 使用 page.evaluate 深度分析页面
  console.log('\n=== Deep DOM Analysis ===');

  const pageInfo = await page.evaluate(() => {
    const result = {
      inputs: [],
      buttons: [],
      textFields: [],
      searchElements: [],
      allClickable: []
    };

    // 查找所有 input 元素
    document.querySelectorAll('input').forEach((inp, i) => {
      result.inputs.push({
        index: i,
        type: inp.type,
        placeholder: inp.placeholder,
        name: inp.name,
        id: inp.id,
        className: inp.className,
        value: inp.value,
        offsetParent: inp.offsetParent !== null,
        display: window.getComputedStyle(inp).display,
        visibility: window.getComputedStyle(inp).visibility
      });
    });

    // 查找所有按钮
    document.querySelectorAll('button').forEach((btn, i) => {
      result.buttons.push({
        index: i,
        text: btn.textContent.substring(0, 50),
        ariaLabel: btn.getAttribute('aria-label'),
        title: btn.getAttribute('title'),
        className: btn.className.substring(0, 100),
        innerHTML: btn.innerHTML.substring(0, 100)
      });
    });

    // 查找可能是搜索框的元素 (MUI TextField 等)
    document.querySelectorAll('[class*="search"], [class*="Search"], [placeholder*="search" i], [placeholder*="find" i]').forEach((el, i) => {
      result.searchElements.push({
        index: i,
        tagName: el.tagName,
        type: el.type,
        placeholder: el.placeholder,
        className: el.className.substring(0, 100),
        id: el.id
      });
    });

    // 查找 MUI 输入组件
    document.querySelectorAll('.MuiInputBase-root, .MuiOutlinedInput-root, [class*="MuiInput"]').forEach((el, i) => {
      const input = el.querySelector('input');
      result.textFields.push({
        index: i,
        hasInput: !!input,
        inputType: input ? input.type : null,
        inputPlaceholder: input ? input.placeholder : null,
        className: el.className.substring(0, 100)
      });
    });

    // 查找所有可点击元素
    document.querySelectorAll('[role="button"], [onclick], [tabindex]').forEach((el, i) => {
      if (i < 20) { // 只取前20个
        result.allClickable.push({
          index: i,
          tagName: el.tagName,
          role: el.getAttribute('role'),
          textContent: el.textContent.substring(0, 30),
          className: el.className.substring(0, 50)
        });
      }
    });

    return result;
  });

  console.log('\n--- Inputs ---');
  console.log(JSON.stringify(pageInfo.inputs, null, 2));

  console.log('\n--- MUI TextFields ---');
  console.log(JSON.stringify(pageInfo.textFields, null, 2));

  console.log('\n--- Search Elements ---');
  console.log(JSON.stringify(pageInfo.searchElements, null, 2));

  console.log('\n--- Buttons (first 10) ---');
  console.log(JSON.stringify(pageInfo.buttons.slice(0, 10), null, 2));

  // 尝试找到并操作搜索框
  console.log('\n=== Attempting to interact with search ===');

  // 在页面内执行搜索
  const searchResult = await page.evaluate((query) => {
    // 方法1: 查找 MUI TextField 中的 input
    const muiInputs = document.querySelectorAll('.MuiInputBase-root input, .MuiOutlinedInput-root input');
    for (const inp of muiInputs) {
      if (inp.offsetParent !== null) { // 可见
        console.log('Found visible MUI input');
        inp.focus();
        inp.value = query;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        return { success: true, method: 'mui-input', placeholder: inp.placeholder };
      }
    }

    // 方法2: 查找任何可见的 text/search input
    const inputs = document.querySelectorAll('input[type="text"], input[type="search"], input:not([type])');
    for (const inp of inputs) {
      if (inp.offsetParent !== null) {
        inp.focus();
        inp.value = query;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        return { success: true, method: 'standard-input', placeholder: inp.placeholder };
      }
    }

    // 方法3: 查找 contenteditable 元素
    const editables = document.querySelectorAll('[contenteditable="true"]');
    for (const el of editables) {
      if (el.offsetParent !== null) {
        el.focus();
        el.textContent = query;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return { success: true, method: 'contenteditable' };
      }
    }

    return { success: false, reason: 'No suitable input found' };
  }, searchQuery);

  console.log('Search input result:', searchResult);

  if (searchResult.success) {
    // 按 Enter 提交搜索
    await page.keyboard.press('Enter');
    console.log('Pressed Enter to submit search');
    await page.waitForTimeout(5000);

    // 截图搜索结果
    await page.screenshot({ path: `${outputDir}/search_results.png`, fullPage: true });
    console.log('Screenshot saved: search_results.png');
  }

  // 检查页面内容
  const pageContent = await page.evaluate(() => document.body.innerText);
  const hasNavDreamer = pageContent.toLowerCase().includes(searchQuery.toLowerCase());
  console.log(`\nPage contains "${searchQuery}": ${hasNavDreamer}`);

  // 分析搜索结果页面的按钮
  if (hasNavDreamer) {
    console.log('\n=== Looking for like button ===');

    const likeButtonInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const likeButtons = [];

      buttons.forEach((btn, i) => {
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        const title = (btn.getAttribute('title') || '').toLowerCase();
        const innerHTML = btn.innerHTML.toLowerCase();
        const className = btn.className.toLowerCase();

        const isLike = ariaLabel.includes('like') ||
                       ariaLabel.includes('favorite') ||
                       ariaLabel.includes('heart') ||
                       title.includes('like') ||
                       innerHTML.includes('heart') ||
                       innerHTML.includes('favorite') ||
                       className.includes('like');

        if (isLike) {
          likeButtons.push({
            index: i,
            ariaLabel: btn.getAttribute('aria-label'),
            title: btn.getAttribute('title'),
            className: btn.className.substring(0, 50)
          });
        }
      });

      return likeButtons;
    });

    console.log('Like buttons found:', likeButtonInfo);

    // 点击第一个点赞按钮
    if (likeButtonInfo.length > 0) {
      const clicked = await page.evaluate((idx) => {
        const buttons = document.querySelectorAll('button');
        // 重新查找带有 like/heart/favorite 的按钮
        for (const btn of buttons) {
          const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
          const innerHTML = btn.innerHTML.toLowerCase();
          if (ariaLabel.includes('like') || ariaLabel.includes('heart') || ariaLabel.includes('favorite') ||
              innerHTML.includes('heart') || innerHTML.includes('favorite')) {
            btn.click();
            return { success: true, ariaLabel: btn.getAttribute('aria-label') };
          }
        }
        return { success: false };
      }, likeButtonInfo[0].index);

      if (clicked.success) {
        console.log('✓ Clicked like button:', clicked.ariaLabel);
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${outputDir}/after_like.png`, fullPage: true });
        console.log('Screenshot saved: after_like.png');
      }
    }
  } else {
    console.log(`\nPaper "${searchQuery}" not found in your Scholar Inbox.`);
    console.log('Tip: Scholar Inbox shows papers based on your research interests.');
    console.log('The paper may appear in future digests if it matches your interests.');
  }

  console.log('\n=== Done! Browser will close in 10 seconds ===');
  await page.waitForTimeout(10000);
  await browser.close();
}

main().catch(console.error);
