# 🚀 GitHub Pages 一键自动部署指南

## 📋 快速开始

### 方法1：PowerShell一键部署（推荐）
```powershell
# 在PowerShell中运行：
.\deploy-to-github-pages.ps1
```

### 方法2：命令提示符一键部署
```cmd
# 在命令提示符中运行：
deploy-to-github-pages.bat
```

### 方法3：手动部署
```bash
# 如果自动脚本有问题，手动执行：
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 🔧 使用方法

### 步骤1：运行部署脚本
选择以下任一方式：

#### PowerShell方式：
1. 打开PowerShell
2. 导航到项目目录：
   ```powershell
   cd "D:\AI\projects\To-Do list"
   ```
3. 运行部署脚本：
   ```powershell
   .\deploy-to-github-pages.ps1
   ```

#### 命令提示符方式：
1. 打开命令提示符（CMD）
2. 导航到项目目录：
   ```cmd
   cd "D:\AI\projects\To-Do list"
   ```
3. 运行部署脚本：
   ```cmd
   deploy-to-github-pages.bat
   ```

### 步骤2：等待自动完成
- **首次激活**：2-5分钟
- **自动部署**：工作流会自动运行
- **状态检查**：访问 https://github.com/Februal/todo-list-pwa/actions

### 步骤3：验证部署
部署完成后访问：
```
https://februal.github.io/todo-list-pwa
```

## 📱 生成APK

部署成功后：
1. 访问 https://www.pwabuilder.com
2. 输入：https://februal.github.io/todo-list-pwa
3. 点击 **Start**
4. 选择 **Android** 平台
5. 下载生成的APK文件

## ⚠️ 常见问题

### PowerShell执行策略问题
如果遇到执行策略错误，运行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 网络连接问题
如果推送失败：
1. 检查网络连接
2. 重试推送：
   ```bash
   git push
   ```

### GitHub Pages未激活
如果15分钟后仍未激活：
1. 手动访问：https://github.com/Februal/todo-list-pwa/settings/pages
2. 确认Source设置为 **GitHub Actions**

## 🎯 成功标志

- ✅ 仓库出现 **Actions** 标签
- ✅ 工作流状态显示绿色✅
- ✅ 能够访问：https://februal.github.io/todo-list-pwa
- ✅ PWA Builder能够识别URL