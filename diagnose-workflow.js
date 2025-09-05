// GitHub Actions 工作流诊断脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 GitHub Actions 工作流诊断');
console.log('================================');

// 检查工作流文件
const workflowPath = '.github/workflows/deploy.yml';
if (fs.existsSync(workflowPath)) {
    const content = fs.readFileSync(workflowPath, 'utf8');
    console.log('✅ 工作流文件存在');
    
    // 检查关键配置
    if (content.includes('actions/checkout@v4')) {
        console.log('✅ 使用最新checkout版本');
    } else {
        console.log('⚠️  checkout版本可能需要更新');
    }
    
    if (content.includes('actions/deploy-pages@v4')) {
        console.log('✅ 使用最新deploy-pages版本');
    } else {
        console.log('⚠️  deploy-pages版本可能需要更新');
    }
} else {
    console.log('❌ 工作流文件不存在');
}

// 检查必需文件
const requiredFiles = [
    'index.html',
    'manifest.json',
    'sw.js',
    'styles.css',
    'script.js'
];

console.log('\n📁 必需文件检查：');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - 缺失`);
    }
});

// 检查图标文件
console.log('\n🖼️  图标检查：');
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
iconSizes.forEach(size => {
    const iconPath = `icons/icon-${size}x${size}.png`;
    if (fs.existsSync(iconPath)) {
        const stats = fs.statSync(iconPath);
        console.log(`✅ ${size}x${size} - ${stats.size}字节`);
    } else {
        console.log(`❌ ${size}x${size} - 缺失`);
    }
});

console.log('\n📋 建议检查：');
console.log('1. 访问 https://github.com/Februal/todo-list-pwa/actions');
console.log('2. 查看最新的工作流运行详情');
console.log('3. 检查是否有任何错误或警告信息');
console.log('4. 确保GitHub Pages已启用：Settings > Pages > Build and deployment > GitHub Actions');