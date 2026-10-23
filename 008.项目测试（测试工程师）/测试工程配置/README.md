# 财务管家 - 项目测试配置

## 测试目录结构

```
003.前端代码（前端工程师）/
└── frontend/
    ├── tests/                    # 前端测试目录
    │   ├── unit/              # 单元测试
    │   │   └── README.md
    │   ├── integration/       # 集成测试
    │   │   └── README.md
    │   ├── e2e/              # 端到端测试
    │   │   ├── pages.test.js
    │   │   └── README.md
    │   └── reports/           # 测试报告
    │       └── README.md
    └── package.json          # 测试配置

003.前端代码（前端工程师）/
└── backend/
    ├── tests/                # 后端测试目录
    │   ├── unit/            # 单元测试
    │   │   └── utils.test.js
    │   ├── api/             # API测试
    │   │   ├── auth.test.js
    │   │   └── accounts.test.js
    │   ├── security/        # 安全测试
    │   │   └── security.test.js
    │   ├── performance/     # 性能测试
    │   │   └── performance.test.js
    │   └── reports/         # 测试报告
    └── package-test.json   # 测试配置

007.跨端APP应用（移动端开发工程师）/
└── uniapp-project/
    ├── tests/               # UniApp测试目录
    │   ├── unit/            # 单元测试
    │   │   └── README.md
    │   ├── integration/     # 集成测试
    │   │   └── README.md
    │   ├── platform/        # 平台测试
    │   │   └── platform.config.js
    │   └── reports/         # 测试报告
    └── package.json        # 测试配置
```

## 测试文件说明

### Frontend (Web前端)

| 文件 | 作用 |
|------|------|
| `tests/e2e/pages.test.js` | Playwright E2E测试，验证页面元素和交互 |
| `tests/test-runner.js` | 测试运行器，统一执行各类型测试 |

### Backend (后端API)

| 文件 | 作用 |
|------|------|
| `tests/unit/utils.test.js` | 单元测试，验证工具函数（日期、密码等） |
| `tests/api/auth.test.js` | API测试，验证认证接口（注册/登录/验证） |
| `tests/api/accounts.test.js` | API测试，验证账户CRUD接口 |
| `tests/security/security.test.js` | 安全测试，验证SQL注入、Token等 |
| `tests/performance/performance.test.js` | 性能测试，验证并发和大数据量 |

### UniApp (跨端应用)

| 文件 | 作用 |
|------|------|
| `tests/platform/platform.config.js` | 平台配置，定义各平台的差异和测试重点 |
| `tests/test-runner.js` | 测试运行器，执行手动+自动测试 |

## 运行测试

### Frontend
```bash
cd frontend
npm install
npm test --suite=e2e
```

### Backend
```bash
cd backend
npm install
npm test                    # 运行所有测试
npm run test:api          # 仅运行API测试
npm run test:security     # 仅运行安全测试
```

### UniApp
```bash
cd uniapp-project
npm test                  # 运行所有测试
npm test --suite=platform  # 运行平台测试
npm test --report         # 生成报告
```

## 报告输出

测试报告输出到 `008.项目测试（测试工程师）/测试报告/` 目录

```
008.项目测试（测试工程师）/
└── 测试报告/
    ├── frontend/          # 前端测试报告
    ├── backend/           # 后端测试报告
    └── uniapp/            # UniApp测试报告
```

## 注意事项

1. **不影响业务代码** - 测试文件独立在tests目录
2. **E2E测试需启动后端** - Frontend的e2e测试需要backend运行
3. **性能测试可选运行** - 耗时较长，按需执行
4. **平台测试以手动为主** - UniApp需要真机/模拟器配合