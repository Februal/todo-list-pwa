@echo off
title GitHub Pages一键部署
color 0A

echo.
echo ================================================
echo    🚀 GitHub Pages 一键自动部署
echo ================================================
echo.

REM 检查当前目录
echo 📁 当前目录: %CD%

REM 检查Git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git未安装，请访问 https://git-scm.com 下载
    pause
    exit /b 1
)

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请访问 https://nodejs.org 下载
    pause
    exit /b 1
)

echo ✅ Git和Node.js已安装

REM 添加所有文件
echo 🔄 添加文件到Git...
git add .

REM 提交更改
echo 🔄 提交更改...
git commit -m "Auto-deploy to GitHub Pages - %date% %time%" 2>nul

REM 推送到GitHub
echo 🔄 推送到GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo ❌ 推送失败，检查网络连接
    pause
    exit /b 1
)

echo.
echo ================================================
echo    ✅ 部署完成！
echo ================================================
echo.
echo 📱 接下来：
echo 1. 访问：https://github.com/Februal/todo-list-pwa/actions
echo 2. 等待2-5分钟让GitHub自动部署
echo 3. 访问：https://februal.github.io/todo-list-pwa
echo.
echo 🎯 然后使用PWA Builder生成APK：
echo https://www.pwabuilder.com
echo.
pause