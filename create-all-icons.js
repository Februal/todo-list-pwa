const fs = require('fs');
const path = require('path');

// 创建icons目录
if (!fs.existsSync('icons')) {
    fs.mkdirSync('icons');
}

// 复制512x512图标到icons目录
fs.copyFileSync('todo-icon-512.png', 'icons/icon-512x512.png');
console.log('已复制512x512图标到icons目录');

// 创建不同尺寸的图标（使用512图标作为占位符）
const sizes = [192, 144, 96, 72];
const baseIcon = fs.readFileSync('todo-icon-512.png');

sizes.forEach(size => {
    const filename = `icons/icon-${size}x${size}.png`;
    fs.writeFileSync(filename, baseIcon);
    console.log(`创建了 ${size}x${size} 图标占位符`);
});

console.log('所有PNG图标已创建完成！');