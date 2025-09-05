@echo off
chcp 65001 >nul
echo.
echo 🎨 正在修复PNG图标问题...
echo.

REM 检查是否存在PNG图标
if exist "icons\icon-512x512.png" (
    echo ✅ 512x512 PNG图标已存在
    goto :check_github
)

echo ❌ 缺少PNG格式图标
echo.
echo 📋 解决方案：
echo.
echo 方案1：使用在线生成器
echo    1. 双击打开 create-png-icons.html
echo    2. 点击"下载所有图标"
echo    3. 将PNG文件放入icons文件夹

echo.
echo 方案2：手动下载
echo    1. 访问：https://www.pwabuilder.com/imageGenerator
echo    2. 生成512x512 PNG图标
echo    3. 保存为 icons/icon-512x512.png

echo.
echo 按任意键打开在线图标生成器...
pause >nul
start "" create-png-icons.html

echo.
echo 生成图标后，按任意键继续...
pause >nul

:check_github
echo.
echo 📤 上传到GitHub...
echo.

git add icons/
git commit -m "Add PNG icons for PWA Builder compatibility" >nul 2>&1
git push >nul 2>&1

echo ✅ 已上传到GitHub
echo.
echo ⏰ 等待2-5分钟让GitHub Pages更新...
echo.
echo 🎯 然后重新访问：https://www.pwabuilder.com
echo.
pause