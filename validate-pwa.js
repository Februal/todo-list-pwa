#!/usr/bin/env node
/**
 * PWA 配置验证工具
 * 检查项目是否准备好用于PWA Builder
 */

const fs = require('fs');
const path = require('path');

class PWAValidator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.errors = [];
        this.warnings = [];
        this.checks = [];
    }

    log(message, type = 'info') {
        const colors = {
            success: '\x1b[32m',
            error: '\x1b[31m',
            warning: '\x1b[33m',
            info: '\x1b[36m',
            reset: '\x1b[0m'
        };
        
        const prefix = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`);
    }

    async checkFileExists(filePath) {
        const fullPath = path.join(this.projectPath, filePath);
        const exists = fs.existsSync(fullPath);
        
        this.checks.push({
            type: 'file',
            name: filePath,
            exists: exists,
            path: fullPath
        });
        
        if (exists) {
            this.log(`找到文件: ${filePath}`, 'success');
        } else {
            this.log(`缺失文件: ${filePath}`, 'error');
            this.errors.push(`缺失文件: ${filePath}`);
        }
        
        return exists;
    }

    async checkManifest() {
        const manifestPath = path.join(this.projectPath, 'manifest.json');
        
        if (!fs.existsSync(manifestPath)) {
            this.log('manifest.json 不存在', 'error');
            this.errors.push('manifest.json 不存在');
            return false;
        }

        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            const requiredFields = [
                'name', 'short_name', 'description', 'start_url',
                'display', 'background_color', 'theme_color'
            ];
            
            requiredFields.forEach(field => {
                if (!manifest[field]) {
                    this.log(`manifest.json 缺失字段: ${field}`, 'error');
                    this.errors.push(`manifest.json 缺失字段: ${field}`);
                } else {
                    this.log(`manifest.json 包含字段: ${field} = ${manifest[field]}`, 'success');
                }
            });

            // 检查图标
            if (manifest.icons && Array.isArray(manifest.icons)) {
                manifest.icons.forEach(icon => {
                    const iconPath = path.join(this.projectPath, icon.src);
                    if (fs.existsSync(iconPath)) {
                        this.log(`找到图标: ${icon.src} (${icon.sizes})`, 'success');
                    } else {
                        this.log(`缺失图标: ${icon.src}`, 'error');
                        this.errors.push(`缺失图标: ${icon.src}`);
                    }
                });
            } else {
                this.log('manifest.json 缺少 icons 配置', 'error');
                this.errors.push('manifest.json 缺少 icons 配置');
            }

            return true;
        } catch (error) {
            this.log(`manifest.json 解析错误: ${error.message}`, 'error');
            this.errors.push(`manifest.json 解析错误: ${error.message}`);
            return false;
        }
    }

    async checkServiceWorker() {
        const swPath = path.join(this.projectPath, 'sw.js');
        
        if (!fs.existsSync(swPath)) {
            this.log('Service Worker (sw.js) 不存在', 'error');
            this.errors.push('Service Worker (sw.js) 不存在');
            return false;
        }

        try {
            const swContent = fs.readFileSync(swPath, 'utf8');
            
            // 检查基本功能
            const checks = [
                { name: 'install事件', pattern: /install/ },
                { name: 'fetch事件', pattern: /fetch/ },
                { name: '缓存功能', pattern: /caches/ },
                { name: '缓存名称', pattern: /CACHE_NAME/ }
            ];

            checks.forEach(check => {
                if (check.pattern.test(swContent)) {
                    this.log(`Service Worker 包含 ${check.name}`, 'success');
                } else {
                    this.log(`Service Worker 缺少 ${check.name}`, 'warning');
                    this.warnings.push(`Service Worker 缺少 ${check.name}`);
                }
            });

            return true;
        } catch (error) {
            this.log(`Service Worker 读取错误: ${error.message}`, 'error');
            this.errors.push(`Service Worker 读取错误: ${error.message}`);
            return false;
        }
    }

    async checkHTML() {
        const htmlPath = path.join(this.projectPath, 'index.html');
        
        if (!fs.existsSync(htmlPath)) {
            this.log('index.html 不存在', 'error');
            this.errors.push('index.html 不存在');
            return false;
        }

        try {
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            // 检查必要标签
            const checks = [
                { name: 'manifest链接', pattern: /<link[^>]*rel="manifest"/ },
                { name: 'viewport meta', pattern: /<meta[^>]*name="viewport"/ },
                { name: 'theme-color meta', pattern: /<meta[^>]*name="theme-color"/ },
                { name: 'apple-mobile-web-app-capable', pattern: /<meta[^>]*name="apple-mobile-web-app-capable"/ }
            ];

            checks.forEach(check => {
                if (check.pattern.test(htmlContent)) {
                    this.log(`HTML 包含 ${check.name}`, 'success');
                } else {
                    this.log(`HTML 缺少 ${check.name}`, 'warning');
                    this.warnings.push(`HTML 缺少 ${check.name}`);
                }
            });

            // 检查Service Worker注册
            if (/navigator\.serviceWorker\.register/.test(htmlContent)) {
                this.log('HTML 包含 Service Worker 注册代码', 'success');
            } else {
                this.log('HTML 缺少 Service Worker 注册代码', 'warning');
                this.warnings.push('HTML 缺少 Service Worker 注册代码');
            }

            return true;
        } catch (error) {
            this.log(`HTML 读取错误: ${error.message}`, 'error');
            this.errors.push(`HTML 读取错误: ${error.message}`);
            return false;
        }
    }

    async checkHTTPS() {
        this.log('注意：HTTPS检查需要部署到线上环境', 'info');
        this.log('PWA Builder要求HTTPS URL', 'info');
        return true;
    }

    async validate() {
        console.log('\n🔍 开始PWA配置验证...\n');
        
        // 检查必需文件
        await this.checkFileExists('manifest.json');
        await this.checkFileExists('sw.js');
        await this.checkFileExists('index.html');
        await this.checkFileExists('styles.css');
        await this.checkFileExists('script.js');
        
        // 检查配置内容
        await this.checkManifest();
        await this.checkServiceWorker();
        await this.checkHTML();
        await this.checkHTTPS();

        // 总结
        console.log('\n' + '='.repeat(50));
        console.log('📊 验证结果总结');
        console.log('='.repeat(50));
        
        if (this.errors.length === 0) {
            console.log('✅ PWA配置完整！可以上传到PWA Builder');
        } else {
            console.log(`❌ 发现 ${this.errors.length} 个错误，需要修复`);
            this.errors.forEach(error => console.log(`   - ${error}`));
        }
        
        if (this.warnings.length > 0) {
            console.log(`⚠️ 发现 ${this.warnings.length} 个警告，建议修复`);
            this.warnings.forEach(warning => console.log(`   - ${warning}`));
        }

        console.log('\n🎯 下一步：');
        console.log('1. 修复所有错误');
        console.log('2. 部署到HTTPS URL');
        console.log('3. 访问 https://www.pwabuilder.com');
        console.log('4. 输入您的应用URL');
        console.log('5. 生成APK文件');
    }
}

// 运行验证
const projectPath = process.cwd();
const validator = new PWAValidator(projectPath);
validator.validate().catch(console.error);