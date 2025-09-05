# 自动GitHub Pages部署PowerShell脚本
Write-Host "🚀 开始自动GitHub Pages部署..." -ForegroundColor Green

# 检查必要工具
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# 检查Node.js
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js未安装" -ForegroundColor Red
    exit 1
}

# 检查Git
if (-not (Test-Command "git")) {
    Write-Host "❌ Git未安装" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 环境检查通过" -ForegroundColor Green

# 运行自动部署
try {
    node auto-deploy-github-pages.js
    Write-Host "✅ 自动部署脚本执行完成" -ForegroundColor Green
} catch {
    Write-Host "❌ 部署失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 显示后续步骤
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📋 部署状态检查" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔍 检查GitHub Actions:" -ForegroundColor Yellow
Write-Host "https://github.com/Februal/todo-list-pwa/actions" -ForegroundColor Blue
Write-Host ""
Write-Host "📱 部署完成后访问:" -ForegroundColor Yellow  
Write-Host "https://februal.github.io/todo-list-pwa" -ForegroundColor Blue
Write-Host ""
Write-Host "🎯 下一步:" -ForegroundColor Yellow
Write-Host "1. 等待2-5分钟让GitHub激活Pages" -ForegroundColor White
Write-Host "2. 使用PWA Builder生成APK" -ForegroundColor White
Write-Host "3. 访问: https://www.pwabuilder.com" -ForegroundColor White

Read-Host "按Enter键继续..."