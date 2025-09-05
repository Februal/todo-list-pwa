@echo off
title 自动部署到GitHub Pages
chcp 65001 >nul

echo.
echo ================================================
echo 🚀 自动GitHub Pages部署工具
echo ================================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请安装Node.js后重试
    pause
    exit /b 1
)

REM 检查Git是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git未安装，请安装Git后重试
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

REM 运行自动部署脚本
node auto-deploy-github-pages.js

echo.
echo ================================================
echo 📋 部署状态检查
echo ================================================
echo.

REM 检查工作流状态
echo 🔍 检查GitHub Actions状态...
echo 请访问：https://github.com/Februal/todo-list-pwa/actions
echo.

echo 📱 部署完成后访问：
echo https://februal.github.io/todo-list-pwa
echo.

echo 🎯 下一步：
echo 1. 等待2-5分钟让GitHub激活Pages
echo 2. 使用PWA Builder生成APK
echo 3. 访问：https://www.pwabuilder.com
echo.
pause