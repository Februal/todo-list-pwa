#!/usr/bin/env node

/**
 * 自动GitHub Pages部署脚本
 * 运行此脚本将自动配置GitHub Pages并部署PWA
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始自动GitHub Pages部署...');

// 检查是否在Git仓库中
function checkGitRepo() {
    try {
        execSync('git rev-parse --git-dir', { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
}

// 检查远程仓库
function checkRemote() {
    try {
        const remotes = execSync('git remote -v', { encoding: 'utf8' });
        return remotes.includes('github.com');
    } catch (error) {
        return false;
    }
}

// 启用GitHub Pages
async function enableGitHubPages() {
    console.log('📋 检查GitHub Pages配置...');
    
    // 创建.github/workflows目录
    if (!fs.existsSync('.github/workflows')) {
        execSync('mkdir -p .github/workflows');
        console.log('✅ 创建工作流目录');
    }

    // 确保工作流文件存在
    const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v5
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

    fs.writeFileSync('.github/workflows/deploy.yml', workflowContent);
    console.log('✅ 更新工作流配置');
}

// 主函数
async function main() {
    try {
        // 检查Git环境
        if (!checkGitRepo()) {
            console.error('❌ 当前目录不是Git仓库');
            process.exit(1);
        }

        if (!checkRemote()) {
            console.error('❌ 没有配置GitHub远程仓库');
            console.log('请运行: git remote add origin https://github.com/YOUR_USERNAME/todo-list-pwa.git');
            process.exit(1);
        }

        // 启用GitHub Pages
        await enableGitHubPages();

        // 添加并提交更改
        try {
            execSync('git add .github/workflows/deploy.yml');
            execSync('git commit -m "Configure GitHub Pages deployment"');
            console.log('✅ 提交工作流配置');
        } catch (error) {
            console.log('ℹ️  工作流已是最新');
        }

        // 推送到GitHub
        console.log('📤 推送到GitHub...');
        execSync('git push origin main');
        console.log('✅ 推送完成');

        console.log('\n🎉 GitHub Pages自动配置完成！');
        console.log('📱 接下来：');
        console.log('1. 等待2-5分钟让GitHub自动激活Pages');
        console.log('2. 访问：https://github.com/Februal/todo-list-pwa/settings/pages');
        console.log('3. 确认Source设置为GitHub Actions');
        console.log('4. 访问：https://februal.github.io/todo-list-pwa');

    } catch (error) {
        console.error('❌ 部署失败:', error.message);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { main };