@echo off
echo ====================================
echo 📱 PWA Builder APK 打包工具
echo ====================================
echo.

:menu
echo 请选择部署方式：
echo 1. 部署到 GitHub Pages (推荐)
echo 2. 部署到 Netlify
echo 3. 部署到 Vercel
echo 4. 手动使用 PWA Builder
echo 5. 查看使用说明
echo 6. 退出
echo.

set /p choice=请输入选项(1-6): 

if "%choice%"=="1" goto github
goto menu

:github
echo.
echo 🔧 准备部署到 GitHub Pages...
echo.

REM 检查Git是否已安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Git，请先安装Git
    echo 下载地址: https://git-scm.com/downloads
    pause
    goto menu
)

echo ✅ Git已安装
echo.

REM 检查是否已初始化Git仓库
if exist .git (
    echo ✅ Git仓库已存在
) else (
    echo 📁 初始化Git仓库...
    git init
    git add .
    git commit -m "Initial commit: Todo List PWA"
)

REM 创建GitHub Pages工作流
if not exist .github mkdir .github
if not exist .github\workflows mkdir .github\workflows

(
echo name: Deploy to GitHub Pages

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
) > .github\workflows\deploy.yml

echo ✅ GitHub Pages工作流已创建
echo.
echo 📋 下一步操作：
echo 1. 在GitHub上创建新仓库
echo 2. 运行以下命令：
echo    git remote add origin [您的仓库URL]
echo    git push -u origin main
echo 3. 访问 https://pwabuilder.com
echo 4. 输入您的GitHub Pages URL
echo 5. 下载生成的APK文件
echo.
pause
goto menu

:netlify
echo.
echo 🔧 准备部署到 Netlify...
echo.

REM 创建Netlify配置
(
echo [build]
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
) > netlify.toml

echo ✅ Netlify配置文件已创建
echo.
echo 📋 部署步骤：
echo 1. 访问 https://netlify.com
echo 2. 拖拽整个项目文件夹到部署区域
echo 3. 获得部署URL
echo 4. 访问 https://pwabuilder.com
echo 5. 输入Netlify URL
echo 6. 下载APK文件
echo.
pause
goto menu

:vercel
echo.
echo 🔧 准备部署到 Vercel...
echo.

REM 创建Vercel配置
(
echo{
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
) > vercel.json

echo ✅ Vercel配置文件已创建
echo.
echo 📋 部署步骤：
echo 1. 安装Vercel CLI: npm i -g vercel
echo 2. 运行: vercel --prod
echo 3. 获得部署URL
echo 4. 访问 https://pwabuilder.com
echo 5. 输入Vercel URL
echo 6. 下载APK文件
echo.
pause
goto menu

:manual
echo.
echo 📖 手动使用 PWA Builder
echo ==========================
echo.
echo 步骤1: 部署应用
REM 这里可以添加一个简单的HTTP服务器部署
echo.
echo 步骤2: 访问 PWA Builder
echo 网址: https://www.pwabuilder.com
echo.
echo 步骤3: 输入部署后的URL
echo.
echo 步骤4: 选择 Android 平台
echo.
echo 步骤5: 下载APK文件
echo.
echo 📱 部署选项：
echo - GitHub Pages (免费)
echo - Netlify (免费)
echo - Vercel (免费)
echo - Firebase Hosting (免费)
echo - 任何支持HTTPS的托管服务
echo.
pause
goto menu

:instructions
echo.
echo 📖 完整使用说明
echo =================
echo.
type ANDROID_BUILD_GUIDE.md
pause
goto menu

:exit
echo.
echo 感谢使用！
echo 按任意键退出...
pause >nul