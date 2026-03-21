const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const searchQuery = process.argv[2] || 'Lyra';
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

  console.log('[Scholar Inbox 搜索点赞]');
  console.log(`  搜索词: "${searchQuery}"`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  const page = await context.newPage();

  let result = {
    success: false,
    paperFound: false,
    likeClicked: false,
    error: null
  };

  try {
    // 1. 访问Scholar Inbox
    console.log('  访问 Scholar Inbox...');
    await page.goto('https://www.scholar-inbox.com/home', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // 增加等待时间到30秒
    console.log('  等待页面加载 (30秒)...');
    await page.waitForTimeout(30000);

    // 2. 查找搜索框 - 使用多种选择器
    console.log('  查找搜索框...');

    let searchBox = null;
    const selectors = [
      'input.MuiInputBase-input',
      'input[type="text"]',
      'input[placeholder*="Search"]',
      'input[placeholder*="search"]',
      '.MuiInput-root input'
    ];

    for (const selector of selectors) {
      try {
        searchBox = await page.$(selector);
        if (searchBox) {
          const isVisible = await searchBox.isVisible();
          if (isVisible) {
            console.log(`  找到搜索框: ${selector}`);
            break;
          }
        }
      } catch (e) {
        // 继续尝试下一个
      }
    }

    if (!searchBox) {
      // 截图当前状态
      await page.screenshot({ path: `${outputDir}/scholar_page_debug.png`, fullPage: true });
      console.log('  未找到搜索框，已保存截图用于调试');

      // 检查页面内容
      const pageContent = await page.evaluate(() => document.body.innerText);
      console.log('  页面内容预览:', pageContent.substring(0, 200));
    } else {
      console.log(`  输入搜索词: "${searchQuery}"`);
      await searchBox.click();
      await page.waitForTimeout(500);
      await searchBox.fill(searchQuery);
      await page.waitForTimeout(500);

      // 按 Enter 搜索
      await page.keyboard.press('Enter');
      console.log('  已提交搜索，等待结果...');
      await page.waitForTimeout(10000);

      // 3. 截图搜索结果
      await page.screenshot({
        path: `${outputDir}/scholar_search_results.png`,
        fullPage: true
      });

      // 4. 检查是否找到论文
      const pageText = await page.evaluate(() => document.body.innerText);
      const hasResult = pageText.toLowerCase().includes(searchQuery.toLowerCase());

      result.paperFound = hasResult;
      console.log(`  搜索结果: ${hasResult ? '找到论文' : '未找到论文'}`);

      if (hasResult) {
        // 5. 查找并点击点赞按钮
        console.log('  查找点赞按钮...');

        const likeResult = await page.evaluate(() => {
          const allElements = Array.from(document.querySelectorAll('*'));

          for (const el of allElements) {
            const text = el.textContent || '';
            if (text.includes('thumb_up_alt') || text.includes('thumb_up_off_alt')) {
              let target = el;
              for (let i = 0; i < 10; i++) {
                const rect = target.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.width < 100) {
                  if (target.tagName === 'BUTTON' ||
                      target.getAttribute('role') === 'button' ||
                      target.style.cursor === 'pointer' ||
                      target.tagName === 'A') {
                    target.click();
                    return { success: true, tag: target.tagName };
                  }
                }
                if (target.parentElement) {
                  target = target.parentElement;
                } else {
                  break;
                }
              }

              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                el.click();
                return { success: true, tag: el.tagName };
              }
            }
          }
          return { success: false };
        });

        if (likeResult.success) {
          result.likeClicked = true;
          result.success = true;
          console.log('  ✓ 点赞按钮已点击!');

          await page.waitForTimeout(2000);
          await page.screenshot({
            path: `${outputDir}/scholar_after_like.png`,
            fullPage: true
          });
        } else {
          console.log('  ✗ 未找到点赞按钮');
        }
      }
    }

  } catch (error) {
    result.error = error.message;
    console.error(`  错误: ${error.message}`);
  }

  console.log('');
  console.log('  浏览器将在15秒后关闭...');
  await page.waitForTimeout(15000);

  await browser.close();

  // 保存结果
  const resultPath = `${outputDir}/scholar_result.json`;
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));

  console.log('');
  console.log('  结果:');
  console.log(`    - 论文找到: ${result.paperFound ? '是' : '否'}`);
  console.log(`    - 点赞成功: ${result.likeClicked ? '是' : '否'}`);

  process.exit(result.success ? 0 : 1);
}

main().catch(error => {
  console.error('执行失败:', error.message);
  process.exit(1);
});
