const { chromium } = require('playwright');
const fs = require('fs');

/**
 * Scholar Inbox Paper Fetcher
 * 使用 Chrome cookies 登录并获取高相关性论文
 *
 * 用法: node fetch_papers.js [output_dir] [relevance_threshold]
 */

// 获取今天的日期字符串 (YYYY-MM-DD 格式)
function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// 检查 digest_date 是否是今天
function isDigestDateToday(digestDate) {
  if (!digestDate) return false;
  const today = getTodayDateString();
  return digestDate === today;
}

function generateMarkdown(papers, threshold, digestDate) {
  let md = `# Scholar Inbox Papers\n\n`;
  md += `**Date:** ${digestDate || 'Today'} | **Relevance > ${threshold}** | **Total:** ${papers.length}\n\n`;
  md += `---\n\n`;

  papers.forEach((paper, index) => {
    // 标题、相关性、PDF链接在一行
    const pdfLink = paper.pdf_url ? `[PDF](${paper.pdf_url})` : '';
    const htmlLink = paper.html_link ? `[HTML](${paper.html_link})` : '';
    const links = [pdfLink, htmlLink].filter(l => l).join(' | ');

    md += `### ${index + 1}. ${paper.title}\n`;
    md += `**Relevance:** ${paper.relevance} | **Category:** ${paper.category || 'N/A'} | ${links}\n\n`;

    // 摘要在下一行
    md += `> ${paper.abstract || 'No abstract available.'}\n\n`;
  });

  return md;
}

async function main() {
  const outputDir = process.argv[2] || './output';
  const relevanceThreshold = parseFloat(process.argv[3]) || 10;

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. 使用 browser_cookie3 获取 cookies (需要先用 Python 获取)
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

  // 2. 启动 Playwright
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  await context.addCookies(playwrightCookies);
  console.log('✓ Cookies injected');

  const page = await context.newPage();

  // 3. 监听 API 请求
  const apiData = [];
  let digestDate = null;

  page.on('response', async response => {
    const url = response.url();
    // 只监听真正的 API 请求（api.scholar-inbox.com 域名）
    if (url.startsWith('https://api.scholar-inbox.com/api/')) {
      console.log(`[API Response] ${response.status()} ${url}`);
      if (response.status() === 200) {
        try {
          const json = await response.json();
          apiData.push({ url, data: json });
          if (json.digest_df) {
            console.log(`  → Found ${json.digest_df.length} papers in digest_df`);
            console.log(`  → Digest date: ${json.current_digest_date}`);
          }
        } catch (e) {
          // 忽略解析错误，可能是页面关闭导致的
        }
      }
    }
  });

  // 4. 访问 Scholar Inbox
  console.log('Navigating to Scholar Inbox...');
  await page.goto('https://www.scholar-inbox.com/home', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // 等待 API 数据加载完成 - 等待看到 digest_df 数据，并且日期是今天
  const todayStr = getTodayDateString();
  console.log(`Today's date: ${todayStr}`);
  console.log('Waiting for paper data to load (up to 60s)...');
  console.log('Will keep waiting if digest_date is not today...');

  let foundPapers = false;
  let retryCount = 0;
  const maxRetries = 60; // 最多等待60秒
  const dateValidationRetries = 3; // 如果日期不对，额外重试次数

  for (let i = 0; i < maxRetries; i++) {
    await page.waitForTimeout(1000);
    // 检查是否已经捕获到论文数据
    for (const item of apiData) {
      if (item.data && item.data.digest_df && item.data.digest_df.length > 0) {
        const currentDate = item.data.current_digest_date || null;

        // 验证日期是否是今天
        if (isDigestDateToday(currentDate)) {
          foundPapers = true;
          digestDate = currentDate;
          console.log(`✓ Found paper data with TODAY's date: ${digestDate}`);
          break;
        } else {
          // 日期不是今天，可能需要刷新页面或等待
          console.log(`  → Found papers but digest_date (${currentDate}) is NOT today (${todayStr})`);
          console.log(`  → Waiting for updated data... (${i + 1}s/${maxRetries}s)`);

          // 如果已经等待了一半时间，尝试刷新页面
          if (i === 30 && retryCount < dateValidationRetries) {
            console.log('  → Refreshing page to get updated data...');
            apiData.length = 0; // 清空之前的API数据
            await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
            retryCount++;
            i = 0; // 重置计数器
          }
        }
      }
    }
    if (foundPapers) {
      console.log(`✓ Found TODAY's paper data after ${i + 1}s`);
      break;
    }
  }

  if (!foundPapers) {
    console.log(`⚠ WARNING: Could not find paper data with today's date (${todayStr})`);
    console.log('⚠ Using whatever data is available...');

    // 使用最后找到的任何数据
    for (const item of apiData) {
      if (item.data && item.data.digest_df && item.data.digest_df.length > 0) {
        digestDate = item.data.current_digest_date || null;
        console.log(`  → Using digest_date: ${digestDate}`);
        break;
      }
    }
  }

  // 5. 提取论文数据
  const papers = [];

  for (const item of apiData) {
    if (item.data && 'digest_df' in item.data) {
      digestDate = item.data.current_digest_date || null;
      const digestPapers = item.data.digest_df || [];

      for (const paper of digestPapers) {
        const rankingScore = paper.ranking_score || 0;
        const relevance = rankingScore * 100;

        if (relevance > relevanceThreshold) {
          papers.push({
            title: paper.title,
            authors: paper.shortened_authors || paper.authors,
            abstract: paper.abstract,
            relevance: parseFloat(relevance.toFixed(2)),
            category: paper.category,
            arxiv_id: paper.arxiv_id,
            pdf_url: paper.url,
            html_link: paper.html_link
          });
        }
      }
    }
  }

  // 6. 按 relevance 排序，只保留 TOP 10
  papers.sort((a, b) => b.relevance - a.relevance);
  const topPapers = papers.slice(0, 10);

  console.log(`\n📊 Total papers with relevance > ${relevanceThreshold}: ${papers.length}`);
  console.log(`📊 Keeping TOP 10 papers for output`);

  // 7. 保存为 Markdown (使用 TOP 10)
  const markdown = generateMarkdown(topPapers, relevanceThreshold, digestDate);
  const mdPath = `${outputDir}/papers_relevance_gt_${relevanceThreshold}.md`;
  fs.writeFileSync(mdPath, markdown);

  // 同时保存 JSON (用于程序处理，使用 TOP 10)
  const jsonPath = `${outputDir}/papers_relevance_gt_${relevanceThreshold}.json`;
  fs.writeFileSync(jsonPath, JSON.stringify(topPapers, null, 2));

  console.log(`\n✓ Saved TOP 10 papers (from ${papers.length} total with relevance > ${relevanceThreshold})`);
  console.log(`✓ Markdown saved to: ${mdPath}`);
  console.log(`✓ JSON saved to: ${jsonPath}`);

  // 8. 打印摘要
  if (topPapers.length > 0) {
    console.log('\n=== Top Papers ===');
    topPapers.forEach((p, i) => {
      console.log(`\n[${i + 1}] Relevance: ${p.relevance}`);
      console.log(`    Title: ${p.title}`);
      console.log(`    PDF: ${p.pdf_url}`);
    });
  }

  await browser.close();
}

main().catch(console.error);
