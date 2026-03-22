const pptxgen = require('pptxgenjs');
const html2pptx = require('/home/cwh/.openclaw/workspace/skills/pptx/scripts/html2pptx');
const sharp = require('sharp');
const path = require('path');

async function createGradientBackground(filename, color1, color2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="562.5">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(filename);

  return filename;
}

async function createPresentation() {
  console.log('Creating gradient backgrounds...');
  const bgPath = path.join(__dirname, 'gradient-bg.png');
  await createGradientBackground(bgPath, '#722F37', '#8B3A42');

  console.log('Creating presentation...');
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Technical Leader';
  pptx.title = '技术Leader竞聘PPT';

  const slides = [
    'slide1-cover.html',
    'slide2-intro.html',
    'slide3-responsibility.html',  // 新增：PL职责与追求
    'slide3-achievement-overview.html',
    'slide4-achievement1.html',
    'slide5-achievement2.html',
    'slide6-achievement3.html',
    'slide7-achievement4.html',
    'slide8-advantages.html',
    'slide9-plan.html',
    'slide10-end.html'
  ];

  for (let i = 0; i < slides.length; i++) {
    const slidePath = path.join(__dirname, 'slides', slides[i]);
    console.log(`Processing slide ${i + 1}/${slides.length}: ${slides[i]}`);
    await html2pptx(slidePath, pptx);
  }

  const outputPath = path.join(__dirname, '技术Leader竞聘模板.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`\n✅ Presentation created successfully!`);
  console.log(`📄 File: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
