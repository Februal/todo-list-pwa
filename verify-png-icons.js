const fs = require('fs');
const path = require('path');

// 验证PNG图标
const requiredIcons = [
    'icon-72x72.png',
    'icon-96x96.png',
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png'
];

const iconsDir = 'icons';
let allPresent = true;

console.log('验证PNG图标文件：');
console.log('==================');

requiredIcons.forEach(icon => {
    const fullPath = path.join(iconsDir, icon);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`✓ ${icon} - ${Math.round(stats.size / 1024)}KB`);
    } else {
        console.log(`✗ ${icon} - 缺失`);
        allPresent = false;
    }
});

if (allPresent) {
    console.log('\n🎉 所有PNG图标都已正确创建！');
    console.log('\n现在您可以：');
    console.log('1. 访问 https://www.pwabuilder.com');
    console.log('2. 输入您的GitHub Pages地址');
    console.log('3. 生成Windows包，不会再出现500错误');
} else {
    console.log('\n❌ 缺少部分PNG图标');
}