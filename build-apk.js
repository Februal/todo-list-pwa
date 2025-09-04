#!/usr/bin/env node

/**
 * PWA Builder APK 生成脚本
 * 使用 PWABuilder API 自动生成 Android APK 文件
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置参数
const CONFIG = {
    appName: '待办清单',
    packageId: 'com.todo.app',
    appUrl: 'http://localhost:8000',
    outputDir: './apk-build',
    pwaBuilderApi: 'https://pwabuilder-api-prod.azurewebsites.net'
};

// 创建输出目录
if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// 步骤1：验证PWA
async function validatePWA() {
    console.log('🔍 正在验证PWA配置...');
    
    // 检查必需文件
    const requiredFiles = ['manifest.json', 'sw.js', 'index.html'];
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            throw new Error(`❌ 缺少必需文件: ${file}`);
        }
    }
    
    // 读取manifest.json
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    // 验证必需字段
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    for (const field of requiredFields) {
        if (!manifest[field]) {
            throw new Error(`❌ manifest.json缺少必需字段: ${field}`);
        }
    }
    
    console.log('✅ PWA验证通过');
    return manifest;
}

// 步骤2：使用PWA Builder API生成APK
async function generateAPK() {
    console.log('🚀 开始生成APK...');
    
    // 注意：这是一个模拟脚本，实际使用时需要部署到可访问的URL
    console.log(`
📱 PWA Builder APK 生成指南
========================

由于我们使用本地服务器 (localhost:8000)，
需要通过以下步骤生成APK：

1. 部署到可访问的URL
   - 使用 GitHub Pages
   - 使用 Netlify
   - 使用 Vercel
   - 使用 Firebase Hosting

2. 访问 PWA Builder
   URL: https://www.pwabuilder.com

3. 输入您的应用URL

4. 选择 "Android" 平台

5. 下载生成的APK

下面提供几种部署方案：
    `);
    
    // 创建部署配置文件
    createDeploymentConfigs();
    
    return true;
}

// 创建部署配置文件
function createDeploymentConfigs() {
    console.log('📦 创建部署配置文件...');
    
    // 1. GitHub Pages 配置
    const githubWorkflow = `.github/workflows/deploy.yml`;
    const githubConfig = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        publish_branch: gh-pages`;
    
    fs.writeFileSync('.github-workflow.yml', githubConfig);
    
    // 2. Netlify 配置
    const netlifyConfig = `[build]
  publish = "."
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"`;
    
    fs.writeFileSync('netlify.toml', netlifyConfig);
    
    // 3. Vercel 配置
    const vercelConfig = `{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}`;
    
    fs.writeFileSync('vercel.json', vercelConfig);
    
    console.log('✅ 部署配置文件已创建');
}

// 主执行函数
async function main() {
    try {
        console.log('🎯 PWA Builder APK 生成工具');
        console.log('============================\n');
        
        await validatePWA();
        await generateAPK();
        
        console.log('\n🎉 准备完成！');
        console.log('\n下一步：');
        console.log('1. 选择一个部署平台');
        console.log('2. 部署后访问 pwabuilder.com');
        console.log('3. 输入部署后的URL');
        console.log('4. 下载APK文件');
        
    } catch (error) {
        console.error('❌ 错误:', error.message);
        process.exit(1);
    }
}

// 如果直接运行
if (require.main === module) {
    main();
}

module.exports = { validatePWA, generateAPK };