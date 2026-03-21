const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox 搜索并点赞 v4
 * 改进：使用 Playwright locator 精确定位点赞按钮，并验证点赞状态变化
 */

async function main() {
  const searchQuery = process.argv[2] || 'Lyra';
  const outputDir = process.argv[3] || './output';

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const cookiePath = `${outputDir}/scholar_cookies.json`;

  if (!fs.existsSync(cookiePath)) {
    console.error('错误: 未找到 Scholar Inbox cookies 文件');
    console.error('请先运行: python scripts/fetch_scholar_cookies.py');
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

  console.log('[Scholar Inbox 搜索点赞 v4]');
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
    likeStateChanged: false,
    likeCountBefore: null,
    likeCountAfter: null,
    error: null
  };

  try {
    // 1. 访问 Scholar Inbox
    console.log('  访问 Scholar Inbox...');
    await page.goto('https://www.scholar-inbox.com/home', {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });

    // 2. 智能等待页面加载
    console.log('  等待页面加载...');

    try {
      await page.waitForFunction(() => {
        const loader = document.querySelector('.dots-loader, .loading');
        if (loader) {
          const style = window.getComputedStyle(loader);
          return style.display === 'none' || style.visibility === 'hidden';
        }
        return true;
      }, { timeout: 60000 });
      console.log('  ✓ 加载指示器已消失');
    } catch (e) {
      console.log('  ⚠ 继续等待...');
    }

    // 等待搜索框
    console.log('  等待搜索框...');
    let searchBox = null;
    let waitTime = 0;
    const maxWait = 120000;
    const interval = 2000;

    while (!searchBox && waitTime < maxWait) {
      try {
        const elements = await page.$$('input.MuiInputBase-input');
        for (const el of elements) {
          if (await el.isVisible()) {
            const placeholder = await el.getAttribute('placeholder') || '';
            if (placeholder.toLowerCase().includes('search')) {
              searchBox = el;
              console.log(`  ✓ 搜索框已加载 (${waitTime/1000}秒)`);
              break;
            }
          }
        }
      } catch (e) {}

      if (!searchBox) {
        await page.waitForTimeout(interval);
        waitTime += interval;
        if (waitTime % 10000 === 0) {
          console.log(`  已等待 ${waitTime/1000} 秒...`);
        }
      }
    }

    if (!searchBox) {
      result.error = '未找到搜索框';
      console.log('  ✗ 未找到搜索框');
    } else {
      // 3. 搜索
      console.log(`  输入搜索词: "${searchQuery}"`);
      await searchBox.click();
      await searchBox.fill('');
      await searchBox.type(searchQuery, { delay: 50 });
      await page.keyboard.press('Enter');
      console.log('  已提交搜索');

      // 4. 等待搜索结果
      console.log('  等待搜索结果...');
      await page.waitForTimeout(5000);

      // 截图点赞前
      await page.screenshot({ path: `${outputDir}/scholar_before.png`, fullPage: true });

      // 5. 检查是否找到论文
      const pageText = await page.locator('body').innerText();
      result.paperFound = pageText.toLowerCase().includes(searchQuery.toLowerCase());
      console.log(`  搜索结果: ${result.paperFound ? '✓ 找到论文' : '✗ 未找到论文'}`);

      if (result.paperFound) {
        // 6. 获取点赞前的状态
        console.log('\n  === 分析点赞按钮状态 ===');

        // 获取点赞前的数量和类名
        const likeButton = page.locator('a:has-text("thumb_up")').first();

        if (await likeButton.isVisible()) {
          const classBefore = await likeButton.getAttribute('class') || '';
          const textBefore = await likeButton.innerText();
          console.log(`  点赞前 class: ${classBefore.substring(0, 60)}`);
          console.log(`  点赞前 text: ${textBefore}`);

          // 提取点赞数
          const match = textBefore.match(/(\d+)/);
          result.likeCountBefore = match ? parseInt(match[1]) : null;
          console.log(`  点赞前数量: ${result.likeCountBefore}`);

          // 记录点赞前的图标状态
          const isLikedBefore = textBefore.includes('thumb_up_alt') && !textBefore.includes('thumb_up_off_alt');
          console.log(`  点赞前状态: ${isLikedBefore ? '已点赞' : '未点赞'}`);

          // 7. 点击点赞按钮
          console.log('\n  点击点赞按钮...');

          // 使用 force: true 强制点击，忽略其他元素遮挡
          await likeButton.click({ force: true, timeout: 5000 });
          result.likeClicked = true;
          console.log('  ✓ 已点击');

          // 等待 UI 更新
          await page.waitForTimeout(2000);

          // 8. 检查点赞后的状态
          const classAfter = await likeButton.getAttribute('class') || '';
          const textAfter = await likeButton.innerText();
          console.log(`  点赞后 class: ${classAfter.substring(0, 60)}`);
          console.log(`  点赞后 text: ${textAfter}`);

          const matchAfter = textAfter.match(/(\d+)/);
          result.likeCountAfter = matchAfter ? parseInt(matchAfter[1]) : null;
          console.log(`  点赞后数量: ${result.likeCountAfter}`);

          // 记录点赞后的图标状态
          const isLikedAfter = textAfter.includes('thumb_up_alt') && !textAfter.includes('thumb_up_off_alt');
          console.log(`  点赞后状态: ${isLikedAfter ? '已点赞' : '未点赞'}`);

          // 9. 判断点赞操作是否成功
          // 检查图标状态是否改变（点赞或取消点赞都算操作成功）
          const stateChanged = isLikedBefore !== isLikedAfter;
          const classChanged = classBefore !== classAfter;
          const countChanged = result.likeCountBefore !== null &&
                              result.likeCountAfter !== null &&
                              result.likeCountAfter !== result.likeCountBefore;

          if (stateChanged) {
            result.likeStateChanged = true;
            result.success = true;
            if (!isLikedBefore && isLikedAfter) {
              console.log('\n  ✓ 点赞成功！图标状态: 未点赞 → 已点赞');
            } else if (isLikedBefore && !isLikedAfter) {
              console.log('\n  ✓ 取消点赞成功！图标状态: 已点赞 → 未点赞');
              // 如果想要点赞但之前已点赞，需要再点一次
              console.log('  提示: 如需点赞，请再次运行脚本');
            }
          } else if (countChanged) {
            result.likeStateChanged = true;
            result.success = true;
            console.log('\n  ✓ 操作成功！点赞数已变化');
            console.log(`    点赞数: ${result.likeCountBefore} → ${result.likeCountAfter}`);
          } else {
            console.log('\n  ⚠ 点赞状态未改变');
            if (isLikedBefore && isLikedAfter) {
              console.log('  提示: 该论文已经是点赞状态');
            } else {
              console.log('  可能原因: 需要登录 / 网络延迟');
            }
          }
        } else {
          console.log('  ✗ 未找到点赞按钮');
        }

        // 截图点赞后
        await page.screenshot({ path: `${outputDir}/scholar_after.png`, fullPage: true });
        console.log('  已保存截图');
      }
    }

  } catch (error) {
    result.error = error.message;
    console.error(`  错误: ${error.message}`);
  }

  console.log('\n  浏览器将在 15 秒后关闭...');
  await page.waitForTimeout(15000);

  await browser.close();

  // 保存结果
  fs.writeFileSync(`${outputDir}/scholar_result.json`, JSON.stringify(result, null, 2));

  console.log('\n  === 最终结果 ===');
  console.log(`  论文找到: ${result.paperFound ? '✓ 是' : '✗ 否'}`);
  console.log(`  点击执行: ${result.likeClicked ? '✓ 是' : '✗ 否'}`);
  console.log(`  状态改变: ${result.likeStateChanged ? '✓ 是' : '✗ 否'}`);
  if (result.likeCountBefore !== null && result.likeCountAfter !== null) {
    console.log(`  点赞数: ${result.likeCountBefore} → ${result.likeCountAfter}`);
  }

  process.exit(result.success ? 0 : 1);
}

main().catch(error => {
  console.error('执行失败:', error.message);
  process.exit(1);
});
