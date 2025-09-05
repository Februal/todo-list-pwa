const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// 创建512x512 PNG图标
async function createPNGIcons() {
  try {
    // 创建SVG到PNG的转换
    const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#2563eb" rx="64"/>
      <circle cx="128" cy="128" r="48" fill="white"/>
      <circle cx="256" cy="128" r="48" fill="white"/>
      <circle cx="384" cy="128" r="48" fill="white"/>
      <circle cx="128" cy="256" r="48" fill="white"/>
      <circle cx="256" cy="256" r="48" fill="white"/>
      <circle cx="384" cy="256" r="48" fill="white"/>
      <circle cx="128" cy="384" r="48" fill="white"/>
      <circle cx="256" cy="384" r="48" fill="white"/>
      <circle cx="384" cy="384" r="48" fill="white"/>
    </svg>`;

    // 确保icons目录存在
    if (!fs.existsSync('icons')) {
      fs.mkdirSync('icons', { recursive: true });
    }

    // 创建512x512 PNG图标
    await sharp(Buffer.from(svg512))
      .png()
      .toFile('icons/icon-512x512.png');

    // 创建192x192 PNG图标
    await sharp(Buffer.from(svg512))
      .resize(192, 192)
      .png()
      .toFile('icons/icon-192x192.png');

    // 创建144x144 PNG图标
    await sharp(Buffer.from(svg512))
      .resize(144, 144)
      .png()
      .toFile('icons/icon-144x144.png');

    console.log('✅ PNG图标创建成功！');
    console.log('📁 已创建文件：');
    console.log('   - icons/icon-512x512.png');
    console.log('   - icons/icon-192x192.png');
    console.log('   - icons/icon-144x144.png');

  } catch (error) {
    console.error('❌ 创建PNG图标失败:', error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  createPNGIcons();
}

module.exports = { createPNGIcons };