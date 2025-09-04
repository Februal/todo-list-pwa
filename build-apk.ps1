# 📱 PWA Builder APK 生成脚本
# PowerShell 版本 - 适用于Windows

param(
    [string]$DeployMethod = "menu",
    [string]$GitHubUsername = "",
    [string]$RepositoryName = "todo-list-pwa"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📱 PWA Builder APK 打包工具" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Show-Menu {
    Write-Host "请选择部署方式：" -ForegroundColor Yellow
    Write-Host "1. GitHub Pages (推荐)" -ForegroundColor White
    Write-Host "2. Netlify" -ForegroundColor White
    Write-Host "3. Vercel" -ForegroundColor White
    Write-Host "4. 手动使用 PWA Builder" -ForegroundColor White
    Write-Host "5. 查看使用说明" -ForegroundColor White
    Write-Host "6. 退出" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "请输入选项(1-6)"
    return $choice
}

function Test-GitInstalled {
    try {
        $gitVersion = git --version 2>$null
        if ($gitVersion) {
            Write-Host "✅ Git已安装: $gitVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ 未检测到Git" -ForegroundColor Red
        return $false
    }
    return $false
}

function Deploy-GitHubPages {
    Write-Host ""
    Write-Host "🔧 准备部署到 GitHub Pages..." -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-GitInstalled)) {
        Write-Host "请先安装Git: https://git-scm.com/downloads" -ForegroundColor Red
        Read-Host "按回车键继续..."
        return
    }
    
    # 检查是否已初始化Git仓库
    if (Test-Path ".git") {
        Write-Host "✅ Git仓库已存在" -ForegroundColor Green
    } else {
        Write-Host "📁 初始化Git仓库..." -ForegroundColor Yellow
        git init
        git add .
        git commit -m "Initial commit: Todo List PWA"
    }
    
    # 创建GitHub Pages工作流
    if (-not (Test-Path ".github")) { New-Item -ItemType Directory -Path ".github" -Force }
    if (-not (Test-Path ".github\workflows")) { New-Item -ItemType Directory -Path ".github\workflows" -Force }
    
    $workflowContent = @"
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        publish_branch: gh-pages
"@
    
    $workflowContent | Out-File -FilePath ".github\workflows\deploy.yml" -Encoding UTF8
    Write-Host "✅ GitHub Pages工作流已创建" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📋 下一步操作：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://github.com 创建新仓库: $RepositoryName" -ForegroundColor White
    Write-Host "2. 运行以下命令：" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/$RepositoryName.git" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host "3. 访问 https://pwabuilder.com" -ForegroundColor White
    Write-Host "4. 输入您的GitHub Pages URL" -ForegroundColor White
    Write-Host "5. 下载生成的APK文件" -ForegroundColor White
    Write-Host ""
    
    Read-Host "按回车键继续..."
}

function Deploy-Netlify {
    Write-Host ""
    Write-Host "🔧 准备部署到 Netlify..." -ForegroundColor Cyan
    Write-Host ""
    
    # 创建Netlify配置
    $netlifyConfig = @"
[build]
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
    Cache-Control = "public, max-age=0, must-revalidate"
"@
    
    $netlifyConfig | Out-File -FilePath "netlify.toml" -Encoding UTF8
    Write-Host "✅ Netlify配置文件已创建" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📋 部署步骤：" -ForegroundColor Yellow
    Write-Host "1. 访问 https://netlify.com" -ForegroundColor White
    Write-Host "2. 拖拽整个项目文件夹到部署区域" -ForegroundColor White
    Write-Host "3. 获得部署URL" -ForegroundColor White
    Write-Host "4. 访问 https://pwabuilder.com" -ForegroundColor White
    Write-Host "5. 输入Netlify URL" -ForegroundColor White
    Write-Host "6. 下载APK文件" -ForegroundColor White
    Write-Host ""
    
    Read-Host "按回车键继续..."
}

function Deploy-Vercel {
    Write-Host ""
    Write-Host "🔧 准备部署到 Vercel..." -ForegroundColor Cyan
    Write-Host ""
    
    # 创建Vercel配置
    $vercelConfig = @"
{
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
}
"@
    
    $vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
    Write-Host "✅ Vercel配置文件已创建" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "📋 部署步骤：" -ForegroundColor Yellow
    Write-Host "1. 安装Vercel CLI: npm i -g vercel" -ForegroundColor White
    Write-Host "2. 运行: vercel --prod" -ForegroundColor White
    Write-Host "3. 获得部署URL" -ForegroundColor White
    Write-Host "4. 访问 https://pwabuilder.com" -ForegroundColor White
    Write-Host "5. 输入Vercel URL" -ForegroundColor White
    Write-Host "6. 下载APK文件" -ForegroundColor White
    Write-Host ""
    
    Read-Host "按回车键继续..."
}

function Show-Instructions {
    Write-Host ""
    Write-Host "📖 手动使用 PWA Builder" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "步骤1: 部署应用" -ForegroundColor Yellow
    Write-Host "步骤2: 访问 PWA Builder: https://www.pwabuilder.com" -ForegroundColor White
    Write-Host "步骤3: 输入部署后的URL" -ForegroundColor White
    Write-Host "步骤4: 选择 Android 平台" -ForegroundColor White
    Write-Host "步骤5: 下载APK文件" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 部署选项：" -ForegroundColor Yellow
    Write-Host "- GitHub Pages (免费)" -ForegroundColor White
    Write-Host "- Netlify (免费)" -ForegroundColor White
    Write-Host "- Vercel (免费)" -ForegroundColor White
    Write-Host "- Firebase Hosting (免费)" -ForegroundColor White
    Write-Host "- 任何支持HTTPS的托管服务" -ForegroundColor White
    Write-Host ""
    
    Read-Host "按回车键继续..."
}

function Show-CompleteGuide {
    Write-Host ""
    Write-Host "📖 查看完整指南..." -ForegroundColor Cyan
    if (Test-Path "PWA_BUILDER_STEP_BY_STEP.md") {
        Get-Content "PWA_BUILDER_STEP_BY_STEP.md" -Raw
    } else {
        Write-Host "完整指南文件不存在，请查看项目中的说明文档" -ForegroundColor Yellow
    }
    Read-Host "按回车键继续..."
}

# 主程序逻辑
if ($DeployMethod -eq "menu" -or $DeployMethod -eq "") {
    do {
        Clear-Host
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "📱 PWA Builder APK 打包工具" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        
        $choice = Show-Menu
        
        switch ($choice) {
            "1" { Deploy-GitHubPages }
            "2" { Deploy-Netlify }
            "3" { Deploy-Vercel }
            "4" { Show-Instructions }
            "5" { Show-CompleteGuide }
            "6" { exit }
            default { Write-Host "无效选项，请重试" -ForegroundColor Red; Start-Sleep -Seconds 2 }
        }
    } while ($choice -ne "6")
} else {
    switch ($DeployMethod.ToLower()) {
        "github" { Deploy-GitHubPages }
        "netlify" { Deploy-Netlify }
        "vercel" { Deploy-Vercel }
        default { Show-Menu }
    }
}