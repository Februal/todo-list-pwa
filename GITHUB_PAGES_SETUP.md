# GitHub Pages 手动设置指南

## 🎯 为什么会出现"没有Source下拉菜单"的问题

这是因为GitHub Pages功能需要首次激活。按照以下步骤操作：

## 📋 步骤1：首次启用GitHub Pages

1. **访问仓库设置**
   - 打开：https://github.com/Februal/todo-list-pwa
   - 点击 **Settings** 标签

2. **启用Pages功能**
   - 在左侧菜单找到 **Pages**（可能需要向下滚动）
   - 如果看不到Pages选项，尝试刷新页面
   - 在 **Build and deployment** 部分
   - **Source** 选择 **Deploy from a branch**
   - **Branch** 选择 **gh-pages** 和 **/(root)**
   - 点击 **Save**

## 📋 步骤2：等待首次部署

1. **工作流将自动创建gh-pages分支**
2. **首次部署需要2-5分钟**
3. **检查Actions标签页**：https://github.com/Februal/todo-list-pwa/actions

## 📋 步骤3：验证部署

部署完成后，访问：
```
https://februal.github.io/todo-list-pwa
```

## 🔧 如果仍然看不到Pages选项

### 方法A：使用经典Pages设置
1. 进入 Settings → Pages
2. 选择 **Classic Pages experience**
3. 选择 **Source: Deploy from a branch**
4. 选择 **Branch: gh-pages**

### 方法B：手动创建gh-pages分支
```bash
git checkout --orphan gh-pages
git rm -rf .
git commit --allow-empty -m "Initial gh-pages commit"
git push origin gh-pages
git checkout main
```

## 📱 部署成功后

- **PWA地址**：https://februal.github.io/todo-list-pwa
- **使用PWA Builder**：访问 https://www.pwabuilder.com 并输入上述URL

## ⚠️ 注意事项

- 首次启用Pages可能需要几分钟
- 确保仓库是公开的（私有仓库需要付费计划）
- 如果15分钟后仍无Pages选项，联系GitHub支持