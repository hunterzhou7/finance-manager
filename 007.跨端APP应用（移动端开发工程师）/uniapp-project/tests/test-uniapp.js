/**
 * 财务管家 - UniApp跨端应用自动化测试
 *
 * 覆盖：代码结构、API配置、组件引用、页面配置
 */

const fs = require('fs');
const path = require('path');

const PROJECT_DIR = '.';
const REPORT_DIR = './tests/reports';

let results = { total: 0, passed: 0, failed: 0 };
let tests = [];

function test(name, passed, message = '') {
    results.total++;
    if (passed) results.passed++;
    else results.failed++;
    tests.push({ name, passed, message, time: new Date().toISOString() });
    console.log(`${passed ? '✅' : '❌'} ${name}: ${message}`);
}

function generateReport() {
    if (!fs.existsSync(REPORT_DIR)) {
        fs.mkdirSync(REPORT_DIR, { recursive: true });
    }

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>财务管家 - UniApp测试报告</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; }
        h1 { color: #333; margin-bottom: 20px; }
        .summary { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center; }
        .summary-item { padding: 16px; }
        .summary-value { font-size: 32px; font-weight: 700; color: #FFB7C5; }
        .summary-label { font-size: 14px; color: #666; margin-top: 4px; }
        .passed .summary-value { color: #52c41a; }
        .failed .summary-value { color: #ff4d4f; }
        .test-list { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .test-item { display: flex; align-items: center; padding: 16px; border-bottom: 1px solid #f0f0f0; }
        .test-item:last-child { border-bottom: none; }
        .test-name { flex: 1; font-size: 14px; color: #333; }
        .test-message { font-size: 12px; color: #999; margin-left: 12px; }
        .test-status { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; }
        .status-icon { font-size: 16px; }
        .passed .status-icon { color: #52c41a; }
        .failed .status-icon { color: #ff4d4f; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>财务管家 - UniApp跨端应用测试报告</h1>
        <div class="summary">
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-value">${results.total}</div>
                    <div class="summary-label">总计</div>
                </div>
                <div class="summary-item passed">
                    <div class="summary-value">${results.passed}</div>
                    <div class="summary-label">通过</div>
                </div>
                <div class="summary-item failed">
                    <div class="summary-value">${results.failed}</div>
                    <div class="summary-label">失败</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${results.total > 0 ? ((results.passed / results.total) * 100).toFixed(0) : 0}%</div>
                    <div class="summary-label">通过率</div>
                </div>
            </div>
        </div>
        <div class="test-list">
            ${tests.map(t => `
            <div class="test-item">
                <div class="test-status ${t.passed ? 'passed' : 'failed'}">
                    <span class="status-icon">${t.passed ? '✓' : '✗'}</span>
                </div>
                <div class="test-name">${t.name}</div>
                <div class="test-message">${t.message}</div>
            </div>
            `).join('')}
        </div>
        <div class="footer">生成时间: ${new Date().toLocaleString('zh-CN')}</div>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(REPORT_DIR, 'uniapp-test-report.html'), html);
    console.log(`\n📊 报告已生成: ${REPORT_DIR}/uniapp-test-report.html`);
}

function runTests() {
    console.log('\n========================================');
    console.log('财务管家 - UniApp跨端应用自动化测试');
    console.log('========================================\n');

    // 1. 项目结构验证
    console.log('📋 测试组: 项目结构验证\n');

    const requiredFiles = [
        'App.vue',
        'main.js',
        'manifest.json',
        'pages.json',
        'index.html',
        'js/api.js'
    ];

    requiredFiles.forEach(file => {
        const exists = fs.existsSync(path.join(PROJECT_DIR, file));
        test(`项目文件存在: ${file}`, exists, exists ? '文件存在' : '文件不存在');
    });

    // 2. pages.json 配置验证
    console.log('📋 测试组: pages.json配置验证\n');

    const pagesJsonPath = path.join(PROJECT_DIR, 'pages.json');
    if (fs.existsSync(pagesJsonPath)) {
        const pagesJson = JSON.parse(fs.readFileSync(pagesJsonPath, 'utf-8'));

        test('pages.json - 包含pages', Array.isArray(pagesJson.pages));
        test('pages.json - 包含globalStyle', !!pagesJson.globalStyle);
        test('pages.json - 包含tabBar', !!pagesJson.tabBar);

        // 验证TabBar配置
        if (pagesJson.tabBar) {
            test('TabBar - color存在', !!pagesJson.tabBar.color);
            test('TabBar - selectedColor存在', !!pagesJson.tabBar.selectedColor);
            test('TabBar - list存在', Array.isArray(pagesJson.tabBar.list));
        }
    } else {
        test('pages.json文件', false, '文件不存在');
    }

    // 3. manifest.json 配置验证
    console.log('📋 测试组: manifest.json配置验证\n');

    const manifestPath = path.join(PROJECT_DIR, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        let manifestContent = fs.readFileSync(manifestPath, 'utf-8');
        // 移除注释
        manifestContent = manifestContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

        try {
            const manifest = JSON.parse(manifestContent);

            test('manifest.json - name存在', !!manifest.name);
            test('manifest.json - appid存在', !!manifest.appid);
            test('manifest.json - versionName存在', !!manifest.versionName);

            // 微信小程序配置
            if (manifest['mp-weixin']) {
                test('微信小程序 - appid存在', !!manifest['mp-weixin'].appid);
            }
        } catch (e) {
            test('manifest.json解析', false, 'JSON解析失败');
        }
    } else {
        test('manifest.json文件', false, '文件不存在');
    }

    // 4. 页面文件验证
    console.log('📋 测试组: 页面文件验证\n');

    const pages = [
        { dir: 'pages/index', name: 'index' },
        { dir: 'pages/login', name: 'login' },
        { dir: 'pages/register', name: 'register' },
        { dir: 'pages/add', name: 'add' },
        { dir: 'pages/statistics', name: 'statistics' },
        { dir: 'pages/history', name: 'history' },
        { dir: 'pages/settings', name: 'settings' },
        { dir: 'pages/category', name: 'category' },
        { dir: 'pages/account', name: 'account' }
    ];

    pages.forEach(page => {
        const vuePath = path.join(PROJECT_DIR, page.dir, page.name + '.vue');
        test(`页面文件: ${page.name}.vue`, fs.existsSync(vuePath));
    });

    // 5. API配置验证
    console.log('📋 测试组: API配置验证\n');

    const apiPath = path.join(PROJECT_DIR, 'js/api.js');
    if (fs.existsSync(apiPath)) {
        const apiContent = fs.readFileSync(apiPath, 'utf-8');

        test('API - baseURL配置', apiContent.includes('baseURL'));
        test('API - login方法', apiContent.includes('login'));
        test('API - register方法', apiContent.includes('register'));
        test('API - getTransactions方法', apiContent.includes('getTransactions'));
        test('API - addTransaction方法', apiContent.includes('addTransaction'));
        test('API - getCategories方法', apiContent.includes('getCategories'));
        test('API - getAccounts方法', apiContent.includes('getAccounts'));
        test('API - getHomeData方法', apiContent.includes('getHomeData'));
        test('API - getStatistics方法', apiContent.includes('getStatistics'));
        test('API - Token认证', apiContent.includes('Authorization') || apiContent.includes('token'));
    } else {
        test('API文件', false, '文件不存在');
    }

    // 6. 首页功能验证
    console.log('📋 测试组: 页面功能验证\n');

    const indexPath = path.join(PROJECT_DIR, 'pages/index/index.vue');
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');

        test('首页 - 本月收入显示', content.includes('monthIncome') || content.includes('收入'));
        test('首页 - 本月支出显示', content.includes('monthExpense') || content.includes('支出'));
        test('首页 - 本月结余显示', content.includes('monthBalance') || content.includes('结余'));
        test('首页 - 分类支出', content.includes('category') || content.includes('分类'));
        test('首页 - 最近记账', content.includes('transaction') || content.includes('交易'));
    }

    // 7. 记一笔页面验证
    const addPath = path.join(PROJECT_DIR, 'pages/add/add.vue');
    if (fs.existsSync(addPath)) {
        const content = fs.readFileSync(addPath, 'utf-8');

        test('记一笔 - 支出类型', content.includes('expense') || content.includes('支出'));
        test('记一笔 - 收入类型', content.includes('income') || content.includes('收入'));
        test('记一笔 - 金额输入', content.includes('amount') || content.includes('金额'));
        test('记一笔 - 分类选择', content.includes('category') || content.includes('分类'));
        test('记一笔 - 账户选择', content.includes('account') || content.includes('账户'));
        test('记一笔 - 保存功能', content.includes('addTransaction') || content.includes('保存'));
    }

    // 8. 统计页面验证
    const statsPath = path.join(PROJECT_DIR, 'pages/statistics/statistics.vue');
    if (fs.existsSync(statsPath)) {
        const content = fs.readFileSync(statsPath, 'utf-8');

        test('统计页 - 年度数据', content.includes('year') || content.includes('年度'));
        test('统计页 - 年度收入', content.includes('yearIncome') || content.includes('收入'));
        test('统计页 - 年度支出', content.includes('yearExpense') || content.includes('支出'));
        test('统计页 - 饼图Canvas', content.includes('pieCanvas') || content.includes('canvas'));
        test('统计页 - 折线图Canvas', content.includes('trendCanvas') || content.includes('canvas'));
    }

    // 9. 明细页面验证
    const historyPath = path.join(PROJECT_DIR, 'pages/history/history.vue');
    if (fs.existsSync(historyPath)) {
        const content = fs.readFileSync(historyPath, 'utf-8');

        test('明细页 - 交易列表', content.includes('transaction') || content.includes('交易'));
        test('明细页 - 筛选功能', content.includes('filter') || content.includes('筛选'));
        test('明细页 - 分页加载', content.includes('page') || content.includes('分页'));
    }

    // 10. 设置页面验证
    const settingsPath = path.join(PROJECT_DIR, 'pages/settings/settings.vue');
    if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, 'utf-8');

        test('设置页 - 用户信息', content.includes('userInfo') || content.includes('用户'));
        test('设置页 - 分类管理入口', content.includes('category') || content.includes('分类'));
        test('设置页 - 账户管理入口', content.includes('account') || content.includes('账户'));
        test('设置页 - 退出登录', content.includes('logout') || content.includes('退出'));
    }

    // 11. 微信小程序特殊配置验证
    console.log('📋 测试组: 跨平台兼容性验证\n');

    const statPageContent = fs.readFileSync(statsPath, 'utf-8');

    // 检查是否移除了可能导致微信兼容问题的属性
    test('统计页 - 移除Canvas 2d类型', !statPageContent.includes('type="2d"'),
        statPageContent.includes('type="2d"') ? '仍包含type=2d' : '已移除');
    test('统计页 - 使用标准canvas', statPageContent.includes('canvas-id='));

    generateReport();

    console.log('\n========================================');
    console.log(`测试完成: ${results.passed}/${results.total} 通过 (${((results.passed/results.total)*100).toFixed(0)}%)`);
    console.log('========================================\n');

    process.exit(results.failed > 0 ? 1 : 0);
}

runTests();