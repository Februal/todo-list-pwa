#!/usr/bin/env node
/**
 * 创建PWA图标生成器
 */

const fs = require('fs');
const path = require('path');

// 创建图标目录
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons', { recursive: true });
}

// 生成不同尺寸的SVG图标
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#2563eb" rx="${Math.round(size * 0.15)}"/>
    <circle cx="${Math.round(size * 0.3)}" cy="${Math.round(size * 0.3)}" r="${Math.round(size * 0.08)}" fill="white"/>
    <circle cx="${Math.round(size * 0.5)}" cy="${Math.round(size * 0.3)}" r="${Math.round(size * 0.08)}" fill="white"/>
    <circle cx="${Math.round(size * 0.7)}" cy="${Math.round(size * 0.3)}" r="${Math.round(size * 0.08)}" fill="white"/>
    <rect x="${Math.round(size * 0.2)}" y="${Math.round(size * 0.45)}" width="${Math.round(size * 0.6)}" height="${Math.round(size * 0.1)}" fill="white" rx="${Math.round(size * 0.05)}"/>
    <rect x="${Math.round(size * 0.2)}" y="${Math.round(size * 0.6)}" width="${Math.round(size * 0.4)}" height="${Math.round(size * 0.1)}" fill="white" rx="${Math.round(size * 0.05)}"/>
</svg>`;
    
    fs.writeFileSync(`icons/icon-${size}x${size}.svg`, svgContent);
    console.log(`✅ 创建图标: icons/icon-${size}x${size}.svg`);
});

// 更新manifest.json包含所有图标
const manifestPath = 'manifest.json';
if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // 添加图标配置
    manifest.icons = [
        {
            "src": "icons/icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
        },
        {
            "src": "icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
        },
        {
            "src": "icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
        },
        {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ];
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ 已更新manifest.json包含所有图标');
}

console.log('🎨 所有图标已创建完成！');
console.log('💡 提示：将SVG转换为PNG格式用于实际部署');